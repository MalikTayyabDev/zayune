"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type Props = {
  productId: string;
  productName: string;
  variantId?: string;
};

export function WaitlistForm({ productId, productName, variantId }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, productId, variantId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to join waitlist");
      setStatus("done");
      setMessage(`You're on the list for ${productName}. We'll email you when it's back.`);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "done") {
    return <p className="text-sm text-sage leading-relaxed">{message}</p>;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 border border-stone bg-stone/20 p-4">
      <div>
        <p className="text-[10px] uppercase tracking-nav text-aubergine/45">
          Out of stock
        </p>
        <p className="mt-1 text-sm text-aubergine/75">
          Get notified when it&apos;s back — join the waitlist and we&apos;ll email you.
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          className="flex-1 border border-stone bg-porcelain px-4 py-3 text-sm outline-none focus:border-aubergine/40"
        />
        <Button type="submit" disabled={status === "loading"} className="sm:w-auto">
          {status === "loading" ? "Saving…" : "Get notified"}
        </Button>
      </div>
      {status === "error" && <p className="text-xs text-copper">{message}</p>}
    </form>
  );
}
