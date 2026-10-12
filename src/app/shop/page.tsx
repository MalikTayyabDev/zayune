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
import { isStoreComingSoon } from "@/lib/store-mode";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Shop Handmade Crochet Flowers, Jewelry & Keychains Pakistan",
  description:
    "Shop ZAYUNE handmade crochet flowers, jewelry, and keychains from Satellite Town, Rawalpindi. Custom orders welcome across Pakistan.",
  path: "/shop",
  keywords: [
    "shop handmade crochet Pakistan",
    "buy crochet flowers online Pakistan",
    "handmade jewelry shop Rawalpindi",
    "handmade keychains Pakistan",
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
      {!comingSoon && (
        <CollectionJsonLd
          name="ZAYUNE Shop"
          description="Handmade crochet accessories from Pakistan."
          path="/shop"
          products={products.map((p) => ({ name: p.name, slug: p.slug }))}
        />
      )}
      <SectionHeading
        as="h1"
        eyebrow="Crochet handmade accessories"
        title="Shop handmade pieces"
        description="Crochet flowers, jewelry, keychains, and custom orders — made by hand in Rawalpindi, Pakistan, and shipped nationwide."
      />

      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-aubergine/65">
        ZAYUNE is a designer-led handmade studio. Browse the edit when live, or{" "}
        <Link href="/custom" className="text-copper hover:underline">
          request a custom piece
        </Link>{" "}
        and{" "}
        <Link href="/contact" className="text-copper hover:underline">
          contact the studio
        </Link>{" "}
        anytime.
      </p>

      {!comingSoon && (
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
      )}

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
