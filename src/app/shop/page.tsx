import { Suspense } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { ComingSoon } from "@/components/shop/ComingSoon";
import { ShopToolbar } from "@/components/shop/ShopToolbar";
import { CollectionJsonLd } from "@/components/seo/JsonLd";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCategories, getProducts } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Shop Handmade Jewelry, Crochet Flowers & Keychains",
  description:
    "Shop ZAYUNE — handmade jewelry, crochet flowers, keychains, and custom orders from Pakistan. Designed, not just made.",
  path: "/shop",
  keywords: [
    "shop handmade crochet Pakistan",
    "buy crochet flowers online Pakistan",
    "handmade jewelry shop Pakistan",
  ],
});

type Props = {
  searchParams: { sort?: string; q?: string; availability?: string };
};

export default async function ShopPage({ searchParams }: Props) {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({
      sort: searchParams.sort,
      q: searchParams.q,
      availability: searchParams.availability,
    }),
  ]);

  const hasFilters = Boolean(
    searchParams.q || searchParams.availability || searchParams.sort
  );

  return (
    <div className="container-content py-10 sm:py-20">
      <CollectionJsonLd
        name="ZAYUNE Shop"
        description="Handmade crochet accessories from Pakistan."
        path="/shop"
        products={products.map((p) => ({ name: p.name, slug: p.slug }))}
      />
      <SectionHeading
        as="h1"
        eyebrow="Crochet handmade accessories"
        title="All pieces"
        description="Crochet flowers, jewelry, keychains, and custom orders — made by hand in Pakistan, presented with room to breathe."
      />

      <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
        <Link href="/shop" className="text-nav text-aubergine">
          All
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/shop/${category.slug}`}
            className={cn(
              "text-nav text-aubergine/50 transition-colors hover:text-copper"
            )}
          >
            {category.name}
          </Link>
        ))}
      </div>

      {products.length > 0 && (
        <Suspense fallback={null}>
          <ShopToolbar total={products.length} />
        </Suspense>
      )}

      {products.length === 0 ? (
        hasFilters ? (
          <p className="mt-14 text-sm text-aubergine/60">
            No pieces match your search. Try another term or{" "}
            <Link href="/shop" className="text-copper hover:underline">
              browse all
            </Link>
            .
          </p>
        ) : (
          <ComingSoon />
        )
      ) : (
        <div className="card-grid mt-8 sm:mt-12 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, index) => (
            <Reveal key={product.id} delay={Math.min(index * 60, 300)}>
              <ProductCard product={product} showQuickAdd />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
