import { siteConfig, studioLocationLine } from "@/lib/site";

/** Shared keyword copy for brand + collection pages. */
export const brandFaqs = [
  {
    question: "Where can I buy handmade crochet beanies in Pakistan?",
    answer: `ZAYUNE makes handmade crochet beanies, scarves, gloves, and winter accessories in ${studioLocationLine()}. Shop the Winter Special online or WhatsApp ${siteConfig.phoneDisplay}.`,
  },
  {
    question: "Do you sell pearl jewelry sets for wedding season?",
    answer:
      "Yes — pearl and beaded jewelry sets are part of our Winter Special for Pakistan’s Nov–Feb wedding and dawat season, handmade in Rawalpindi.",
  },
  {
    question: "Can I order custom crochet colors?",
    answer:
      "Custom colorways and one-of-a-kind requests stay open year-round. Share your idea on the Custom orders page or WhatsApp the studio for a quote.",
  },
  {
    question: "What is in the ZAYUNE Winter Special?",
    answer:
      "Ten winning winter products: beanies, chunky scarves, fingerless gloves, ponchos, ear warmers, boot cuffs, pearl jewelry sets, flower hair clips & gajras, mini ornaments, and crochet totes.",
  },
];

export const collectionSeo: Record<
  string,
  { h1Extra: string; body: string; keywords: string[] }
> = {
  "beanies-hats": {
    h1Extra: "Handmade crochet beanies & slouchy hats Pakistan",
    body: `Shop handmade crochet beanies and slouchy hats from ZAYUNE in ${studioLocationLine()}. Winter bestsellers with wide colorways, seasonal pricing, and nationwide shipping.`,
    keywords: [
      "crochet beanie Pakistan",
      "handmade slouchy hat",
      "winter beanie Rawalpindi",
    ],
  },
  "scarves-mufflers": {
    h1Extra: "Chunky crochet scarves & mufflers Pakistan",
    body: `Oversized handmade crochet scarves and mufflers from ZAYUNE — cozy winter layers that bundle perfectly with a beanie. Designed and finished by hand in Rawalpindi.`,
    keywords: [
      "chunky crochet scarf Pakistan",
      "handmade muffler",
      "winter scarf Rawalpindi",
    ],
  },
  "gloves-warmers": {
    h1Extra: "Fingerless gloves & hand warmers Pakistan",
    body: `Handmade crochet fingerless gloves and hand warmers from ZAYUNE — practical winter gifts with high handmade margin. Ships across Pakistan.`,
    keywords: [
      "fingerless gloves crochet Pakistan",
      "hand warmers handmade",
      "winter gift gloves",
    ],
  },
  "ponchos-shrugs": {
    h1Extra: "Handmade crochet ponchos & shrugs Pakistan",
    body: `Premium crochet ponchos and shrugs from ZAYUNE for winter outfits and wedding-season dinners. Made to order in Satellite Town, Rawalpindi.`,
    keywords: [
      "crochet poncho Pakistan",
      "handmade shrug",
      "winter wedding layer",
    ],
  },
  "ear-warmers": {
    h1Extra: "Crochet ear warmers & headbands Pakistan",
    body: `Light handmade ear warmers and headbands from ZAYUNE — ideal winter add-ons with easy shipping for first-time buyers.`,
    keywords: [
      "crochet ear warmer Pakistan",
      "handmade headband",
      "winter add-on",
    ],
  },
  "boot-cuffs": {
    h1Extra: "Handmade crochet boot cuffs Pakistan",
    body: `Crochet boot cuffs from ZAYUNE — a niche winter accessory with loyal search demand and almost no local competition.`,
    keywords: [
      "crochet boot cuffs Pakistan",
      "boot toppers handmade",
      "winter boot cuffs",
    ],
  },
  jewelry: {
    h1Extra: "Pearl & beaded jewelry sets Pakistan",
    body: `Pearl and beaded handmade jewelry sets from ZAYUNE for Pakistan’s wedding and dawat season — necklace and earring sets finished by hand in Rawalpindi.`,
    keywords: [
      "pearl jewelry set Pakistan",
      "wedding jewelry Rawalpindi",
      "beaded necklace earrings",
    ],
  },
  "hair-accessories": {
    h1Extra: "Crochet flower hair clips & gajras Pakistan",
    body: `Handmade crochet flower hair clips and gajras from ZAYUNE — everyday wear and mehndi/wedding functions, priced for easy upsell.`,
    keywords: [
      "crochet flower hair clip",
      "handmade gajra Pakistan",
      "mehndi hair accessories",
    ],
  },
  "ornaments-gifts": {
    h1Extra: "Mini crochet ornaments & gift toppers",
    body: `Mini handmade crochet ornaments and gift toppers from ZAYUNE — light to ship internationally for Christmas and New Year gifting.`,
    keywords: [
      "crochet ornaments set",
      "gift toppers handmade",
      "christmas crochet Pakistan",
    ],
  },
  "bags-pouches": {
    h1Extra: "Handmade crochet tote bags & pouches Pakistan",
    body: `Chunky crochet totes and pouches from ZAYUNE — winter gifting peaks with year-round everyday carry demand.`,
    keywords: [
      "crochet tote bag Pakistan",
      "handmade pouch",
      "granny square bag",
    ],
  },
  "custom-orders": {
    h1Extra: "Custom crochet orders Pakistan",
    body: `Request custom crochet colorways and one-of-a-kind winter pieces from ZAYUNE. Quote first, then we make by hand in Rawalpindi.`,
    keywords: [
      "custom crochet orders Pakistan",
      "made to order crochet Pakistan",
      "custom handmade accessories Pakistan",
    ],
  },
};

export const shopIntro = `Shop the ZAYUNE Winter Special from ${studioLocationLine()} — handmade beanies, chunky scarves, fingerless gloves, ponchos, ear warmers, boot cuffs, pearl jewelry sets, flower hair clips, ornaments, and crochet totes. Seasonal 5% on products · WELCOME10 intro · WINTER5 at checkout.`;

export const homeSeoParagraphs = [
  `ZAYUNE is a handmade studio in ${studioLocationLine()} — design-led crochet beanies, chunky scarves, fingerless gloves, ponchos, ear warmers, boot cuffs, pearl jewelry sets, flower hair clips, ornaments, and totes.`,
  `Every piece is finished by hand with clear checkout, guest shopping, custom colorways, and WhatsApp support on ${siteConfig.phoneDisplay}. We ship nationwide across Pakistan.`,
];
