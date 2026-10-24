/**
 * Winter Special — the 10 winning products (ZAYUNE studio edit).
 * Hero images live in /public/products/winter/.
 */

const local = (file: string) => `/products/winter/${file}`;

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
  stock?: number | null;
  sku?: string;
};

export type WinterCategorySeed = {
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
};

export type WinterProductSeed = {
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
  variants: WinterVariantSeed[];
};

export const winterCategories: WinterCategorySeed[] = [
  {
    name: "Beanies & Hats",
    slug: "beanies-hats",
    description:
      "Handmade crochet beanies and slouchy hats — winter bestsellers with wide colorways.",
    sortOrder: 1,
  },
  {
    name: "Scarves & Mufflers",
    slug: "scarves-mufflers",
    description:
      "Chunky crochet scarves and mufflers — cozy oversized winter layers, perfect to bundle with a beanie.",
    sortOrder: 2,
  },
  {
    name: "Gloves & Warmers",
    slug: "gloves-warmers",
    description:
      "Fingerless gloves and hand warmers — practical gifts with high handmade margin.",
    sortOrder: 3,
  },
  {
    name: "Ponchos & Shrugs",
    slug: "ponchos-shrugs",
    description:
      "Statement crochet ponchos and shrugs for winter outfits and wedding-season dinners.",
    sortOrder: 4,
  },
  {
    name: "Ear Warmers",
    slug: "ear-warmers",
    description:
      "Crochet ear warmers and headbands — light, giftable add-ons with easy shipping.",
    sortOrder: 5,
  },
  {
    name: "Boot Cuffs",
    slug: "boot-cuffs",
    description:
      "Handmade crochet boot cuffs — a niche winter accessory with loyal search demand.",
    sortOrder: 6,
  },
  {
    name: "Hair Accessories",
    slug: "hair-accessories",
    description:
      "Crochet flower hair clips and gajras — everyday wear and mehndi/wedding functions.",
    sortOrder: 7,
  },
  {
    name: "Ornaments & Gifts",
    slug: "ornaments-gifts",
    description:
      "Mini crochet ornaments and gift toppers for Christmas and New Year gifting.",
    sortOrder: 8,
  },
  {
    name: "Bags & Pouches",
    slug: "bags-pouches",
    description:
      "Chunky crochet totes and pouches — winter gifting staples that work year-round.",
    sortOrder: 9,
  },
];

