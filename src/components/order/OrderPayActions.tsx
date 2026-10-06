"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

type Props = {
  token: string;
  isBank: boolean;
  alreadyConfirmed: boolean;
  advanceMarked: boolean;
};

export function OrderPayActions({
  token,
  isBank,
  alreadyConfirmed,
  advanceMarked,
}: Props) {
  const router = useRouter();
  const [paymentRef, setPaymentRef] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(action: "confirm_order" | "mark_advance_sent") {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/orders/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          action,
          paymentRef: paymentRef || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to update order");
      setMessage(data.message || "Updated.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (message) {
    return (
      <div className="border border-sage/40 bg-sage/10 px-5 py-4 text-sm text-aubergine/80">
        {message}
      </div>
    );
  }

  if (isBank) {
    if (advanceMarked || alreadyConfirmed) {
      return (
        <p className="text-sm text-aubergine/65">
          {advanceMarked
            ? "Advance marked as sent — we’re verifying your transfer."
            : "This order is already confirmed."}
        </p>
      );
    }

    return (
      <div className="space-y-4">
        <label className="block">
          <span className="text-nav text-aubergine/55">
            Transfer reference (optional)
          </span>
          <input
            value={paymentRef}
            onChange={(e) => setPaymentRef(e.target.value)}
            placeholder="Raast / bank reference"
            className="mt-2 w-full border border-stone bg-porcelain px-4 py-3 text-sm outline-none focus:border-aubergine/40"
          />
        </label>
        <Button
          type="button"
          disabled={loading}
          onClick={() => submit("mark_advance_sent")}
          className="w-full"
        >
          {loading ? "Updating…" : "I’ve sent the 30% advance"}
        </Button>
        <p className="text-xs text-aubergine/50">
          This confirms your order on the site and notifies ZAYUNE to verify the
          payment.
        </p>
        {error && <p className="text-xs text-copper">{error}</p>}
      </div>
    );
  }

  if (alreadyConfirmed) {
    return (
      <p className="text-sm text-aubergine/65">This order is already confirmed.</p>
    );
  }

  return (
    <div className="space-y-3">
      <Button
        type="button"
        disabled={loading}
        onClick={() => submit("confirm_order")}
        className="w-full"
      >
        {loading ? "Confirming…" : "Confirm my order"}
      </Button>
      {error && <p className="text-xs text-copper">{error}</p>}
    </div>
  );
}
