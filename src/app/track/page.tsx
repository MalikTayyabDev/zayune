"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { readApiError } from "@/lib/api-error";
import { formatPrice } from "@/lib/utils";

type TrackResult = {
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  currency: string;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
  customerName: string;
  updatedAt?: string;
};

function TrackForm() {
  const params = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(params.get("order") || "");
  const [email, setEmail] = useState(params.get("email") || "");
  const [result, setResult] = useState<TrackResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const presetOrder = params.get("order");
    const presetEmail = params.get("email");
    if (presetOrder) setOrderNumber(presetOrder);
    if (presetEmail) setEmail(presetEmail);
  }, [params]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    const res = await fetch("/api/orders/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderNumber, email }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(readApiError(data, "Order not found"));
      return;
    }
    setResult(data);
  }

  const steps = ["PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED"];

  return (
    <div className="container-content max-w-narrow py-14 sm:py-20">
      <SectionHeading
        as="h1"
        title="Track your order"
        description="Enter your order number and email to see status and courier details."
      />

      <form onSubmit={onSubmit} className="mt-10 space-y-4">
        <label className="block">
          <span className="text-nav text-aubergine/55">Order number</span>
          <input
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            required
            placeholder="ZY-…"
            className="mt-2 w-full border border-stone px-4 py-3 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-nav text-aubergine/55">Email used at checkout</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-2 w-full border border-stone px-4 py-3 text-sm"
          />
        </label>
        {error && <p className="text-xs text-copper">{error}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? "Looking up…" : "Track order"}
        </Button>
      </form>

      {result && (
        <div className="mt-12 border border-stone p-6">
          <p className="text-nav text-aubergine/45">Order {result.orderNumber}</p>
          <h2 className="mt-2 font-display text-3xl">{result.status}</h2>
          <p className="mt-2 text-sm text-aubergine/60">
            Hi {result.customerName.split(" ")[0]} ·{" "}
            {formatPrice(result.total, result.currency)} · Payment{" "}
            {result.paymentStatus.replace("_", " ").toLowerCase()}
          </p>

          <ol className="mt-8 space-y-3">
            {steps.map((step) => {
              const currentIndex = steps.indexOf(result.status);
              const stepIndex = steps.indexOf(step);
              const done =
                result.status === "CANCELLED"
                  ? false
                  : stepIndex <= currentIndex && currentIndex >= 0;
              return (
                <li
                  key={step}
                  className={`flex items-center gap-3 text-sm ${
                    done ? "text-aubergine" : "text-aubergine/35"
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      done ? "bg-sage" : "bg-stone"
                    }`}
                  />
                  {step}
                </li>
              );
            })}
            {result.status === "CANCELLED" && (
              <li className="text-sm text-copper">Order cancelled</li>
            )}
          </ol>

          {result.trackingNumber && (
            <div className="mt-8 border-t border-stone pt-6 text-sm">
              <p className="text-nav text-aubergine/45 mb-2">Courier tracking</p>
              <p>{result.trackingNumber}</p>
              {result.trackingUrl && (
                <a
                  href={result.trackingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-copper"
                >
                  Open tracking page →
                </a>
              )}
            </div>
          )}

          <Link
            href={`/order/${result.orderNumber}/invoice?email=${encodeURIComponent(email)}`}
            className="mt-6 inline-block text-nav text-copper"
          >
            View / print invoice
          </Link>
        </div>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="container-content py-20" />}>
      <TrackForm />
    </Suspense>
  );
}
