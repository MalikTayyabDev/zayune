/**
 * Winter Dawat Edit — Mehndi / Engagement / Walima wedding-season catalog.
 * Hero images live in /public/products/dawat/.
 */

import { withSeasonalPrice } from "@/lib/winter-catalog";

const local = (file: string) => `/products/dawat/${file}`;

export { withSeasonalPrice };

export type DawatVariantSeed = {
  name: string;
  optionGroup: string;
  swatchHex: string;
  priceDelta?: number;
  stock?: number | null;
  sku?: string;
};

export type DawatCategorySeed = {
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
};

export type DawatProductSeed = {
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
  variants: DawatVariantSeed[];
};

export type DawatBundleSeed = {
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
  /** Child product slugs resolved to IDs at seed time. */
  childSlugs: string[];
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
  tags: string[];
  images: { url: string; alt: string; kind: string }[];
  variants: DawatVariantSeed[];
};

export const dawatCategories: DawatCategorySeed[] = [
  {
    name: "Mehndi Collection",
    slug: "mehndi",
    description:
      "Colour-forward crochet gajras, flower clips, jhumkas and mehndi hair accessories — handmade in Pakistan for wedding season.",
    sortOrder: 20,
  },
  {
    name: "Walima Collection",
    slug: "walima",
    description:
      "Soft walima crochet — ivory gajras and shawl pins for evening looks.",
    sortOrder: 21,
  },
];

