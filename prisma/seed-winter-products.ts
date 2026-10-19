/**
 * Seeds the 10 winning Winter Special products + discounts; sets store LIVE.
 * Usage: npm run db:seed-winter
 */
import { PrismaClient } from "@prisma/client";
import {
  winterCategories,
  winterProducts,
  withSeasonalPrice,
} from "../src/lib/winter-catalog";

const prisma = new PrismaClient();

async function ensureCategories() {
  // Keep Custom Orders for made-to-order flow, but replace shop taxonomy.
  const custom = {
    name: "Custom Orders",
    slug: "custom-orders",
    description:
      "Made for you — custom colorways, names, and one-of-a-kind requests.",
    sortOrder: 99,
  };

  const map = new Map<string, string>();
  for (const def of [...winterCategories, custom]) {
    const row = await prisma.category.upsert({
      where: { slug: def.slug },
      update: {
        name: def.name,
        description: def.description,
        sortOrder: def.sortOrder,
      },
      create: def,
    });
    map.set(def.slug, row.id);
  }

  // Drop legacy empty categories so they stop appearing in the sitemap.
  const keep = new Set([...winterCategories.map((c) => c.slug), "custom-orders"]);
  const stale = await prisma.category.findMany({
    where: { products: { none: {} } },
  });
  for (const category of stale) {
    if (keep.has(category.slug)) continue;
    await prisma.category.delete({ where: { id: category.id } }).catch(() => null);
  }

  return map;
}

async function clearCatalogOnly() {
  await prisma.orderItem.deleteMany().catch(() => null);
  await prisma.order.deleteMany().catch(() => null);
  await prisma.variant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.wishlistItem.deleteMany().catch(() => null);
  await prisma.waitlistEntry.deleteMany().catch(() => null);
  await prisma.product.deleteMany();
}

async function ensureDiscounts() {
  const winterEnd = new Date();
  winterEnd.setMonth(winterEnd.getMonth() + 3);

  await prisma.discountCode.upsert({
    where: { code: "WELCOME10" },
    update: {
      active: true,
      isIntroOffer: true,
      type: "PERCENT",
      value: 10,
      description: "Introductory offer — 10% off your order",
      usageType: "UNLIMITED",
    },
    create: {
      code: "WELCOME10",
      type: "PERCENT",
      value: 10,
      active: true,
      isIntroOffer: true,
      usageType: "UNLIMITED",
      description: "Introductory offer — 10% off your order",
    },
  });

  await prisma.discountCode.upsert({
    where: { code: "WINTER5" },
    update: {
      active: true,
      isIntroOffer: false,
      type: "PERCENT",
      value: 5,
      description: "Winter Special — extra 5% off at checkout",
      usageType: "UNLIMITED",
      endsAt: winterEnd,
    },
    create: {
      code: "WINTER5",
      type: "PERCENT",
      value: 5,
      active: true,
      isIntroOffer: false,
      usageType: "UNLIMITED",
      description: "Winter Special — extra 5% off at checkout",
      endsAt: winterEnd,
    },
  });
}

async function main() {
  const categories = await ensureCategories();
  await clearCatalogOnly();
  await ensureDiscounts();

  let created = 0;
  for (const item of winterProducts) {
    const categoryId = categories.get(item.categorySlug);
    if (!categoryId) {
      throw new Error(`Missing category ${item.categorySlug}`);
    }
    const { price, compareAtPrice } = withSeasonalPrice(item.listPrice);

    await prisma.product.create({
      data: {
        name: item.name,
        slug: item.slug,
        sku: item.sku,
        oneLiner: item.oneLiner,
        story: item.story,
        materials: item.materials,
        handmadeProof: item.handmadeProof,
        stylingNote: item.stylingNote,
        price,
        compareAtPrice,
        currency: "PKR",
        fulfillment: item.fulfillment,
        stock: item.stock,
        leadTimeDays: item.leadTimeDays,
        featured: item.featured,
        published: true,
        introOfferPercent: 5,
        seoTitle: item.seoTitle,
        seoDescription: item.seoDescription,
        tags: item.tags,
        categoryId,
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
    created += 1;
  }

  await prisma.settings.upsert({
    where: { id: "default" },
    update: {
      storeMode: "LIVE",
      bannerText:
        "Winter Special · 10 winning pieces · 5% seasonal on products · WELCOME10 · WINTER5",
    },
    create: {
      id: "default",
      storeMode: "LIVE",
      shippingFlatFee: 250,
      freeShippingOver: 5000,
      bannerText:
        "Winter Special · 10 winning pieces · 5% seasonal on products · WELCOME10 · WINTER5",
    },
  });

  console.log("Winter Special (10 products) seeded:", {
    products: created,
    categories: winterCategories.length,
    storeMode: "LIVE",
    discounts: ["WELCOME10", "WINTER5"],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
