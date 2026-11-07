/**
 * Encore Edit — 16 crochet SKUs filling gift, baby, home, festive, and statement gaps.
 * Images: /public/products/encore/
 */

import { withSeasonalPrice } from "@/lib/winter-catalog";

const local = (file: string) => `/products/encore/${file}`;

export { withSeasonalPrice };

export type EncoreVariantSeed = {
  name: string;
  optionGroup: string;
  swatchHex: string;
  priceDelta?: number;
  stock?: number | null;
  sku?: string;
};

export type EncoreCategorySeed = {
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
};

export type EncoreProductSeed = {
  name: string;
  slug: string;
  sku: string;
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
  variants: EncoreVariantSeed[];
};

export const encoreCategories: EncoreCategorySeed[] = [
  {
    name: "Baby & Kids",
    slug: "baby-kids",
    description:
      "Handmade crochet for little ones — soft baby blankets, loveys, and kid-friendly gifts from ZAYUNE Pakistan.",
    sortOrder: 12,
  },
  {
    name: "Home & Desk",
    slug: "home-desk",
    description:
      "Handmade crochet for home — coasters, cup cozies, and soft desk gifts finished in Rawalpindi.",
    sortOrder: 13,
  },
  {
    name: "Tops & Layers",
    slug: "tops-layers",
    description:
      "Handmade crochet tops and light layers — cropped covers and statement pieces from ZAYUNE.",
    sortOrder: 4,
  },
];

