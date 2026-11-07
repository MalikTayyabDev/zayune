import { siteConfig, studioLocationLine } from "@/lib/site";

/** Shared keyword copy for brand + collection pages. */
export const brandFaqs = [
  {
    question: "Where can I buy handmade crochet beanies in Pakistan?",
    answer: `ZAYUNE makes handmade crochet beanies, scarves, gloves, and winter accessories in ${studioLocationLine()}. Shop the Winter Special online or WhatsApp ${siteConfig.phoneDisplay}.`,
  },
  {
    question: "Do you make crochet gajras and hair clips for mehndi?",
    answer:
      "Yes — handmade crochet gajras and flower hair clips are part of our Mehndi Edit and Winter Special, finished by hand in Rawalpindi.",
  },
  {
    question: "Can I order custom crochet colors?",
    answer:
      "Custom colorways and one-of-a-kind crochet requests stay open year-round. Share your idea on the Custom orders page or WhatsApp the studio for a quote.",
  },
  {
    question: "What does ZAYUNE make?",
    answer:
      "Handmade crochet only: butterfly sweaters, granny cardigans, baby blankets, amigurumi, beanies, scarves, gajras, flower clips, market bags, cozies, and soft home gifts.",
  },
];

export const collectionSeo: Record<
  string,
  { h1Extra: string; body: string; keywords: string[] }
> = {
  "sweaters-cardigans": {
    h1Extra: "Handmade crochet sweaters & butterfly sweaters Pakistan",
    body: `Shop handmade crochet sweaters from ZAYUNE in ${studioLocationLine()} — including the signature tapestry Butterfly Crochet Sweater (monarch wing colourwork), made to order with nationwide shipping.`,
    keywords: [
      "butterfly crochet sweater Pakistan",
      "monarch butterfly crochet sweater",
      "tapestry crochet sweater",
      "handmade butterfly wing sweater",
      "crochet sweater Rawalpindi",
    ],
  },
  "beanies-hats": {
    h1Extra: "Handmade crochet beanies & slouchy hats Pakistan",
    body: `Shop handmade crochet beanies and slouchy hats from ZAYUNE in ${studioLocationLine()}. Winter bestsellers with wide colorways, seasonal pricing, and nationwide shipping.`,
    keywords: [
      "crochet beanie Pakistan",
      "handmade slouchy hat",
      "winter beanie Rawalpindi",
      "kids crochet beanie Pakistan",
      "crochet bucket hat Pakistan",
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
  mehndi: {
    h1Extra: "Mehndi crochet gajras & clips Pakistan",
    body: `Handmade crochet gajras and flower hair clips from ZAYUNE for mehndi season — colour-forward crochet accessories finished by hand in Rawalpindi.`,
    keywords: [
      "crochet gajra mehndi",
      "mehndi crochet accessories",
      "handmade gajra Pakistan",
    ],
  },
  walima: {
    h1Extra: "Walima crochet accessories Pakistan",
    body: `Soft ivory crochet gajras and shawl pins from ZAYUNE for walima evenings — handmade crochet accessories only.`,
    keywords: [
      "ivory crochet gajra",
      "walima crochet accessories",
      "crochet shawl pin",
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
  "baby-kids": {
    h1Extra: "Handmade crochet baby blankets & kids gifts Pakistan",
    body: `Shop soft handmade crochet baby blankets, loveys, and amigurumi gifts from ZAYUNE in ${studioLocationLine()} — shower-ready pieces with nationwide shipping.`,
    keywords: [
      "crochet baby blanket Pakistan",
      "handmade lovey Pakistan",
      "amigurumi bunny Pakistan",
      "baby shower crochet gift",
    ],
  },
  "home-desk": {
    h1Extra: "Handmade crochet coasters, cup cozies & desk gifts",
    body: `Handmade crochet home and desk gifts from ZAYUNE — coaster sets, cup cozies, laptop sleeves, and soft AirPods cases finished in Rawalpindi.`,
    keywords: [
      "crochet coasters Pakistan",
      "crochet cup cozy",
      "handmade laptop sleeve crochet",
      "crochet AirPods case Pakistan",
    ],
  },
  "tops-layers": {
    h1Extra: "Handmade crochet tops & light layers Pakistan",
    body: `Shop cropped crochet covers and light handmade layers from ZAYUNE — statement pieces made to order in Rawalpindi.`,
    keywords: [
      "crochet crop top Pakistan",
      "handmade crochet cover top",
      "light crochet layer Pakistan",
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

export const shopIntro = `Shop handmade crochet from ZAYUNE in ${studioLocationLine()} — butterfly sweaters, baby blankets, granny market bags, beanies, scarves, gajras, home gifts, and custom orders. Seasonal 5% on products · WELCOME10 intro · WINTER5 at checkout.`;

export const homeSeoParagraphs = [
  `ZAYUNE is a handmade crochet studio in ${studioLocationLine()} — butterfly sweaters, baby blankets, amigurumi, granny bags, beanies, scarves, gajras, cozies, and soft home gifts.`,
  `Every piece is finished by hand with clear checkout, guest shopping, custom crochet colorways, and WhatsApp support on ${siteConfig.phoneDisplay}. We ship nationwide across Pakistan.`,
];
