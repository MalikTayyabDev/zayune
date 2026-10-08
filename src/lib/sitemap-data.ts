import { getCategories, getProducts } from "@/lib/products";
import { siteConfig } from "@/lib/site";

export type SitemapEntry = {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
};

function isoDate(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString();
  }
  if (typeof value === "string" || typeof value === "number") {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  }
  return new Date().toISOString();
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`timeout after ${ms}ms`)), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

function entry(
  loc: string,
  priority: string,
  changefreq: string,
  lastmod?: unknown
): SitemapEntry {
  return {
    loc,
    lastmod: isoDate(lastmod),
    changefreq,
    priority,
  };
}

/** Build public sitemap URLs. Never throws — falls back to static pages. */
export async function getSitemapEntries(): Promise<SitemapEntry[]> {
  const base = siteConfig.url.replace(/\/$/, "");
  const now = new Date();

  const entries: SitemapEntry[] = [
    entry(`${base}/`, "1.0", "daily", now),
    entry(`${base}/shop`, "0.9", "daily", now),
    entry(`${base}/custom`, "0.8", "weekly", now),
    entry(`${base}/about`, "0.6", "monthly", now),
    entry(`${base}/contact`, "0.6", "monthly", now),
    entry(`${base}/journal`, "0.5", "weekly", now),
    entry(`${base}/shipping-returns`, "0.4", "monthly", now),
    entry(`${base}/privacy`, "0.3", "yearly", now),
    entry(`${base}/cookies`, "0.3", "yearly", now),
  ];

  try {
    const [products, categories] = await withTimeout(
      Promise.all([getProducts(), getCategories()]),
      4000
    );

    for (const category of categories) {
      if (!category.slug) continue;
      entries.push(entry(`${base}/shop/${category.slug}`, "0.75", "weekly", now));
    }

    for (const product of products) {
      if (!product.slug || product.published === false) continue;
      entries.push(
        entry(
          `${base}/product/${product.slug}`,
          "0.8",
          "weekly",
          "updatedAt" in product ? product.updatedAt : now
        )
      );
    }
  } catch (error) {
    console.error("[sitemap] catalog load failed; serving static URLs only", error);
  }

  return entries;
}

export function entriesToXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map(
      (e) => `  <url>
    <loc>${escapeXml(e.loc)}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function sitemapResponse(xml: string): Response {
  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
