import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCategories, getProducts } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";
import { isStoreComingSoon } from "@/lib/store-mode";

export const metadata = pageMetadata({
  title: "Sitemap",
  description:
    "Browse every public ZAYUNE page — Winter Special collections, products, custom orders, and studio policies.",
  path: "/site-map",
  keywords: ["ZAYUNE sitemap", "handmade shop pages Pakistan"],
});

const staticLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop all pieces" },
  { href: "/custom", label: "Custom orders" },
  { href: "/about", label: "About the studio" },
  { href: "/contact", label: "Contact" },
  { href: "/shipping-returns", label: "Shipping & returns" },
  { href: "/privacy", label: "Privacy policy" },
  { href: "/cookies", label: "Cookie policy" },
];

export default async function HtmlSitemapPage() {
  const comingSoon = await isStoreComingSoon();
  const [categories, products] = await Promise.all([
    getCategories(),
    comingSoon ? Promise.resolve([]) : getProducts(),
  ]);

  const published = products.filter((p) => p.published !== false);
  const usedCategorySlugs = new Set(
    published
      .map((p) => ("category" in p && p.category ? p.category.slug : null))
      .filter(Boolean) as string[]
  );
  const liveCategories = categories.filter((c) => usedCategorySlugs.has(c.slug));

  return (
    <div className="container-content py-14 sm:py-20 max-w-narrow">
      <SectionHeading
        as="h1"
        eyebrow="Index"
        title="Sitemap"
        description="Public ZAYUNE pages for visitors and search engines. Private account and checkout URLs are not listed."
      />

      <section className="mt-12 space-y-3">
        <h2 className="font-display text-2xl text-aubergine">Studio</h2>
        <ul className="space-y-2 text-sm text-aubergine/75">
          {staticLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-copper hover:underline">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {liveCategories.length > 0 && (
        <section className="mt-12 space-y-3">
          <h2 className="font-display text-2xl text-aubergine">Collections</h2>
          <ul className="space-y-2 text-sm text-aubergine/75">
            {liveCategories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/shop/${category.slug}`}
                  className="text-copper hover:underline"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {published.length > 0 && (
        <section className="mt-12 space-y-3">
          <h2 className="font-display text-2xl text-aubergine">Products</h2>
          <ul className="space-y-2 text-sm text-aubergine/75">
            {published.map((product) => (
              <li key={product.id}>
                <Link
                  href={`/product/${product.slug}`}
                  className="text-copper hover:underline"
                >
                  {product.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
