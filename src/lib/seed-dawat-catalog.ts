/**
 * Append-only Winter Dawat Edit seed (shared by CLI + admin API).
 */
import { PrismaClient } from "@prisma/client";
import {
  dawatBundles,
  dawatCategories,
  dawatProducts,
  withSeasonalPrice,
} from "@/lib/dawat-catalog";

export async function seedDawatCatalog(prisma: PrismaClient) {
  const categories = new Map<string, string>();
  for (const def of dawatCategories) {
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

  const slugToId = new Map<string, string>();
  let products = 0;

  for (const item of dawatProducts) {
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
      const row = await prisma.product.update({
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
      slugToId.set(item.slug, row.id);
    } else {
      const row = await prisma.product.create({
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
      slugToId.set(item.slug, row.id);
    }
    products += 1;
  }

  let bundles = 0;
  for (const item of dawatBundles) {
    const categoryId = categories.get(item.categorySlug);
    if (!categoryId) throw new Error(`Missing category ${item.categorySlug}`);
    const childIds = item.childSlugs
      .map((slug) => slugToId.get(slug))
      .filter((id): id is string => Boolean(id));
    if (childIds.length !== item.childSlugs.length) {
      const missing = item.childSlugs.filter((s) => !slugToId.has(s));
      throw new Error(`Bundle ${item.slug} missing children: ${missing.join(", ")}`);
    }

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
      fulfillment: "IN_STOCK" as const,
      stock: item.variants.reduce((sum, v) => sum + (v.stock ?? 0), 0) || null,
      leadTimeDays: null as number | null,
      featured: item.featured,
      published: true,
      isBundle: true,
      bundleProductIds: childIds,
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
    bundles += 1;
  }

  const winterCount = await prisma.product.count({
    where: { sku: { startsWith: "ZAY-WIN-" } },
  });

  await prisma.settings.upsert({
    where: { id: "default" },
    update: {
      storeMode: "LIVE",
      bannerText:
        "Winter Special + Winter Dawat Edit · Mehndi · Engagement · Walima · WELCOME10 · WINTER5",
    },
    create: {
      id: "default",
      storeMode: "LIVE",
      shippingFlatFee: 250,
      freeShippingOver: 5000,
      bannerText:
        "Winter Special + Winter Dawat Edit · Mehndi · Engagement · Walima · WELCOME10 · WINTER5",
    },
  });

  return {
    categories: dawatCategories.length,
    products,
    bundles,
    winterProductsStillPresent: winterCount,
    storeMode: "LIVE" as const,
  };
}
