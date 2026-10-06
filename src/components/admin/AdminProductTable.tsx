"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FormInput, FormSelect } from "@/components/ui/FormControls";
import { formatPrice } from "@/lib/utils";

type Row = {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  variants: number;
  images: number;
  published: boolean;
  featured: boolean;
};

export function AdminProductTable({ products }: { products: Row[] }) {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products]
  );

  const filtered = products.filter((p) => {
    if (category !== "all" && p.category !== category) return false;
    if (status === "published" && !p.published) return false;
    if (status === "draft" && p.published) return false;
    if (status === "featured" && !p.featured) return false;
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      if (!p.name.toLowerCase().includes(needle)) return false;
    }
    return true;
  });

  return (
    <div className="mt-8 space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <FormInput
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products…"
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
              <th className="p-4 font-normal">Category</th>
              <th className="p-4 font-normal">Price</th>
              <th className="p-4 font-normal">Variants</th>
              <th className="p-4 font-normal">Images</th>
              <th className="p-4 font-normal">Status</th>
              <th className="p-4 font-normal" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product.id} className="border-b border-stone/70">
                <td className="p-4">{product.name}</td>
                <td className="p-4 text-aubergine/65">{product.category}</td>
                <td className="p-4">
                  {formatPrice(product.price, product.currency)}
                </td>
                <td className="p-4">{product.variants}</td>
                <td className="p-4">{product.images}</td>
                <td className="p-4 text-aubergine/65">
                  {product.published ? "Published" : "Draft"}
                  {product.featured ? " · Featured" : ""}
                </td>
                <td className="p-4 text-right">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="text-nav text-copper hover:text-aubergine"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-aubergine/50">
                  No products match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
