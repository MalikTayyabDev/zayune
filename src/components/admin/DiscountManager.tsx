"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  FormCheckbox,
  FormInput,
  FormSelect,
} from "@/components/ui/FormControls";

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
  usageType?: string;
  productIds?: string | null;
  description?: string | null;
};

export function DiscountManager({ discounts }: { discounts: Discount[] }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [type, setType] = useState<"PERCENT" | "FIXED">("PERCENT");
  const [value, setValue] = useState("10");
  const [minSubtotal, setMinSubtotal] = useState("0");
  const [usageType, setUsageType] = useState<
    "UNLIMITED" | "LIMITED" | "ONE_TIME" | "ONE_TIME_EMAIL"
  >("UNLIMITED");
  const [maxUses, setMaxUses] = useState("100");
  const [productIds, setProductIds] = useState("");
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
        usageType,
        maxUses:
          usageType === "LIMITED"
            ? Number(maxUses) || 1
            : usageType === "ONE_TIME"
              ? 1
              : null,
        productIds: productIds.trim()
          ? JSON.stringify(
              productIds
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            )
          : null,
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
    setProductIds("");
    setIsIntroOffer(false);
    setUsageType("UNLIMITED");
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
          <FormInput
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            required
          />
        </label>
        <label className="block">
          <span className="text-nav text-aubergine/55">Type</span>
          <FormSelect
            value={type}
            onChange={(e) => setType(e.target.value as "PERCENT" | "FIXED")}
          >
            <option value="PERCENT">Percent off</option>
            <option value="FIXED">Fixed PKR off</option>
          </FormSelect>
        </label>
        <label className="block">
          <span className="text-nav text-aubergine/55">Value</span>
          <FormInput
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />
        </label>
        <label className="block">
          <span className="text-nav text-aubergine/55">Min subtotal</span>
          <FormInput
            type="number"
            value={minSubtotal}
            onChange={(e) => setMinSubtotal(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="text-nav text-aubergine/55">Usage rule</span>
          <FormSelect
            value={usageType}
            onChange={(e) =>
              setUsageType(
                e.target.value as
                  | "UNLIMITED"
                  | "LIMITED"
                  | "ONE_TIME"
                  | "ONE_TIME_EMAIL"
              )
            }
          >
            <option value="UNLIMITED">Unlimited</option>
            <option value="LIMITED">Limited total uses</option>
            <option value="ONE_TIME">One-time globally</option>
            <option value="ONE_TIME_EMAIL">One-time per email</option>
          </FormSelect>
        </label>
        {usageType === "LIMITED" && (
          <label className="block">
            <span className="text-nav text-aubergine/55">Max uses</span>
            <FormInput
              type="number"
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
            />
          </label>
        )}
        <label className="block sm:col-span-2">
          <span className="text-nav text-aubergine/55">
            Product IDs (optional, comma-separated — leave blank for all)
          </span>
          <FormInput
            value={productIds}
            onChange={(e) => setProductIds(e.target.value)}
            placeholder="prod_xxx, prod_yyy"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-nav text-aubergine/55">Description</span>
          <FormInput
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <FormCheckbox
          className="sm:col-span-2"
          checked={isIntroOffer}
          onChange={(e) => setIsIntroOffer(e.target.checked)}
          label="Show as introductory offer in the announcement bar"
        />
        {error && (
          <p className="text-xs text-copper sm:col-span-2">{error}</p>
        )}
        <div className="sm:col-span-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving…" : "Create discount"}
          </Button>
        </div>
      </form>

      <div className="overflow-x-auto border border-stone">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone text-nav text-aubergine/45">
            <tr>
              <th className="p-4 font-normal">Code</th>
              <th className="p-4 font-normal">Value</th>
              <th className="p-4 font-normal">Usage</th>
              <th className="p-4 font-normal">Used</th>
              <th className="p-4 font-normal">Products</th>
              <th className="p-4 font-normal">Status</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((d) => (
              <tr key={d.id} className="border-b border-stone/70">
                <td className="p-4 font-medium">{d.code}</td>
                <td className="p-4">
                  {d.type === "PERCENT" ? `${d.value}%` : `Rs ${d.value}`}
                </td>
                <td className="p-4 text-aubergine/65">
                  {d.usageType || (d.maxUses == null ? "UNLIMITED" : "LIMITED")}
                </td>
                <td className="p-4">
                  {d.usedCount}
                  {d.maxUses != null ? ` / ${d.maxUses}` : ""}
                </td>
                <td className="p-4 text-aubergine/65">
                  {d.productIds ? "Specific" : "All"}
                </td>
                <td className="p-4">
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
