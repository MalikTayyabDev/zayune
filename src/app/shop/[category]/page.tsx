import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { ComingSoon } from "@/components/shop/ComingSoon";
import { ShopToolbar } from "@/components/shop/ShopToolbar";
import { CollectionJsonLd } from "@/components/seo/JsonLd";
import { CollectionSeoCopy } from "@/components/seo/SeoKeywordBlock";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCategories, getProducts } from "@/lib/products";
import { collectionSeo } from "@/lib/seo-copy";
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
  const seo = category ? collectionSeo[category.slug] : undefined;
  return pageMetadata({
    title: seo?.h1Extra || (category ? `${name} — Handmade Pakistan` : "Shop"),
    description:
      seo?.body?.slice(0, 155) ||
      category?.description ||
      "Browse handmade pieces from ZAYUNE Pakistan.",
    path: `/shop/${params.category}`,
    keywords: category
      ? [
          ...(seo?.keywords || []),
          `${category.name} handmade Pakistan`,
          `ZAYUNE ${category.name}`,
        ]
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

  const seo = collectionSeo[category.slug];

  return (
    <div className="container-content py-10 sm:py-20">
      <CollectionJsonLd
        name={seo?.h1Extra || `${category.name} — ZAYUNE`}
        description={
          seo?.body ||
          category.description ||
          `Handmade ${category.name} from ZAYUNE Pakistan.`
        }
        path={`/shop/${category.slug}`}
        products={products.map((p) => ({ name: p.name, slug: p.slug }))}
      />
      <SectionHeading
        as="h1"
        eyebrow="Shop"
        title={seo?.h1Extra || category.name}
        description={category.description || undefined}
      />
      <CollectionSeoCopy
        slug={category.slug}
        name={category.name}
        fallbackDescription={category.description}
      />

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
