import type { FulfillmentType } from "@prisma/client";
import { ensureDatabaseUrl, isServerlessRuntime } from "@/lib/env";

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

/**
 * No placeholder products. Add real catalog items in Admin after launch.
 * Kept as a typed empty list so demo-mode admin can still create products in memory.
 */
export type DemoProductSeed = {
  id: string;
  name: string;
  slug: string;
  oneLiner: string;
  story: string;
  materials: string;
  handmadeProof: string;
  stylingNote: string;
  price: number;
  compareAtPrice: number | null;
  currency: string;
  fulfillment: FulfillmentType;
  stock: number | null;
  leadTimeDays: number | null;
  featured: boolean;
  published: boolean;
  isBundle: boolean;
  bundleProductIds: string[];
  introOfferPercent: number | null;
  seoTitle: string;
  seoDescription: string;
  tags: string[];
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  category: (typeof demoCategories)[number];
  images: {
    id: string;
    productId: string;
    url: string;
    alt: string;
    kind: string;
    sortOrder: number;
  }[];
  variants: {
    id: string;
    productId: string;
    name: string;
    optionGroup: string;
    swatchHex: string | null;
    imageUrl: string | null;
    sku: string | null;
    priceDelta: number;
    stock: number | null;
  }[];
};

export const demoProducts: DemoProductSeed[] = [];

export const demoSettings = {
  id: "default",
  shippingFlatFee: 250,
  freeShippingOver: 5000,
  bannerText:
    "Products coming soon · Custom orders open on WhatsApp · Handmade in Pakistan",
  bankName: "[Bank name — to be supplied]",
  bankAccountTitle: "ZAYUNE",
  bankAccountNumber: "[Account number — to be supplied]",
  bankIban: "[IBAN / Raast ID — to be supplied]",
};

export function isDemoMode() {
  const dbUrl = ensureDatabaseUrl();
  if (dbUrl) {
    return process.env.FORCE_DEMO_DATA === "true";
  }
  if (isServerlessRuntime()) {
    return true;
  }
  return process.env.USE_DEMO_DATA === "true" || !dbUrl;
}
