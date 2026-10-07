"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  FormInput,
  FormTextarea,
} from "@/components/ui/FormControls";
import { readApiError } from "@/lib/api-error";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ticketId, setTicketId] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(form.get("name") || ""),
        email: String(form.get("email") || ""),
        phone: String(form.get("phone") || ""),
        message: String(form.get("message") || ""),
        source: "contact",
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(readApiError(data, "Unable to send message."));
      return;
    }
    setTicketId(data.ticketId);
    e.currentTarget.reset();
  }

  if (ticketId) {
    return (
      <div className="mt-12 border border-stone bg-stone/20 px-6 py-8">
        <p className="text-nav text-aubergine/45">Sent</p>
        <h2 className="mt-2 font-display text-2xl text-aubergine">
          We’ve got your message
        </h2>
        <p className="mt-3 text-sm text-aubergine/70">
          Reference <span className="text-aubergine">{ticketId}</span>. A
          confirmation email is on its way — we’ll follow up soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-12 space-y-5">
      <p className="text-nav text-aubergine/45">Write to the studio</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormInput name="name" placeholder="Name" required />
        <FormInput name="email" type="email" placeholder="Email" required />
      </div>
      <FormInput name="phone" placeholder="WhatsApp / phone" required />
      <FormTextarea
        name="message"
        placeholder="How can we help?"
        rows={5}
        required
      />
      {error ? <p className="text-sm text-copper">{error}</p> : null}
      <Button type="submit" disabled={loading}>
        {loading ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
