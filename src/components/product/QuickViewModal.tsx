"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { WishlistButton } from "@/components/product/WishlistButton";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice, cn } from "@/lib/utils";

export type QuickViewProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  oneLiner: string;
  images: { url: string; alt: string }[];
  category: { name: string };
  variants?: {
    id: string;
    name: string;
    swatchHex?: string | null;
    imageUrl?: string | null;
    priceDelta?: number;
    stock?: number | null;
  }[];
};

type Props = {
  product: QuickViewProduct | null;
  open: boolean;
  onClose: () => void;
  initialVariantId?: string;
};

export function QuickViewModal({ product, open, onClose, initialVariantId }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const [variantId, setVariantId] = useState("");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (product) {
      setVariantId(initialVariantId || product.variants?.[0]?.id || "");
      setQty(1);
    }
  }, [product, initialVariantId]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || !product) return null;

  const selected = product.variants?.find((v) => v.id === variantId);
  const image =
    selected?.imageUrl ||
    product.images[0]?.url ||
    "";
  const price = product.price + (selected?.priceDelta || 0);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-aubergine/40"
        aria-label="Close quick view"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Quick view: ${product.name}`}
        className="relative z-10 grid max-h-[90vh] w-full max-w-3xl overflow-hidden bg-porcelain shadow-2xl md:grid-cols-2"
      >
        <div className="relative aspect-[4/5] bg-stone/40 md:aspect-auto md:min-h-[420px]">
          {image && (
            <Image
              src={image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 50vw"
            />
          )}
        </div>
        <div className="flex flex-col overflow-y-auto p-6 sm:p-8">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 text-nav text-aubergine/50 hover:text-copper"
          >
            Close
          </button>
          <p className="text-nav text-aubergine/45">{product.category.name}</p>
          <h2 className="mt-2 font-display text-3xl text-aubergine">{product.name}</h2>
          <p className="mt-2 font-editorial italic text-aubergine/70">{product.oneLiner}</p>
          <p className="mt-4 text-lg">{formatPrice(price, product.currency)}</p>

          {product.variants && product.variants.length > 0 && (
            <div className="mt-6">
              <p className="text-nav text-aubergine/50 mb-3">
                {selected?.name || "Option"}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    title={variant.name}
                    onClick={() => setVariantId(variant.id)}
                    className={cn(
                      "h-8 w-8 rounded-full border-2 transition",
                      variantId === variant.id
                        ? "border-aubergine scale-110"
                        : "border-stone hover:border-aubergine/40"
                    )}
                    style={{
                      backgroundColor: variant.swatchHex || "#D7CEC3",
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center gap-3">
            <div className="inline-flex border border-stone">
              <button
                type="button"
                className="h-10 w-10"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span className="flex w-8 items-center justify-center text-sm">{qty}</span>
              <button
                type="button"
                className="h-10 w-10"
                onClick={() => setQty((q) => q + 1)}
              >
                +
              </button>
            </div>
            <Button
              type="button"
              className="flex-1"
              onClick={() => {
                addItem({
                  productId: product.id,
                  slug: product.slug,
                  name: product.name,
                  price,
                  image,
                  quantity: qty,
                  variantId: selected?.id,
                  variantName: selected?.name,
                });
                onClose();
              }}
            >
              Add to cart
            </Button>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <WishlistButton
              label
              product={{
                productId: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: product.images[0]?.url || "",
                currency: product.currency,
              }}
            />
            <Link
              href={`/product/${product.slug}`}
              onClick={onClose}
              className="text-nav text-copper hover:text-aubergine"
            >
              Full details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
