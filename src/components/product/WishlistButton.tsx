"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { useWishlistStore } from "@/lib/wishlist-store";
import { cn } from "@/lib/utils";

type Props = {
  product: {
    productId: string;
    slug: string;
    name: string;
    price: number;
    image: string;
    currency: string;
  };
  className?: string;
  label?: boolean;
};

export function WishlistButton({ product, className, label = false }: Props) {
  const [mounted, setMounted] = useState(false);
  const toggle = useWishlistStore((s) => s.toggle);
  const has = useWishlistStore((s) => s.has(product.productId));

  useEffect(() => setMounted(true), []);

  const active = mounted && has;

  return (
    <button
      type="button"
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(product);
      }}
      className={cn(
        "inline-flex items-center gap-2 text-aubergine/70 transition-colors hover:text-copper",
        className
      )}
    >
      <Icon
        icon={Heart}
        size={15}
        className={cn(
          "text-current transition-colors",
          active && "fill-copper text-copper"
        )}
      />
      {label && (
        <span className="text-nav">{active ? "Saved" : "Wishlist"}</span>
      )}
    </button>
  );
}
