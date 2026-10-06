"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, Eye, Flower2, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { QuickViewModal } from "@/components/product/QuickViewModal";
import { WishlistButton } from "@/components/product/WishlistButton";
import { Icon } from "@/components/ui/Icon";
import { useCartStore } from "@/lib/cart-store";
import { isOutOfStock } from "@/lib/stock";
import { formatPrice, cn } from "@/lib/utils";

type Variant = {
  id: string;
  name: string;
  swatchHex?: string | null;
  imageUrl?: string | null;
  priceDelta?: number;
  stock?: number | null;
};

type Props = {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number | null;
    isBundle?: boolean;
    currency: string;
    oneLiner: string;
    fulfillment?: string | null;
    stock?: number | null;
    images: { url: string; alt: string }[];
    category: { name: string };
    variants?: Variant[];
  };
  showQuickAdd?: boolean;
};

export function ProductCard({ product, showQuickAdd = true }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const [variantId, setVariantId] = useState(product.variants?.[0]?.id || "");
  const [adding, setAdding] = useState(false);
  const [quickView, setQuickView] = useState(false);

  const selected = useMemo(
    () => product.variants?.find((v) => v.id === variantId),
    [product.variants, variantId]
  );

  const oos = isOutOfStock(product, selected?.stock);
  const primary = product.images[0];
  const secondary = product.images[1] || product.images[0];
  const activeImage = selected?.imageUrl || primary?.url || "";
  const price = product.price + (selected?.priceDelta || 0);
  const swatches = (product.variants || []).filter((v) => v.swatchHex).slice(0, 6);

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (oos) {
      setQuickView(true);
      return;
    }
    setAdding(true);
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price,
      image: activeImage,
      variantId: selected?.id,
      variantName: selected?.name,
      fulfillment: product.fulfillment || undefined,
    });
    window.setTimeout(() => setAdding(false), 1200);
  }

  return (
    <>
      <article className="group flex h-full flex-col">
        <div className="relative">
          <Link href={`/product/${product.slug}`} className="block">
            <div className="relative aspect-[4/5] overflow-hidden bg-stone/40">
              {activeImage && (
                <Image
                  src={activeImage}
                  alt={primary?.alt || product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className={cn(
                    "object-cover transition duration-500",
                    oos && "opacity-70",
                    !selected?.imageUrl && !oos && "group-hover:opacity-0"
                  )}
                />
              )}
              {!selected?.imageUrl && !oos && secondary && (
                <Image
                  src={secondary.url}
                  alt={secondary.alt || product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover opacity-0 transition duration-500 group-hover:opacity-100"
                />
              )}
            </div>
          </Link>

          <div className="absolute left-2 top-2 z-10 flex flex-col gap-1.5 sm:left-3 sm:top-3">
            <span className="inline-flex h-6 items-center justify-center gap-1 bg-porcelain/95 px-1.5 text-[8px] uppercase tracking-nav text-aubergine/70 backdrop-blur-sm sm:h-7 sm:justify-start sm:gap-1.5 sm:px-2.5 sm:text-[9px]">
              <Icon icon={Flower2} size={11} className="text-copper sm:hidden" />
              <Icon icon={Flower2} size={12} className="hidden text-copper sm:block" />
              <span className="hidden sm:inline">Handmade</span>
            </span>
            {oos && (
              <span className="inline-flex h-6 items-center bg-aubergine/90 px-2 text-[8px] uppercase tracking-nav text-porcelain sm:h-7 sm:text-[9px]">
                Sold out
              </span>
            )}
          </div>

          <div className="absolute right-2 top-2 z-10 sm:right-3 sm:top-3">
            <WishlistButton
              className="h-8 w-8 justify-center rounded-sm bg-porcelain/95 p-0 shadow-sm backdrop-blur-sm sm:h-9 sm:w-9"
              product={{
                productId: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: primary?.url || "",
                currency: product.currency,
              }}
            />
          </div>

          <div className="absolute inset-x-3 bottom-3 z-10 flex translate-y-2 items-center gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            {showQuickAdd && (
              <button
                type="button"
                onClick={quickAdd}
                className="inline-flex h-10 min-h-10 max-h-10 flex-1 items-center justify-center gap-1.5 box-border bg-aubergine px-3 text-[10px] uppercase leading-none tracking-nav text-porcelain"
              >
                {oos ? (
                  <>
                    <Icon icon={Bell} size={14} className="text-porcelain" />
                    Get notified
                  </>
                ) : (
                  <>
                    <Icon icon={Plus} size={14} className="text-porcelain" />
                    {adding ? "Added ✓" : "Quick add"}
                  </>
                )}
              </button>
            )}

            <div className="relative h-10 w-10 shrink-0">
              <button
                type="button"
                aria-label="Quick view"
                onClick={(e) => {
                  e.preventDefault();
                  setQuickView(true);
                }}
                className="peer inline-flex h-10 min-h-10 max-h-10 w-full items-center justify-center box-border border border-aubergine/15 bg-porcelain/95 text-aubergine backdrop-blur-sm transition hover:border-copper hover:text-copper"
              >
                <Icon icon={Eye} size={14} className="text-current" />
              </button>
              <span
                role="tooltip"
                className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap border border-white/20 bg-white px-2.5 py-1.5 text-[10px] uppercase tracking-nav text-aubergine opacity-0 shadow-sm transition-opacity peer-hover:opacity-100 peer-focus-visible:opacity-100"
              >
                Quick view
              </span>
            </div>
          </div>
        </div>

        <div className="mt-2 flex flex-1 flex-col space-y-1 sm:mt-4 sm:space-y-1.5">
          <p className="truncate text-[10px] uppercase tracking-nav text-aubergine/45 sm:text-nav">
            {product.category.name}
          </p>
          <Link href={`/product/${product.slug}`} className="min-h-[2.5rem] sm:min-h-0">
            <h3 className="line-clamp-2 font-body text-xs leading-snug tracking-wide text-aubergine hover:text-copper sm:text-sm sm:leading-normal">
              {product.name}
            </h3>
          </Link>
          <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2">
            <p className="text-xs text-aubergine/70 sm:text-sm">
              {formatPrice(price, product.currency)}
            </p>
            {product.compareAtPrice && product.compareAtPrice > price && (
              <p className="text-xs text-aubergine/35 line-through">
                {formatPrice(product.compareAtPrice, product.currency)}
              </p>
            )}
            {product.isBundle && (
              <span className="text-[10px] uppercase tracking-nav text-copper">
                Bundle
              </span>
            )}
            {oos && (
              <span className="text-[10px] uppercase tracking-nav text-aubergine/45">
                Out of stock
              </span>
            )}
          </div>
          {swatches.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {swatches.map((swatch) => (
                <button
                  key={swatch.id}
                  type="button"
                  title={swatch.name}
                  aria-label={`Select ${swatch.name}`}
                  aria-pressed={variantId === swatch.id}
                  onClick={() => setVariantId(swatch.id)}
                  className={cn(
                    "h-4 w-4 rounded-full border transition",
                    variantId === swatch.id
                      ? "border-aubergine scale-110"
                      : "border-stone hover:border-aubergine/50"
                  )}
                  style={{ backgroundColor: swatch.swatchHex || undefined }}
                />
              ))}
            </div>
          )}

          <div className="mt-auto flex items-center gap-2 pt-1.5 sm:hidden">
            {showQuickAdd && (
              <button
                type="button"
                onClick={quickAdd}
                className="text-[10px] uppercase tracking-nav text-copper"
              >
                {oos ? "Notify me" : adding ? "Added ✓" : "Add +"}
              </button>
            )}
            <button
              type="button"
              aria-label="Quick view"
              onClick={() => setQuickView(true)}
              className="inline-flex items-center gap-0.5 text-[10px] uppercase tracking-nav text-aubergine/50"
            >
              <Icon icon={Eye} size={12} className="text-current" />
              View
            </button>
          </div>
        </div>
      </article>

      <QuickViewModal
        product={product}
        open={quickView}
        onClose={() => setQuickView(false)}
        initialVariantId={variantId}
      />
    </>
  );
}
