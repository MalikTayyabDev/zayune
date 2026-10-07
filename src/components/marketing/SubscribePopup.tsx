"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { FormInput } from "@/components/ui/FormControls";
import { readApiError } from "@/lib/api-error";

const STORAGE_KEY = "zayune_subscribe_dismissed";

export function SubscribePopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY)) return;
    const t = window.setTimeout(() => setOpen(true), 1800);
    return () => window.clearTimeout(t);
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(readApiError(data, "Unable to subscribe"));
      return;
    }
    setCode(data.code || "SUBSCRIBE5");
    setDone(true);
    localStorage.setItem(STORAGE_KEY, "1");
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-aubergine/45 p-4 sm:items-center">
      <div className="relative w-full max-w-md border border-stone bg-porcelain p-6 shadow-2xl sm:p-8">
        <button
          type="button"
          aria-label="Close"
          onClick={dismiss}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center text-aubergine"
        >
          <Icon icon={X} size={18} className="text-copper" />
        </button>

        {!done ? (
          <>
            <p className="text-nav text-copper">Welcome offer</p>
            <h2 className="mt-2 font-display text-3xl text-aubergine">
              Get 5% off
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-aubergine/65">
              Subscribe for a one-time code — use it once on your next order.
            </p>
            <form onSubmit={onSubmit} className="mt-6 space-y-3">
              <FormInput
                placeholder="Name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-0"
              />
              <FormInput
                required
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-0"
              />
              {error && <p className="text-xs text-copper">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-aubergine py-3 text-[11px] uppercase tracking-nav text-porcelain disabled:opacity-50"
              >
                {loading ? "Saving…" : "Unlock 5% off"}
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="text-nav text-copper">You’re in</p>
            <h2 className="mt-2 font-display text-3xl text-aubergine">
              Code {code}
            </h2>
            <p className="mt-3 text-sm text-aubergine/65">
              Check your email — this code is one-time use. Apply it at checkout.
            </p>
            <button
              type="button"
              onClick={dismiss}
              className="mt-6 w-full border border-aubergine py-3 text-[11px] uppercase tracking-nav"
            >
              Continue shopping
            </button>
          </>
        )}
      </div>
    </div>
  );
}
