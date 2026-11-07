/**
 * Append-only Atelier Edit seed (Butterfly Sweater + 9) — CLI + admin API.
 */
import { PrismaClient } from "@prisma/client";
import {
  atelierCategories,
  atelierProducts,
  withSeasonalPrice,
} from "@/lib/atelier-catalog";

export async function seedAtelierCatalog(prisma: PrismaClient) {
  const categories = new Map<string, string>();

  for (const def of atelierCategories) {
    const row = await prisma.category.upsert({
      where: { slug: def.slug },
      update: {
        name: def.name,
        description: def.description,
        sortOrder: def.sortOrder,
      },
      create: def,
    });
    categories.set(def.slug, row.id);
  }

  // Resolve existing category IDs for products that reuse Winter/Dawat categories.
  const needed = new Set(atelierProducts.map((p) => p.categorySlug));
  for (const slug of needed) {
    if (categories.has(slug)) continue;
    const row = await prisma.category.findUnique({ where: { slug } });
    if (!row) {
      throw new Error(
        `Missing category ${slug} — seed Winter/Dawat first or create the category.`
      );
    }
    categories.set(slug, row.id);
  }

  let products = 0;

  for (const item of atelierProducts) {
    const categoryId = categories.get(item.categorySlug);
    if (!categoryId) throw new Error(`Missing category ${item.categorySlug}`);
    const { price, compareAtPrice } = withSeasonalPrice(item.listPrice);
    const existing = await prisma.product.findUnique({
      where: { slug: item.slug },
    });

    const shared = {
      name: item.name,
      sku: item.sku,
      oneLiner: item.oneLiner,
      story: item.story,
      materials: item.materials,
      handmadeProof: item.handmadeProof,
      stylingNote: item.stylingNote,
      price,
      compareAtPrice,
      currency: "PKR" as const,
      fulfillment: item.fulfillment,
      stock: item.stock,
      leadTimeDays: item.leadTimeDays,
      featured: item.featured,
      published: true,
      isBundle: false,
      bundleProductIds: [] as string[],
      introOfferPercent: 5,
      seoTitle: item.seoTitle,
      seoDescription: item.seoDescription,
      tags: item.tags,
      categoryId,
    };

    if (existing) {
      await prisma.variant.deleteMany({ where: { productId: existing.id } });
      await prisma.productImage.deleteMany({ where: { productId: existing.id } });
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          ...shared,
          images: {
            create: item.images.map((img, index) => ({
              url: img.url,
              alt: img.alt,
              kind: img.kind,
              sortOrder: index,
            })),
          },
          variants: {
            create: item.variants.map((v) => ({
              name: v.name,
              optionGroup: v.optionGroup,
              swatchHex: v.swatchHex,
              priceDelta: v.priceDelta ?? 0,
              stock: v.stock ?? null,
              sku: v.sku ?? null,
              imageUrl: item.images[0]?.url ?? null,
            })),
          },
        },
      });
    } else {
      await prisma.product.create({
        data: {
          ...shared,
          slug: item.slug,
          images: {
            create: item.images.map((img, index) => ({
              url: img.url,
              alt: img.alt,
              kind: img.kind,
              sortOrder: index,
            })),
          },
          variants: {
            create: item.variants.map((v) => ({
              name: v.name,
              optionGroup: v.optionGroup,
              swatchHex: v.swatchHex,
              priceDelta: v.priceDelta ?? 0,
              stock: v.stock ?? null,
              sku: v.sku ?? null,
              imageUrl: item.images[0]?.url ?? null,
            })),
          },
        },
      });
    }
    products += 1;
  }

  await prisma.settings.upsert({
    where: { id: "default" },
    update: {
      storeMode: "LIVE",
      bannerText:
        "Handmade crochet · Butterfly Sweater · Winter Special · WELCOME10 · WINTER5",
    },
    create: {
      id: "default",
      storeMode: "LIVE",
      shippingFlatFee: 250,
      freeShippingOver: 5000,
      bannerText:
        "Handmade crochet · Butterfly Sweater · Winter Special · WELCOME10 · WINTER5",
    },
  });

  const atelierCount = await prisma.product.count({
    where: { sku: { startsWith: "ZAY-ATL-" } },
  });

  return {
    categories: atelierCategories.length,
    products,
    atelierProductsPresent: atelierCount,
    storeMode: "LIVE" as const,
  };
}
