"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

type Discount = {
  id: string;
  code: string;
  type: string;
  value: number;
  minSubtotal: number;
  maxUses: number | null;
  usedCount: number;
  active: boolean;
  isIntroOffer: boolean;
  description?: string | null;
};

export function DiscountManager({ discounts }: { discounts: Discount[] }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [type, setType] = useState<"PERCENT" | "FIXED">("PERCENT");
  const [value, setValue] = useState("10");
  const [minSubtotal, setMinSubtotal] = useState("0");
  const [isIntroOffer, setIsIntroOffer] = useState(false);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function createDiscount(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/discounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        type,
        value: Number(value),
        minSubtotal: Number(minSubtotal) || 0,
        active: true,
        isIntroOffer,
        description: description || null,
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Unable to create");
      return;
    }
    setCode("");
    setDescription("");
    setIsIntroOffer(false);
    router.refresh();
  }

  return (
    <div className="mt-10 space-y-10">
      <form
        onSubmit={createDiscount}
        className="grid gap-4 border border-stone p-6 sm:grid-cols-2"
      >
        <h2 className="font-display text-2xl sm:col-span-2">New discount</h2>
        <label className="block">
          <span className="text-nav text-aubergine/55">Code</span>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            required
            className="mt-2 w-full border border-stone px-4 py-3 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-nav text-aubergine/55">Type</span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "PERCENT" | "FIXED")}
            className="mt-2 w-full border border-stone px-4 py-3 text-sm"
          >
            <option value="PERCENT">Percent off</option>
            <option value="FIXED">Fixed PKR off</option>
          </select>
        </label>
        <label className="block">
          <span className="text-nav text-aubergine/55">Value</span>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
            className="mt-2 w-full border border-stone px-4 py-3 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-nav text-aubergine/55">Min subtotal</span>
          <input
            type="number"
            value={minSubtotal}
            onChange={(e) => setMinSubtotal(e.target.value)}
            className="mt-2 w-full border border-stone px-4 py-3 text-sm"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-nav text-aubergine/55">Description</span>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-2 w-full border border-stone px-4 py-3 text-sm"
          />
        </label>
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input
            type="checkbox"
            checked={isIntroOffer}
            onChange={(e) => setIsIntroOffer(e.target.checked)}
          />
          Show as introductory offer in the announcement bar
        </label>
        {error && <p className="text-xs text-copper sm:col-span-2">{error}</p>}
        <Button type="submit" disabled={loading} className="sm:col-span-2 w-fit">
          {loading ? "Creating…" : "Create discount"}
        </Button>
      </form>

      <div className="overflow-x-auto border border-stone">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone text-nav text-aubergine/45">
            <tr>
              <th className="p-4 font-normal">Code</th>
              <th className="p-4 font-normal">Offer</th>
              <th className="p-4 font-normal">Uses</th>
              <th className="p-4 font-normal">Flags</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((d) => (
              <tr key={d.id} className="border-b border-stone/70">
                <td className="p-4 font-medium">{d.code}</td>
                <td className="p-4">
                  {d.type === "PERCENT" ? `${d.value}%` : `PKR ${d.value}`}
                  {d.minSubtotal > 0 ? ` · min ${d.minSubtotal}` : ""}
                  {d.description ? (
                    <span className="mt-1 block text-xs text-aubergine/50">
                      {d.description}
                    </span>
                  ) : null}
                </td>
                <td className="p-4">
                  {d.usedCount}
                  {d.maxUses != null ? ` / ${d.maxUses}` : ""}
                </td>
                <td className="p-4 text-xs text-aubergine/60">
                  {d.active ? "Active" : "Off"}
                  {d.isIntroOffer ? " · Intro" : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
