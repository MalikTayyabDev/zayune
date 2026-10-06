import type { FulfillmentType } from "@prisma/client";
import { ensureDatabaseUrl, isServerlessRuntime } from "@/lib/env";
import { img, siteImages } from "@/lib/site-images";

export const demoCategories = [
  {
    id: "cat-jewelry",
    name: "Jewelry",
    slug: "jewelry",
    description:
      "Handmade jewelry with quiet presence — pieces meant to be worn close and often.",
    sortOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "cat-crochet-flowers",
    name: "Crochet Flowers",
    slug: "crochet-flowers",
    description:
      "Crochet flowers and floral forms — soft structure, lasting bloom, made by hand in Pakistan.",
    sortOrder: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "cat-keychains",
    name: "Keychains",
    slug: "keychains",
    description:
      "Small keepsakes with character — keychains and charms for everyday carry.",
    sortOrder: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "cat-custom",
    name: "Custom Orders",
    slug: "custom-orders",
    description:
      "Made for you — custom colorways, names, and one-of-a-kind requests.",
    sortOrder: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const productImages = {
  pendant: [
    img(siteImages.jewelry.flatlay, "Handmade pendant jewelry by ZAYUNE", "hero", 0),
    img(siteImages.jewelry.pearl, "ZAYUNE pendant detail in soft light", "detail", 1),
  ],
  earrings: [
    img(siteImages.jewelry.earrings, "Handmade earrings by ZAYUNE", "hero", 0),
    img(siteImages.jewelry.necklace, "ZAYUNE jewelry worn close-up", "worn", 1),
  ],
  bloom: [
    img(siteImages.flowers.yellow, "Handmade crochet flower by ZAYUNE", "hero", 0),
    img(siteImages.flowers.sunflower, "Crochet flower texture detail", "detail", 1),
  ],
  floralSet: [
    img(siteImages.flowers.clusterBlue, "ZAYUNE crochet floral set", "hero", 0),
    img(siteImages.flowers.bowl, "Crochet blooms grouped as a gift set", "styled", 1),
  ],
  keychain: [
    img(siteImages.keychains.crochetCharm, "Handmade crochet keychain charm by ZAYUNE", "hero", 0),
    img(siteImages.keychains.smallBloom, "Small crochet bloom keychain detail", "detail", 1),
  ],
  custom: [
    img(siteImages.flowers.held, "Custom crochet colorway request — ZAYUNE", "hero", 0),
    img(siteImages.studio.yarnBalls, "Yarn palette for custom ZAYUNE orders", "process", 1),
  ],
};

function v(
  id: string,
  productId: string,
  name: string,
  optionGroup: string,
  swatchHex: string | null,
  priceDelta = 0,
  stock: number | null = null,
  imageUrl: string | null = null
) {
  return {
    id,
    productId,
    name,
    optionGroup,
    swatchHex,
    imageUrl,
    sku: null,
    priceDelta,
    stock,
  };
}

export const demoProducts = [
  {
    id: "prod-1",
    name: "Lumen Pendant",
    slug: "lumen-pendant",
    oneLiner: "A quiet point of light against the collarbone.",
    story:
      "Sketched for evenings that ask for one deliberate detail. The Lumen pendant holds a soft geometry — enough to catch light, never enough to shout.",
    materials: "[materials — to be supplied]",
    handmadeProof:
      "Each piece is formed by hand in the studio, finished and checked before it leaves. [process detail — to be supplied]",
    stylingNote: "Wear alone on a fine chain, or layered with a shorter collar piece.",
    price: 4500,
    compareAtPrice: 5200,
    currency: "PKR",
    fulfillment: "MADE_TO_ORDER" as FulfillmentType,
    stock: null,
    leadTimeDays: 7,
    featured: true,
    published: true,
    isBundle: false,
    bundleProductIds: [] as string[],
    introOfferPercent: 10 as number | null,
    seoTitle: "Lumen Pendant | Handmade Jewelry by ZAYUNE Pakistan",
    seoDescription:
      "Shop the Lumen Pendant — handmade jewelry from ZAYUNE. Designer-led, made to order in Pakistan. Designed, not just made.",
    tags: ["jewelry", "pendant", "handmade", "pakistan"],
    categoryId: "cat-jewelry",
    createdAt: new Date(),
    updatedAt: new Date(),
    category: demoCategories[0],
    images: productImages.pendant.map((img, i) => ({
      ...img,
      id: `prod-1-${i}`,
      productId: "prod-1",
    })),
    variants: [
      v("v1a", "prod-1", "Gold tone", "Color", "#B79B63"),
      v("v1b", "prod-1", "Silver tone", "Color", "#C5C0B8"),
      v("v1c", "prod-1", "Copper", "Color", "#B85F45"),
    ],
  },
  {
    id: "prod-2",
    name: "Thread & Stone Earrings",
    slug: "thread-stone-earrings",
    oneLiner: "Textile warmth meeting a single stone.",
    story:
      "A study in contrast: soft fiber and a cool stone, held in balance. Designed as daily wear with editorial intent.",
    materials: "[materials — to be supplied]",
    handmadeProof:
      "Wound, set, and finished by hand. Made in small batches. [process detail — to be supplied]",
    stylingNote: "Pairs cleanly with an open neckline and pulled-back hair.",
    price: 3200,
    compareAtPrice: null as number | null,
    currency: "PKR",
    fulfillment: "IN_STOCK" as FulfillmentType,
    stock: 4,
    leadTimeDays: null,
    featured: true,
    published: true,
    isBundle: false,
    bundleProductIds: [] as string[],
    introOfferPercent: null as number | null,
    seoTitle: "Thread & Stone Earrings | ZAYUNE Handmade Jewelry",
    seoDescription:
      "Handmade Thread & Stone Earrings by ZAYUNE — textile and stone jewelry crafted in Pakistan.",
    tags: ["jewelry", "earrings", "handmade"],
    categoryId: "cat-jewelry",
    createdAt: new Date(),
    updatedAt: new Date(),
    category: demoCategories[0],
    images: productImages.earrings.map((img, i) => ({
      ...img,
      id: `prod-2-${i}`,
      productId: "prod-2",
    })),
    variants: [
      v("v2a", "prod-2", "Porcelain", "Color", "#F4EEE6", 0, 2),
      v("v2b", "prod-2", "Sage", "Color", "#7F8B78", 0, 1),
      v("v2c", "prod-2", "Aubergine", "Color", "#2A1F2D", 200, 1),
    ],
  },
  {
    id: "prod-3",
    name: "Eternal Bloom Crochet Flower",
    slug: "eternal-bloom-crochet-flower",
    oneLiner: "A lasting bloom — crocheted, not cut.",
    story:
      "Inspired by the flowers we keep returning to. Each bloom is crocheted by hand — soft petals, considered color, made to outlast a season.",
    materials: "[materials — to be supplied]",
    handmadeProof:
      "Hooked petal by petal from a studio pattern. [process detail — to be supplied]",
    stylingNote: "Pin to a bag, weave into hair, or gift as a keepsake bloom.",
    price: 1800,
    compareAtPrice: 2200 as number | null,
    currency: "PKR",
    fulfillment: "MADE_TO_ORDER" as FulfillmentType,
    stock: null,
    leadTimeDays: 5,
    featured: true,
    published: true,
    isBundle: false,
    bundleProductIds: [] as string[],
    introOfferPercent: null as number | null,
    seoTitle: "Eternal Bloom Crochet Flower | Handmade by ZAYUNE",
    seoDescription:
      "Handmade crochet flowers from ZAYUNE Pakistan. Soft, lasting blooms — custom colors available.",
    tags: ["crochet", "flowers", "handmade", "pakistan"],
    categoryId: "cat-crochet-flowers",
    createdAt: new Date(),
    updatedAt: new Date(),
    category: demoCategories[1],
    images: productImages.bloom.map((img, i) => ({
      ...img,
      id: `prod-3-${i}`,
      productId: "prod-3",
    })),
    variants: [
      v("v3a", "prod-3", "Porcelain", "Color", "#F4EEE6"),
      v("v3b", "prod-3", "Blush", "Color", "#D4A59A"),
      v("v3c", "prod-3", "Sage", "Color", "#7F8B78"),
      v("v3d", "prod-3", "Copper", "Color", "#B85F45"),
    ],
  },
  {
    id: "prod-4",
    name: "Studio Floral Set",
    slug: "studio-floral-set",
    oneLiner: "A small bouquet, forever in yarn.",
    story:
      "Three crochet blooms as a set — for styling, gifting, or keeping on a desk. Tiny things, big vibes.",
    materials: "[materials — to be supplied]",
    handmadeProof:
      "Crocheted and finished as a matched set in-studio. [process detail — to be supplied]",
    stylingNote: "Group in a small vessel or gift wrapped as a trio.",
    price: 4200,
    compareAtPrice: 5400 as number | null,
    currency: "PKR",
    fulfillment: "MADE_TO_ORDER" as FulfillmentType,
    stock: null,
    leadTimeDays: 10,
    featured: true,
    published: true,
    isBundle: true,
    bundleProductIds: ["prod-3", "prod-5"] as string[],
    introOfferPercent: null as number | null,
    seoTitle: "Studio Floral Set | Crochet Flowers by ZAYUNE",
    seoDescription:
      "A handmade crochet flower set from ZAYUNE. Designer-led floral pieces made in Pakistan.",
    tags: ["crochet", "flowers", "gift", "set", "bundle"],
    categoryId: "cat-crochet-flowers",
    createdAt: new Date(),
    updatedAt: new Date(),
    category: demoCategories[1],
    images: productImages.floralSet.map((img, i) => ({
      ...img,
      id: `prod-4-${i}`,
      productId: "prod-4",
    })),
    variants: [
      v("v4a", "prod-4", "Soft neutrals", "Palette", "#D7CEC3"),
      v("v4b", "prod-4", "Warm copper", "Palette", "#B85F45"),
      v("v4c", "prod-4", "Garden sage", "Palette", "#7F8B78"),
    ],
  },
  {
    id: "prod-5",
    name: "Charm Keychain",
    slug: "charm-keychain",
    oneLiner: "A small mark for the keys you carry every day.",
    story:
      "Designed as a tiny companion — handmade charm, solid finish, meant for bags and keys without feeling loud.",
    materials: "[materials — to be supplied]",
    handmadeProof: "Formed and finished by hand. [process detail — to be supplied]",
    stylingNote: "Clip to a tote zipper or house keys.",
    price: 1200,
    compareAtPrice: null as number | null,
    currency: "PKR",
    fulfillment: "IN_STOCK" as FulfillmentType,
    stock: 0,
    leadTimeDays: null,
    featured: true,
    published: true,
    isBundle: false,
    bundleProductIds: [] as string[],
    introOfferPercent: null as number | null,
    seoTitle: "Charm Keychain | Handmade Accessories by ZAYUNE",
    seoDescription:
      "Shop handmade keychains from ZAYUNE Pakistan. Small keepsakes with character — join the waitlist when sold out.",
    tags: ["keychain", "accessories", "handmade"],
    categoryId: "cat-keychains",
    createdAt: new Date(),
    updatedAt: new Date(),
    category: demoCategories[2],
    images: productImages.keychain.map((img, i) => ({
      ...img,
      id: `prod-5-${i}`,
      productId: "prod-5",
    })),
    variants: [
      v("v5a", "prod-5", "Aubergine", "Color", "#2A1F2D", 0, 0),
      v("v5b", "prod-5", "Copper", "Color", "#B85F45", 0, 0),
      v("v5c", "prod-5", "Brass", "Color", "#B79B63", 0, 0),
    ],
  },
  {
    id: "prod-6",
    name: "Custom Colorway Request",
    slug: "custom-colorway-request",
    oneLiner: "Your palette. Our hand.",
    story:
      "For custom orders — choose a piece type and share your color story. We design and make it with the same care as our studio edit.",
    materials: "[materials — to be confirmed per order]",
    handmadeProof:
      "Custom pieces follow the same sketch → material → make path. Lead times vary. [details — to be supplied]",
    stylingNote: "Start the conversation on WhatsApp or at checkout notes.",
    price: 2500,
    compareAtPrice: null as number | null,
    currency: "PKR",
    fulfillment: "MADE_TO_ORDER" as FulfillmentType,
    stock: null,
    leadTimeDays: 14,
    featured: false,
    published: false,
    isBundle: false,
    bundleProductIds: [] as string[],
    introOfferPercent: null as number | null,
    seoTitle: "Custom Orders | Handmade by ZAYUNE Pakistan",
    seoDescription:
      "Request a custom handmade piece from ZAYUNE — jewelry, crochet flowers, keychains, and colorways made for you.",
    tags: ["custom", "made-to-order", "pakistan"],
    categoryId: "cat-custom",
    createdAt: new Date(),
    updatedAt: new Date(),
    category: demoCategories[3],
    images: productImages.custom.map((img, i) => ({
      ...img,
      id: `prod-6-${i}`,
      productId: "prod-6",
    })),
    variants: [
      v("v6a", "prod-6", "Flower", "Piece type", "#D4A59A"),
      v("v6b", "prod-6", "Jewelry", "Piece type", "#B79B63"),
      v("v6c", "prod-6", "Keychain", "Piece type", "#7F8B78"),
    ],
  },
];

export const demoSettings = {
  id: "default",
  shippingFlatFee: 250,
  freeShippingOver: 5000,
  bannerText: "Intro offer: use WELCOME10 for 10% off · Handmade in Pakistan",
  bankName: "[Bank name — to be supplied]",
  bankAccountTitle: "ZAYUNE",
  bankAccountNumber: "[Account number — to be supplied]",
  bankIban: "[IBAN / Raast ID — to be supplied]",
};

export function isDemoMode() {
  // With a real DB URL (incl. Neon POSTGRES_* aliases), only force-demo opts in.
  // In-memory demo orders do not persist across Vercel serverless invocations.
  const dbUrl = ensureDatabaseUrl();
  if (dbUrl) {
    return process.env.FORCE_DEMO_DATA === "true";
  }
  if (isServerlessRuntime()) {
    return true;
  }
  return process.env.USE_DEMO_DATA === "true" || !dbUrl;
}
