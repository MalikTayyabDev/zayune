"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FormInput, FormSelect } from "@/components/ui/FormControls";
import { formatPrice } from "@/lib/utils";

export type ProductRow = {
  id: string;
  name: string;
  sku?: string | null;
  category: string;
  price: number;
  currency: string;
  variants: number;
  images: number;
  published: boolean;
  featured: boolean;
  fulfillment: string;
  stock: number | null;
  lowStock: boolean;
};

const LOW_STOCK_THRESHOLD = 3;

export function AdminProductTable({
  products,
  initialFilter = "all",
}: {
  products: ProductRow[];
  initialFilter?: string;
}) {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState(initialFilter);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products]
  );

  const lowCount = products.filter((p) => p.lowStock).length;

  const filtered = products.filter((p) => {
    if (category !== "all" && p.category !== category) return false;
    if (status === "published" && !p.published) return false;
    if (status === "draft" && p.published) return false;
    if (status === "featured" && !p.featured) return false;
    if (status === "low") {
      if (!p.lowStock) return false;
    }
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      if (
        !p.name.toLowerCase().includes(needle) &&
        !(p.sku || "").toLowerCase().includes(needle)
      )
        return false;
    }
    return true;
  });

  return (
    <div className="mt-8 space-y-4">
      {lowCount > 0 && status !== "low" && (
        <button
          type="button"
          onClick={() => setStatus("low")}
          className="w-full border border-copper/40 bg-copper/10 px-4 py-3 text-left text-sm text-aubergine"
        >
          <strong>{lowCount}</strong> product
          {lowCount === 1 ? "" : "s"} low on stock (≤{LOW_STOCK_THRESHOLD - 1}
          ). Tap to filter.
        </button>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        <FormInput
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name or SKU…"
          className="mt-0"
        />
        <FormSelect
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-0"
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </FormSelect>
        <FormSelect
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mt-0"
        >
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="featured">Featured</option>
          <option value="low">Low stock</option>
        </FormSelect>
      </div>

      <p className="text-xs text-aubergine/50">
        Showing {filtered.length} of {products.length}
      </p>

      <div className="overflow-x-auto border border-stone">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone text-nav text-aubergine/45">
            <tr>
              <th className="p-4 font-normal">Name</th>
              <th className="p-4 font-normal">SKU</th>
              <th className="p-4 font-normal">Category</th>
              <th className="p-4 font-normal">Price</th>
              <th className="p-4 font-normal">Stock</th>
              <th className="p-4 font-normal">Images</th>
              <th className="p-4 font-normal">Status</th>
              <th className="p-4 font-normal" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr
                key={product.id}
                className={
                  product.lowStock
                    ? "border-b border-stone/70 bg-copper/5"
                    : "border-b border-stone/70"
                }
              >
                <td className="p-4">
                  {product.name}
                  {product.lowStock && (
                    <span className="ml-2 text-[10px] uppercase tracking-nav text-copper">
                      Low
                    </span>
                  )}
                </td>
                <td className="p-4 text-xs text-aubergine/55">
                  {product.sku || "—"}
                </td>
                <td className="p-4 text-aubergine/65">{product.category}</td>
                <td className="p-4">
                  {formatPrice(product.price, product.currency)}
                </td>
                <td className="p-4">
                  {product.fulfillment === "MADE_TO_ORDER"
                    ? "MTO"
                    : product.stock == null
                      ? "—"
                      : product.stock}
                </td>
                <td className="p-4">{product.images}</td>
                <td className="p-4 text-aubergine/65">
                  {product.published ? "Live" : "Draft"}
                  {product.featured ? " · Featured" : ""}
                </td>
                <td className="p-4 text-right">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="text-nav text-copper"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-aubergine/50">
                  No products match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { LOW_STOCK_THRESHOLD };
