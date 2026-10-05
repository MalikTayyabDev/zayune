"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";

export function CartView() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.subtotal());

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="font-display text-3xl text-aubergine">Your cart is empty</p>
        <p className="mt-3 text-sm text-aubergine/60">
          Begin with a piece from the edit.
        </p>
        <Button href="/shop" className="mt-8">
          Shop pieces
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
      <ul className="divide-y divide-stone">
        {items.map((item) => (
          <li
            key={`${item.productId}-${item.variantId || "default"}`}
            className="flex gap-5 py-8 first:pt-0"
          >
            <Link
              href={`/product/${item.slug}`}
              className="relative aspect-[4/5] h-28 w-24 shrink-0 overflow-hidden bg-stone/40"
            >
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              )}
            </Link>
            <div className="flex flex-1 flex-col sm:flex-row sm:justify-between gap-4">
              <div>
                <Link
                  href={`/product/${item.slug}`}
                  className="text-sm text-aubergine hover:text-copper"
                >
                  {item.name}
                </Link>
                {item.variantName && (
                  <p className="mt-1 text-xs text-aubergine/55">{item.variantName}</p>
                )}
                <p className="mt-2 text-sm text-aubergine/80">
                  {formatPrice(item.price)}
                </p>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId, item.variantId)}
                  className="mt-3 text-nav text-aubergine/40 hover:text-copper"
                >
                  Remove
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="h-8 w-8 border border-stone text-sm"
                  onClick={() =>
                    updateQuantity(item.productId, item.quantity - 1, item.variantId)
                  }
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-6 text-center text-sm">{item.quantity}</span>
                <button
                  type="button"
                  className="h-8 w-8 border border-stone text-sm"
                  onClick={() =>
                    updateQuantity(item.productId, item.quantity + 1, item.variantId)
                  }
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside className="h-fit border border-stone bg-stone/20 p-6">
        <h2 className="text-nav text-aubergine/50">Summary</h2>
        <div className="mt-4 flex justify-between text-sm">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <p className="mt-2 text-xs text-aubergine/50">
          Shipping calculated at checkout.
        </p>
        <Button href="/checkout" className="mt-6 w-full">
          Checkout
        </Button>
      </aside>
    </div>
  );
}
