"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WishlistEntry = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  currency: string;
};

type WishlistState = {
  items: WishlistEntry[];
  toggle: (item: WishlistEntry) => void;
  remove: (productId: string) => void;
  has: (productId: string) => boolean;
  count: () => number;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (item) => {
        const exists = get().items.some((i) => i.productId === item.productId);
        set({
          items: exists
            ? get().items.filter((i) => i.productId !== item.productId)
            : [...get().items, item],
        });
      },
      remove: (productId) =>
        set({ items: get().items.filter((i) => i.productId !== productId) }),
      has: (productId) => get().items.some((i) => i.productId === productId),
      count: () => get().items.length,
    }),
    { name: "zayune-wishlist" }
  )
);
