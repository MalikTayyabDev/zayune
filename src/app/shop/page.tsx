import { Suspense } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { ComingSoon } from "@/components/shop/ComingSoon";
import { ShopToolbar } from "@/components/shop/ShopToolbar";
import { CollectionJsonLd } from "@/components/seo/JsonLd";
import { ShopSeoIntro } from "@/components/seo/SeoKeywordBlock";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCategories, getProducts } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";
import { isStoreComingSoon } from "@/lib/store-mode";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Shop Handmade Jewelry, Crochet Flowers & Keychains Pakistan",
  description:
    "Shop handmade jewelry, crochet flowers, and keychains from ZAYUNE Rawalpindi. Designer-led crochet accessories made by hand in Pakistan — custom orders welcome.",
  path: "/shop",
  keywords: [
    "shop handmade crochet Pakistan",
    "buy crochet flowers online Pakistan",
    "handmade jewelry shop Pakistan",
    "handmade keychains shop Pakistan",
    "ZAYUNE shop",
  ],
});

type Props = {
  searchParams: { sort?: string; q?: string; availability?: string };
};

export default async function ShopPage({ searchParams }: Props) {
  const comingSoon = await isStoreComingSoon();
  const [categories, products] = await Promise.all([
    getCategories(),
    comingSoon
      ? Promise.resolve([])
      : getProducts({
          sort: searchParams.sort,
          q: searchParams.q,
          availability: searchParams.availability,
        }),
  ]);

  const hasFilters = Boolean(
    searchParams.q || searchParams.availability || searchParams.sort
  );
  const showComingSoon = comingSoon || products.length === 0;

  return (
    <div className="container-content py-10 sm:py-20">
      <CollectionJsonLd
        name="Shop handmade jewelry & crochet — ZAYUNE"
        description="Handmade crochet flowers, jewelry, and keychains from ZAYUNE Pakistan."
        path="/shop"
        products={products.map((p) => ({ name: p.name, slug: p.slug }))}
      />
      <SectionHeading
        as="h1"
        eyebrow="Crochet handmade accessories"
        title="Shop handmade jewelry & crochet"
        description="Crochet flowers, jewelry, keychains, and custom orders — made by hand in Satellite Town, Rawalpindi, Pakistan."
      />
      <ShopSeoIntro />

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

      {!comingSoon && products.length > 0 && (
        <Suspense fallback={null}>
          <ShopToolbar total={products.length} />
        </Suspense>
      )}

      {showComingSoon ? (
        comingSoon || !hasFilters ? (
          <ComingSoon />
        ) : (
          <p className="mt-14 text-sm text-aubergine/60">
            No pieces match your search. Try another term or{" "}
            <Link href="/shop" className="text-copper hover:underline">
              browse all
            </Link>
            .
          </p>
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