export const dawatProducts: DawatProductSeed[] = [
  {
    name: "Crochet Gajra (Mehndi)",
    slug: "crochet-gajra-mehndi",
    sku: "ZAY-DAW-GAJRA",
    categorySlug: "mehndi",
    oneLiner: "Hand-crocheted floral garland — wrist or hair, mehndi-ready.",
    story:
      "Our hero mehndi accessory: a soft crochet floral gajra in marigold, rose pink or parrot green. Wear it on the wrist or pin it into braids for colour-forward wedding functions that photograph beautifully.",
    materials: "Cotton yarn blooms · Soft elastic base · Hand-shaped petals",
    handmadeProof: "Each flower crocheted and strung by hand in the ZAYUNE studio.",
    stylingNote: "Pair with flower clips and jhumkas for a full Mehndi Glow look.",
    listPrice: 799,
    fulfillment: "IN_STOCK",
    stock: 24,
    leadTimeDays: null,
    featured: true,
    seoTitle: "Crochet Gajra for Mehndi | Handmade | ZAYUNE",
    seoDescription:
      "Buy handmade crochet gajras for mehndi — single or pair in marigold, pink or green. Crafted in Pakistan by ZAYUNE. Winter Dawat Edit.",
    tags: ["crochet gajra", "mehndi accessories", "handmade gajra Pakistan", "wedding hair"],
    images: [
      { url: local("gajra.jpg"), alt: "Handmade crochet floral gajra for mehndi — ZAYUNE", kind: "hero" },
      { url: local("gajra-detail.jpg"), alt: "Crochet gajra petal detail — studio close-up", kind: "detail" },
    ],
    variants: [
      { name: "Marigold Single", optionGroup: "Color & Pack", swatchHex: "#E8A317", stock: 8, sku: "ZAY-DAW-GAJRA-MAR" },
      { name: "Rose Pink Single", optionGroup: "Color & Pack", swatchHex: "#E8A0B0", stock: 8, sku: "ZAY-DAW-GAJRA-PNK" },
      { name: "Parrot Green Single", optionGroup: "Color & Pack", swatchHex: "#3FA34D", stock: 8, sku: "ZAY-DAW-GAJRA-GRN" },
      {
        name: "Marigold Pair",
        optionGroup: "Color & Pack",
        swatchHex: "#E8A317",
        priceDelta: 800,
        stock: 6,
        sku: "ZAY-DAW-GAJRA-MAR-PR",
      },
      {
        name: "Rose Pink Pair",
        optionGroup: "Color & Pack",
        swatchHex: "#E8A0B0",
        priceDelta: 800,
        stock: 6,
        sku: "ZAY-DAW-GAJRA-PNK-PR",
      },
      {
        name: "Parrot Green Pair",
        optionGroup: "Color & Pack",
        swatchHex: "#3FA34D",
        priceDelta: 800,
        stock: 6,
        sku: "ZAY-DAW-GAJRA-GRN-PR",
      },
    ],
  },
  {
    name: "Crochet Flower Hair Clips (Set of 3)",
    slug: "crochet-flower-hair-clips-set-mehndi",
    sku: "ZAY-DAW-CLIPS3",
    categorySlug: "mehndi",
    oneLiner: "Three coordinated 3D crochet blooms — easy mehndi add-on.",
    story:
      "Small handmade flower clips in coordinated mehndi colours. Low-cost, high-impact add-on at checkout — perfect for braids, half-ups and bridesmaid looks.",
    materials: "Cotton yarn · Metal alligator clips · Hand-shaped petals",
    handmadeProof: "Each bloom crocheted and secured to the clip by hand.",
    stylingNote: "Bundle with a gajra for matching colour stories.",
    listPrice: 799,
    fulfillment: "IN_STOCK",
    stock: 30,
    leadTimeDays: null,
    featured: true,
    seoTitle: "Crochet Flower Hair Clips Set of 3 | Mehndi ZAYUNE",
    seoDescription:
      "Shop a set of 3 handmade crochet flower hair clips for mehndi — marigold, pink & green. Pakistan-made by ZAYUNE.",
    tags: ["crochet flower hair clips", "mehndi hair accessories", "set of 3 clips"],
    images: [
      {
        url: local("flower-clips-set.jpg"),
        alt: "Set of three crochet flower hair clips — mehndi colours",
        kind: "hero",
      },
      {
        url: local("flower-clips-set-detail.jpg"),
        alt: "Crochet flower clip petal detail",
        kind: "detail",
      },
    ],
    variants: [
      { name: "Mehndi Mix", optionGroup: "Colour Story", swatchHex: "#E8A317", stock: 12, sku: "ZAY-DAW-CLIPS3-MIX" },
      { name: "All Pink", optionGroup: "Colour Story", swatchHex: "#E8A0B0", stock: 9, sku: "ZAY-DAW-CLIPS3-PNK" },
      { name: "All Green", optionGroup: "Colour Story", swatchHex: "#3FA34D", stock: 9, sku: "ZAY-DAW-CLIPS3-GRN" },
    ],
  },
  {
    name: "Beaded Jhumka Earrings",
    slug: "beaded-jhumka-earrings-mehndi",
    sku: "ZAY-DAW-JHUMKA",
    categorySlug: "mehndi",
    oneLiner: "Lightweight beaded jhumkas in mehndi colours — all-night comfort.",
    story:
      "Colourful beaded jhumkas designed for long mehndi events. Lightweight drops that photograph well and pair with bright outfits without weighing the ear down.",
    materials: "Glass & acrylic beads · Brass findings · Hand-wired",
    handmadeProof: "Beaded, wired and clasp-checked by hand in studio.",
    stylingNote: "Match with gajra and clips for the Mehndi Glow Set.",
    listPrice: 1350,
    fulfillment: "IN_STOCK",
    stock: 18,
    leadTimeDays: null,
    featured: true,
    seoTitle: "Beaded Jhumka Earrings Mehndi | Handmade ZAYUNE",
    seoDescription:
      "Lightweight handmade beaded jhumka earrings for mehndi — green, pink and orange palettes. Shop ZAYUNE Pakistan.",
    tags: ["beaded jhumka", "mehndi earrings", "handmade jhumka Pakistan"],
    images: [
      { url: local("jhumka.jpg"), alt: "Beaded jhumka earrings in mehndi colours — ZAYUNE", kind: "hero" },
      { url: local("jhumka-detail.jpg"), alt: "Beaded jhumka drop detail", kind: "detail" },
    ],
    variants: [
      { name: "Marigold Mix", optionGroup: "Color", swatchHex: "#E8A317", stock: 6, sku: "ZAY-DAW-JHUMKA-MAR" },
      { name: "Rose Pink", optionGroup: "Color", swatchHex: "#E8A0B0", stock: 6, sku: "ZAY-DAW-JHUMKA-PNK" },
      { name: "Parrot Green", optionGroup: "Color", swatchHex: "#3FA34D", stock: 6, sku: "ZAY-DAW-JHUMKA-GRN" },
    ],
  },
  {
    name: "Floral Maang Tikka",
    slug: "floral-maang-tikka-mehndi",
    sku: "ZAY-DAW-TIKKA",
    categorySlug: "mehndi",
    oneLiner: "Statement forehead piece — beaded or crochet floral accent.",
    story:
      "A photogenic maang tikka that completes a mehndi outfit. Soft floral centre with bead drops — also wearable for engagement guest looks.",
    materials: "Beads · Pearl-effect accents · Chain & hook · Optional crochet bloom",
    handmadeProof: "Assembled and finished by hand; each piece checked for balance.",
    stylingNote: "Wear centre-parted or slightly off-centre for modern mehndi styling.",
    listPrice: 1200,
    fulfillment: "IN_STOCK",
    stock: 14,
    leadTimeDays: null,
    featured: false,
    seoTitle: "Floral Maang Tikka Mehndi | Handmade | ZAYUNE",
    seoDescription:
      "Handmade floral maang tikka for mehndi and engagement — beaded forehead jewelry by ZAYUNE Pakistan.",
    tags: ["maang tikka", "mehndi jewelry", "floral tikka handmade"],
    images: [
      { url: local("maang-tikka.jpg"), alt: "Floral beaded maang tikka for mehndi", kind: "hero" },
      { url: local("maang-tikka-detail.jpg"), alt: "Maang tikka centrepiece detail", kind: "detail" },
    ],
    variants: [
      { name: "Marigold Floral", optionGroup: "Style", swatchHex: "#E8A317", stock: 5, sku: "ZAY-DAW-TIKKA-MAR" },
      { name: "Rose Beaded", optionGroup: "Style", swatchHex: "#E8A0B0", stock: 5, sku: "ZAY-DAW-TIKKA-ROS" },
      { name: "Gold Pearl", optionGroup: "Style", swatchHex: "#C4A35A", stock: 4, sku: "ZAY-DAW-TIKKA-GLD" },
    ],
  },
  {
    name: "Colourful Paranda",
    slug: "colourful-paranda-mehndi",
    sku: "ZAY-DAW-PARANDA",
    categorySlug: "mehndi",
    oneLiner: "Bright braid tassel with beads and thread — mehndi trending.",
    story:
      "A colourful paranda for mehndi braids: layered thread tassels and beads that move beautifully in photos and Reels. Popular with guests who want festive colour without heavy jewelry.",
    materials: "Thread tassels · Beads · Braided base",
    handmadeProof: "Tied and knotted by hand; each tassel length matched in studio.",
    stylingNote: "Best with open braids or a low ponytail for mehndi nights.",
    listPrice: 1100,
    fulfillment: "IN_STOCK",
    stock: 16,
    leadTimeDays: null,
    featured: false,
    seoTitle: "Colourful Paranda for Mehndi | Handmade ZAYUNE",
    seoDescription:
      "Shop colourful handmade paranda hair tassels for mehndi braids — beads & thread by ZAYUNE Pakistan.",
    tags: ["paranda", "mehndi braid", "hair tassel Pakistan"],
    images: [
      { url: local("paranda.jpg"), alt: "Colourful handmade paranda for mehndi braids", kind: "hero" },
      { url: local("paranda-detail.jpg"), alt: "Paranda bead and thread detail", kind: "detail" },
    ],
    variants: [
      { name: "Rainbow Festive", optionGroup: "Color", swatchHex: "#E85D04", stock: 6, sku: "ZAY-DAW-PAR-RNB" },
      { name: "Pink & Gold", optionGroup: "Color", swatchHex: "#E8A0B0", stock: 5, sku: "ZAY-DAW-PAR-PNK" },
      { name: "Green & Orange", optionGroup: "Color", swatchHex: "#3FA34D", stock: 5, sku: "ZAY-DAW-PAR-GRN" },
    ],
  },
  {
    name: "Engagement Pearl Necklace & Earring Set",
    slug: "engagement-pearl-necklace-earring-set",
    sku: "ZAY-DAW-PEARL-SET",
    categorySlug: "engagement",
    oneLiner: "Layered or single-strand pearls with matching drop earrings.",
    story:
      "The safest engagement bestseller: classic pearl necklace with matching drops in soft ivory and gold tones. Designed for formal dresses and walima guest looks too.",
    materials: "Pearl-effect beads · Gold-tone findings · Hand-strung",
    handmadeProof: "Strung, knotted and clasp-checked by hand.",
    stylingNote: "Pairs with tikka & jhumar and pearl hair pins for a full engagement set.",
    listPrice: 3000,
    fulfillment: "IN_STOCK",
    stock: 12,
    leadTimeDays: null,
    featured: true,
    seoTitle: "Pearl Necklace & Earring Set Engagement | ZAYUNE",
    seoDescription:
      "Handmade engagement pearl necklace and earring set — formal wedding guest jewelry by ZAYUNE Pakistan.",
    tags: ["pearl necklace set", "engagement jewelry Pakistan", "pearl earrings"],
    images: [
      {
        url: local("pearl-necklace-set.jpg"),
        alt: "Engagement pearl necklace and earring set — ZAYUNE",
        kind: "hero",
      },
      {
        url: local("pearl-necklace-set-detail.jpg"),
        alt: "Pearl drop earring and necklace detail",
        kind: "detail",
      },
    ],
    variants: [
      { name: "Classic Single Strand", optionGroup: "Style", swatchHex: "#F0E6DC", stock: 6, sku: "ZAY-DAW-PEARL-SGL" },
      {
        name: "Layered Pearl",
        optionGroup: "Style",
        swatchHex: "#E8DCC8",
        priceDelta: 400,
        stock: 6,
        sku: "ZAY-DAW-PEARL-LYR",
      },
    ],
  },
  {
    name: "Pearl Tikka & Jhumar Set",
    slug: "pearl-tikka-jhumar-set-engagement",
    sku: "ZAY-DAW-JHUMAR",
    categorySlug: "engagement",
    oneLiner: "Maang tikka with side jhumar — traditional bridal-guest statement.",
    story:
      "A coordinated pearl tikka and side jhumar for engagement and formal functions. Soft ivory pearls with gold-tone chain for a refined traditional look.",
    materials: "Pearl-effect beads · Chain · Gold-tone findings",
    handmadeProof: "Paired as a matching set and finished by hand.",
    stylingNote: "Wear with the engagement pearl necklace set for a cohesive look.",
    listPrice: 2600,
    fulfillment: "IN_STOCK",
    stock: 10,
    leadTimeDays: null,
    featured: false,
    seoTitle: "Pearl Tikka & Jhumar Set | Engagement ZAYUNE",
    seoDescription:
      "Handmade pearl maang tikka and jhumar set for engagement — traditional bridal-guest jewelry by ZAYUNE.",
    tags: ["pearl jhumar", "maang tikka set", "engagement jewelry"],
    images: [
      { url: local("pearl-tikka-jhumar.jpg"), alt: "Pearl tikka and jhumar set for engagement", kind: "hero" },
      { url: local("pearl-tikka-jhumar-detail.jpg"), alt: "Pearl jhumar beadwork detail", kind: "detail" },
    ],
    variants: [
      { name: "Classic Ivory", optionGroup: "Tone", swatchHex: "#F0E6DC", stock: 5, sku: "ZAY-DAW-JHUMAR-IVY" },
      { name: "Champagne Gold", optionGroup: "Tone", swatchHex: "#C4A35A", stock: 5, sku: "ZAY-DAW-JHUMAR-GLD" },
    ],
  },
  {
    name: "Pearl & Bead Hair Pins (Pack of 4)",
    slug: "pearl-bead-hair-pins-pack",
    sku: "ZAY-DAW-PINS4",
    categorySlug: "engagement",
    oneLiner: "Four small pearl pins for buns, braids — giftable set.",
    story:
      "A pack of four delicate pearl and bead hair pins for updos and soft braids. Ideal engagement gift add-on and easy everyday formal styling.",
    materials: "Pearl-effect beads · Metal pin bases · Hand-finished",
    handmadeProof: "Each pin assembled and matched as a set of four.",
    stylingNote: "Scatter through a bun or line a braid for bridal-guest polish.",
    listPrice: 1000,
    fulfillment: "IN_STOCK",
    stock: 20,
    leadTimeDays: null,
    featured: false,
    seoTitle: "Pearl Hair Pins Pack of 4 | Engagement ZAYUNE",
    seoDescription:
      "Buy a pack of 4 handmade pearl & bead hair pins for engagement buns and braids — ZAYUNE Pakistan.",
    tags: ["pearl hair pins", "engagement hair accessories", "gift set"],
    images: [
      { url: local("pearl-hair-pins.jpg"), alt: "Pack of four pearl and bead hair pins", kind: "hero" },
      { url: local("pearl-hair-pins-detail.jpg"), alt: "Pearl hair pin close-up detail", kind: "detail" },
    ],
    variants: [
      { name: "Classic Pearl", optionGroup: "Tone", swatchHex: "#F0E6DC", stock: 10, sku: "ZAY-DAW-PINS4-CLS" },
      { name: "Gold Bead Mix", optionGroup: "Tone", swatchHex: "#C4A35A", stock: 10, sku: "ZAY-DAW-PINS4-GLD" },
    ],
  },
  {
    name: "Beaded Bracelet & Ring Duo",
    slug: "beaded-bracelet-ring-duo-engagement",
    sku: "ZAY-DAW-DUO",
    categorySlug: "engagement",
    oneLiner: "Delicate pastel beadwork sold as a matching pair.",
    story:
      "A soft pastel bracelet and ring duo for engagement and formal dinners — light beadwork that layers with pearl sets without competing.",
    materials: "Pastel glass beads · Elastic / adjustable fit · Hand-strung",
    handmadeProof: "Matched as a duo and finished by hand.",
    stylingNote: "Easy add-on with the engagement pearl necklace set.",
    listPrice: 1300,
    fulfillment: "IN_STOCK",
    stock: 14,
    leadTimeDays: null,
    featured: false,
    seoTitle: "Beaded Bracelet & Ring Duo | Engagement ZAYUNE",
    seoDescription:
      "Handmade pastel beaded bracelet and ring duo for engagement — delicate add-on jewelry by ZAYUNE.",
    tags: ["beaded bracelet", "ring duo", "engagement accessories"],
    images: [
      { url: local("bracelet-ring-duo.jpg"), alt: "Pastel beaded bracelet and ring duo", kind: "hero" },
      { url: local("bracelet-ring-duo-detail.jpg"), alt: "Beaded bracelet clasp and ring detail", kind: "detail" },
    ],
    variants: [
      { name: "Blush Pastel", optionGroup: "Color", swatchHex: "#E8C4C0", stock: 7, sku: "ZAY-DAW-DUO-BLS" },
      { name: "Sage Pastel", optionGroup: "Color", swatchHex: "#A8B5A0", stock: 7, sku: "ZAY-DAW-DUO-SAG" },
    ],
  },
  {
    name: "Hand-Painted Organza Dupatta",
    slug: "hand-painted-organza-dupatta",
    sku: "ZAY-DAW-DUPATTA",
    categorySlug: "engagement",
    oneLiner: "Floral hand-painted organza with golden border — premium piece.",
    story:
      "Our premium engagement and walima draping piece: sheer organza with hand-painted florals and a golden border. Made to order so colour stories can match your outfit.",
    materials: "Organza · Hand-painted florals · Golden border finish",
    handmadeProof: "Painted and finished to order in studio — each piece unique.",
    stylingNote: "Allow lead time before the event; share outfit colour references on WhatsApp.",
    listPrice: 4999,
    fulfillment: "MADE_TO_ORDER",
    stock: null,
    leadTimeDays: 10,
    featured: true,
    seoTitle: "Hand-Painted Organza Dupatta | Engagement ZAYUNE",
    seoDescription:
      "Premium handmade hand-painted organza dupatta with golden border — made to order for engagement & walima by ZAYUNE.",
    tags: ["organza dupatta", "hand painted dupatta", "engagement premium", "walima"],
    images: [
      { url: local("organza-dupatta.jpg"), alt: "Hand-painted floral organza dupatta with golden border", kind: "hero" },
      { url: local("organza-dupatta-detail.jpg"), alt: "Hand-painted floral and border detail on organza", kind: "detail" },
    ],
    variants: [
      { name: "Ivory Blush Florals", optionGroup: "Palette", swatchHex: "#F5F0E8", stock: null, sku: "ZAY-DAW-DUP-IVY" },
      { name: "Soft Pink Florals", optionGroup: "Palette", swatchHex: "#E8C4C0", stock: null, sku: "ZAY-DAW-DUP-PNK" },
      { name: "Sage & Gold", optionGroup: "Palette", swatchHex: "#A8B5A0", stock: null, sku: "ZAY-DAW-DUP-SAG" },
    ],
  },
  {
    name: "Kundan-Style Choker Set",
    slug: "kundan-style-choker-set-walima",
    sku: "ZAY-DAW-CHOKER",
    categorySlug: "walima",
    oneLiner: "Light choker with matching earrings for evening functions.",
    story:
      "An understated kundan-style choker with matching earrings for walima and evening dawat looks. Light enough for long wear, polished enough for formal photographs.",
    materials: "Kundan-style stones · Gold-tone setting · Matching earrings",
    handmadeProof: "Set matched and finish-checked by hand before packing.",
    stylingNote: "Pair with ivory gajra and pearl hair comb for Walima Elegance.",
    listPrice: 3500,
    fulfillment: "IN_STOCK",
    stock: 8,
    leadTimeDays: null,
    featured: true,
    seoTitle: "Kundan Choker Set Walima | Handmade | ZAYUNE",
    seoDescription:
      "Light handmade kundan-style choker set with matching earrings for walima evenings — ZAYUNE Pakistan.",
    tags: ["kundan choker", "walima jewelry", "choker earring set"],
    images: [
      { url: local("kundan-choker.jpg"), alt: "Kundan-style choker and earring set for walima", kind: "hero" },
      { url: local("kundan-choker-detail.jpg"), alt: "Kundan choker centrepiece detail", kind: "detail" },
    ],
    variants: [
      { name: "Ivory Gold", optionGroup: "Tone", swatchHex: "#F5F0E8", stock: 4, sku: "ZAY-DAW-CHOKER-IVY" },
      { name: "Champagne", optionGroup: "Tone", swatchHex: "#C4A35A", stock: 4, sku: "ZAY-DAW-CHOKER-CHM" },
    ],
  },
  {
    name: "Ivory Crochet Gajra",
    slug: "ivory-crochet-gajra-walima",
    sku: "ZAY-DAW-IVY-GAJ",
    categorySlug: "walima",
    oneLiner: "Ivory and blush gajra — walima styling over mehndi brights.",
    story:
      "A softer crochet gajra in ivory and blush for walima and pastel outfits. Same handmade quality as our mehndi hero, tuned for evening elegance.",
    materials: "Cotton yarn · Soft elastic base · Hand-shaped ivory blooms",
    handmadeProof: "Crocheted and strung by hand in ivory/blush palettes.",
    stylingNote: "Single for a soft accent; pair for fuller wrist or hair styling.",
    listPrice: 799,
    fulfillment: "IN_STOCK",
    stock: 18,
    leadTimeDays: null,
    featured: true,
    seoTitle: "Ivory Crochet Gajra Walima | Handmade ZAYUNE",
    seoDescription:
      "Handmade ivory and blush crochet gajra for walima — single or pair. Soft wedding-season accessory by ZAYUNE.",
    tags: ["ivory gajra", "walima accessories", "crochet gajra"],
    images: [
      { url: local("ivory-gajra.jpg"), alt: "Ivory and blush crochet gajra for walima", kind: "hero" },
      { url: local("ivory-gajra-detail.jpg"), alt: "Ivory crochet gajra petal detail", kind: "detail" },
    ],
    variants: [
      { name: "Ivory Single", optionGroup: "Pack", swatchHex: "#F5F0E8", stock: 8, sku: "ZAY-DAW-IVY-SGL" },
      { name: "Blush Single", optionGroup: "Pack", swatchHex: "#E8C4C0", stock: 6, sku: "ZAY-DAW-BLS-SGL" },
      {
        name: "Ivory Pair",
        optionGroup: "Pack",
        swatchHex: "#F5F0E8",
        priceDelta: 800,
        stock: 4,
        sku: "ZAY-DAW-IVY-PR",
      },
    ],
  },
  {
    name: "Pearl Hair Comb",
    slug: "pearl-hair-comb-walima",
    sku: "ZAY-DAW-COMB",
    categorySlug: "walima",
    oneLiner: "Decorative pearl comb for loose or low-bun winter hairstyles.",
    story:
      "A pearl-accent hair comb for walima and winter formal hair — slides into loose waves or a low bun without bulk.",
    materials: "Pearl-effect accents · Metal comb base · Hand-set",
    handmadeProof: "Pearls set and secured by hand; teeth alignment checked.",
    stylingNote: "Place at the side of a low bun or crown for soft evening polish.",
    listPrice: 1500,
    fulfillment: "IN_STOCK",
    stock: 12,
    leadTimeDays: null,
    featured: false,
    seoTitle: "Pearl Hair Comb Walima | Handmade | ZAYUNE",
    seoDescription:
      "Handmade pearl hair comb for walima and winter formal hairstyles — ZAYUNE Pakistan wedding accessories.",
    tags: ["pearl hair comb", "walima hair", "winter hairstyles"],
    images: [
      { url: local("pearl-hair-comb.jpg"), alt: "Pearl decorative hair comb for walima", kind: "hero" },
      { url: local("pearl-hair-comb-detail.jpg"), alt: "Pearl hair comb detail close-up", kind: "detail" },
    ],
    variants: [
      { name: "Classic Pearl", optionGroup: "Tone", swatchHex: "#F0E6DC", stock: 6, sku: "ZAY-DAW-COMB-CLS" },
      { name: "Gold Accent", optionGroup: "Tone", swatchHex: "#C4A35A", stock: 6, sku: "ZAY-DAW-COMB-GLD" },
    ],
  },
  {
    name: "Embellished Clutch / Potli",
    slug: "embellished-clutch-potli-walima",
    sku: "ZAY-DAW-POTLI",
    categorySlug: "walima",
    oneLiner: "Small beaded potli that completes an outfit and photographs well.",
    story:
      "A beaded potli clutch for walima and mehndi evenings — small, embellished, and made to finish festive outfits in photos.",
    materials: "Beaded fabric · Drawstring / wrist strap · Lined interior",
    handmadeProof: "Embellished and finished by hand; lining and strap checked.",
    stylingNote: "Choose Ivory, Blush or Sage to match pastel walima outfits.",
    listPrice: 2600,
    fulfillment: "IN_STOCK",
    stock: 10,
    leadTimeDays: null,
    featured: false,
    seoTitle: "Embellished Potli Clutch Walima | Handmade ZAYUNE",
    seoDescription:
      "Handmade beaded potli clutch for walima and mehndi — ivory, blush or sage. Shop ZAYUNE Pakistan.",
    tags: ["potli bag", "beaded clutch", "walima accessories", "mehndi bag"],
    images: [
      { url: local("potli-clutch.jpg"), alt: "Embellished beaded potli clutch for walima", kind: "hero" },
      { url: local("potli-clutch-detail.jpg"), alt: "Potli beadwork and drawstring detail", kind: "detail" },
    ],
    variants: [
      { name: "Ivory", optionGroup: "Color", swatchHex: "#F5F0E8", stock: 4, sku: "ZAY-DAW-POTLI-IVY" },
      { name: "Blush", optionGroup: "Color", swatchHex: "#E8C4C0", stock: 3, sku: "ZAY-DAW-POTLI-BLS" },
      { name: "Sage", optionGroup: "Color", swatchHex: "#A8B5A0", stock: 3, sku: "ZAY-DAW-POTLI-SAG" },
    ],
  },
  {
    name: "Crochet Shawl Pin / Brooch",
    slug: "crochet-shawl-pin-brooch-walima",
    sku: "ZAY-DAW-SHAWL",
    categorySlug: "walima",
    oneLiner: "Pins a winter shawl in place — ties the look to the season.",
    story:
      "A handmade crochet floral shawl pin that keeps winter wraps elegant for walima dinners. Small, giftable, and on-brand for cold-weather wedding season.",
    materials: "Cotton yarn bloom · Metal pin back · Hand-finished",
    handmadeProof: "Flower crocheted and pinned by hand in studio.",
    stylingNote: "Pin at the shoulder or centre of a shawl for photos.",
    listPrice: 900,
    fulfillment: "IN_STOCK",
    stock: 20,
    leadTimeDays: null,
    featured: false,
    seoTitle: "Crochet Shawl Pin Brooch | Walima Winter ZAYUNE",
    seoDescription:
      "Handmade crochet shawl pin brooch for walima and winter wraps — soft floral accent by ZAYUNE Pakistan.",
    tags: ["shawl pin", "crochet brooch", "walima winter", "gift"],
    images: [
      { url: local("shawl-pin.jpg"), alt: "Crochet floral shawl pin brooch for walima", kind: "hero" },
      { url: local("shawl-pin-detail.jpg"), alt: "Crochet shawl pin petal and pin-back detail", kind: "detail" },
    ],
    variants: [
      { name: "Ivory Bloom", optionGroup: "Color", swatchHex: "#F5F0E8", stock: 8, sku: "ZAY-DAW-SHAWL-IVY" },
      { name: "Blush Bloom", optionGroup: "Color", swatchHex: "#E8C4C0", stock: 6, sku: "ZAY-DAW-SHAWL-BLS" },
      { name: "Sage Bloom", optionGroup: "Color", swatchHex: "#A8B5A0", stock: 6, sku: "ZAY-DAW-SHAWL-SAG" },
    ],
  },
];

