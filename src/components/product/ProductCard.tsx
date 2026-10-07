"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, Eye, Flower2, Plus } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
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
  const openDrawer = useCartStore((s) => s.openDrawer);
  const [variantId, setVariantId] = useState(product.variants?.[0]?.id || "");
  const [adding, setAdding] = useState(false);
  const [quickView, setQuickView] = useState(false);
  const [inView, setInView] = useState(false);
  const cardRef = useRef<HTMLElement | null>(null);

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

  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -6% 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

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
    openDrawer();
    window.setTimeout(() => setAdding(false), 1200);
  }

  return (
    <>
      <article ref={cardRef} className="group flex h-full flex-col">
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
              {/* Soft scrim so mobile CTAs stay readable */}
              <div
                className={cn(
                  "pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-aubergine/45 to-transparent sm:hidden",
                  inView ? "opacity-100" : "opacity-0",
                  "transition-opacity duration-500"
                )}
              />
            </div>
          </Link>

          <div className="absolute left-2 top-2 z-10 flex flex-col gap-1.5 sm:left-3 sm:top-3">
            <span
              className={cn(
                "inline-flex h-6 items-center justify-center gap-1 border border-stone/80 bg-porcelain/95 px-1.5 text-[8px] uppercase tracking-nav text-aubergine/70 backdrop-blur-sm sm:h-7 sm:justify-start sm:gap-1.5 sm:px-2.5 sm:text-[9px]",
                inView && "badge-pop"
              )}
            >
              <Icon icon={Flower2} size={11} className="text-copper sm:hidden" />
              <Icon icon={Flower2} size={12} className="hidden text-copper sm:block" />
              <span className="hidden sm:inline">Handmade</span>
            </span>
            {oos && (
              <span
                className={cn(
                  "inline-flex h-7 items-center gap-1.5 border border-copper/40 bg-aubergine px-2.5 text-[9px] uppercase tracking-nav text-porcelain shadow-sm sm:h-7 sm:text-[10px]",
                  inView && "sold-out-glow"
                )}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-copper" aria-hidden />
                Sold out
              </span>
            )}
          </div>

          <div
            className={cn(
              "absolute right-2 top-2 z-10 sm:right-3 sm:top-3",
              inView && "badge-pop"
            )}
            style={inView ? { animationDelay: "80ms" } : undefined}
          >
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

          {/* Mobile: always reveal with fade. Desktop: hover reveal. */}
          <div
            className={cn(
              "absolute inset-x-2 bottom-2 z-10 flex items-center gap-1.5 sm:inset-x-3 sm:bottom-3 sm:gap-2",
              "sm:translate-y-2 sm:opacity-0 sm:transition-all sm:duration-300 sm:group-hover:translate-y-0 sm:group-hover:opacity-100",
              inView ? "card-action-in opacity-100" : "opacity-0 sm:opacity-0"
            )}
          >
            {showQuickAdd && (
              <button
                type="button"
                onClick={quickAdd}
                className={cn(
                  "inline-flex h-10 min-h-10 max-h-10 flex-1 items-center justify-center gap-1.5 box-border px-2.5 text-[9px] uppercase leading-none tracking-nav text-porcelain shadow-md sm:px-3 sm:text-[10px]",
                  oos
                    ? "bg-copper hover:bg-aubergine"
                    : "bg-aubergine hover:bg-aubergine/90"
                )}
              >
                {oos ? (
                  <>
                    <Icon icon={Bell} size={13} className="text-porcelain" />
                    Get notified
                  </>
                ) : (
                  <>
                    <Icon icon={Plus} size={13} className="text-porcelain" />
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
                className="peer inline-flex h-10 min-h-10 max-h-10 w-full items-center justify-center box-border border border-aubergine/15 bg-porcelain/95 text-aubergine shadow-md backdrop-blur-sm transition hover:border-copper hover:text-copper"
              >
                <Icon icon={Eye} size={14} className="text-current" />
              </button>
              <span
                role="tooltip"
                className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap border border-white/20 bg-white px-2.5 py-1.5 text-[10px] uppercase tracking-nav text-aubergine opacity-0 shadow-sm transition-opacity peer-hover:opacity-100 peer-focus-visible:opacity-100 max-sm:hidden"
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
              <span className="text-[10px] uppercase tracking-nav text-copper">
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
