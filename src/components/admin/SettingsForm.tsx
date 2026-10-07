"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { readApiError } from "@/lib/api-error";

type Values = {
  shippingFlatFee: number;
  bannerText: string;
  bankName: string;
  bankAccountTitle: string;
  bankAccountNumber: string;
  bankIban: string;
};

export function SettingsForm({
  initial,
  adminEmailHint,
}: {
  initial: Values;
  adminEmailHint?: string;
}) {
  const [values, setValues] = useState(initial);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    setMessage(res.ok ? "Saved." : readApiError(data, "Unable to save"));
    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-5">
      <div className="border border-stone bg-stone/20 px-5 py-4 text-sm text-aubergine/70">
        <p className="text-nav text-aubergine/45">Admin login</p>
        <p className="mt-2 leading-relaxed">
          Change studio admin email/password in environment variables — not on
          this form:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
          <li>
            Local <code className="text-aubergine">.env</code>:{" "}
            <code className="text-aubergine">ADMIN_EMAIL</code>,{" "}
            <code className="text-aubergine">ADMIN_PASSWORD</code>
          </li>
          <li>
            Vercel → Project → Settings → Environment Variables → same keys →
            Redeploy
          </li>
        </ul>
        <p className="mt-2 text-xs text-aubergine/55">
          Current admin email:{" "}
          <span className="text-aubergine">
            {adminEmailHint || "set ADMIN_EMAIL on the server"}
          </span>
        </p>
      </div>
      <label className="block">
        <span className="text-nav text-aubergine/55">Flat shipping fee (PKR)</span>
        <input
          type="number"
          value={values.shippingFlatFee}
          onChange={(e) =>
            setValues((v) => ({ ...v, shippingFlatFee: Number(e.target.value) }))
          }
          className="mt-2 w-full border border-stone bg-transparent px-4 py-3 text-sm"
        />
      </label>
      <label className="block">
        <span className="text-nav text-aubergine/55">Banner text (optional)</span>
        <input
          value={values.bannerText}
          onChange={(e) => setValues((v) => ({ ...v, bannerText: e.target.value }))}
          className="mt-2 w-full border border-stone bg-transparent px-4 py-3 text-sm"
        />
      </label>
      <label className="block">
        <span className="text-nav text-aubergine/55">Bank name</span>
        <input
          value={values.bankName}
          onChange={(e) => setValues((v) => ({ ...v, bankName: e.target.value }))}
          className="mt-2 w-full border border-stone bg-transparent px-4 py-3 text-sm"
        />
      </label>
      <label className="block">
        <span className="text-nav text-aubergine/55">Account title</span>
        <input
          value={values.bankAccountTitle}
          onChange={(e) =>
            setValues((v) => ({ ...v, bankAccountTitle: e.target.value }))
          }
          className="mt-2 w-full border border-stone bg-transparent px-4 py-3 text-sm"
        />
      </label>
      <label className="block">
        <span className="text-nav text-aubergine/55">Account number</span>
        <input
          value={values.bankAccountNumber}
          onChange={(e) =>
            setValues((v) => ({ ...v, bankAccountNumber: e.target.value }))
          }
          className="mt-2 w-full border border-stone bg-transparent px-4 py-3 text-sm"
        />
      </label>
      <label className="block">
        <span className="text-nav text-aubergine/55">IBAN / Raast</span>
        <input
          value={values.bankIban}
          onChange={(e) => setValues((v) => ({ ...v, bankIban: e.target.value }))}
          className="mt-2 w-full border border-stone bg-transparent px-4 py-3 text-sm"
        />
      </label>
      {message && <p className="text-xs text-aubergine/60">{message}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "Saving…" : "Save settings"}
      </Button>
    </form>
  );
}
