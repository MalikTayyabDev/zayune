import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { ComingSoon } from "@/components/shop/ComingSoon";
import { ShopToolbar } from "@/components/shop/ShopToolbar";
import { CollectionJsonLd } from "@/components/seo/JsonLd";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCategories, getProducts } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";
import { isStoreComingSoon } from "@/lib/store-mode";
import { cn } from "@/lib/utils";

type Props = {
  params: { category: string };
  searchParams: { sort?: string; q?: string; availability?: string };
};

export async function generateMetadata({ params }: Props) {
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === params.category);
  const name = category?.name || "Shop";
  return pageMetadata({
    title: category ? `${name} — Handmade` : "Shop",
    description:
      category?.description ||
      "Browse handmade pieces from ZAYUNE Pakistan.",
    path: `/shop/${params.category}`,
    keywords: category
      ? [`${category.name} handmade Pakistan`, `ZAYUNE ${category.name}`]
      : undefined,
  });
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const comingSoon = await isStoreComingSoon();
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === params.category);
  if (!category) notFound();

  const products = comingSoon
    ? []
    : await getProducts({
        categorySlug: params.category,
        sort: searchParams.sort,
        q: searchParams.q,
        availability: searchParams.availability,
      });

  const hasFilters = Boolean(
    searchParams.q || searchParams.availability || searchParams.sort
  );
  const showComingSoon = comingSoon || products.length === 0;

  return (
    <div className="container-content py-10 sm:py-20">
      {!comingSoon && (
        <CollectionJsonLd
          name={category.name}
          description={
            category.description || `Handmade ${category.name} from ZAYUNE.`
          }
          path={`/shop/${category.slug}`}
          products={products.map((p) => ({ name: p.name, slug: p.slug }))}
        />
      )}
      <SectionHeading
        as="h1"
        eyebrow="Shop"
        title={category.name}
        description={category.description || undefined}
      />

      {!comingSoon && (
        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
          <Link href="/shop" className="text-nav text-aubergine/50 hover:text-copper">
            All
          </Link>
          {categories.map((item) => (
            <Link
              key={item.id}
              href={`/shop/${item.slug}`}
              className={cn(
                "text-nav transition-colors hover:text-copper",
                item.slug === category.slug
                  ? "text-aubergine"
                  : "text-aubergine/50"
              )}
            >
              {item.name}
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
          <ComingSoon
            title={
              comingSoon
                ? "Products coming soon"
                : `${category.name} coming soon`
            }
            description={
              comingSoon
                ? undefined
                : `We’re preparing the ${category.name.toLowerCase()} edit. Custom requests for this collection are welcome anytime.`
            }
          />
        ) : (
          <p className="mt-16 text-sm text-aubergine/60">
            No pieces match these filters right now.
          </p>
        )
      ) : (
        <div className="card-grid mt-8 sm:mt-12 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} showQuickAdd />
          ))}
        </div>
      )}
    </div>
  );
}