export const encoreProducts: EncoreProductSeed[] = [
  {
    name: "Soft Baby Blanket Lovey",
    slug: "soft-baby-blanket-lovey",
    sku: "ZAY-ENC-BABYBLANKET",
    categorySlug: "baby-kids",
    oneLiner: "Soft handmade crochet baby blanket / lovey — shower gift ready.",
    story:
      "A soft crochet baby blanket with lovey-scale comfort — gentle yarn, tidy edges, and gift-ready finish. Popular for baby showers and first winters in Pakistan.",
    materials: "Baby-soft acrylic blend · Breathable stitch · Bound edges",
    handmadeProof: "Edges and corners finished by hand for a soft, non-scratch feel.",
    stylingNote: "Message preferred size (lovey vs stroller) on WhatsApp after checkout.",
    listPrice: 2800,
    fulfillment: "MADE_TO_ORDER",
    stock: null,
    leadTimeDays: 10,
    featured: true,
    seoTitle: "Handmade Crochet Baby Blanket Lovey Pakistan | ZAYUNE",
    seoDescription:
      "Buy a handmade crochet baby blanket lovey from ZAYUNE Pakistan. Soft shower gift, made to order, ships nationwide from Rawalpindi.",
    tags: ["crochet baby blanket Pakistan", "handmade lovey", "baby shower gift crochet", "soft baby blanket Rawalpindi"],
    images: [
      { url: local("baby-blanket.jpg"), alt: "Handmade soft crochet baby blanket lovey — ZAYUNE", kind: "hero" },
      { url: local("baby-blanket-detail.jpg"), alt: "Soft stitch detail on crochet baby blanket", kind: "detail" },
    ],
    variants: [
      { name: "Ivory Cloud", optionGroup: "Color", swatchHex: "#F5F0E8", stock: null, sku: "ZAY-ENC-BB-IVY" },
      { name: "Blush Mist", optionGroup: "Color", swatchHex: "#E8C4C0", stock: null, sku: "ZAY-ENC-BB-BLS" },
      { name: "Sky Soft", optionGroup: "Color", swatchHex: "#A8C4D8", stock: null, sku: "ZAY-ENC-BB-SKY" },
    ],
  },
  {
    name: "Amigurumi Bunny Soft Toy",
    slug: "amigurumi-bunny-soft-toy",
    sku: "ZAY-ENC-BUNNY",
    categorySlug: "baby-kids",
    oneLiner: "Handmade crochet amigurumi bunny — cuddly gift and shelf cute.",
    story:
      "A small handmade crochet bunny with soft stuffing and tidy amigurumi shaping. Perfect as a kids gift, nursery shelf piece, or Instagram-ready add-on.",
    materials: "Soft yarn · Polyester fill · Embroidered face · Safety-conscious finish",
    handmadeProof: "Shaping, stuffing, and face details completed by hand in the studio.",
    stylingNote: "Not for unsupervised infants under 3 — decorative / cuddle toy for older kids.",
    listPrice: 1200,
    fulfillment: "IN_STOCK",
    stock: 12,
    leadTimeDays: null,
    featured: true,
    seoTitle: "Handmade Crochet Amigurumi Bunny Pakistan | Soft Toy Gift",
    seoDescription:
      "Shop a handmade crochet amigurumi bunny from ZAYUNE Pakistan. Soft toy gift, ships nationwide from Rawalpindi.",
    tags: ["amigurumi bunny Pakistan", "handmade crochet soft toy", "crochet bunny gift", "kids crochet toy"],
    images: [
      { url: local("amigurumi-bunny.jpg"), alt: "Handmade crochet amigurumi bunny soft toy — ZAYUNE", kind: "hero" },
      { url: local("amigurumi-bunny-detail.jpg"), alt: "Close-up of handmade amigurumi bunny stitches", kind: "detail" },
    ],
    variants: [
      { name: "Cream Bunny", optionGroup: "Color", swatchHex: "#F5F0E8", stock: 4, sku: "ZAY-ENC-BUN-CRM" },
      { name: "Blush Bunny", optionGroup: "Color", swatchHex: "#E8C4C0", stock: 4, sku: "ZAY-ENC-BUN-BLS" },
      { name: "Cocoa Bunny", optionGroup: "Color", swatchHex: "#6B4A34", stock: 4, sku: "ZAY-ENC-BUN-COC" },
    ],
  },
  {
    name: "Messy Bun Ponytail Beanie",
    slug: "messy-bun-ponytail-beanie",
    sku: "ZAY-ENC-MESSYBUN",
    categorySlug: "beanies-hats",
    oneLiner: "Handmade crochet beanie with top opening for messy bun or ponytail.",
    story:
      "A winter beanie with a soft crown opening so you can wear a bun or ponytail without flattening your hair. Ribbed brim, stretch fit, gift-ready.",
    materials: "Soft acrylic blend · Elastic crown opening · Ribbed brim",
    handmadeProof: "Crown opening and brim ribbing finished by hand for a secure stretch.",
    stylingNote: "Adult soft-fit. Message for snugger crown if needed.",
    listPrice: 1300,
    fulfillment: "IN_STOCK",
    stock: 14,
    leadTimeDays: null,
    featured: false,
    seoTitle: "Messy Bun Ponytail Crochet Beanie Pakistan | Handmade",
    seoDescription:
      "Buy a handmade messy bun / ponytail crochet beanie from ZAYUNE Pakistan. Winter hair-friendly hat, ships nationwide.",
    tags: ["messy bun beanie Pakistan", "ponytail crochet hat", "handmade bun beanie", "winter crochet hat"],
    images: [
      { url: local("messy-bun-beanie.jpg"), alt: "Handmade messy bun ponytail crochet beanie — ZAYUNE", kind: "hero" },
      { url: local("messy-bun-beanie-detail.jpg"), alt: "Crown opening detail on messy bun crochet beanie", kind: "detail" },
    ],
    variants: [
      { name: "Camel", optionGroup: "Color", swatchHex: "#C4A484", stock: 5, sku: "ZAY-ENC-MB-CAM" },
      { name: "Charcoal", optionGroup: "Color", swatchHex: "#3A3A3A", stock: 5, sku: "ZAY-ENC-MB-CHR" },
      { name: "Blush", optionGroup: "Color", swatchHex: "#E8C4C0", stock: 4, sku: "ZAY-ENC-MB-BLS" },
    ],
  },
  {
    name: "Chunky Infinity Scarf",
    slug: "chunky-infinity-scarf",
    sku: "ZAY-ENC-INFINITY",
    categorySlug: "scarves-mufflers",
    oneLiner: "Seamless handmade crochet infinity scarf — loop twice for warmth.",
    story:
      "A continuous crochet loop scarf you can wear long or doubled. Different from our open muffler and cowl — this is the classic infinity silhouette.",
    materials: "Chunky yarn · Seamless loop · Soft hand-feel",
    handmadeProof: "Worked in continuous rounds for even tension around the loop.",
    stylingNote: "Double for cold mornings; single for light layering.",
    listPrice: 1700,
    fulfillment: "IN_STOCK",
    stock: 12,
    leadTimeDays: null,
    featured: false,
    seoTitle: "Chunky Crochet Infinity Scarf Pakistan | Handmade Loop Scarf",
    seoDescription:
      "Shop a handmade chunky crochet infinity scarf from ZAYUNE Pakistan. Soft loop scarf, ships nationwide from Rawalpindi.",
    tags: ["crochet infinity scarf Pakistan", "handmade loop scarf", "chunky infinity scarf", "winter scarf Rawalpindi"],
    images: [
      { url: local("infinity-scarf.jpg"), alt: "Handmade chunky crochet infinity scarf — ZAYUNE", kind: "hero" },
      { url: local("infinity-scarf-detail.jpg"), alt: "Chunky stitch detail on crochet infinity scarf", kind: "detail" },
    ],
    variants: [
      { name: "Oatmeal", optionGroup: "Color", swatchHex: "#D9CBB8", stock: 4, sku: "ZAY-ENC-INF-OAT" },
      { name: "Cocoa", optionGroup: "Color", swatchHex: "#6B4A34", stock: 4, sku: "ZAY-ENC-INF-COC" },
      { name: "Fog Grey", optionGroup: "Color", swatchHex: "#9A9A9A", stock: 4, sku: "ZAY-ENC-INF-GRY" },
    ],
  },
  {
    name: "Soft Crochet Leg Warmers",
    slug: "soft-crochet-leg-warmers",
    sku: "ZAY-ENC-LEGWARM",
    categorySlug: "boot-cuffs",
    oneLiner: "Handmade crochet leg warmers — taller than boot cuffs, dance-to-street ready.",
    story:
      "Longer crochet leg warmers that sit above the boot line. Pair with boot cuffs for a layered winter look or wear alone with sneakers.",
    materials: "Soft acrylic blend · Stretch tube · Ribbed edges",
    handmadeProof: "Pair matched by hand for even length and stitch count.",
    stylingNote: "Sold as a pair. Message calf size if you need a custom stretch.",
    listPrice: 1400,
    fulfillment: "IN_STOCK",
    stock: 10,
    leadTimeDays: null,
    featured: false,
    seoTitle: "Handmade Crochet Leg Warmers Pakistan | Winter Pair",
    seoDescription:
      "Buy handmade crochet leg warmers from ZAYUNE Pakistan. Soft winter pair, ships nationwide from Rawalpindi.",
    tags: ["crochet leg warmers Pakistan", "handmade leg warmers", "winter crochet socks style", "boot layer crochet"],
    images: [
      { url: local("leg-warmers.jpg"), alt: "Handmade soft crochet leg warmers pair — ZAYUNE", kind: "hero" },
      { url: local("leg-warmers-detail.jpg"), alt: "Ribbed edge detail on crochet leg warmers", kind: "detail" },
    ],
    variants: [
      { name: "Cream", optionGroup: "Color", swatchHex: "#F5F0E8", stock: 4, sku: "ZAY-ENC-LW-CRM" },
      { name: "Camel", optionGroup: "Color", swatchHex: "#C4A484", stock: 3, sku: "ZAY-ENC-LW-CAM" },
      { name: "Charcoal", optionGroup: "Color", swatchHex: "#3A3A3A", stock: 3, sku: "ZAY-ENC-LW-CHR" },
    ],
  },
  {
    name: "Crochet Soft Stole",
    slug: "crochet-soft-stole",
    sku: "ZAY-ENC-STOLE",
    categorySlug: "scarves-mufflers",
    oneLiner: "Long handmade crochet stole — soft wrap for walima evenings and winter layers.",
    story:
      "A long, light crochet stole for draping — festive evenings, air-conditioned halls, and soft winter layering. Yarn-only, design-led, no metal jewelry.",
    materials: "Soft drape yarn · Long rectangle · Hand-bound ends",
    handmadeProof: "Full length crocheted in studio sessions for even drape.",
    stylingNote: "Wrap once or twice. Ivory and blush are most requested for walima guests.",
    listPrice: 4500,
    fulfillment: "MADE_TO_ORDER",
    stock: null,
    leadTimeDays: 12,
    featured: true,
    seoTitle: "Handmade Crochet Soft Stole Pakistan | Wedding Wrap",
    seoDescription:
      "Buy a handmade crochet soft stole from ZAYUNE Pakistan. Light festive wrap, made to order, ships nationwide.",
    tags: ["crochet stole Pakistan", "handmade wedding wrap", "crochet dupatta style stole", "walima crochet wrap"],
    images: [
      { url: local("soft-stole.jpg"), alt: "Handmade crochet soft stole wrap — ZAYUNE", kind: "hero" },
      { url: local("soft-stole-detail.jpg"), alt: "Drape and stitch detail on crochet soft stole", kind: "detail" },
    ],
    variants: [
      { name: "Ivory", optionGroup: "Color", swatchHex: "#F5F0E8", stock: null, sku: "ZAY-ENC-ST-IVY" },
      { name: "Blush", optionGroup: "Color", swatchHex: "#E8C4C0", stock: null, sku: "ZAY-ENC-ST-BLS" },
      { name: "Sage", optionGroup: "Color", swatchHex: "#A8B5A0", stock: null, sku: "ZAY-ENC-ST-SAG" },
    ],
  },
  {
    name: "Crochet Bridal Soft Clutch",
    slug: "crochet-bridal-soft-clutch",
    sku: "ZAY-ENC-CLUTCH",
    categorySlug: "bags-pouches",
    oneLiner: "Handmade crochet soft clutch / potli — bridal guest and festive evenings.",
    story:
      "A soft crochet clutch with tidy closure — light enough for walima and mehndi nights, structured enough for phone and lipstick.",
    materials: "Dense crochet body · Soft lining feel · Draw/zip finish",
    handmadeProof: "Body and edge finishing completed by hand in the studio.",
    stylingNote: "Ivory and blush sell first for bridal guests.",
    listPrice: 2200,
    fulfillment: "IN_STOCK",
    stock: 8,
    leadTimeDays: null,
    featured: false,
    seoTitle: "Handmade Crochet Bridal Soft Clutch Pakistan | Potli",
    seoDescription:
      "Shop a handmade crochet bridal soft clutch from ZAYUNE Pakistan. Festive potli-style bag, ships nationwide.",
    tags: ["crochet clutch Pakistan", "handmade bridal clutch", "crochet potli bag", "wedding guest bag crochet"],
    images: [
      { url: local("bridal-clutch.jpg"), alt: "Handmade crochet bridal soft clutch — ZAYUNE", kind: "hero" },
      { url: local("bridal-clutch-detail.jpg"), alt: "Edge and stitch detail on crochet bridal clutch", kind: "detail" },
    ],
    variants: [
      { name: "Ivory", optionGroup: "Color", swatchHex: "#F5F0E8", stock: 3, sku: "ZAY-ENC-CL-IVY" },
      { name: "Blush", optionGroup: "Color", swatchHex: "#E8C4C0", stock: 3, sku: "ZAY-ENC-CL-BLS" },
      { name: "Sage", optionGroup: "Color", swatchHex: "#A8B5A0", stock: 2, sku: "ZAY-ENC-CL-SAG" },
    ],
  },
  {
    name: "Crochet Flower Bouquet Set",
    slug: "crochet-flower-bouquet-set",
    sku: "ZAY-ENC-BOUQUET",
    categorySlug: "ornaments-gifts",
    oneLiner: "Handmade crochet flower bouquet — keepsake blooms for mehndi favours and gifts.",
    story:
      "A small set of crochet flowers arranged as a keepsake bouquet. No wilting — ideal for mehndi favours, desk gifts, and photo props.",
    materials: "Mini crochet blooms · Soft stems · Gift-ready pack",
    handmadeProof: "Each bloom shaped and assembled by hand.",
    stylingNote: "Ask for boutonniere-only pack on WhatsApp if you need single stems.",
    listPrice: 1500,
    fulfillment: "IN_STOCK",
    stock: 10,
    leadTimeDays: null,
    featured: false,
    seoTitle: "Handmade Crochet Flower Bouquet Pakistan | Keepsake Blooms",
    seoDescription:
      "Buy a handmade crochet flower bouquet set from ZAYUNE Pakistan. Keepsake blooms for gifts and mehndi, ships nationwide.",
    tags: ["crochet flower bouquet Pakistan", "handmade crochet flowers", "mehndi favour crochet", "keepsake crochet blooms"],
    images: [
      { url: local("flower-bouquet.jpg"), alt: "Handmade crochet flower bouquet set — ZAYUNE", kind: "hero" },
      { url: local("flower-bouquet-detail.jpg"), alt: "Close-up of handmade crochet flower petals", kind: "detail" },
    ],
    variants: [
      { name: "Mehndi Mix", optionGroup: "Palette", swatchHex: "#E8A317", stock: 4, sku: "ZAY-ENC-BQ-MEH" },
      { name: "Blush Ivory", optionGroup: "Palette", swatchHex: "#E8C4C0", stock: 3, sku: "ZAY-ENC-BQ-BLS" },
      { name: "Garden Soft", optionGroup: "Palette", swatchHex: "#A8B5A0", stock: 3, sku: "ZAY-ENC-BQ-GRD" },
    ],
  },
  {
    name: "Crochet AirPods Case",
    slug: "crochet-airpods-case",
    sku: "ZAY-ENC-AIRPODS",
    categorySlug: "bags-pouches",
    oneLiner: "Tiny handmade crochet case for earbuds — impulse gift add-on.",
    story:
      "A small crochet sleeve sized for earbud cases. Soft protection, loop tab, and easy gifting at checkout.",
    materials: "Dense mini crochet · Soft stretch · Loop tab",
    handmadeProof: "Mini sleeve edged and looped by hand.",
    stylingNote: "Fits most slim earbud cases; message your model for a taller sleeve.",
    listPrice: 550,
    fulfillment: "IN_STOCK",
    stock: 20,
    leadTimeDays: null,
    featured: false,
    seoTitle: "Handmade Crochet AirPods Case Pakistan | Earbuds Sleeve",
    seoDescription:
      "Shop a handmade crochet AirPods / earbuds case from ZAYUNE Pakistan. Soft mini sleeve, ships nationwide.",
    tags: ["crochet airpods case Pakistan", "handmade earbuds sleeve", "mini crochet pouch", "gift add-on crochet"],
    images: [
      { url: local("airpods-case.jpg"), alt: "Handmade crochet AirPods earbuds case — ZAYUNE", kind: "hero" },
      { url: local("airpods-case-detail.jpg"), alt: "Stitch detail on crochet earbuds case", kind: "detail" },
    ],
    variants: [
      { name: "Cream", optionGroup: "Color", swatchHex: "#F5F0E8", stock: 7, sku: "ZAY-ENC-AP-CRM" },
      { name: "Blush", optionGroup: "Color", swatchHex: "#E8C4C0", stock: 7, sku: "ZAY-ENC-AP-BLS" },
      { name: "Sage", optionGroup: "Color", swatchHex: "#A8B5A0", stock: 6, sku: "ZAY-ENC-AP-SAG" },
    ],
  },
  {
    name: "Granny Square Market Bag",
    slug: "granny-square-market-bag",
    sku: "ZAY-ENC-MARKETBAG",
    categorySlug: "bags-pouches",
    oneLiner: "Handmade crochet granny square market bag — roomy everyday tote.",
    story:
      "A roomy granny-square crochet market bag with soft handles. Weekend markets, books, and light shopping — designed to look handmade, not factory.",
    materials: "Cotton-blend yarn · Granny motifs · Soft handles",
    handmadeProof: "Motifs joined and handles attached by hand.",
    stylingNote: "Stretchy when full — ideal for light groceries and beach days.",
    listPrice: 2400,
    fulfillment: "IN_STOCK",
    stock: 8,
    leadTimeDays: null,
    featured: true,
    seoTitle: "Handmade Granny Square Market Bag Pakistan | Crochet Tote",
    seoDescription:
      "Buy a handmade crochet granny square market bag from ZAYUNE Pakistan. Roomy tote, ships nationwide from Rawalpindi.",
    tags: ["granny square bag Pakistan", "crochet market bag", "handmade crochet tote", "granny square tote"],
    images: [
      { url: local("market-bag.jpg"), alt: "Handmade granny square crochet market bag — ZAYUNE", kind: "hero" },
      { url: local("market-bag-detail.jpg"), alt: "Granny square stitch detail on crochet market bag", kind: "detail" },
    ],
    variants: [
      { name: "Cream Mix", optionGroup: "Palette", swatchHex: "#F5F0E8", stock: 3, sku: "ZAY-ENC-MBAG-CRM" },
      { name: "Sunset Mix", optionGroup: "Palette", swatchHex: "#E85D04", stock: 3, sku: "ZAY-ENC-MBAG-SUN" },
      { name: "Sage Mix", optionGroup: "Palette", swatchHex: "#A8B5A0", stock: 2, sku: "ZAY-ENC-MBAG-SAG" },
    ],
  },
  {
    name: "Cup Cozy Mug Warmer Set",
    slug: "cup-cozy-mug-warmer-set",
    sku: "ZAY-ENC-CUPCOZY",
    categorySlug: "home-desk",
    oneLiner: "Handmade crochet cup cozies — warm hands, desk-ready set of 2.",
    story:
      "Two crochet cup cozies for mugs and takeaway cups. Fast gifts for desks, hostesses, and winter mornings.",
    materials: "Soft yarn sleeves · Stretch fit · Set of 2",
    handmadeProof: "Each cozy edged by hand for a clean stretch fit.",
    stylingNote: "Fits most straight mugs; not for boiling-hot thin glass without liner.",
    listPrice: 650,
    fulfillment: "IN_STOCK",
    stock: 16,
    leadTimeDays: null,
    featured: false,
    seoTitle: "Handmade Crochet Cup Cozy Set Pakistan | Mug Warmers",
    seoDescription:
      "Shop a handmade crochet cup cozy mug warmer set from ZAYUNE Pakistan. Set of 2, ships nationwide.",
    tags: ["crochet cup cozy Pakistan", "handmade mug warmer", "desk gift crochet", "cup sleeve crochet"],
    images: [
      { url: local("cup-cozy.jpg"), alt: "Handmade crochet cup cozy mug warmer set — ZAYUNE", kind: "hero" },
      { url: local("cup-cozy-detail.jpg"), alt: "Stitch detail on crochet cup cozy", kind: "detail" },
    ],
    variants: [
      { name: "Neutral Pair", optionGroup: "Palette", swatchHex: "#D9CBB8", stock: 6, sku: "ZAY-ENC-CC-NEU" },
      { name: "Blush Pair", optionGroup: "Palette", swatchHex: "#E8C4C0", stock: 5, sku: "ZAY-ENC-CC-BLS" },
      { name: "Cocoa Pair", optionGroup: "Palette", swatchHex: "#6B4A34", stock: 5, sku: "ZAY-ENC-CC-COC" },
    ],
  },
  {
    name: "Crochet Coaster Set of 4",
    slug: "crochet-coaster-set-of-4",
    sku: "ZAY-ENC-COASTERS",
    categorySlug: "home-desk",
    oneLiner: "Set of four handmade crochet coasters — soft desk and table gift.",
    story:
      "Four round crochet coasters with tidy edges. Hostess gifts, Eid trays, and everyday table protection with a handmade look.",
    materials: "Cotton-blend yarn · Dense rounds · Pack of 4",
    handmadeProof: "Each coaster edged by hand for a flat, even circle.",
    stylingNote: "Wipe gently; lay flat to dry.",
    listPrice: 800,
    fulfillment: "IN_STOCK",
    stock: 14,
    leadTimeDays: null,
    featured: false,
    seoTitle: "Handmade Crochet Coaster Set of 4 Pakistan | Table Gift",
    seoDescription:
      "Buy a handmade crochet coaster set of 4 from ZAYUNE Pakistan. Soft table gift, ships nationwide.",
    tags: ["crochet coasters Pakistan", "handmade coaster set", "table gift crochet", "home crochet Pakistan"],
    images: [
      { url: local("coasters.jpg"), alt: "Handmade crochet coaster set of four — ZAYUNE", kind: "hero" },
      { url: local("coasters-detail.jpg"), alt: "Close-up of handmade crochet coaster stitches", kind: "detail" },
    ],
    variants: [
      { name: "Ivory Set", optionGroup: "Palette", swatchHex: "#F5F0E8", stock: 5, sku: "ZAY-ENC-CO-IVY" },
      { name: "Sage Set", optionGroup: "Palette", swatchHex: "#A8B5A0", stock: 5, sku: "ZAY-ENC-CO-SAG" },
      { name: "Blush Set", optionGroup: "Palette", swatchHex: "#E8C4C0", stock: 4, sku: "ZAY-ENC-CO-BLS" },
    ],
  },
  {
    name: "Crochet Laptop Sleeve",
    slug: "crochet-laptop-sleeve",
    sku: "ZAY-ENC-LAPTOP",
    categorySlug: "bags-pouches",
    oneLiner: "Handmade crochet laptop / iPad sleeve — soft padded carry.",
    story:
      "A soft crochet sleeve for laptops and tablets with dense stitch protection. Handmade look for work bags and gifting.",
    materials: "Dense crochet body · Soft cushion feel · Snug opening",
    handmadeProof: "Body and opening finished by hand for a clean stretch fit.",
    stylingNote: "Select size for 13\" or 15\" class devices; message exact model if unsure.",
    listPrice: 2200,
    fulfillment: "MADE_TO_ORDER",
    stock: null,
    leadTimeDays: 7,
    featured: false,
    seoTitle: "Handmade Crochet Laptop Sleeve Pakistan | iPad Cover",
    seoDescription:
      "Buy a handmade crochet laptop / iPad sleeve from ZAYUNE Pakistan. Soft device sleeve, made to order, ships nationwide.",
    tags: ["crochet laptop sleeve Pakistan", "handmade ipad cover", "crochet device sleeve", "laptop pouch crochet"],
    images: [
      { url: local("laptop-sleeve.jpg"), alt: "Handmade crochet laptop sleeve — ZAYUNE", kind: "hero" },
      { url: local("laptop-sleeve-detail.jpg"), alt: "Dense stitch detail on crochet laptop sleeve", kind: "detail" },
    ],
    variants: [
      { name: '13" Soft Fit', optionGroup: "Size", swatchHex: "#F5F0E8", stock: null, sku: "ZAY-ENC-LP-13" },
      { name: '15" Soft Fit', optionGroup: "Size", swatchHex: "#D9CBB8", priceDelta: 300, stock: null, sku: "ZAY-ENC-LP-15" },
    ],
  },
  {
    name: "Granny Square Cardigan",
    slug: "granny-square-cardigan",
    sku: "ZAY-ENC-GRANNYCARD",
    categorySlug: "sweaters-cardigans",
    oneLiner: "Handmade granny square crochet cardigan — colourful statement layer.",
    story:
      "A wearable granny-square cardigan with soft joins and easy layering. Statement colour stories for winter and festive outings — made to order.",
    materials: "Granny motifs · Soft joins · Open front · Hand-finished edges",
    handmadeProof: "Motifs and joins completed by hand for a soft drape.",
    stylingNote: "One soft size S–L. Custom colour maps welcome via WhatsApp.",
    listPrice: 5500,
    fulfillment: "MADE_TO_ORDER",
    stock: null,
    leadTimeDays: 16,
    featured: true,
    seoTitle: "Handmade Granny Square Cardigan Pakistan | Crochet",
    seoDescription:
      "Buy a handmade granny square crochet cardigan from ZAYUNE Pakistan. Colourful statement layer, made to order, ships nationwide.",
    tags: ["granny square cardigan Pakistan", "handmade crochet cardigan", "colourful crochet sweater", "granny square jacket"],
    images: [
      { url: local("granny-cardigan.jpg"), alt: "Handmade granny square crochet cardigan — ZAYUNE", kind: "hero" },
      { url: local("granny-cardigan-detail.jpg"), alt: "Granny square join detail on crochet cardigan", kind: "detail" },
    ],
    variants: [
      { name: "Cream Patch", optionGroup: "Palette", swatchHex: "#F5F0E8", stock: null, sku: "ZAY-ENC-GC-CRM" },
      { name: "Sunset Patch", optionGroup: "Palette", swatchHex: "#E85D04", stock: null, sku: "ZAY-ENC-GC-SUN" },
      { name: "Garden Patch", optionGroup: "Palette", swatchHex: "#A8B5A0", stock: null, sku: "ZAY-ENC-GC-GRD" },
    ],
  },
  {
    name: "Cropped Crochet Cover Top",
    slug: "cropped-crochet-cover-top",
    sku: "ZAY-ENC-CROPTOP",
    categorySlug: "tops-layers",
    oneLiner: "Soft handmade cropped crochet cover — layer over tanks and dresses.",
    story:
      "A light cropped crochet cover top for layering. Festival, summer evenings, and soft modest layering over camisoles — made to order.",
    materials: "Open stitch crochet · Cropped length · Soft yarn",
    handmadeProof: "Body and edges finished by hand for a soft crop line.",
    stylingNote: "Wear over a tank or slip. Share bust/length notes for best fit.",
    listPrice: 2800,
    fulfillment: "MADE_TO_ORDER",
    stock: null,
    leadTimeDays: 10,
    featured: false,
    seoTitle: "Handmade Cropped Crochet Cover Top Pakistan | Layer",
    seoDescription:
      "Shop a handmade cropped crochet cover top from ZAYUNE Pakistan. Soft layering piece, made to order, ships nationwide.",
    tags: ["cropped crochet top Pakistan", "handmade crochet cover", "festival crochet top", "crochet bralette cover"],
    images: [
      { url: local("crop-top.jpg"), alt: "Handmade cropped crochet cover top — ZAYUNE", kind: "hero" },
      { url: local("crop-top-detail.jpg"), alt: "Open stitch detail on cropped crochet cover", kind: "detail" },
    ],
    variants: [
      { name: "Ivory", optionGroup: "Color", swatchHex: "#F5F0E8", stock: null, sku: "ZAY-ENC-CT-IVY" },
      { name: "Black Soft", optionGroup: "Color", swatchHex: "#2A2A2A", stock: null, sku: "ZAY-ENC-CT-BLK" },
      { name: "Blush", optionGroup: "Color", swatchHex: "#E8C4C0", stock: null, sku: "ZAY-ENC-CT-BLS" },
    ],
  },
  {
    name: "Crochet Balaclava Hood",
    slug: "crochet-balaclava-hood",
    sku: "ZAY-ENC-BALACLAVA",
    categorySlug: "beanies-hats",
    oneLiner: "Handmade crochet balaclava hood — full winter face-and-neck warmth.",
    story:
      "A soft crochet balaclava-style hood for cold Rawalpindi mornings and travel. Covers head and neck with a clean face opening.",
    materials: "Soft acrylic blend · Contoured face opening · Ribbed edge",
    handmadeProof: "Shaping around the face opening finished by hand for stretch comfort.",
    stylingNote: "Adult soft fit. Message if you need a deeper neck length.",
    listPrice: 1600,
    fulfillment: "IN_STOCK",
    stock: 10,
    leadTimeDays: null,
    featured: false,
    seoTitle: "Handmade Crochet Balaclava Hood Pakistan | Winter Mask",
    seoDescription:
      "Buy a handmade crochet balaclava hood from ZAYUNE Pakistan. Soft winter face-and-neck warmer, ships nationwide.",
    tags: ["crochet balaclava Pakistan", "handmade winter hood", "crochet ski mask style", "face neck warmer crochet"],
    images: [
      { url: local("balaclava.jpg"), alt: "Handmade crochet balaclava hood — ZAYUNE", kind: "hero" },
      { url: local("balaclava-detail.jpg"), alt: "Face opening stitch detail on crochet balaclava", kind: "detail" },
    ],
    variants: [
      { name: "Charcoal", optionGroup: "Color", swatchHex: "#3A3A3A", stock: 4, sku: "ZAY-ENC-BAL-CHR" },
      { name: "Camel", optionGroup: "Color", swatchHex: "#C4A484", stock: 3, sku: "ZAY-ENC-BAL-CAM" },
      { name: "Ivory", optionGroup: "Color", swatchHex: "#F5F0E8", stock: 3, sku: "ZAY-ENC-BAL-IVY" },
    ],
  },
];
