"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type RecentProduct = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  currency: string;
};

type State = {
  items: RecentProduct[];
  add: (item: RecentProduct) => void;
};

export const useRecentlyViewed = create<State>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => {
        const next = [
          item,
          ...get().items.filter((i) => i.productId !== item.productId),
        ].slice(0, 8);
        set({ items: next });
      },
    }),
    { name: "zayune-recently-viewed" }
  )
);