export const dawatBundles: DawatBundleSeed[] = [
  {
    name: "Mehndi Glow Set",
    slug: "mehndi-glow-set",
    sku: "ZAY-DAW-BDL-MEH",
    categorySlug: "mehndi",
    oneLiner: "Crochet gajra pair + flower clips set — one colour story.",
    story:
      "Our curated mehndi crochet bundle: a handmade gajra pair and set of three flower clips styled to match. Pure crochet accessories — higher order value without guessing what pairs together.",
    materials: "See included products — crochet handmade set",
    handmadeProof: "Each piece handmade; bundle packed as a matched set.",
    stylingNote: "Choose a colour story variant so both pieces feel coordinated.",
    listPrice: 2399,
    childSlugs: [
      "crochet-gajra-mehndi",
      "crochet-flower-hair-clips-set-mehndi",
    ],
    featured: true,
    seoTitle: "Mehndi Glow Crochet Set | Gajra & Clips | ZAYUNE",
    seoDescription:
      "Mehndi Glow crochet set: handmade gajra pair and flower hair clips. Curated crochet bundle by ZAYUNE Pakistan.",
    tags: ["mehndi bundle", "crochet gajra set", "crochet accessories bundle"],
    images: [
      { url: local("mehndi-glow-bundle.jpg"), alt: "Mehndi Glow Set — gajra, clips and jhumkas", kind: "hero" },
    ],
    variants: [
      { name: "Marigold Story", optionGroup: "Colour Story", swatchHex: "#E8A317", stock: 4, sku: "ZAY-DAW-BDL-MEH-MAR" },
      { name: "Rose Pink Story", optionGroup: "Colour Story", swatchHex: "#E8A0B0", stock: 4, sku: "ZAY-DAW-BDL-MEH-PNK" },
      { name: "Parrot Green Story", optionGroup: "Colour Story", swatchHex: "#3FA34D", stock: 3, sku: "ZAY-DAW-BDL-MEH-GRN" },
    ],
  },
  {
    name: "Engagement Pearl Set",
    slug: "engagement-pearl-set-bundle",
    sku: "ZAY-DAW-BDL-ENG",
    categorySlug: "engagement",
    oneLiner: "Pearl necklace & earrings + tikka/jhumar + 4 hair pins.",
    story:
      "A complete engagement pearl look in one bundle: necklace and earring set, tikka & jhumar, plus a pack of four pearl hair pins.",
    materials: "Pearl-effect jewelry set — see included products",
    handmadeProof: "Each piece handmade; curated and packed as one engagement set.",
    stylingNote: "Ideal gift for bridal guests and formal engagement outfits.",
    listPrice: 5500,
    childSlugs: [
      "engagement-pearl-necklace-earring-set",
      "pearl-tikka-jhumar-set-engagement",
      "pearl-bead-hair-pins-pack",
    ],
    featured: true,
    seoTitle: "Engagement Pearl Set Bundle | Handmade ZAYUNE",
    seoDescription:
      "Engagement Pearl Set: necklace & earrings, tikka & jhumar, and pearl hair pins. Curated handmade bundle by ZAYUNE.",
    tags: ["engagement pearl set", "wedding jewelry bundle", "pearl set Pakistan"],
    images: [
      {
        url: local("engagement-pearl-bundle.jpg"),
        alt: "Engagement Pearl Set bundle flat lay — ZAYUNE",
        kind: "hero",
      },
    ],
    variants: [
      { name: "Classic Ivory", optionGroup: "Tone", swatchHex: "#F0E6DC", stock: 3, sku: "ZAY-DAW-BDL-ENG-IVY" },
      { name: "Champagne Gold", optionGroup: "Tone", swatchHex: "#C4A35A", stock: 3, sku: "ZAY-DAW-BDL-ENG-GLD" },
    ],
  },
  {
    name: "Walima Elegance Set",
    slug: "walima-elegance-set",
    sku: "ZAY-DAW-BDL-WAL",
    categorySlug: "walima",
    oneLiner: "Kundan choker set + pearl hair comb + ivory crochet gajra.",
    story:
      "Evening-ready walima trio: kundan-style choker with earrings, pearl hair comb, and an ivory crochet gajra for soft finishing detail.",
    materials: "Jewelry + crochet accessories — see included products",
    handmadeProof: "Curated walima set; each piece handmade and matched.",
    stylingNote: "Best with ivory, blush or sage evening outfits.",
    listPrice: 5500,
    childSlugs: [
      "kundan-style-choker-set-walima",
      "pearl-hair-comb-walima",
      "ivory-crochet-gajra-walima",
    ],
    featured: true,
    seoTitle: "Walima Elegance Set Bundle | Handmade ZAYUNE",
    seoDescription:
      "Walima Elegance Set: kundan choker, pearl hair comb & ivory crochet gajra. Curated evening bundle by ZAYUNE.",
    tags: ["walima bundle", "kundan set", "evening jewelry"],
    images: [
      {
        url: local("walima-elegance-bundle.jpg"),
        alt: "Walima Elegance Set — choker, comb and ivory gajra",
        kind: "hero",
      },
    ],
    variants: [
      { name: "Ivory Evening", optionGroup: "Tone", swatchHex: "#F5F0E8", stock: 3, sku: "ZAY-DAW-BDL-WAL-IVY" },
      { name: "Champagne Evening", optionGroup: "Tone", swatchHex: "#C4A35A", stock: 3, sku: "ZAY-DAW-BDL-WAL-CHM" },
    ],
  },
  {
    name: "Bridesmaid Pack (4)",
    slug: "bridesmaid-pack-4",
    sku: "ZAY-DAW-BDL-BM",
    categorySlug: "mehndi",
    oneLiner: "Matching gajra + clips ×4 in one colour story for the squad.",
    story:
      "Four coordinated gajra-and-clips pairings in one colour story — for bridesmaids who want matching handmade accents without ordering piece by piece.",
    materials: "Crochet gajras & flower clips — matched set of 4",
    handmadeProof: "Four matched handmade pairs packed as one bridesmaid pack.",
    stylingNote: "Pick one colour story for the whole squad.",
    listPrice: 6000,
    childSlugs: ["crochet-gajra-mehndi", "crochet-flower-hair-clips-set-mehndi"],
    featured: true,
    seoTitle: "Bridesmaid Pack of 4 | Matching Gajra Clips ZAYUNE",
    seoDescription:
      "Bridesmaid Pack (4): matching handmade crochet gajras and flower clips in one colour story. Shop ZAYUNE Pakistan.",
    tags: ["bridesmaid pack", "matching gajra", "mehndi squad"],
    images: [
      { url: local("bridesmaid-pack.jpg"), alt: "Bridesmaid pack of four matching gajras and clips", kind: "hero" },
    ],
    variants: [
      { name: "Marigold Squad", optionGroup: "Colour Story", swatchHex: "#E8A317", stock: 2, sku: "ZAY-DAW-BDL-BM-MAR" },
      { name: "Rose Pink Squad", optionGroup: "Colour Story", swatchHex: "#E8A0B0", stock: 2, sku: "ZAY-DAW-BDL-BM-PNK" },
      { name: "Blush Squad", optionGroup: "Colour Story", swatchHex: "#E8C4C0", stock: 2, sku: "ZAY-DAW-BDL-BM-BLS" },
    ],
  },
];
