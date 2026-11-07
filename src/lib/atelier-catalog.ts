/**
 * Atelier Edit — Butterfly Sweater + crochet gift add-ons.
 * Images live in /public/products/atelier/.
 */

import { withSeasonalPrice } from "@/lib/winter-catalog";

const local = (file: string) => `/products/atelier/${file}`;

export { withSeasonalPrice };

export type AtelierVariantSeed = {
  name: string;
  optionGroup: string;
  swatchHex: string;
  priceDelta?: number;
  stock?: number | null;
  sku?: string;
};

export type AtelierCategorySeed = {
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
};

export type AtelierProductSeed = {
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
  variants: AtelierVariantSeed[];
};

export const atelierCategories: AtelierCategorySeed[] = [
  {
    name: "Sweaters & Cardigans",
    slug: "sweaters-cardigans",
    description:
      "Handmade crochet sweaters and cardigans from ZAYUNE Pakistan — including the signature Butterfly Crochet Sweater, made to order in Satellite Town, Rawalpindi.",
    sortOrder: 3,
  },
];

export const atelierProducts: AtelierProductSeed[] = [
  {
    name: "Butterfly Crochet Sweater",
    slug: "butterfly-crochet-sweater",
    sku: "ZAY-ATL-BUTTERFLY",
    categorySlug: "sweaters-cardigans",
    oneLiner:
      "Handmade tapestry crochet butterfly sweater — black, orange monarch wings, white edge dots.",
    story:
      "This is the Butterfly Crochet Sweater: dense tapestry crochet colourwork that builds monarch-style wings in black, orange-red, and white. Scalloped wing edges, black vein lines, and a ribbed cuff — crocheted row by row by hand in Satellite Town, Rawalpindi. Made to order; share size (S–L) and colour notes on WhatsApp after checkout.",
    materials:
      "Soft acrylic-blend yarn · Tapestry crochet colourwork · Black / orange / white · Ribbed cuff · Hand-finished edges",
    handmadeProof:
      "Every colour change and wing panel is worked stitch by stitch in the ZAYUNE studio — never printed, never machine-knit.",
    stylingNote:
      "Statement layer for winter and festive looks. Made to order S–L — note measurements on WhatsApp after checkout.",
    listPrice: 6500,
    fulfillment: "MADE_TO_ORDER",
    stock: null,
    leadTimeDays: 14,
    featured: true,
    seoTitle: "Butterfly Crochet Sweater Pakistan | Handmade Monarch Tapestry",
    seoDescription:
      "Buy the handmade Butterfly Crochet Sweater from ZAYUNE Pakistan — tapestry crochet monarch wing sweater in black and orange, made to order, ships nationwide from Rawalpindi.",
    tags: [
      "butterfly crochet sweater Pakistan",
      "monarch butterfly crochet sweater",
      "tapestry crochet sweater",
      "handmade butterfly wing sweater",
      "black orange crochet sweater",
      "made to order crochet Pakistan",
    ],
    images: [
      {
        url: local("butterfly-sweater.jpg"),
        alt: "Handmade tapestry Butterfly Crochet Sweater with black and orange monarch wings — ZAYUNE Pakistan",
        kind: "hero",
      },
      {
        url: local("butterfly-sweater-detail.jpg"),
        alt: "Close-up of handmade tapestry crochet monarch wing stitches on Butterfly Sweater",
        kind: "detail",
      },
    ],
    variants: [
      { name: "Monarch Classic", optionGroup: "Colorway", swatchHex: "#E85D04", stock: null, sku: "ZAY-ATL-BUTTERFLY-MON" },
      { name: "Monarch Deep", optionGroup: "Colorway", swatchHex: "#9B2D2D", stock: null, sku: "ZAY-ATL-BUTTERFLY-DEEP" },
      { name: "Custom Palette", optionGroup: "Colorway", swatchHex: "#2A2A2A", stock: null, sku: "ZAY-ATL-BUTTERFLY-CUS" },
    ],
  },
  {
    name: "Matching Beanie & Scarf Set",
    slug: "matching-beanie-scarf-set",
    sku: "ZAY-ATL-SET-BS",
    categorySlug: "beanies-hats",
    oneLiner: "Coordinated handmade crochet beanie and scarf — the gift set everyone asks for.",
    story:
      "A matched crochet beanie and chunky scarf in the same yarn and colour story. Designed as a ready gift for winter — one checkout, two pieces, one studio palette.",
    materials: "Soft acrylic-blend yarn · Ribbed beanie brim · Generous scarf length",
    handmadeProof: "Both pieces crocheted as a coordinated set in the same studio session for even tension.",
    stylingNote: "Gift-wrap ready. Add a third colourway via Custom if you need a family set.",
    listPrice: 3200,
    fulfillment: "IN_STOCK",
    stock: 10,
    leadTimeDays: null,
    featured: true,
    seoTitle: "Matching Crochet Beanie & Scarf Set Pakistan | Handmade Gift",
    seoDescription:
      "Shop a handmade matching crochet beanie and scarf set from ZAYUNE Pakistan. Winter gift set, ships nationwide from Rawalpindi.",
    tags: [
      "matching beanie scarf set Pakistan",
      "crochet gift set",
      "handmade winter set Rawalpindi",
      "beanie and muffler set",
    ],
    images: [
      {
        url: local("beanie-scarf-set.jpg"),
        alt: "Matching handmade crochet beanie and scarf set — ZAYUNE",
        kind: "hero",
      },
      {
        url: local("beanie-scarf-set-detail.jpg"),
        alt: "Yarn texture detail on matching crochet beanie and scarf",
        kind: "detail",
      },
    ],
    variants: [
      { name: "Camel Duo", optionGroup: "Color", swatchHex: "#C4A484", stock: 3, sku: "ZAY-ATL-SET-CAM" },
      { name: "Ivory Duo", optionGroup: "Color", swatchHex: "#F5F0E8", stock: 4, sku: "ZAY-ATL-SET-IVY" },
      { name: "Charcoal Duo", optionGroup: "Color", swatchHex: "#3A3A3A", stock: 3, sku: "ZAY-ATL-SET-CHR" },
    ],
  },
  {
    name: "Chunky Crochet Cowl Snood",
    slug: "chunky-crochet-cowl-snood",
    sku: "ZAY-ATL-COWL",
    categorySlug: "scarves-mufflers",
    oneLiner: "Loop-once crochet cowl — warmer than a scarf, easier to wear.",
    story:
      "A chunky crochet snood that sits close to the neck without trailing ends. Ideal for Rawalpindi winters, commuting, and layering under coats.",
    materials: "Chunky yarn · Seamless loop · Soft hand-feel",
    handmadeProof: "Worked in continuous rounds for even stitch height.",
    stylingNote: "Wear double for extra warmth or single as a soft collar.",
    listPrice: 1600,
    fulfillment: "IN_STOCK",
    stock: 14,
    leadTimeDays: null,
    featured: false,
    seoTitle: "Chunky Crochet Cowl Snood Pakistan | Handmade Neck Warmer",
    seoDescription:
      "Buy a handmade chunky crochet cowl snood from ZAYUNE Pakistan. Soft winter neck warmer, ships nationwide.",
    tags: [
      "crochet cowl Pakistan",
      "handmade snood",
      "chunky neck warmer Rawalpindi",
      "winter crochet accessory",
    ],
    images: [
      {
        url: local("cowl-snood.jpg"),
        alt: "Handmade chunky crochet cowl snood — ZAYUNE",
        kind: "hero",
      },
      {
        url: local("cowl-snood-detail.jpg"),
        alt: "Chunky crochet stitch detail on handmade snood",
        kind: "detail",
      },
    ],
    variants: [
      { name: "Oatmeal", optionGroup: "Color", swatchHex: "#D9CBB8", stock: 5, sku: "ZAY-ATL-COWL-OAT" },
      { name: "Cocoa", optionGroup: "Color", swatchHex: "#6B4A34", stock: 5, sku: "ZAY-ATL-COWL-COC" },
      { name: "Fog Grey", optionGroup: "Color", swatchHex: "#9A9A9A", stock: 4, sku: "ZAY-ATL-COWL-GRY" },
    ],
  },
  {
    name: "Soft Crochet Mittens",
    slug: "soft-crochet-mittens",
    sku: "ZAY-ATL-MITTENS",
    categorySlug: "gloves-warmers",
    oneLiner: "Full-cover handmade crochet mittens — warm palms for cold mornings.",
    story:
      "Closed-tip crochet mittens for days when fingerless gloves are not enough. Soft yarn, tidy thumbs, and gift-ready finish.",
    materials: "Soft acrylic-blend yarn · Shaped thumb · Lined feel without bulk",
    handmadeProof: "Each pair shaped and finished by hand for a matched fit.",
    stylingNote: "Pair with a beanie for a winter set, or gift with the matching scarf set.",
    listPrice: 1200,
    fulfillment: "IN_STOCK",
    stock: 16,
    leadTimeDays: null,
    featured: false,
    seoTitle: "Soft Crochet Mittens Pakistan | Handmade Winter Gloves",
    seoDescription:
      "Shop handmade soft crochet mittens from ZAYUNE Pakistan. Full-cover winter gloves, ships nationwide from Rawalpindi.",
    tags: [
      "crochet mittens Pakistan",
      "handmade winter gloves",
      "crochet mitts Rawalpindi",
      "warm handmade gloves",
    ],
    images: [
      {
        url: local("mittens.jpg"),
        alt: "Handmade soft crochet mittens — ZAYUNE",
        kind: "hero",
      },
      {
        url: local("mittens-detail.jpg"),
        alt: "Thumb and stitch detail on handmade crochet mittens",
        kind: "detail",
      },
    ],
    variants: [
      { name: "Blush", optionGroup: "Color", swatchHex: "#E8C4C0", stock: 6, sku: "ZAY-ATL-MITT-BLS" },
      { name: "Cream", optionGroup: "Color", swatchHex: "#F3EDE4", stock: 5, sku: "ZAY-ATL-MITT-CRM" },
      { name: "Sage", optionGroup: "Color", swatchHex: "#A8B5A0", stock: 5, sku: "ZAY-ATL-MITT-SAG" },
    ],
  },
  {
    name: "Kids Mini Crochet Beanie",
    slug: "kids-mini-crochet-beanie",
    sku: "ZAY-ATL-KIDS-BEANIE",
    categorySlug: "beanies-hats",
    oneLiner: "Soft mini crochet beanie for little heads — gift-friendly winter staple.",
    story:
      "A smaller-scale crochet beanie for kids, with a soft brim and gentle stretch. Popular for family winter gifts and newborn-to-toddler colour stories.",
    materials: "Soft baby-friendly yarn blend · Ribbed brim · Lightweight crown",
    handmadeProof: "Scaled pattern crocheted by hand for a soft, non-itchy finish.",
    stylingNote: "Message age or head circumference on WhatsApp for best fit guidance.",
    listPrice: 1100,
    fulfillment: "IN_STOCK",
    stock: 12,
    leadTimeDays: null,
    featured: false,
    seoTitle: "Kids Mini Crochet Beanie Pakistan | Handmade Children's Hat",
    seoDescription:
      "Buy a handmade kids mini crochet beanie from ZAYUNE Pakistan. Soft children's winter hat, ships nationwide.",
    tags: [
      "kids crochet beanie Pakistan",
      "handmade children hat",
      "baby crochet beanie Rawalpindi",
      "mini winter hat gift",
    ],
    images: [
      {
        url: local("kids-beanie.jpg"),
        alt: "Handmade kids mini crochet beanie — ZAYUNE",
        kind: "hero",
      },
      {
        url: local("kids-beanie-detail.jpg"),
        alt: "Soft brim detail on kids crochet beanie",
        kind: "detail",
      },
    ],
    variants: [
      { name: "Butter Yellow", optionGroup: "Color", swatchHex: "#E8D48A", stock: 4, sku: "ZAY-ATL-KIDS-YLW" },
      { name: "Sky Blue", optionGroup: "Color", swatchHex: "#A8C4D8", stock: 4, sku: "ZAY-ATL-KIDS-BLU" },
      { name: "Blush Pink", optionGroup: "Color", swatchHex: "#E8C4C0", stock: 4, sku: "ZAY-ATL-KIDS-PNK" },
    ],
  },
  {
    name: "Crochet Scrunchie Pack (3)",
    slug: "crochet-scrunchie-pack-3",
    sku: "ZAY-ATL-SCRUNCHIE3",
    categorySlug: "hair-accessories",
    oneLiner: "Set of three handmade crochet scrunchies — everyday colour for hair and wrists.",
    story:
      "Three soft crochet scrunchies in a coordinated palette. Light to ship, easy to gift, and perfect as an add-on with gajras or flower clips.",
    materials: "Soft yarn over elastic core · Gentle hold · Pack of 3",
    handmadeProof: "Each scrunchie covered and finished by hand in the studio.",
    stylingNote: "Wear in hair or on the wrist. Mix with mehndi flower clips for festive looks.",
    listPrice: 650,
    fulfillment: "IN_STOCK",
    stock: 20,
    leadTimeDays: null,
    featured: false,
    seoTitle: "Crochet Scrunchie Pack of 3 Pakistan | Handmade Hair Ties",
    seoDescription:
      "Shop a handmade crochet scrunchie pack of 3 from ZAYUNE Pakistan. Soft everyday hair accessories, ships nationwide.",
    tags: [
      "crochet scrunchie Pakistan",
      "handmade hair ties",
      "crochet scrunchie pack",
      "handmade hair accessories Rawalpindi",
    ],
    images: [
      {
        url: local("scrunchie-pack.jpg"),
        alt: "Handmade crochet scrunchie pack of three — ZAYUNE",
        kind: "hero",
      },
      {
        url: local("scrunchie-pack-detail.jpg"),
        alt: "Close-up of handmade crochet scrunchie texture",
        kind: "detail",
      },
    ],
    variants: [
      { name: "Blush Mix", optionGroup: "Palette", swatchHex: "#E8C4C0", stock: 8, sku: "ZAY-ATL-SCR-BLS" },
      { name: "Neutral Mix", optionGroup: "Palette", swatchHex: "#D9CBB8", stock: 7, sku: "ZAY-ATL-SCR-NEU" },
      { name: "Festive Mix", optionGroup: "Palette", swatchHex: "#E8A317", stock: 5, sku: "ZAY-ATL-SCR-FST" },
    ],
  },
  {
    name: "Crochet Phone Pouch",
    slug: "crochet-phone-pouch",
    sku: "ZAY-ATL-PHONE",
    categorySlug: "bags-pouches",
    oneLiner: "Soft handmade crochet pouch for phone or earbuds — slip-in everyday carry.",
    story:
      "A slim crochet pouch sized for phones and small essentials. Soft structure, tidy edge, and a loop for keys or a bag charm.",
    materials: "Dense crochet body · Soft lining feel · Loop tab",
    handmadeProof: "Edge finishing and loop attachment completed by hand.",
    stylingNote: "Fits most slim phones; message your model if you need a taller pouch.",
    listPrice: 750,
    fulfillment: "IN_STOCK",
    stock: 15,
    leadTimeDays: null,
    featured: false,
    seoTitle: "Crochet Phone Pouch Pakistan | Handmade Phone Case Sleeve",
    seoDescription:
      "Buy a handmade crochet phone pouch from ZAYUNE Pakistan. Soft sleeve for phone or earbuds, ships nationwide.",
    tags: [
      "crochet phone pouch Pakistan",
      "handmade phone sleeve",
      "crochet pouch Rawalpindi",
      "handmade everyday pouch",
    ],
    images: [
      {
        url: local("phone-pouch.jpg"),
        alt: "Handmade crochet phone pouch — ZAYUNE",
        kind: "hero",
      },
      {
        url: local("phone-pouch-detail.jpg"),
        alt: "Stitch and loop detail on crochet phone pouch",
        kind: "detail",
      },
    ],
    variants: [
      { name: "Cream", optionGroup: "Color", swatchHex: "#F5F0E8", stock: 5, sku: "ZAY-ATL-PHONE-CRM" },
      { name: "Sage", optionGroup: "Color", swatchHex: "#A8B5A0", stock: 5, sku: "ZAY-ATL-PHONE-SAG" },
      { name: "Blush", optionGroup: "Color", swatchHex: "#E8C4C0", stock: 5, sku: "ZAY-ATL-PHONE-BLS" },
    ],
  },
  {
    name: "Flower Crochet Keychain Set",
    slug: "flower-crochet-keychain-set",
    sku: "ZAY-ATL-KEYFLOWER",
    categorySlug: "ornaments-gifts",
    oneLiner: "Mini handmade crochet flower charms — bag, keys, or gift toppers.",
    story:
      "A set of small crochet flower keychain charms. Lightweight, colourful, and perfect as stocking fillers or add-ons with larger winter pieces.",
    materials: "Mini crochet blooms · Metal key ring · Soft yarn petals",
    handmadeProof: "Each bloom shaped and attached by hand in the studio.",
    stylingNote: "Clip to keys, tote, or zippers. Mix colours via Custom for party favours.",
    listPrice: 550,
    fulfillment: "IN_STOCK",
    stock: 24,
    leadTimeDays: null,
    featured: false,
    seoTitle: "Flower Crochet Keychain Set Pakistan | Handmade Bag Charms",
    seoDescription:
      "Shop handmade flower crochet keychain charms from ZAYUNE Pakistan. Mini gift set, ships nationwide from Rawalpindi.",
    tags: [
      "crochet flower keychain Pakistan",
      "handmade bag charm",
      "mini crochet flower gift",
      "crochet keychain set",
    ],
    images: [
      {
        url: local("flower-keychain.jpg"),
        alt: "Handmade flower crochet keychain set — ZAYUNE",
        kind: "hero",
      },
      {
        url: local("flower-keychain-detail.jpg"),
        alt: "Close-up of mini crochet flower keychain charm",
        kind: "detail",
      },
    ],
    variants: [
      { name: "Set of 2", optionGroup: "Pack", swatchHex: "#E8A0B0", stock: 10, sku: "ZAY-ATL-KEY-2" },
      {
        name: "Set of 3",
        optionGroup: "Pack",
        swatchHex: "#E8A317",
        priceDelta: 150,
        stock: 8,
        sku: "ZAY-ATL-KEY-3",
      },
      {
        name: "Set of 5",
        optionGroup: "Pack",
        swatchHex: "#3FA34D",
        priceDelta: 350,
        stock: 6,
        sku: "ZAY-ATL-KEY-5",
      },
    ],
  },
  {
    name: "Crochet Bookmark Trio",
    slug: "crochet-bookmark-trio",
    sku: "ZAY-ATL-BOOKMARK3",
    categorySlug: "ornaments-gifts",
    oneLiner: "Three handmade crochet bookmarks — soft page markers for readers and gifts.",
    story:
      "A trio of slim crochet bookmarks with a soft tassel finish. Easy gifts for book lovers, teachers, and stationery lovers.",
    materials: "Fine crochet cord · Soft tassel · Set of 3",
    handmadeProof: "Each bookmark length and tassel finished by hand.",
    stylingNote: "Slip into novels or journals. Bundle with ornaments for a desk gift.",
    listPrice: 450,
    fulfillment: "IN_STOCK",
    stock: 18,
    leadTimeDays: null,
    featured: false,
    seoTitle: "Crochet Bookmark Trio Pakistan | Handmade Reader Gift",
    seoDescription:
      "Buy a handmade crochet bookmark trio from ZAYUNE Pakistan. Soft reader gift set, ships nationwide.",
    tags: [
      "crochet bookmark Pakistan",
      "handmade bookmark set",
      "reader gift crochet",
      "handmade stationery gift",
    ],
    images: [
      {
        url: local("bookmark-trio.jpg"),
        alt: "Handmade crochet bookmark trio — ZAYUNE",
        kind: "hero",
      },
      {
        url: local("bookmark-trio-detail.jpg"),
        alt: "Tassel detail on handmade crochet bookmark",
        kind: "detail",
      },
    ],
    variants: [
      { name: "Neutral Trio", optionGroup: "Palette", swatchHex: "#D9CBB8", stock: 6, sku: "ZAY-ATL-BM-NEU" },
      { name: "Pastel Trio", optionGroup: "Palette", swatchHex: "#E8C4C0", stock: 6, sku: "ZAY-ATL-BM-PST" },
      { name: "Jewel Trio", optionGroup: "Palette", swatchHex: "#6B4A34", stock: 6, sku: "ZAY-ATL-BM-JWL" },
    ],
  },
  {
    name: "Soft Crochet Bucket Hat",
    slug: "soft-crochet-bucket-hat",
    sku: "ZAY-ATL-BUCKET",
    categorySlug: "beanies-hats",
    oneLiner: "Soft handmade crochet bucket hat — casual brim for sun and style.",
    story:
      "A soft crochet bucket hat with a gentle brim. Wear for mild winter sun, travel, and everyday looks that still feel handmade.",
    materials: "Medium-weight yarn · Soft brim · Breathable crown",
    handmadeProof: "Brim rounds and crown decreases completed by hand for a clean circle.",
    stylingNote: "Size is soft-fit adult. Message for a snugger crown if needed.",
    listPrice: 1800,
    fulfillment: "IN_STOCK",
    stock: 10,
    leadTimeDays: null,
    featured: false,
    seoTitle: "Soft Crochet Bucket Hat Pakistan | Handmade Brim Hat",
    seoDescription:
      "Shop a handmade soft crochet bucket hat from ZAYUNE Pakistan. Casual brim hat, ships nationwide from Rawalpindi.",
    tags: [
      "crochet bucket hat Pakistan",
      "handmade brim hat",
      "soft crochet hat Rawalpindi",
      "handmade summer winter hat",
    ],
    images: [
      {
        url: local("bucket-hat.jpg"),
        alt: "Handmade soft crochet bucket hat — ZAYUNE",
        kind: "hero",
      },
      {
        url: local("bucket-hat-detail.jpg"),
        alt: "Brim and crown stitch detail on crochet bucket hat",
        kind: "detail",
      },
    ],
    variants: [
      { name: "Ivory", optionGroup: "Color", swatchHex: "#F5F0E8", stock: 4, sku: "ZAY-ATL-BKT-IVY" },
      { name: "Camel", optionGroup: "Color", swatchHex: "#C4A484", stock: 3, sku: "ZAY-ATL-BKT-CAM" },
      { name: "Sage", optionGroup: "Color", swatchHex: "#A8B5A0", stock: 3, sku: "ZAY-ATL-BKT-SAG" },
    ],
  },
];
