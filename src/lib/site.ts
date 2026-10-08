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

export const siteConfig = {
  name: "ZAYUNE",
  tagline: "Designed, not just made.",
  supportingLine: "Tiny things, big vibes.",
  description:
    "ZAYUNE is a crochet handmade accessories label from Pakistan — crochet flowers, jewelry, keychains, and custom orders. Made by hand. Led by design.",
  url: resolvePublicSiteUrl(),
  locale: "en_PK",
  instagram:
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ||
    "https://www.instagram.com/zayune.pk/",
  instagramHandle: "@zayune.pk",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567",
  email: process.env.NEXT_PUBLIC_STUDIO_EMAIL || "store@zayune.com",
  sameAs: [
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ||
      "https://www.instagram.com/zayune.pk/",
  ],
};

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
