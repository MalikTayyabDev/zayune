"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Truck, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice, cn } from "@/lib/utils";

const FREE_SHIPPING_OVER = 5000;

export function CartDrawer() {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((s) => s.items);
  const open = useCartStore((s) => s.drawerOpen);
  const closeDrawer = useCartStore((s) => s.closeDrawer);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.subtotal());

  useEffect(() => setMounted(true), []);

  // Body scroll lock is owned by Header (menu + cart) to avoid races.

  if (!mounted) return null;

  const remaining = Math.max(0, FREE_SHIPPING_OVER - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_OVER) * 100);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-aubergine/30 transition-opacity",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={closeDrawer}
        aria-hidden
      />
      <aside
        className={cn(
          "fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-porcelain shadow-xl transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full"
        )}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b border-stone px-5 py-4">
          <h2 className="inline-flex items-center gap-2 font-display text-2xl">
            <Icon icon={ShoppingBag} size={18} />
            Your cart
          </h2>
          <button
            type="button"
            className="text-aubergine/50 hover:text-copper"
            onClick={closeDrawer}
            aria-label="Close cart"
          >
            <Icon icon={X} size={18} className="text-current" />
          </button>
        </div>

        <div className="border-b border-stone px-5 py-4">
          <p className="inline-flex items-center gap-2 text-xs text-aubergine/60">
            <Icon icon={Truck} size={14} />
            {remaining > 0
              ? `${formatPrice(remaining)} away from complimentary shipping`
              : "You've unlocked complimentary shipping"}
          </p>
          <div className="mt-2 h-1 w-full bg-stone">
            <div
              className="h-full bg-sage transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm text-aubergine/60">Your cart is empty.</p>
              <Link
                href="/shop"
                onClick={closeDrawer}
                className="mt-6 inline-flex items-center justify-center px-7 py-3 text-[11px] uppercase tracking-nav bg-aubergine text-porcelain"
              >
                Continue shopping
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-stone">
              {items.map((item) => (
                <li
                  key={`${item.productId}-${item.variantId || "default"}`}
                  className="flex gap-4 py-5"
                >
                  <Link
                    href={`/product/${item.slug}`}
                    onClick={closeDrawer}
                    className="relative h-24 w-20 shrink-0 overflow-hidden bg-stone/40"
                  >
                    {item.image && (
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                    )}
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <Link
                      href={`/product/${item.slug}`}
                      onClick={closeDrawer}
                      className="text-sm hover:text-copper"
                    >
                      {item.name}
                    </Link>
                    {item.variantName && (
                      <p className="mt-1 text-xs text-aubergine/50">{item.variantName}</p>
                    )}
                    <p className="mt-1 text-sm">{formatPrice(item.price)}</p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="inline-flex items-center border border-stone">
                        <button
                          type="button"
                          className="h-8 w-8 text-sm"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1, item.variantId)
                          }
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-xs">{item.quantity}</span>
                        <button
                          type="button"
                          className="h-8 w-8 text-sm"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1, item.variantId)
                          }
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className="text-nav text-aubergine/40 hover:text-copper"
                        onClick={() => removeItem(item.productId, item.variantId)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-stone px-5 py-5">
            <div className="mb-4 flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeDrawer}
              className="flex w-full items-center justify-center px-7 py-3 text-[11px] uppercase tracking-nav bg-aubergine text-porcelain"
            >
              Checkout
            </Link>
            <Link
              href="/cart"
              onClick={closeDrawer}
              className="mt-3 block text-center text-nav text-aubergine/55 hover:text-copper"
            >
              View full cart
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
