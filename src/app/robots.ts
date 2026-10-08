import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

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
          "/checkout",
          "/cart",
          "/account",
          "/account/",
          "/order/",
          "/wishlist",
          "/track",
          "/journal",
        ],
      },
    ],
    // Both paths serve the same XML. Prefer the nested URL in GSC if /sitemap.xml is stuck on "Couldn't fetch".
    sitemap: [`${base}/sitemap.xml`, `${base}/sitemap/sitemap.xml`],
    host: base.replace(/^https?:\/\//, ""),
  };
}
