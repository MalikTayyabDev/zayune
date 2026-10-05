export const siteConfig = {
  name: "ZAYUNE",
  tagline: "Designed, not just made.",
  supportingLine: "Tiny things, big vibes.",
  description:
    "ZAYUNE is a crochet handmade accessories label from Pakistan — crochet flowers, jewelry, keychains, and custom orders. Made by hand. Led by design.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://zayune.com",
  locale: "en_PK",
  instagram:
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ||
    "https://www.instagram.com/zayune.pk/",
  instagramHandle: "@zayune.pk",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567",
  email: process.env.NEXT_PUBLIC_STUDIO_EMAIL || "hello@zayune.com",
  sameAs: [
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ||
      "https://www.instagram.com/zayune.pk/",
  ],
};
