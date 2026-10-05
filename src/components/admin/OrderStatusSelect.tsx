"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const statuses = [
  "PENDING",
  "CONFIRMED",
  "PACKED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

type Props = {
  orderId: string;
  status: string;
};

export function OrderStatusSelect({ orderId, status }: Props) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [saving, setSaving] = useState(false);

  async function onChange(next: string) {
    setValue(next);
    setSaving(true);
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <label className="block text-right">
      <span className="text-nav text-aubergine/45 block mb-2">
        Status{saving ? "…" : ""}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-stone bg-porcelain px-3 py-2 text-sm"
      >
        {statuses.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </label>
  );
}
