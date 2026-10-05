"use client";

import { useEffect } from "react";
import { useRecentlyViewed } from "@/lib/recently-viewed";

type Props = {
  product: {
    productId: string;
    slug: string;
    name: string;
    price: number;
    image: string;
    currency: string;
  };
};

export function RecentlyViewedTracker({ product }: Props) {
  const add = useRecentlyViewed((s) => s.add);

  useEffect(() => {
    add(product);
    // Track once per product view
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.productId]);

  return null;
}
