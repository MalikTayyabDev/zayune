"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useCartStore } from "@/lib/cart-store";
import { useWishlistStore } from "@/lib/wishlist-store";
import { formatPrice } from "@/lib/utils";

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const items = useWishlistStore((s) => s.items);
  const remove = useWishlistStore((s) => s.remove);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="container-content py-20" />;
  }

  return (
    <div className="container-content py-10 sm:py-20">
      <SectionHeading
        as="h1"
        title="Wishlist"
        description="Pieces you’re holding onto — move them to cart when you’re ready."
        className="mb-6 sm:mb-12"
      />

      {items.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm text-aubergine/60">Your wishlist is empty.</p>
          <Button href="/shop" className="mt-6">
            Browse the shop
          </Button>
        </div>
      ) : (
        <ul className="card-grid lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.productId} className="flex flex-col">
              <Link href={`/product/${item.slug}`} className="block">
                <div className="relative aspect-[4/5] overflow-hidden bg-stone/40">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, 33vw"
                    />
                  )}
                </div>
              </Link>
              <div className="mt-2 flex flex-1 flex-col sm:mt-4">
                <Link
                  href={`/product/${item.slug}`}
                  className="line-clamp-2 text-xs leading-snug hover:text-copper sm:text-sm"
                >
                  {item.name}
                </Link>
                <p className="mt-1 text-xs text-aubergine/70 sm:text-sm">
                  {formatPrice(item.price, item.currency)}
                </p>
                <div className="mt-auto flex flex-col gap-2 pt-2 sm:mt-4 sm:flex-row sm:gap-3">
                  <Button
                    type="button"
                    className="w-full px-4 py-2.5 text-[10px] sm:flex-1 sm:px-7 sm:py-3 sm:text-[11px]"
                    onClick={() =>
                      addItem({
                        productId: item.productId,
                        slug: item.slug,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                      })
                    }
                  >
                    Add
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full px-4 py-2.5 text-[10px] sm:w-auto sm:px-7 sm:py-3 sm:text-[11px]"
                    onClick={() => remove(item.productId)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
