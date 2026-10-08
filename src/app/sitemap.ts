import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/products";
import { siteConfig } from "@/lib/site";

export const revalidate = 3600;

function safeDate(value: unknown): Date {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === "string" || typeof value === "number") {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return new Date();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url.replace(/\/$/, "");

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/shop`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/custom`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/journal`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
    {
      url: `${base}/shipping-returns`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/cookies`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  let productRoutes: MetadataRoute.Sitemap = [];
  let categoryRoutes: MetadataRoute.Sitemap = [];

  try {
    const [products, categories] = await Promise.all([
      getProducts(),
      getCategories(),
    ]);

    productRoutes = products
      .filter((p) => p.published !== false && p.slug)
      .map((product) => ({
        url: `${base}/product/${product.slug}`,
        lastModified: safeDate(
          "updatedAt" in product ? product.updatedAt : undefined
        ),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));

    categoryRoutes = categories
      .filter((c) => c.slug)
      .map((category) => ({
        url: `${base}/shop/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.75,
      }));
  } catch (error) {
    console.error("[sitemap] failed to load catalog routes", error);
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
