/**
 * Seeds the Winter Special catalog + discounts and sets store to LIVE.
 * Usage: npx tsx prisma/seed-winter-products.ts
 */
import { PrismaClient } from "@prisma/client";
import {
  winterProducts,
  withSeasonalPrice,
} from "../src/lib/winter-catalog";

const prisma = new PrismaClient();

async function ensureCategories() {
  const defs = [
    {
      name: "Jewelry",
      slug: "jewelry",
      description:
        "Handmade jewelry with quiet presence — pieces meant to be worn close and often.",
      sortOrder: 1,
    },
    {
      name: "Crochet Flowers",
      slug: "crochet-flowers",
      description:
        "Crochet flowers and floral forms — soft structure, lasting bloom, made by hand in Pakistan.",
      sortOrder: 2,
    },
    {
      name: "Keychains",
      slug: "keychains",
      description:
        "Small keepsakes with character — keychains and charms for everyday carry.",
      sortOrder: 3,
    },
    {
      name: "Custom Orders",
      slug: "custom-orders",
      description:
        "Made for you — custom colorways, names, and one-of-a-kind requests.",
      sortOrder: 4,
    },
  ];

  const map = new Map<string, string>();
  for (const def of defs) {
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
        "Winter Special · 5% seasonal on products · Intro code WELCOME10 · Extra WINTER5 at checkout",
    },
    create: {
      id: "default",
      storeMode: "LIVE",
      shippingFlatFee: 250,
      freeShippingOver: 5000,
      bannerText:
        "Winter Special · 5% seasonal on products · Intro code WELCOME10 · Extra WINTER5 at checkout",
    },
  });

  console.log("Winter Special seeded:", {
    products: created,
    storeMode: "LIVE",
    discounts: ["WELCOME10", "WINTER5"],
    note: "Product prices already include 5% seasonal (compare-at = list).",
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
