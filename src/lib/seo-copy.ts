import { siteConfig, studioLocationLine } from "@/lib/site";

/** Shared keyword copy for brand + collection pages (indexable while Coming soon). */
export const brandFaqs = [
  {
    question: "Where can I buy handmade crochet flowers in Pakistan?",
    answer: `ZAYUNE makes handmade crochet flowers in ${studioLocationLine()}. Browse the shop when the studio edit is live, or request a made-to-order bloom via Custom orders / WhatsApp ${siteConfig.phoneDisplay}.`,
  },
  {
    question: "Do you sell handmade jewelry in Rawalpindi?",
    answer: `Yes — ZAYUNE is a designer-led handmade jewelry and accessories label based in Satellite Town, Rawalpindi. Pieces are made by hand and ship across Pakistan.`,
  },
  {
    question: "Can I order custom crochet keychains or jewelry?",
    answer:
      "Custom colorways, names, initials, and one-of-a-kind requests are open year-round. Share your idea on the Custom orders page or WhatsApp the studio for a quote and lead time.",
  },
  {
    question: "What does ZAYUNE make?",
    answer:
      "ZAYUNE designs and handmakes crochet flowers, jewelry, keychains, and custom accessories — design-led pieces finished by hand in Pakistan.",
  },
];

export const collectionSeo: Record<
  string,
  { h1Extra: string; body: string; keywords: string[] }
> = {
  "crochet-flowers": {
    h1Extra: "Handmade crochet flowers Pakistan",
    body: `Looking for handmade crochet flowers in Pakistan? ZAYUNE crafts soft floral forms by hand in ${studioLocationLine()} — lasting blooms for gifts, styling, and keepsakes. Shop the crochet flowers edit when live, or request a custom colorway anytime.`,
    keywords: [
      "handmade crochet flowers Pakistan",
      "buy crochet flowers online Pakistan",
      "crochet flower bouquet Rawalpindi",
    ],
  },
  jewelry: {
    h1Extra: "Handmade jewelry Pakistan",
    body: `ZAYUNE handmade jewelry is designed first, then finished by hand in Rawalpindi — quiet earrings, accents, and everyday pieces meant to be worn often. Explore the jewelry collection when the studio edit drops, or commission a custom piece.`,
    keywords: [
      "handmade jewelry Pakistan",
      "handmade jewelry Rawalpindi",
      "designer handmade jewelry Pakistan",
    ],
  },
  keychains: {
    h1Extra: "Handmade keychains Pakistan",
    body: `Handmade keychains and crochet charms from ZAYUNE — small keepsakes with character for everyday carry. Based in Satellite Town, Rawalpindi, we ship across Pakistan and take custom name or initial requests.`,
    keywords: [
      "handmade keychains Pakistan",
      "custom crochet keychain Pakistan",
      "handmade keychains Rawalpindi",
    ],
  },
  "custom-orders": {
    h1Extra: "Custom crochet orders Pakistan",
    body: `Request custom crochet orders from ZAYUNE — flowers, jewelry, keychains, and colorways made to your brief. Share inspiration on WhatsApp or the custom form; we quote before making and ship nationwide from Rawalpindi.`,
    keywords: [
      "custom crochet orders Pakistan",
      "made to order crochet Pakistan",
      "custom handmade accessories Pakistan",
    ],
  },
};

export const shopIntro = `Shop handmade accessories from ZAYUNE — crochet flowers, jewelry, and keychains designed and made by hand in ${studioLocationLine()}. Nationwide shipping across Pakistan. Custom orders stay open while the next studio edit is prepared.`;

export const homeSeoParagraphs = [
  `ZAYUNE is a handmade accessories label from ${studioLocationLine()} — crochet flowers, jewelry, keychains, and custom orders. Designed, not just made.`,
  `Search for handmade jewelry Pakistan, crochet flowers Pakistan, or handmade keychains Rawalpindi and you’ll find our studio: design-led pieces finished by hand, with WhatsApp support and made-to-order colorways.`,
  `Whether you want a soft crochet bloom, quiet jewelry for everyday wear, or a custom keychain, start with Shop or Custom orders — guest checkout when pieces are live, or message ${siteConfig.phoneDisplay} anytime.`,
];