export const winterProducts: WinterProductSeed[] = [
  {
    name: "Crochet Beanie & Slouchy Hat",
    slug: "crochet-beanie-slouchy-hat",
    sku: "ZAY-WIN-BEANIE",
    categorySlug: "beanies-hats",
    oneLiner: "The winter bestseller — soft structure, wide color range, made by hand.",
    story:
      "Our crochet beanie and slouchy hat is the highest-demand winter piece for a reason: fast to finish, warm to wear, and easy to gift. Each hat is formed stitch by stitch in Satellite Town, Rawalpindi — leftover yarn colorways welcome on request.",
    materials: "Soft acrylic-blend / cotton-blend yarn · Ribbed brim · Hand-finished crown",
    handmadeProof: "Crown decreases and brim ribbing completed by hand in the ZAYUNE studio.",
    stylingNote: "Wear snug as a beanie or slightly slouched — bundle with a matching scarf.",
    listPrice: 1400,
    fulfillment: "IN_STOCK",
    stock: 18,
    leadTimeDays: null,
    featured: true,
    seoTitle: "Handmade Crochet Beanie & Slouchy Hat Pakistan | Winter Special",
    seoDescription:
      "Buy handmade crochet beanies and slouchy hats from ZAYUNE Pakistan. Winter bestseller, seasonal 5% off, color variants, ships nationwide from Rawalpindi.",
    tags: [
      "crochet beanie Pakistan",
      "slouchy hat",
      "winter special",
      "handmade hat Rawalpindi",
      "bestseller",
    ],
    images: [
      {
        url: local("beanie.jpg"),
        alt: "Handmade crochet beanie and slouchy hat — ZAYUNE Winter Special",
        kind: "hero",
      },
      {
        url: local("beanie-detail.jpg"),
        alt: "Crochet beanie stitch and brim detail — matching studio shot",
        kind: "detail",
      },
    ],
    variants: [
      { name: "Camel", optionGroup: "Color", swatchHex: "#C4A484", stock: 5, sku: "ZAY-WIN-BEANIE-CAM" },
      { name: "Ivory", optionGroup: "Color", swatchHex: "#F5F0E8", stock: 5, sku: "ZAY-WIN-BEANIE-IVY" },
      { name: "Charcoal", optionGroup: "Color", swatchHex: "#3A3A3A", stock: 4, sku: "ZAY-WIN-BEANIE-CHR" },
      { name: "Blush", optionGroup: "Color", swatchHex: "#E8C4C0", stock: 4, sku: "ZAY-WIN-BEANIE-BLS" },
    ],
  },
  {
    name: "Chunky Crochet Scarf & Muffler",
    slug: "chunky-crochet-scarf-muffler",
    sku: "ZAY-WIN-SCARF",
    categorySlug: "scarves-mufflers",
    oneLiner: "Oversized cozy texture — the Instagram-ready winter muffler.",
    story:
      "Chunky crochet scarves are trending for that oversized, soft winter look. Ours is designed to wrap once or twice, photograph well, and pair with a matching beanie as a set.",
    materials: "Chunky yarn · Generous length · Hand-bound ends",
    handmadeProof: "Full length crocheted in continuous studio sessions for even tension.",
    stylingNote: "Bundle with a beanie for a matching winter set — strong gift pairing.",
    listPrice: 2000,
    fulfillment: "IN_STOCK",
    stock: 14,
    leadTimeDays: null,
    featured: true,
    seoTitle: "Chunky Crochet Scarf & Muffler Handmade Pakistan | Winter",
    seoDescription:
      "Shop chunky handmade crochet scarves and mufflers from ZAYUNE. Trending winter layers, seasonal pricing, ships across Pakistan.",
    tags: [
      "chunky crochet scarf",
      "muffler Pakistan",
      "winter scarf handmade",
      "bundle with beanie",
    ],
    images: [
      {
        url: local("scarf.jpg"),
        alt: "Chunky handmade crochet scarf and muffler — ZAYUNE",
        kind: "hero",
      },
      {
        url: local("scarf-detail.jpg"),
        alt: "Chunky scarf stitch detail — matching studio shot",
        kind: "detail",
      },
    ],
    variants: [
      { name: "Oatmeal", optionGroup: "Color", swatchHex: "#D9CBB8", stock: 5, sku: "ZAY-WIN-SCARF-OAT" },
      { name: "Cocoa", optionGroup: "Color", swatchHex: "#6B4A34", stock: 5, sku: "ZAY-WIN-SCARF-COC" },
      { name: "Fog Grey", optionGroup: "Color", swatchHex: "#9A9A9A", stock: 4, sku: "ZAY-WIN-SCARF-GRY" },
    ],
  },
  {
    name: "Fingerless Gloves & Hand Warmers",
    slug: "fingerless-gloves-hand-warmers",
    sku: "ZAY-WIN-GLOVES",
    categorySlug: "gloves-warmers",
    oneLiner: "Practical, cute, and high-margin — the small-gift winter staple.",
    story:
      "Fingerless gloves keep palms warm while leaving fingers free — perfect for phones, markets, and gifting. Low yarn usage means a strong handmade margin and a lovely first purchase.",
    materials: "Soft yarn · Thumb opening reinforced · Pair sold together",
    handmadeProof: "Each pair shaped and checked as a matched set by hand.",
    stylingNote: "Gift-ready for teachers, friends, and winter markets.",
    listPrice: 900,
    fulfillment: "IN_STOCK",
    stock: 22,
    leadTimeDays: null,
    featured: true,
    seoTitle: "Handmade Fingerless Gloves & Hand Warmers Pakistan | ZAYUNE",
    seoDescription:
      "Buy handmade crochet fingerless gloves and hand warmers from ZAYUNE Pakistan. High-margin winter gifts with seasonal 5% off.",
    tags: [
      "fingerless gloves crochet",
      "hand warmers Pakistan",
      "winter gift",
      "high margin",
    ],
    images: [
      {
        url: local("gloves.jpg"),
        alt: "Handmade crochet fingerless gloves and hand warmers",
        kind: "hero",
      },
      {
        url: local("gloves-detail.jpg"),
        alt: "Fingerless gloves stitch and thumb detail — matching studio shot",
        kind: "detail",
      },
    ],
    variants: [
      { name: "Blush", optionGroup: "Color", swatchHex: "#E8C4C0", stock: 8, sku: "ZAY-WIN-GLOVES-BLS" },
      { name: "Cream", optionGroup: "Color", swatchHex: "#F3EDE4", stock: 7, sku: "ZAY-WIN-GLOVES-CRM" },
      { name: "Sage", optionGroup: "Color", swatchHex: "#A8B5A0", stock: 7, sku: "ZAY-WIN-GLOVES-SAG" },
    ],
  },
  {
    name: "Crochet Poncho & Shrug",
    slug: "crochet-poncho-shrug",
    sku: "ZAY-WIN-PONCHO",
    categorySlug: "ponchos-shrugs",
    oneLiner: "A statement winter layer for dinners, dawats, and Reels-ready looks.",
    story:
      "Our crochet poncho and shrug sits at a premium winter price point — designed as a statement piece for outfit styling, wedding-season dinners, and content that sells the brand.",
    materials: "Medium-weight yarn · Open drape · Hand-finished edges",
    handmadeProof: "Panel construction joined and blocked by hand before packing.",
    stylingNote: "Style over kurtas, dresses, or jeans — strong Reels styling piece.",
    listPrice: 5000,
    fulfillment: "MADE_TO_ORDER",
    stock: null,
    leadTimeDays: 10,
    featured: true,
    seoTitle: "Handmade Crochet Poncho & Shrug Pakistan | Premium Winter",
    seoDescription:
      "Order a handmade crochet poncho or shrug from ZAYUNE. Premium winter statement piece, made to order in Rawalpindi, Pakistan.",
    tags: [
      "crochet poncho Pakistan",
      "handmade shrug",
      "wedding season",
      "premium crochet",
    ],
    images: [
      {
        url: local("poncho.jpg"),
        alt: "Handmade crochet poncho and shrug — ZAYUNE Winter Special",
        kind: "hero",
      },
      {
        url: local("poncho-detail.jpg"),
        alt: "Poncho yarn drape detail — matching studio shot",
        kind: "detail",
      },
    ],
    variants: [
      { name: "Ivory", optionGroup: "Color", swatchHex: "#F5F0E8", stock: null, sku: "ZAY-WIN-PONCHO-IVY" },
      { name: "Soft Taupe", optionGroup: "Color", swatchHex: "#B8A99A", stock: null, sku: "ZAY-WIN-PONCHO-TAU" },
      {
        name: "Deep Wine",
        optionGroup: "Color",
        swatchHex: "#6B2D3C",
        priceDelta: 400,
        stock: null,
        sku: "ZAY-WIN-PONCHO-WIN",
      },
    ],
  },
  {
    name: "Ear Warmers & Headbands",
    slug: "ear-warmers-headbands",
    sku: "ZAY-WIN-EAR",
    categorySlug: "ear-warmers",
    oneLiner: "Smaller than a beanie — ideal add-on and first-time try-us purchase.",
    story:
      "Ear warmers and headbands use less yarn and ship light, so they work as an easy add-on at checkout or a low-risk first order — especially for overseas buyers watching shipping cost.",
    materials: "Soft yarn · Stretch fit · Hand-seamed join",
    handmadeProof: "Seam and stretch checked by hand on every piece.",
    stylingNote: "Add to cart with a beanie or scarf — perfect upsell.",
    listPrice: 750,
    fulfillment: "IN_STOCK",
    stock: 25,
    leadTimeDays: null,
    featured: false,
    seoTitle: "Handmade Crochet Ear Warmers & Headbands Pakistan | ZAYUNE",
    seoDescription:
      "Shop handmade crochet ear warmers and headbands from ZAYUNE. Low shipping cost winter add-on with seasonal pricing.",
    tags: [
      "crochet ear warmer",
      "headband Pakistan",
      "winter add-on",
      "low shipping",
    ],
    images: [
      {
        url: local("earwarmer.jpg"),
        alt: "Handmade crochet ear warmer and headband — ZAYUNE",
        kind: "hero",
      },
      {
        url: local("earwarmer-detail.jpg"),
        alt: "Ear warmer stitch detail — matching studio shot",
        kind: "detail",
      },
    ],
    variants: [
      { name: "Sage", optionGroup: "Color", swatchHex: "#A8B5A0", stock: 9, sku: "ZAY-WIN-EAR-SAG" },
      { name: "Cream", optionGroup: "Color", swatchHex: "#F3EDE4", stock: 8, sku: "ZAY-WIN-EAR-CRM" },
      { name: "Berry", optionGroup: "Color", swatchHex: "#9B2D2D", stock: 8, sku: "ZAY-WIN-EAR-BER" },
    ],
  },
  {
    name: "Crochet Boot Cuffs",
    slug: "crochet-boot-cuffs",
    sku: "ZAY-WIN-BOOT",
    categorySlug: "boot-cuffs",
    oneLiner: "A niche winter search winner — almost no local competition.",
    story:
      "Boot cuffs have a loyal international audience every winter on Etsy and Pinterest. We make them by hand so ZAYUNE can lead this low-competition niche from Pakistan.",
    materials: "Warm yarn · Stretch cuff · Sold as a pair",
    handmadeProof: "Pair matched for stretch and length before packing.",
    stylingNote: "Wear peeking over boots — classic winter outfit finisher.",
    listPrice: 1000,
    fulfillment: "IN_STOCK",
    stock: 16,
    leadTimeDays: null,
    featured: false,
    seoTitle: "Handmade Crochet Boot Cuffs Pakistan | Winter Niche ZAYUNE",
    seoDescription:
      "Buy handmade crochet boot cuffs from ZAYUNE Pakistan. Niche winter accessory with seasonal discount — ships nationwide.",
    tags: [
      "crochet boot cuffs",
      "boot toppers Pakistan",
      "etsy niche",
      "winter accessory",
    ],
    images: [
      {
        url: local("bootcuffs.jpg"),
        alt: "Handmade crochet boot cuffs pair — ZAYUNE Winter Special",
        kind: "hero",
      },
      {
        url: local("bootcuffs-detail.jpg"),
        alt: "Boot cuffs stitch detail — matching studio shot",
        kind: "detail",
      },
    ],
    variants: [
      { name: "Cream", optionGroup: "Color", swatchHex: "#F5F0E8", stock: 6, sku: "ZAY-WIN-BOOT-CRM" },
      { name: "Camel", optionGroup: "Color", swatchHex: "#C4A484", stock: 5, sku: "ZAY-WIN-BOOT-CAM" },
      { name: "Grey", optionGroup: "Color", swatchHex: "#8A8A8A", stock: 5, sku: "ZAY-WIN-BOOT-GRY" },
    ],
  },
  {
    name: "Crochet Flower Hair Clips & Gajras",
    slug: "crochet-flower-hair-clips-gajras",
    sku: "ZAY-WIN-HAIR",
    categorySlug: "hair-accessories",
    oneLiner: "Validated ZAYUNE price band — everyday wear and mehndi-ready.",
    story:
      "Crochet flower hair clips and gajras are already proven in ZAYUNE’s pricing range (PKR 299–1,599). Low cost to produce, easy upsell at checkout, and perfect for everyday looks plus wedding functions.",
    materials: "Cotton yarn blooms · Metal clip / elastic base · Hand-shaped petals",
    handmadeProof: "Each bloom crocheted and secured to the clip or gajra base by hand.",
    stylingNote: "Add-on at checkout — pairs with jewelry and winter outfits.",
    listPrice: 899,
    fulfillment: "IN_STOCK",
    stock: 30,
    leadTimeDays: null,
    featured: true,
    seoTitle: "Crochet Flower Hair Clips & Gajras Pakistan | ZAYUNE",
    seoDescription:
      "Buy handmade crochet flower hair clips and gajras from ZAYUNE. Easy upsell winter accessories for everyday and mehndi — seasonal pricing.",
    tags: [
      "crochet flower hair clip",
      "gajra handmade",
      "mehndi accessories",
      "upsell",
    ],
    images: [
      {
        url: local("flower-clips.jpg"),
        alt: "Handmade crochet flower hair clips and gajras — ZAYUNE",
        kind: "hero",
      },
      {
        url: local("flower-clips-detail.jpg"),
        alt: "Flower clip petal detail — matching studio shot",
        kind: "detail",
      },
    ],
    variants: [
      { name: "Single Clip", optionGroup: "Style", swatchHex: "#E8C4C0", stock: 12, sku: "ZAY-WIN-HAIR-SGL" },
      {
        name: "Pair of Clips",
        optionGroup: "Style",
        swatchHex: "#F5F0E8",
        priceDelta: 400,
        stock: 10,
        sku: "ZAY-WIN-HAIR-PR",
      },
      {
        name: "Gajra Strand",
        optionGroup: "Style",
        swatchHex: "#C4A090",
        priceDelta: 500,
        stock: 8,
        sku: "ZAY-WIN-HAIR-GAJ",
      },
    ],
  },
  {
    name: "Mini Crochet Ornaments & Gift Toppers",
    slug: "mini-crochet-ornaments-gift-toppers",
    sku: "ZAY-WIN-ORN",
    categorySlug: "ornaments-gifts",
    oneLiner: "Snowflake & festive minis — light to ship, strong holiday spike.",
    story:
      "Mini crochet ornaments and gift toppers (snowflakes, mistletoe, tiny festive forms) are light, cheap to ship internationally, and spike for Christmas and New Year gifting overseas.",
    materials: "Fine yarn · Light fill · Set of mini pieces · Ribbon loop",
    handmadeProof: "Each mini form crocheted and finished by hand as a set.",
    stylingNote: "Sell as a set for holiday gifting — strong overseas shipping profile.",
    listPrice: 450,
    fulfillment: "IN_STOCK",
    stock: 28,
    leadTimeDays: null,
    featured: false,
    seoTitle: "Mini Crochet Ornaments & Gift Toppers Set | Winter Holiday",
    seoDescription:
      "Shop mini handmade crochet ornaments and gift toppers from ZAYUNE. Holiday set pricing, light to ship internationally, Winter Special.",
    tags: [
      "crochet ornaments",
      "gift toppers",
      "christmas crochet",
      "holiday set",
    ],
    images: [
      {
        url: local("ornaments.jpg"),
        alt: "Mini handmade crochet ornaments and gift toppers set",
        kind: "hero",
      },
      {
        url: local("ornaments-detail.jpg"),
        alt: "Snowflake ornament detail — matching studio shot",
        kind: "detail",
      },
    ],
    variants: [
      { name: "Snowflake Set (3)", optionGroup: "Set", swatchHex: "#E8EEF5", stock: 10, sku: "ZAY-WIN-ORN-SNW" },
      { name: "Festive Mix (4)", optionGroup: "Set", swatchHex: "#9B2D2D", priceDelta: 100, stock: 10, sku: "ZAY-WIN-ORN-FST" },
      { name: "Mistletoe Pair", optionGroup: "Set", swatchHex: "#5F7A5A", stock: 8, sku: "ZAY-WIN-ORN-MST" },
    ],
  },
  {
    name: "Crochet Tote Bag & Pouch",
    slug: "crochet-tote-bag-pouch",
    sku: "ZAY-WIN-TOTE",
    categorySlug: "bags-pouches",
    oneLiner: "Chunky textured tote — winter gifting peak, year-round everyday carry.",
    story:
      "Textured granny-square and chunky totes are a strong Etsy category that peaks in winter gifting and keeps selling as everyday carry the rest of the year. Handmade in our Rawalpindi studio.",
    materials: "Chunky cotton-blend yarn · Structured base · Inner pouch option",
    handmadeProof: "Panels joined and handles reinforced by hand.",
    stylingNote: "Gift in winter; keep as daily tote after the holidays.",
    listPrice: 2600,
    fulfillment: "MADE_TO_ORDER",
    stock: null,
    leadTimeDays: 8,
    featured: true,
    seoTitle: "Handmade Crochet Tote Bag & Pouch Pakistan | ZAYUNE",
    seoDescription:
      "Order a handmade crochet tote bag and pouch from ZAYUNE Pakistan. Chunky winter gifting staple that works year-round — seasonal pricing.",
    tags: [
      "crochet tote bag",
      "granny square bag",
      "handmade pouch Pakistan",
      "year-round seller",
    ],
    images: [
      {
        url: local("tote.jpg"),
        alt: "Handmade chunky crochet tote bag and pouch — ZAYUNE",
        kind: "hero",
      },
      {
        url: local("tote-detail.jpg"),
        alt: "Tote stitch and handle detail — matching studio shot",
        kind: "detail",
      },
    ],
    variants: [
      { name: "Cream Chunky", optionGroup: "Style", swatchHex: "#F5F0E8", stock: null, sku: "ZAY-WIN-TOTE-CRM" },
      {
        name: "Granny Square Color",
        optionGroup: "Style",
        swatchHex: "#C4A484",
        priceDelta: 300,
        stock: null,
        sku: "ZAY-WIN-TOTE-GRN",
      },
      {
        name: "Tote + Pouch Set",
        optionGroup: "Style",
        swatchHex: "#6B4A34",
        priceDelta: 500,
        stock: null,
        sku: "ZAY-WIN-TOTE-SET",
      },
    ],
  },
];
