"use client";

import { useEffect, useMemo, useState } from "react";
import { Hand, MessageCircle, ShoppingBag, Truck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { VariantSwatches, type SwatchVariant } from "@/components/product/VariantSwatches";
import { WaitlistForm } from "@/components/product/WaitlistForm";
import { WishlistButton } from "@/components/product/WishlistButton";
import { useCartStore } from "@/lib/cart-store";
import { maxPurchasableQty } from "@/lib/stock";
import { formatPrice, whatsappOrderUrl } from "@/lib/utils";

type Props = {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    currency: string;
    image: string;
    fulfillment: "IN_STOCK" | "MADE_TO_ORDER";
    stock: number | null;
    leadTimeDays: number | null;
    variants: SwatchVariant[];
  };
};

export function AddToCart({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openDrawer);
  const [variantId, setVariantId] = useState(product.variants[0]?.id || "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const selected = product.variants.find((v) => v.id === variantId);
  const unitPrice = product.price + (selected?.priceDelta || 0);

  const available = useMemo(() => {
    if (product.fulfillment === "MADE_TO_ORDER") return true;
    if (selected?.stock != null) return selected.stock > 0;
    return (product.stock ?? 0) > 0;
  }, [product, selected]);

  const maxQty = maxPurchasableQty(product, selected?.stock);

  useEffect(() => {
    setQuantity((q) => Math.min(q, Math.max(1, maxQty || 1)));
  }, [maxQty, variantId]);

  function handleAdd() {
    if (!available || maxQty < 1) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: unitPrice,
      image: product.image,
      quantity: Math.min(quantity, maxQty),
      variantId: selected?.id,
      variantName: selected?.name,
      fulfillment: product.fulfillment,
    });
    setAdded(true);
    openCart?.();
    window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="space-y-6">
      {product.variants.length > 0 && (
        <VariantSwatches
          variants={product.variants}
          value={variantId}
          onChange={setVariantId}
        />
      )}

      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-nav text-aubergine/55 mb-2">Quantity</p>
          <div className="inline-flex items-center border border-stone">
            <button
              type="button"
              className="h-11 w-11 text-sm"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-10 text-center text-sm">{quantity}</span>
            <button
              type="button"
              className="h-11 w-11 text-sm"
              onClick={() => setQuantity((q) => Math.min(maxQty || 1, q + 1))}
              aria-label="Increase quantity"
              disabled={!available || maxQty < 1}
            >
              +
            </button>
          </div>
        </div>
        <p className="text-lg text-aubergine">{formatPrice(unitPrice * quantity, product.currency)}</p>
      </div>

      {available ? (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="button" onClick={handleAdd} className="sm:flex-1 gap-2">
              <Icon icon={ShoppingBag} size={14} className="text-porcelain" />
              {added ? "Added" : "Add to cart"}
            </Button>
            <WishlistButton
              label
              className="justify-center border border-stone px-5 py-3 sm:w-auto"
              product={{
                productId: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: product.image,
                currency: product.currency,
              }}
            />
          </div>
          <Button
            variant="secondary"
            href={whatsappOrderUrl(product.name, product.slug)}
            target="_blank"
            rel="noreferrer"
            className="w-full gap-2"
          >
            <Icon icon={MessageCircle} size={14} />
            Order on WhatsApp
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <WaitlistForm
            productId={product.id}
            productName={product.name}
            variantId={selected?.id}
          />
          <Button
            variant="secondary"
            href={whatsappOrderUrl(product.name, product.slug)}
            target="_blank"
            rel="noreferrer"
            className="w-full gap-2"
          >
            <Icon icon={MessageCircle} size={14} />
            Ask on WhatsApp
          </Button>
        </div>
      )}

      <ul className="space-y-2.5 border-t border-stone pt-5 text-xs text-aubergine/55">
        <li className="flex items-start gap-2">
          <Icon icon={Hand} size={14} className="mt-0.5" />
          <span>
            {product.fulfillment === "MADE_TO_ORDER"
              ? `Crocheted to order · ships in about ${product.leadTimeDays ?? "—"} days`
              : available
                ? "In stock · handmade & ready after confirmation"
                : "Currently unavailable"}
          </span>
        </li>
        <li className="flex items-start gap-2">
          <Icon icon={UserRound} size={14} className="mt-0.5" />
          <span>Guest checkout available · create an account anytime</span>
        </li>
        <li className="flex items-start gap-2">
          <Icon icon={Truck} size={14} className="mt-0.5" />
          <span>Nationwide shipping across Pakistan</span>
        </li>
      </ul>
    </div>
  );
}
