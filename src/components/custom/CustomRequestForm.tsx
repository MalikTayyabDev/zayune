"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  BUDGET_RANGES,
  OCCASIONS,
  PIECE_TYPES,
  buildWhatsAppCustomMessage,
} from "@/lib/custom-requests";

export function CustomRequestForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<{
    name: string;
    pieceType: string;
    colors: string;
    details: string;
    budget: string;
  } | null>(null);

  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);

    const payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      pieceType: String(form.get("pieceType") || ""),
      colors: String(form.get("colors") || ""),
      details: String(form.get("details") || ""),
      occasion: String(form.get("occasion") || ""),
      budget: String(form.get("budget") || ""),
      neededBy: String(form.get("neededBy") || "") || null,
      referenceUrl: String(form.get("referenceUrl") || "") || null,
    };

    try {
      const res = await fetch("/api/custom-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to submit request");
      }
      setDone({
        name: payload.name,
        pieceType: payload.pieceType,
        colors: payload.colors,
        details: payload.details,
        budget: payload.budget,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    const waText = encodeURIComponent(buildWhatsAppCustomMessage(done));
    return (
      <div className="border border-stone bg-stone/20 p-8 text-center">
        <p className="text-nav text-aubergine/50">Request received</p>
        <h3 className="mt-3 font-display text-2xl text-aubergine">
          Thank you, {done.name.split(" ")[0]}
        </h3>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-aubergine/70">
          We’ll review your idea and reply by email or WhatsApp with a quote and
          timeline. No payment is due until you approve the plan.
        </p>
        <Button
          href={`https://wa.me/${whatsapp}?text=${waText}`}
          target="_blank"
          rel="noreferrer"
          className="mt-8"
        >
          Continue on WhatsApp
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 border border-stone p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" required />
        <Field label="Email" name="email" type="email" required />
      </div>
      <Field label="WhatsApp / phone" name="phone" required />

      <label className="block">
        <span className="text-nav text-aubergine/55">Piece type</span>
        <select
          name="pieceType"
          required
          defaultValue=""
          className="mt-2 w-full border border-stone bg-transparent px-4 py-3 text-sm outline-none focus:border-aubergine/40"
        >
          <option value="" disabled>
            Select a type
          </option>
          {PIECE_TYPES.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      <Field
        label="Color preferences"
        name="colors"
        required
        placeholder="e.g. soft blush, brass accents, sage"
      />

      <label className="block">
        <span className="text-nav text-aubergine/55">Inspiration / details</span>
        <textarea
          name="details"
          required
          minLength={10}
          rows={4}
          placeholder="Describe the piece, size vibes, names to include, or anything we should know."
          className="mt-2 w-full border border-stone bg-transparent px-4 py-3 text-sm outline-none focus:border-aubergine/40"
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-nav text-aubergine/55">Occasion</span>
          <select
            name="occasion"
            required
            defaultValue="personal"
            className="mt-2 w-full border border-stone bg-transparent px-4 py-3 text-sm outline-none focus:border-aubergine/40"
          >
            {OCCASIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-nav text-aubergine/55">Budget range</span>
          <select
            name="budget"
            required
            defaultValue="2_4k"
            className="mt-2 w-full border border-stone bg-transparent px-4 py-3 text-sm outline-none focus:border-aubergine/40"
          >
            {BUDGET_RANGES.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Needed by (optional)" name="neededBy" type="date" />
        <Field
          label="Reference link (optional)"
          name="referenceUrl"
          type="url"
          placeholder="Instagram or Pinterest URL"
        />
      </div>

      {error && (
        <p className="text-xs text-copper" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Sending…" : "Send custom request"}
      </Button>
      <p className="text-[11px] leading-relaxed text-aubergine/45">
        We’ll quote first — no checkout required for custom pieces.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-nav text-aubergine/55">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full border border-stone bg-transparent px-4 py-3 text-sm outline-none focus:border-aubergine/40"
      />
    </label>
  );
}
