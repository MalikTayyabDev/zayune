import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

/**
 * Block only private app surfaces.
 * Utility pages (cart/wishlist/track/journal/checkout) stay crawlable so Google
 * can see their noindex tags — avoids “Blocked by robots.txt” / discovery limbo.
 */
export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.url.replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api/",
          "/account",
          "/account/",
          "/order/",
        ],
      },
    ],
    // No Host: directive — Googlebot ignores it (Yandex-only) and GSC warns.
    sitemap: `${base}/sitemap.xml`,
  };
}
