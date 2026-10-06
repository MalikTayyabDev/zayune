"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variantId?: string;
  variantName?: string;
  /** IN_STOCK | MADE_TO_ORDER — used for 30% advance / COD rules */
  fulfillment?: string;
};

type CartState = {
  items: CartItem[];
  discountCode: string;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  setDiscountCode: (code: string) => void;
  clearCart: () => void;
  itemCount: () => number;
  subtotal: () => number;
};

function sameLine(a: CartItem, productId: string, variantId?: string) {
  return a.productId === productId && (a.variantId || "") === (variantId || "");
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      discountCode: "",
      drawerOpen: false,
      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false }),
      addItem: (item) => {
        const qty = Math.min(20, Math.max(1, item.quantity || 1));
        set((state) => {
          const existing = state.items.find((i) =>
            sameLine(i, item.productId, item.variantId)
          );
          if (existing) {
            return {
              drawerOpen: true,
              items: state.items.map((i) =>
                sameLine(i, item.productId, item.variantId)
                  ? {
                      ...i,
                      ...item,
                      quantity: Math.min(20, i.quantity + qty),
                    }
                  : i
              ),
            };
          }
          return {
            drawerOpen: true,
            items: [
              ...state.items,
              {
                ...item,
                quantity: qty,
              },
            ],
          };
        });
      },
      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter((i) => !sameLine(i, productId, variantId)),
        }));
      },
      updateQuantity: (productId, quantity, variantId) => {
        // Never auto-remove on decrement — keep lines until Remove is used
        const nextQty = Math.min(20, Math.max(1, Math.floor(quantity)));
        set((state) => ({
          items: state.items.map((i) =>
            sameLine(i, productId, variantId) ? { ...i, quantity: nextQty } : i
          ),
        }));
      },
      setDiscountCode: (code) => set({ discountCode: code.trim().toUpperCase() }),
      clearCart: () => set({ items: [], discountCode: "" }),
      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "zayune-cart",
      partialize: (state) => ({
        items: state.items,
        discountCode: state.discountCode,
      }),
      merge: (persisted, current) => {
        const p = (persisted || {}) as Partial<CartState>;
        const items = Array.isArray(p.items)
          ? p.items
              .filter(
                (item) =>
                  item &&
                  typeof item.productId === "string" &&
                  typeof item.name === "string" &&
                  typeof item.price === "number" &&
                  item.quantity > 0
              )
              .map((item) => ({
                ...item,
                quantity: Math.min(20, Math.max(1, item.quantity)),
              }))
          : current.items;
        return {
          ...current,
          ...p,
          items,
          discountCode: typeof p.discountCode === "string" ? p.discountCode : "",
          drawerOpen: false,
        };
      },
    }
  )
);
