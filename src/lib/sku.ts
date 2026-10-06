/** Generate a unique product SKU, e.g. ZY-BLOOM-K3F9A2 */
export function generateProductSku(nameOrSlug: string) {
  const base = nameOrSlug
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "")
    .slice(0, 8) || "ITEM";
  const suffix = Date.now().toString(36).toUpperCase().slice(-5);
  return `ZY-${base}-${suffix}`;
}

/** Variant SKU from product SKU + variant name */
export function generateVariantSku(productSku: string, variantName: string) {
  const part = variantName
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "")
    .slice(0, 6) || "VAR";
  return `${productSku}-${part}`;
}
