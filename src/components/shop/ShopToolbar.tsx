"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SearchBar } from "@/components/layout/SearchBar";

const sorts = [
  { value: "featured", label: "Featured" },
  { value: "best-sellers", label: "Best sellers" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to high" },
  { value: "price-desc", label: "Price: High to low" },
  { value: "name", label: "Name A–Z" },
];

export function ShopToolbar({ total }: { total: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const sort = params.get("sort") || "featured";
  const q = params.get("q") || "";
  const availability = params.get("availability") || "all";

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (!value || value === "all" || (key === "sort" && value === "featured")) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    const query = next.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className="mt-8 space-y-4 border-y border-stone py-5">
      <SearchBar defaultValue={q} className="max-w-xl" />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-nav text-aubergine/45">
          {total} {total === 1 ? "piece" : "pieces"}
          {q ? ` for “${q}”` : ""}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <select
            value={availability}
            onChange={(e) => update("availability", e.target.value)}
            className="border border-stone bg-transparent px-3 py-2 text-sm"
          >
            <option value="all">All availability</option>
            <option value="in-stock">In stock</option>
            <option value="made-to-order">Made to order</option>
          </select>
          <select
            value={sort}
            onChange={(e) => update("sort", e.target.value)}
            className="border border-stone bg-transparent px-3 py-2 text-sm"
          >
            {sorts.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
