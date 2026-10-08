import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AddToCart } from "@/components/product/AddToCart";
import { ProductGallery } from "@/components/product/ProductGallery";
import { RecentlyViewedTracker } from "@/components/product/RecentlyViewedTracker";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { BreadcrumbJsonLd, ProductJsonLd } from "@/components/seo/JsonLd";
import { Reveal } from "@/components/ui/Reveal";
import { findDemoProduct } from "@/lib/demo-catalog";
import { isDemoMode } from "@/lib/demo-data";
import { getProductBySlug, getProducts, getRelatedProducts } from "@/lib/products";
import { prisma } from "@/lib/prisma";
import { pageMetadata } from "@/lib/seo";
import { isStoreComingSoon } from "@/lib/store-mode";
import { formatPrice } from "@/lib/utils";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props) {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Product" };
  const title = product.seoTitle || product.name;
  const description = product.seoDescription || product.oneLiner;
  return pageMetadata({
    title,
    description,
    path: `/product/${product.slug}`,
    image: product.images[0]?.url,
    absoluteTitle: Boolean(product.seoTitle?.match(/zayune/i)),
  });
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: Props) {
  if (await isStoreComingSoon()) redirect("/shop");

  const product = await getProductBySlug(params.slug);
  if (!product || !product.published) notFound();

  const related = await getRelatedProducts(product.slug, product.category.slug, 4);

  const compareAt =
    "compareAtPrice" in product && product.compareAtPrice
      ? Number(product.compareAtPrice)
      : null;
  const isBundle = "isBundle" in product && Boolean(product.isBundle);
  const bundleIds =
    "bundleProductIds" in product && Array.isArray(product.bundleProductIds)
      ? (product.bundleProductIds as string[])
      : [];

  const bundleProducts = (
    await Promise.all(
      bundleIds.map(async (id) => {
        if (isDemoMode()) return findDemoProduct(id);
        return prisma.product.findUnique({
          where: { id },
          include: { images: true },
        });
      })
    )
  ).filter(Boolean);

  const inStock =
    product.fulfillment === "MADE_TO_ORDER" ||
    (product.stock != null && product.stock > 0) ||
    product.variants.some((v) => (v.stock ?? 1) > 0);

  const availability =
    product.fulfillment === "MADE_TO_ORDER"
      ? ("PreOrder" as const)
      : inStock
        ? ("InStock" as const)
        : ("OutOfStock" as const);

  const availabilityLabel =
    product.fulfillment === "MADE_TO_ORDER"
      ? `Made to order · ships in ${product.leadTimeDays ?? "—"} days`
      : product.stock === 0
        ? "Sold out — join the waitlist"
        : product.stock === 1
          ? "One of a kind · 1 available"
          : product.stock && product.stock > 0
            ? `${product.stock} available`
            : "Check options below";

  return (
    <div className="container-content py-12 sm:py-16">
      <ProductJsonLd
        product={{
          name: product.name,
          slug: product.slug,
          description: product.seoDescription || product.oneLiner,
          price: product.price,
          currency: product.currency,
          image: product.images[0]?.url,
          availability,
        }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Shop", path: "/shop" },
          {
            name: product.category.name,
            path: `/shop/${product.category.slug}`,
          },
          { name: product.name, path: `/product/${product.slug}` },
        ]}
      />
      <RecentlyViewedTracker
        product={{
          productId: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.images[0]?.url || "",
          currency: product.currency,
        }}
      />

      <nav aria-label="Breadcrumb" className="mb-8 text-nav text-aubergine/45">
        <Link href="/shop" className="hover:text-copper">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/shop/${product.category.slug}`} className="hover:text-copper">
          {product.category.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-aubergine/70">{product.name}</span>
      </nav>

      <Reveal className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.images} productName={product.name} />

        <div>
          <p className="text-nav text-aubergine/45">{product.category.name}</p>
          {isBundle && (
            <p className="mt-2 text-nav text-copper">Bundle</p>
          )}
          <h1 className="mt-3 font-display text-4xl leading-tight text-aubergine sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-4 font-editorial text-xl italic text-aubergine/75">
            {product.oneLiner}
          </p>
          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <p className="text-lg text-aubergine">
              {formatPrice(product.price, product.currency)}
            </p>
            {compareAt && compareAt > product.price && (
              <p className="text-sm text-aubergine/40 line-through">
                {formatPrice(compareAt, product.currency)}
              </p>
            )}
          </div>
          <p className="mt-2 text-sm text-sage">{availabilityLabel}</p>

          {bundleProducts.length > 0 && (
            <div className="mt-6 border border-stone bg-stone/15 p-4">
              <p className="text-nav text-aubergine/45">Includes</p>
              <ul className="mt-3 space-y-2 text-sm text-aubergine/75">
                {bundleProducts.map((item) =>
                  item ? (
                    <li key={item.id}>
                      <Link
                        href={`/product/${item.slug}`}
                        className="hover:text-copper"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ) : null
                )}
              </ul>
            </div>
          )}

          <div className="mt-8">
            <AddToCart
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                currency: product.currency,
                image: product.images[0]?.url || "",
                fulfillment: product.fulfillment,
                stock: product.stock,
                leadTimeDays: product.leadTimeDays,
                variants: product.variants.map((v) => ({
                  id: v.id,
                  name: v.name,
                  optionGroup:
                    "optionGroup" in v ? (v.optionGroup as string) : "Option",
                  swatchHex:
                    "swatchHex" in v ? (v.swatchHex as string | null) : null,
                  priceDelta: v.priceDelta,
                  stock: v.stock,
                })),
              }}
            />
          </div>

          <div className="mt-12 space-y-8 border-t border-stone pt-10">
            <DetailBlock title="Story" body={product.story} />
            <DetailBlock title="Materials" body={product.materials} />
            <DetailBlock title="Handmade proof" body={product.handmadeProof} />
            <DetailBlock title="Styling note" body={product.stylingNote} />
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-16">
        <RelatedProducts products={related} />
      </Reveal>
    </div>
  );
}

function DetailBlock({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h2 className="text-nav text-aubergine/50 mb-2">{title}</h2>
      <p className="text-sm sm:text-base leading-relaxed text-aubergine/80 whitespace-pre-line">
        {body}
      </p>
    </div>
  );
}
