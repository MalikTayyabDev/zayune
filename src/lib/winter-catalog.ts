/**
 * Winter Special studio edit — SEO-ready product definitions.
 * Images: curated Unsplash (allowed in next.config remotePatterns).
 */

const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;

/** Apply 5% seasonal discount; compare-at shows the list price. */
export function withSeasonalPrice(listPricePkr: number) {
  const compareAtPrice = listPricePkr;
  const price = Math.round(listPricePkr * 0.95);
  return { price, compareAtPrice };
}

export type WinterVariantSeed = {
  name: string;
  optionGroup: string;
  swatchHex: string;
  priceDelta?: number;
  stock?: number;
};

export type WinterProductSeed = {
  name: string;
  slug: string;
  categorySlug: string;
  oneLiner: string;
  story: string;
  materials: string;
  handmadeProof: string;
  stylingNote: string;
  listPrice: number;
  fulfillment: "IN_STOCK" | "MADE_TO_ORDER";
  stock: number | null;
  leadTimeDays: number | null;
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
  tags: string[];
  images: { url: string; alt: string; kind: string }[];
  variants: WinterVariantSeed[];
};

export const winterProducts: WinterProductSeed[] = [
  {
    name: "Frost Bloom Crochet Flower",
    slug: "frost-bloom-crochet-flower",
    categorySlug: "crochet-flowers",
    oneLiner: "A quiet winter bloom — soft structure, lasting cream light.",
    story:
      "Frost Bloom was sketched for cold-season tables and coats: a handmade crochet flower with enough weight to hold shape, and enough softness to feel like a keepsake. Each petal is formed by hand in our Satellite Town, Rawalpindi studio.",
    materials:
      "Cotton-blend yarn · Wire-light stem support · Hand-finished petal edges",
    handmadeProof:
      "Crocheted petal by petal in the ZAYUNE studio — no machine-made bloom.",
    stylingNote:
      "Pin to a wool coat, gift as a lasting winter flower, or style on a linen tray.",
    listPrice: 1950,
    fulfillment: "IN_STOCK",
    stock: 12,
    leadTimeDays: null,
    featured: true,
    seoTitle: "Frost Bloom Handmade Crochet Flower Pakistan | Winter Special",
    seoDescription:
      "Buy Frost Bloom — handmade crochet flower from ZAYUNE Rawalpindi. Winter Special with seasonal pricing. Soft cream tones, made by hand in Pakistan.",
    tags: [
      "winter special",
      "crochet flower",
      "handmade Pakistan",
      "frost bloom",
      "Rawalpindi",
    ],
    images: [
      {
        url: u("photo-1700171518313-5dd219beaaa6"),
        alt: "Frost Bloom handmade crochet flower in soft winter light",
        kind: "hero",
      },
      {
        url: u("photo-1700171458554-46cfd3f2a87a"),
        alt: "Crochet flower petal texture detail — Frost Bloom",
        kind: "detail",
      },
      {
        url: u("photo-1716400128984-3681f2005d22"),
        alt: "Frost Bloom crochet flower styled as winter accessory",
        kind: "lifestyle",
      },
    ],
    variants: [
      { name: "Ivory Frost", optionGroup: "Color", swatchHex: "#F5F0E8", stock: 4 },
      { name: "Blush Mist", optionGroup: "Color", swatchHex: "#E8C4C0", stock: 4 },
      { name: "Soft Sage", optionGroup: "Color", swatchHex: "#A8B5A0", stock: 4 },
    ],
  },
  {
    name: "Winter Rose Crochet Pin",
    slug: "winter-rose-crochet-pin",
    categorySlug: "crochet-flowers",
    oneLiner: "A deeper winter rose — designed to sit close to wool and silk.",
    story:
      "Winter Rose is a denser crochet bloom for colder wardrobes. The spiral is tightened by hand so the flower reads as jewelry-adjacent — structured, quiet, and gift-ready.",
    materials: "Mercerized cotton yarn · Metal pin back · Hand-shaped center",
    handmadeProof: "Spiral center and outer petals crocheted in one continuous studio session.",
    stylingNote: "Wear on a blazer lapel, hijab, or winter scarf as a lasting rose.",
    listPrice: 2250,
    fulfillment: "IN_STOCK",
    stock: 10,
    leadTimeDays: null,
    featured: true,
    seoTitle: "Winter Rose Handmade Crochet Pin | ZAYUNE Pakistan",
    seoDescription:
      "Winter Rose crochet pin — handmade flower accessory from ZAYUNE. Seasonal winter edit, crafted in Satellite Town, Rawalpindi, Pakistan.",
    tags: ["winter special", "crochet rose", "handmade pin", "winter flower"],
    images: [
      {
        url: u("photo-1700171394718-2457b1190444"),
        alt: "Winter Rose handmade crochet flower pin",
        kind: "hero",
      },
      {
        url: u("photo-1708000077538-c7dfba8037d6"),
        alt: "Warm-toned crochet rose detail — Winter Rose",
        kind: "detail",
      },
    ],
    variants: [
      { name: "Deep Rose", optionGroup: "Color", swatchHex: "#8B3A3A", stock: 4 },
      { name: "Burgundy Dusk", optionGroup: "Color", swatchHex: "#5C2A2A", stock: 3 },
      { name: "Cream Rose", optionGroup: "Color", swatchHex: "#F2E8DC", stock: 3 },
    ],
  },
  {
    name: "Snowdrop Cluster",
    slug: "snowdrop-cluster-crochet",
    categorySlug: "crochet-flowers",
    oneLiner: "Three small blooms — a winter cluster for gifts and styling.",
    story:
      "Snowdrop Cluster gathers three miniature crochet flowers into one piece. Designed as a winter gift: soft, light, and easy to place on a shelf, gift wrap, or vanity.",
    materials: "Fine cotton yarn · Soft wired stems · Hand-tied cluster base",
    handmadeProof: "Each mini bloom crocheted separately, then clustered by hand.",
    stylingNote: "Gift as a lasting bouquet alternative — no water, all winter.",
    listPrice: 2650,
    fulfillment: "MADE_TO_ORDER",
    stock: null,
    leadTimeDays: 7,
    featured: false,
    seoTitle: "Snowdrop Cluster Handmade Crochet Flowers | Winter Gift Pakistan",
    seoDescription:
      "Order Snowdrop Cluster — handmade mini crochet flower bouquet from ZAYUNE Pakistan. Winter Special made-to-order gift, ships nationwide.",
    tags: ["winter special", "crochet bouquet", "gift", "snowdrop", "made to order"],
    images: [
      {
        url: u("photo-1752755098269-58113eb87d61"),
        alt: "Snowdrop Cluster handmade crochet flowers on book",
        kind: "hero",
      },
      {
        url: u("photo-1595301490405-0ae747be39f6"),
        alt: "White and soft purple crochet flower cluster detail",
        kind: "detail",
      },
    ],
    variants: [
      { name: "Ivory Cluster", optionGroup: "Colorway", swatchHex: "#F7F3EE", stock: null },
      {
        name: "Ice Blue Mix",
        optionGroup: "Colorway",
        swatchHex: "#C5D4E0",
        priceDelta: 150,
        stock: null,
      },
    ],
  },
  {
    name: "Ember Drop Earrings",
    slug: "ember-drop-earrings",
    categorySlug: "jewelry",
    oneLiner: "Warm winter light in a quiet handmade drop.",
    story:
      "Ember Drop was designed for winter evenings — a soft drop with enough presence for wool necklines, without shouting. Finished by hand in the ZAYUNE studio.",
    materials: "Brass findings · Lightweight drop elements · Hypoallergenic hooks (nickel-free finish)",
    handmadeProof: "Each pair assembled and checked by hand before packing.",
    stylingNote: "Pair with a turtleneck or open collar — everyday winter jewelry.",
    listPrice: 2850,
    fulfillment: "IN_STOCK",
    stock: 8,
    leadTimeDays: null,
    featured: true,
    seoTitle: "Ember Drop Handmade Earrings Pakistan | Winter Jewelry ZAYUNE",
    seoDescription:
      "Shop Ember Drop earrings — handmade winter jewelry from ZAYUNE Rawalpindi. Designer-led drops with seasonal pricing. Ships across Pakistan.",
    tags: ["winter special", "handmade earrings", "jewelry Pakistan", "ember drop"],
    images: [
      {
        url: u("photo-1535632066927-ab7c9ab60908"),
        alt: "Ember Drop handmade earrings in soft light",
        kind: "hero",
      },
      {
        url: u("photo-1611652022419-a9419f74343d"),
        alt: "Handmade jewelry flatlay — Ember Drop winter edit",
        kind: "lifestyle",
      },
    ],
    variants: [
      { name: "Warm Brass", optionGroup: "Finish", swatchHex: "#C4A35A", stock: 4 },
      { name: "Soft Copper", optionGroup: "Finish", swatchHex: "#B87333", stock: 4 },
    ],
  },
  {
    name: "Soft Frost Necklace",
    slug: "soft-frost-necklace",
    categorySlug: "jewelry",
    oneLiner: "A pale winter necklace — quiet length, soft shine.",
    story:
      "Soft Frost sits close to the collarbone with a calm winter palette. Designed as a daily piece for the cold months — light enough for all-day wear, considered enough for gifts.",
    materials: "Glass & pearl-effect beads · Brass clasp · Hand-strung length",
    handmadeProof: "Strung and knotted by hand; clasp stress-tested before shipping.",
    stylingNote: "Layer under a coat collar or wear alone on a knit.",
    listPrice: 3450,
    fulfillment: "IN_STOCK",
    stock: 6,
    leadTimeDays: null,
    featured: true,
    seoTitle: "Soft Frost Handmade Necklace Pakistan | Winter Special ZAYUNE",
    seoDescription:
      "Soft Frost necklace — handmade winter jewelry by ZAYUNE. Elegant pearl-soft tones, crafted in Pakistan. Seasonal Winter Special pricing.",
    tags: ["winter special", "handmade necklace", "jewelry Rawalpindi", "soft frost"],
    images: [
      {
        url: u("photo-1599643478518-a784e5dc4c8f"),
        alt: "Soft Frost handmade necklace close-up",
        kind: "hero",
      },
      {
        url: u("photo-1573408301185-91496af5d5b9"),
        alt: "Pearl-soft handmade necklace detail — Soft Frost",
        kind: "detail",
      },
    ],
    variants: [
      { name: "Pearl Mist", optionGroup: "Tone", swatchHex: "#F0E6DC", stock: 3 },
      { name: "Silver Frost", optionGroup: "Tone", swatchHex: "#D0D5DB", stock: 3 },
    ],
  },
  {
    name: "Brass Thread Hoops",
    slug: "brass-thread-hoops",
    categorySlug: "jewelry",
    oneLiner: "Everyday winter hoops with a hand-finished brass edge.",
    story:
      "Brass Thread Hoops are the studio’s winter essential — clean circles with a hand-checked finish. Meant to live in the jewelry dish and leave with you every morning.",
    materials: "Brass hoop base · Hand-polished finish · Secure latch",
    handmadeProof: "Edges filed and polished by hand for a smooth wear.",
    stylingNote: "Works with hijab, open hair, or a winter beanie.",
    listPrice: 2150,
    fulfillment: "IN_STOCK",
    stock: 14,
    leadTimeDays: null,
    featured: false,
    seoTitle: "Brass Thread Handmade Hoop Earrings | ZAYUNE Pakistan",
    seoDescription:
      "Buy Brass Thread Hoops — handmade brass earrings from ZAYUNE. Winter Special everyday jewelry, made in Rawalpindi, Pakistan.",
    tags: ["winter special", "hoop earrings", "handmade brass", "everyday jewelry"],
    images: [
      {
        url: u("photo-1515562141207-7a88fb7ce338"),
        alt: "Brass Thread handmade hoop earrings",
        kind: "hero",
      },
      {
        url: u("photo-1611652022419-a9419f74343d"),
        alt: "Handmade jewelry styling — Brass Thread Hoops",
        kind: "lifestyle",
      },
    ],
    variants: [
      { name: "Classic Brass", optionGroup: "Finish", swatchHex: "#B8953E", stock: 7 },
      { name: "Antique Brass", optionGroup: "Finish", swatchHex: "#8A6A2F", stock: 7 },
    ],
  },
  {
    name: "Midnight Bloom Keychain",
    slug: "midnight-bloom-keychain",
    categorySlug: "keychains",
    oneLiner: "A small winter bloom for keys, bags, and pockets.",
    story:
      "Midnight Bloom is a crochet charm keychain for the winter edit — compact, colorful enough to find in a dark bag, and soft enough to gift without occasion.",
    materials: "Cotton yarn charm · Metal key ring · Reinforced join",
    handmadeProof: "Charm crocheted and secured to the ring by hand.",
    stylingNote: "Clip to keys, tote, or zip — a daily winter keepsake.",
    listPrice: 1100,
    fulfillment: "IN_STOCK",
    stock: 20,
    leadTimeDays: null,
    featured: true,
    seoTitle: "Midnight Bloom Handmade Crochet Keychain Pakistan | ZAYUNE",
    seoDescription:
      "Midnight Bloom crochet keychain — handmade winter charm from ZAYUNE Pakistan. Seasonal pricing. Ships nationwide from Rawalpindi.",
    tags: ["winter special", "crochet keychain", "handmade charm", "midnight bloom"],
    images: [
      {
        url: u("photo-1700161093261-e059af3897c7"),
        alt: "Midnight Bloom handmade crochet keychain charm",
        kind: "hero",
      },
      {
        url: u("photo-1700170447159-9d2d0da133a5"),
        alt: "Small crochet bloom charm detail — Midnight Bloom",
        kind: "detail",
      },
    ],
    variants: [
      { name: "Navy Night", optionGroup: "Color", swatchHex: "#1F2A44", stock: 7 },
      { name: "Wine Ember", optionGroup: "Color", swatchHex: "#6B2D3C", stock: 7 },
      { name: "Cream Moon", optionGroup: "Color", swatchHex: "#F3EDE4", stock: 6 },
    ],
  },
  {
    name: "Cocoa Petal Keychain",
    slug: "cocoa-petal-keychain",
    categorySlug: "keychains",
    oneLiner: "Warm cocoa tones — a soft petal charm for winter carry.",
    story:
      "Cocoa Petal brings warmer yarn tones into the winter keychain line. Designed as a tiny companion piece: handmade, light, and easy to personalize later with a custom colorway.",
    materials: "Soft cotton yarn · Nickel-free key ring · Tight stitch density",
    handmadeProof: "Petal layers stacked and stitched closed by hand.",
    stylingNote: "Pairs well with cocoa-toned bags and winter neutrals.",
    listPrice: 1200,
    fulfillment: "IN_STOCK",
    stock: 16,
    leadTimeDays: null,
    featured: false,
    seoTitle: "Cocoa Petal Handmade Crochet Keychain | Winter Special Pakistan",
    seoDescription:
      "Shop Cocoa Petal — handmade crochet keychain by ZAYUNE. Warm winter tones, crafted in Pakistan. Winter Special seasonal price.",
    tags: ["winter special", "keychain", "cocoa", "handmade Pakistan"],
    images: [
      {
        url: u("photo-1622648147611-e817249f3b73"),
        alt: "Cocoa Petal handmade yarn keychain accent",
        kind: "hero",
      },
      {
        url: u("photo-1595301390417-c66647b47e9f"),
        alt: "Yarn studio tones for Cocoa Petal keychain",
        kind: "detail",
      },
    ],
    variants: [
      { name: "Cocoa", optionGroup: "Color", swatchHex: "#6B4A34", stock: 8 },
      { name: "Blush Cocoa", optionGroup: "Color", swatchHex: "#C4A090", stock: 8 },
    ],
  },
  {
    name: "Holly Berry Charm",
    slug: "holly-berry-charm-keychain",
    categorySlug: "keychains",
    oneLiner: "A festive winter charm — berry red with a quiet handmade finish.",
    story:
      "Holly Berry is the brightest note in the Winter Special — still designed, still restrained. A crochet charm for gifting through the cold season.",
    materials: "Cotton yarn · Metal ring · Embroidered berry detail",
    handmadeProof: "Berry accents embroidered by hand after the charm is formed.",
    stylingNote: "Gift with a card — ready for winter holidays and birthdays.",
    listPrice: 1150,
    fulfillment: "IN_STOCK",
    stock: 18,
    leadTimeDays: null,
    featured: false,
    seoTitle: "Holly Berry Handmade Crochet Keychain Charm | ZAYUNE Winter",
    seoDescription:
      "Holly Berry crochet keychain — handmade winter charm from ZAYUNE. Festive yet quiet. Seasonal Winter Special, ships across Pakistan.",
    tags: ["winter special", "holly", "crochet charm", "gift keychain"],
    images: [
      {
        url: u("photo-1700170928599-d7fc2d4ec97f"),
        alt: "Holly Berry handmade crochet charm on soft ground",
        kind: "hero",
      },
      {
        url: u("photo-1700161093261-e059af3897c7"),
        alt: "Handmade crochet charm detail — Holly Berry",
        kind: "detail",
      },
    ],
    variants: [
      { name: "Berry Red", optionGroup: "Color", swatchHex: "#9B2D2D", stock: 9 },
      { name: "Cream Holly", optionGroup: "Color", swatchHex: "#F5EFE6", stock: 9 },
    ],
  },
];
