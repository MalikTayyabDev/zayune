import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import {
  getDemoCatalog,
  getDemoCategories,
  upsertDemoProduct,
  type DemoProduct,
} from "@/lib/demo-catalog";
import { isDemoMode } from "@/lib/demo-data";
import { prisma } from "@/lib/prisma";
import { generateProductSku, generateVariantSku } from "@/lib/sku";

const variantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  optionGroup: z.string().default("Color"),
  swatchHex: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  priceDelta: z.number().int().default(0),
  stock: z.number().int().nullable().optional(),
  sku: z.string().nullable().optional(),
});

const imageSchema = z.object({
  url: z.string().min(1),
  alt: z.string().default(""),
  kind: z.string().default("hero"),
  sortOrder: z.number().int().default(0),
});

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  sku: z.string().optional().nullable(),
  oneLiner: z.string().min(2),
  story: z.string().min(2),
  materials: z.string().min(2),
  handmadeProof: z.string().min(2),
  stylingNote: z.string().min(1),
  price: z.number().int().nonnegative(),
  compareAtPrice: z.number().int().nonnegative().nullable().optional(),
  categoryId: z.string(),
  fulfillment: z.enum(["IN_STOCK", "MADE_TO_ORDER"]),
  stock: z.number().int().nullable().optional(),
  leadTimeDays: z.number().int().nullable().optional(),
  featured: z.boolean(),
  published: z.boolean(),
  isBundle: z.boolean().optional(),
  bundleProductIds: z.array(z.string()).optional(),
  introOfferPercent: z.number().int().min(0).max(90).nullable().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  tags: z.array(z.string()).optional(),
  images: z.array(imageSchema).default([]),
  variants: z.array(variantSchema).default([]),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = schema.parse(await request.json());

    const productSku =
      data.sku?.trim() || generateProductSku(data.slug || data.name);
    const variants = data.variants.map((v) => ({
      ...v,
      sku: v.sku?.trim() || generateVariantSku(productSku, v.name),
    }));

    if (isDemoMode()) {
      const category =
        getDemoCategories().find((c) => c.id === data.categoryId) ||
        getDemoCategories()[0];
      const id = `prod_${Date.now().toString(36)}`;
      const product = {
        id,
        name: data.name,
        slug: data.slug,
        sku: productSku,
        oneLiner: data.oneLiner,
        story: data.story,
        materials: data.materials,
        handmadeProof: data.handmadeProof,
        stylingNote: data.stylingNote,
        price: data.price,
        compareAtPrice: data.compareAtPrice ?? null,
        currency: "PKR",
        fulfillment: data.fulfillment,
        stock: data.fulfillment === "IN_STOCK" ? data.stock ?? 0 : null,
        leadTimeDays:
          data.fulfillment === "MADE_TO_ORDER" ? data.leadTimeDays ?? 7 : null,
        featured: data.featured,
        published: data.published,
        isBundle: data.isBundle ?? false,
        bundleProductIds: data.bundleProductIds || [],
        introOfferPercent: data.introOfferPercent ?? null,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
        tags: data.tags || [],
        categoryId: category.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        category,
        images: data.images.map((img, i) => ({
          id: `${id}_img_${i}`,
          productId: id,
          url: img.url,
          alt: img.alt || data.name,
          kind: img.kind,
          sortOrder: i,
        })),
        variants: variants.map((v, i) => ({
          id: `${id}_v_${i}`,
          productId: id,
          name: v.name,
          optionGroup: v.optionGroup,
          swatchHex: v.swatchHex || null,
          imageUrl: v.imageUrl || null,
          sku: v.sku || null,
          priceDelta: v.priceDelta || 0,
          stock: v.stock ?? null,
        })),
      } as unknown as DemoProduct;

      upsertDemoProduct(product);
      return NextResponse.json({ id });
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        sku: productSku,
        oneLiner: data.oneLiner,
        story: data.story,
        materials: data.materials,
        handmadeProof: data.handmadeProof,
        stylingNote: data.stylingNote,
        price: data.price,
        compareAtPrice: data.compareAtPrice ?? null,
        categoryId: data.categoryId,
        fulfillment: data.fulfillment,
        stock: data.fulfillment === "IN_STOCK" ? data.stock ?? 0 : null,
        leadTimeDays:
          data.fulfillment === "MADE_TO_ORDER" ? data.leadTimeDays ?? 7 : null,
        featured: data.featured,
        published: data.published,
        isBundle: data.isBundle ?? false,
        bundleProductIds: data.bundleProductIds || [],
        introOfferPercent: data.introOfferPercent ?? null,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
        tags: data.tags || [],
        images: {
          create: data.images.map((img, i) => ({
            url: img.url,
            alt: img.alt || data.name,
            kind: img.kind,
            sortOrder: i,
          })),
        },
        variants: {
          create: variants.map((v) => ({
            name: v.name,
            optionGroup: v.optionGroup,
            swatchHex: v.swatchHex || null,
            imageUrl: v.imageUrl || null,
            sku: v.sku || null,
            priceDelta: v.priceDelta || 0,
            stock: v.stock ?? null,
          })),
        },
      },
    });

    return NextResponse.json({ id: product.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Invalid product data" }, { status: 400 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (isDemoMode()) {
    return NextResponse.json(getDemoCatalog());
  }
  const products = await prisma.product.findMany({
    include: { category: true, images: true, variants: true },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(products);
}
