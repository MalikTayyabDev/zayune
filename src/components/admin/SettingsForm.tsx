"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { readApiError } from "@/lib/api-error";

type StoreMode = "LIVE" | "COMING_SOON";

type Values = {
  storeMode: StoreMode;
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

      <fieldset className="border border-stone px-5 py-4">
        <legend className="text-nav px-1 text-aubergine/55">Store status</legend>
        <p className="text-xs leading-relaxed text-aubergine/60">
          Like WooCommerce “Coming soon” — hide the catalog on shop and home
          until you’re ready to go live. Custom orders and WhatsApp stay
          available.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {(
            [
              {
                value: "COMING_SOON" as const,
                label: "Coming soon",
                hint: "Show “Products coming soon” on shop & home",
              },
              {
                value: "LIVE" as const,
                label: "Live",
                hint: "Show the product catalog to customers",
              },
            ] as const
          ).map((option) => {
            const active = values.storeMode === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  setValues((v) => ({ ...v, storeMode: option.value }))
                }
                className={`border px-4 py-3 text-left transition-colors ${
                  active
                    ? "border-brass bg-brass/10 text-aubergine"
                    : "border-stone text-aubergine/70 hover:border-brass/50"
                }`}
              >
                <span className="block text-sm font-medium">{option.label}</span>
                <span className="mt-1 block text-xs text-aubergine/55">
                  {option.hint}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

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
