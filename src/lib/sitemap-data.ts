import { getCategories, getProducts } from "@/lib/products";
import { siteConfig } from "@/lib/site";
import { isStoreComingSoon } from "@/lib/store-mode";

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

/** Brand URLs that always return 200 — safe for Coming soon and Live. */
export function getBrandSitemapEntries(base: string, now = new Date()): SitemapEntry[] {
  return [
    entry(`${base}/`, "1.0", "daily", now),
    entry(`${base}/shop`, "0.9", "daily", now),
    entry(`${base}/custom`, "0.9", "weekly", now),
    entry(`${base}/about`, "0.7", "monthly", now),
    entry(`${base}/contact`, "0.7", "monthly", now),
    entry(`${base}/shipping-returns`, "0.4", "monthly", now),
    entry(`${base}/privacy`, "0.3", "yearly", now),
    entry(`${base}/cookies`, "0.3", "yearly", now),
    entry(`${base}/site-map`, "0.3", "weekly", now),
  ];
}

/**
 * Build public sitemap URLs.
 * Never throws — brand URLs always returned so Google can crawl even if DB is slow.
 * Categories included in Coming soon (they serve 200 + keyword copy, not redirects).
 * Products only when Live.
 */
export async function getSitemapEntries(): Promise<SitemapEntry[]> {
  const base = siteConfig.url.replace(/\/$/, "");
  const now = new Date();
  const entries = getBrandSitemapEntries(base, now);

  try {
    const comingSoon = await withTimeout(isStoreComingSoon(), 1500).catch(
      () => true
    );

    if (comingSoon) {
      // Coming soon: only brand URLs (categories without products look thin to Google).
      return entries;
    }

    const [categories, products] = await withTimeout(
      Promise.all([getCategories(), getProducts()]),
      4000
    ).catch(() => [[], []] as const);

    const published = products.filter(
      (p) => p.slug && p.published !== false
    );
    const usedCategorySlugs = new Set(
      published
        .map((p) => ("category" in p && p.category ? p.category.slug : null))
        .filter(Boolean) as string[]
    );

    for (const category of categories) {
      if (!category.slug) continue;
      // Only list categories that have at least one published product.
      if (!usedCategorySlugs.has(category.slug)) continue;
      entries.push(
        entry(`${base}/shop/${category.slug}`, "0.8", "weekly", now)
      );
    }

    for (const product of published) {
      entries.push(
        entry(
          `${base}/product/${product.slug}`,
          "0.85",
          "weekly",
          "updatedAt" in product ? product.updatedAt : now
        )
      );
    }
  } catch (error) {
    console.error("[sitemap] catalog load failed; serving brand URLs only", error);
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

/** Absolute fallback if route handlers throw before getSitemapEntries resolves. */
export function fallbackSitemapXml() {
  const base = siteConfig.url.replace(/\/$/, "");
  return entriesToXml(getBrandSitemapEntries(base));
}

/** Call after product create/update/delete so Live sitemaps refresh quickly. */
export async function revalidateSitemaps() {
  const { revalidatePath } = await import("next/cache");
  revalidatePath("/sitemap.xml");
  revalidatePath("/sitemap/sitemap.xml");
}
