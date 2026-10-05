import { Suspense } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { ShopToolbar } from "@/components/shop/ShopToolbar";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCategories, getProducts } from "@/lib/products";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Shop Handmade Jewelry, Crochet Flowers & Keychains",
  description:
    "Shop ZAYUNE — handmade jewelry, crochet flowers, keychains, and custom orders from Pakistan. Designed, not just made.",
  alternates: { canonical: `${siteConfig.url}/shop` },
};

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

  return (
    <div className="container-content py-10 sm:py-20">
      <SectionHeading
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
            className={cn("text-nav text-aubergine/50 transition-colors hover:text-copper")}
          >
            {category.name}
          </Link>
        ))}
      </div>

      <Suspense fallback={null}>
        <ShopToolbar total={products.length} />
      </Suspense>

      {products.length === 0 ? (
        <p className="mt-14 text-sm text-aubergine/60">
          No pieces match your search. Try another term or browse all collections.
        </p>
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
