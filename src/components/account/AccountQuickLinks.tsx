"use client";

import Link from "next/link";
import {
  Flower2,
  Heart,
  PackageSearch,
  ShoppingBag,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { useWishlistStore } from "@/lib/wishlist-store";

const links = [
  {
    href: "/wishlist",
    label: "Wishlist",
    description: "Saved pieces",
    icon: Heart,
    countKey: "wishlist" as const,
  },
  {
    href: "/shop",
    label: "Shop",
    description: "Browse the edit",
    icon: ShoppingBag,
  },
  {
    href: "/custom",
    label: "Custom",
    description: "Request a piece",
    icon: Flower2,
  },
  {
    href: "/track",
    label: "Track order",
    description: "Shipping updates",
    icon: PackageSearch,
  },
];

export function AccountQuickLinks() {
  const [mounted, setMounted] = useState(false);
  const wishCount = useWishlistStore((s) => s.items.length);

  useEffect(() => setMounted(true), []);

  return (
    <div className="card-grid-stat lg:grid-cols-4">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="group flex min-h-[5.5rem] flex-col border border-stone bg-porcelain p-3 transition hover:border-aubergine/35 sm:min-h-0 sm:p-5"
        >
          <div className="flex items-start justify-between gap-2">
            <Icon
              icon={link.icon}
              size={16}
              className="text-copper transition group-hover:text-aubergine sm:hidden"
            />
            <Icon
              icon={link.icon}
              size={18}
              className="hidden text-copper transition group-hover:text-aubergine sm:block"
            />
            {link.countKey === "wishlist" && mounted && wishCount > 0 && (
              <span className="text-[10px] uppercase tracking-nav text-aubergine/50 sm:text-nav">
                {wishCount}
              </span>
            )}
          </div>
          <p className="mt-2 text-[10px] uppercase tracking-nav text-aubergine/45 sm:mt-4 sm:text-nav">
            {link.label}
          </p>
          <p className="mt-0.5 line-clamp-2 font-body text-xs leading-snug text-aubergine sm:mt-1 sm:text-sm sm:leading-normal">
            {link.description}
          </p>
        </Link>
      ))}
    </div>
  );
}
