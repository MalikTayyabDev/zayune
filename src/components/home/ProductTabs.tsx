"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Flower2,
  Sparkles,
  Star,
  Heart,
} from "lucide-react";
import { CopperStar } from "@/components/brand/CopperStar";
import { ProductCard } from "@/components/product/ProductCard";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  oneLiner: string;
  images: { url: string; alt: string }[];
  category: { name: string };
  variants?: { id: string; name: string; swatchHex?: string | null }[];
};

type Tab = {
  id: string;
  label: string;
  products: Product[];
};

type Props = {
  tabs: Tab[];
};

const tabIcons: Record<string, typeof Star> = {
  "best-sellers": Star,
  new: Sparkles,
  featured: Flower2,
  "also-like": Heart,
};

export function ProductTabs({ tabs }: Props) {
  const [active, setActive] = useState(tabs[0]?.id || "");
  const current = tabs.find((t) => t.id === active) || tabs[0];

  if (!current) return null;

  return (
    <section className="container-content py-10 sm:py-20">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-nav inline-flex items-center gap-2 text-aubergine/50">
            <CopperStar size={10} />
            Crochet handmade edit
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl">
            Shop the accessories
          </h2>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-nav text-copper hover:text-aubergine"
        >
          View full shop
          <Icon icon={ArrowRight} size={14} className="text-current" />
        </Link>
      </div>

      <div
        className="mt-8 flex gap-1 overflow-x-auto border-b border-stone pb-px"
        role="tablist"
      >
        {tabs.map((tab) => {
          const TabIcon = tabIcons[tab.id] || Flower2;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active === tab.id}
              onClick={() => setActive(tab.id)}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 px-4 py-3 text-nav transition-colors",
                active === tab.id
                  ? "border-b-2 border-aubergine text-aubergine"
                  : "text-aubergine/45 hover:text-aubergine"
              )}
            >
              <Icon
                icon={TabIcon}
                size={14}
                className={active === tab.id ? "text-copper" : "text-current"}
              />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        className="card-grid mt-6 sm:mt-10 lg:grid-cols-4"
        key={current.id}
      >
        {current.products.map((product) => (
          <ProductCard key={product.id} product={product} showQuickAdd />
        ))}
      </div>
    </section>
  );
}
