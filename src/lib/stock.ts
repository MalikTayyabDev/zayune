export type Stockable = {
  fulfillment?: string | null;
  stock?: number | null;
  variants?: { stock?: number | null }[] | null;
};

/** True when the product (or selected variant) can be purchased. */
export function isAvailable(
  product: Stockable,
  selectedStock?: number | null
): boolean {
  if (product.fulfillment === "MADE_TO_ORDER") return true;
  if (selectedStock != null) return selectedStock > 0;
  if (product.stock != null) return product.stock > 0;
  const variants = product.variants || [];
  if (variants.length > 0) {
    return variants.some((v) => (v.stock ?? 0) > 0);
  }
  // IN_STOCK with unknown stock — treat as unavailable (matches PDP)
  return false;
}

export function isOutOfStock(product: Stockable, selectedStock?: number | null) {
  return !isAvailable(product, selectedStock);
}

export function maxPurchasableQty(
  product: Stockable,
  selectedStock?: number | null
): number {
  if (product.fulfillment === "MADE_TO_ORDER") return 20;
  const stock =
    selectedStock != null
      ? selectedStock
      : product.stock != null
        ? product.stock
        : 0;
  return Math.max(0, Math.min(20, stock));
}
