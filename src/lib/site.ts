/** Never use preview / localhost hosts for SEO canonicals. */
function resolvePublicSiteUrl() {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NEXTAUTH_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined,
    "https://zayune.com",
  ];

  for (const raw of candidates) {
    if (!raw) continue;
    try {
      const withProtocol = raw.startsWith("http") ? raw : `https://${raw}`;
      const url = new URL(withProtocol);
      const host = url.hostname.toLowerCase();
      if (host === "localhost" || host.endsWith(".vercel.app")) continue;
      return `${url.protocol}//${host}`.replace(/\/$/, "");
    } catch {
      continue;
    }
  }
  return "https://zayune.com";
}

/** Digits only for wa.me (e.g. 923055282964). */
export function studioWhatsAppDigits(raw?: string | null) {
  const fallback = "923055282964";
  const digits = String(raw || fallback).replace(/\D/g, "");
  if (!digits) return fallback;
  if (digits.startsWith("92")) return digits;
  if (digits.startsWith("0")) return `92${digits.slice(1)}`;
  if (digits.length === 10) return `92${digits}`;
  return digits;
}

export const siteConfig = {
  name: "ZAYUNE",
  tagline: "Designed, not just made.",
  supportingLine: "Tiny things, big vibes.",
  description:
    "ZAYUNE makes handmade crochet accessories in Satellite Town, Rawalpindi, Pakistan — beanies, scarves, gajras, flower clips, and custom crochet orders finished by hand.",
  url: resolvePublicSiteUrl(),
  locale: "en_PK",
  instagram:
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ||
    "https://www.instagram.com/zayune.pk/",
  instagramHandle: "@zayune.pk",
  /** WhatsApp digits for wa.me links */
  whatsapp: studioWhatsAppDigits(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER),
  /** E.164 for schema / tel: links */
  phoneE164: `+${studioWhatsAppDigits(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER)}`,
  phoneDisplay: "+92 305 5282964",
  email: process.env.NEXT_PUBLIC_STUDIO_EMAIL || "store@zayune.com",
  address: {
    street: "Satellite Town",
    city: "Rawalpindi",
    region: "Punjab",
    country: "Pakistan",
    countryCode: "PK",
  },
  sameAs: [
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ||
      "https://www.instagram.com/zayune.pk/",
  ],
  /**
   * Sitewide focus keywords — brand → common → mid → advanced long-tail.
   * Merged into page metadata + Organization knowsAbout. Prefer crochet-only terms.
   */
  focusKeywords: [
    // Brand
    "ZAYUNE",
    "zayune.pk",
    "ZAYUNE handmade",
    "ZAYUNE crochet",
    "ZAYUNE Pakistan",
    "ZAYUNE Rawalpindi",

    // Common / head terms
    "handmade crochet Pakistan",
    "crochet accessories Pakistan",
    "handmade accessories Pakistan",
    "buy crochet online Pakistan",
    "crochet shop Pakistan",
    "handmade gifts Pakistan",
    "winter crochet Pakistan",
    "crochet beanie Pakistan",
    "crochet scarf Pakistan",
    "crochet gajra Pakistan",
    "flower hair clips crochet",
    "custom crochet orders Pakistan",

    // Mid / local + category
    "handmade crochet Rawalpindi",
    "crochet studio Rawalpindi",
    "handmade accessories Satellite Town",
    "crochet accessories Rawalpindi",
    "designer handmade accessories",
    "handmade winter wear Pakistan",
    "chunky crochet scarf Pakistan",
    "fingerless gloves crochet Pakistan",
    "crochet poncho Pakistan",
    "crochet ear warmer Pakistan",
    "crochet boot cuffs Pakistan",
    "crochet tote bag Pakistan",
    "mehndi crochet accessories",
    "handmade gajra Pakistan",
    "crochet flower hair clip Pakistan",
    "wedding crochet accessories Pakistan",
    "made to order crochet Pakistan",

    // Advanced / long-tail intent
    "where to buy handmade crochet beanie in Pakistan",
    "handmade crochet gajra for mehndi Pakistan",
    "custom colour crochet beanie Rawalpindi",
    "chunky handmade muffler online Pakistan",
    "ivory crochet gajra for walima",
    "handmade crochet flower clips for wedding",
    "winter crochet gift set Pakistan",
    "buy handmade crochet accessories Satellite Town Rawalpindi",
    "small business crochet studio Pakistan WhatsApp order",
    "designer crochet accessories shipped across Pakistan",
    "handmade crochet ornaments Christmas gift Pakistan",
    "crochet shawl pin handmade Pakistan",
    "slouchy crochet hat handmade Pakistan",
    "soft yarn handmade accessories Pakistan women",
  ],
};

export function studioLocationLine() {
  const { street, city, country } = siteConfig.address;
  return `${street}, ${city}, ${country}`;
}

/** Canonical public origin (no trailing slash). Prefers NEXTAUTH_URL for app links. */
export function siteOrigin() {
  const raw =
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    siteConfig.url;
  try {
    const url = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
    const host = url.hostname.toLowerCase();
    if (host === "localhost" || host.endsWith(".vercel.app")) {
      return siteConfig.url;
    }
    return `${url.protocol}//${host}`.replace(/\/$/, "");
  } catch {
    return siteConfig.url;
  }
}

/** Resend From header — requires the domain verified in Resend. */
export function storeFromEmail() {
  const address = process.env.RESEND_FROM_EMAIL || "store@zayune.com";
  if (address.includes("<")) return address;
  return `ZAYUNE <${address}>`;
}

export function whatsappHref(text?: string) {
  const base = `https://wa.me/${siteConfig.whatsapp}`;
  if (!text) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
}
