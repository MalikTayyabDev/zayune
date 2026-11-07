/**
 * Non-crochet jewelry / metal / beaded pieces to keep unpublished.
 * ZAYUNE sells handmade crochet accessories only.
 */
export const JEWELRY_PRODUCT_SLUGS = [
  "pearl-beaded-jewelry-set",
  "beaded-jhumka-earrings-mehndi",
  "floral-maang-tikka-mehndi",
  "engagement-pearl-necklace-earring-set",
  "pearl-tikka-jhumar-set-engagement",
  "pearl-bead-hair-pins-pack",
  "beaded-bracelet-ring-duo-engagement",
  "hand-painted-organza-dupatta",
  "kundan-style-choker-set-walima",
  "pearl-hair-comb-walima",
  "embellished-clutch-potli-walima",
  "engagement-pearl-set-bundle",
  "walima-elegance-set",
] as const;

/** Categories that were jewelry-only and should not appear on the crochet storefront. */
export const HIDDEN_STOREFRONT_CATEGORY_SLUGS = ["jewelry", "engagement"] as const;

export const jewelrySlugList: string[] = [...JEWELRY_PRODUCT_SLUGS];

/** Prisma `where` fragment — always exclude non-crochet SKUs from public queries. */
export function excludeJewelryProductWhere() {
  return { slug: { notIn: jewelrySlugList } };
}

export function isJewelryProductSlug(slug: string) {
  return jewelrySlugList.includes(slug);
}

export function isHiddenStorefrontCategory(slug: string) {
  return (HIDDEN_STOREFRONT_CATEGORY_SLUGS as readonly string[]).includes(slug);
}
