"use client";

import {
  Flower2,
  MessageSquare,
  Package,
  Percent,
  Send,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { FormCheckbox, FormInput, FormTextarea } from "@/components/ui/FormControls";
import { readApiError } from "@/lib/api-error";
import { cn } from "@/lib/utils";

type Msg = { role: "bot" | "user"; text: string };

const replies: { match: RegExp; answer: string }[] = [
  {
    match: /discount|coupon|code|welcome|offer/i,
    answer:
      "Try WELCOME10 for 10% off (intro), or SUBSCRIBE5 for 5% if you joined our list. Product-specific and one-time codes may also appear in admin promos.",
  },
  {
    match: /bundle|set|floral set/i,
    answer:
      "Bundles are marked on product cards. Browse Shop → look for the Bundle label, or open Studio Floral Set.",
  },
  {
    match: /flower|crochet flower|bloom/i,
    answer:
      "Crochet flowers live under Shop → Flowers. Custom colorways are available via /custom.",
  },
  {
    match: /jewel|earring|pendant/i,
    answer: "Jewelry is under Shop → Jewelry — earrings and quiet statement pieces.",
  },
  {
    match: /keychain|charm/i,
    answer: "Keychains are under Shop → Keychains — everyday charms from Rs 1,200.",
  },
  {
    match: /ship|delivery|cod|cash/i,
    answer:
      "We ship Pakistan-wide. COD is available in selected cities; bank/Raast needs 30% advance to confirm.",
  },
  {
    match: /custom|made to order|colour|color/i,
    answer:
      "Custom orders: open /custom, share your idea + a reference photo. We’ll quote before making.",
  },
  {
    match: /track|order status|where is/i,
    answer: "Use Track order in the menu with your order number + email.",
  },
];

export function SupportChat() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"chat" | "ticket" | "done">("chat");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "bot",
      text: "Hi — I’m the ZAYUNE studio assistant. Ask about products, discounts, bundles, shipping, or raise a ticket for a human on WhatsApp.",
    },
  ]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [details, setDetails] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [error, setError] = useState("");

  const quick = useMemo(
    () => [
      { icon: Percent, label: "Discounts", q: "What discount codes do you have?" },
      { icon: Package, label: "Bundles", q: "Tell me about bundles" },
      { icon: Flower2, label: "Flowers", q: "Where are crochet flowers?" },
    ],
    []
  );

  function ask(text: string) {
    const answer =
      replies.find((r) => r.match.test(text))?.answer ||
      "I can help with products, discounts, bundles, shipping, and custom orders. For anything else, raise a ticket — we’ll WhatsApp you.";
    setMessages((m) => [
      ...m,
      { role: "user", text },
      { role: "bot", text: answer },
    ]);
    setInput("");
  }

  async function submitTicket(e: React.FormEvent) {
    e.preventDefault();
    if (!agree) {
      setError("Please agree so we can contact you on WhatsApp.");
      return;
    }
    setLoading(true);
    setError("");
    const res = await fetch("/api/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, message: details || messages.map((m) => `${m.role}: ${m.text}`).join("\n") }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(readApiError(data, "Unable to create ticket"));
      return;
    }
    setTicketId(data.ticketId);
    setStep("done");
  }

  return (
    <>
      <button
        type="button"
        aria-label="Open studio chat"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 left-5 z-[55] flex h-14 w-14 items-center justify-center border border-aubergine/20 bg-porcelain text-aubergine shadow-lg transition hover:border-copper sm:bottom-8 sm:left-8"
      >
        <Icon icon={MessageSquare} size={22} className="text-copper" />
      </button>

      {open && (
        <div className="fixed bottom-24 left-5 z-[56] flex w-[min(100vw-2.5rem,22rem)] flex-col border border-stone bg-porcelain shadow-2xl sm:left-8">
          <div className="flex items-center justify-between bg-aubergine px-4 py-3 text-porcelain">
            <div>
              <p className="text-[10px] uppercase tracking-nav text-brass">Support</p>
              <p className="font-display text-lg">Studio chat</p>
            </div>
            <button type="button" aria-label="Close chat" onClick={() => setOpen(false)}>
              <Icon icon={X} size={18} className="text-porcelain" />
            </button>
          </div>

          {step === "chat" && (
            <>
              <div className="flex max-h-72 flex-col gap-3 overflow-y-auto px-4 py-4">
                {messages.map((m, i) => (
                  <div
                    key={`${m.role}-${i}`}
                    className={cn(
                      "max-w-[90%] px-3 py-2 text-xs leading-relaxed",
                      m.role === "bot"
                        ? "self-start bg-stone/40 text-aubergine"
                        : "self-end bg-aubergine text-porcelain"
                    )}
                  >
                    {m.text}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 border-t border-stone px-3 py-2">
                {quick.map((q) => (
                  <button
                    key={q.label}
                    type="button"
                    onClick={() => ask(q.q)}
                    className="inline-flex items-center gap-1 border border-stone px-2 py-1 text-[10px] uppercase tracking-nav text-aubergine/70 hover:border-copper"
                  >
                    <Icon icon={q.icon} size={11} className="text-copper" />
                    {q.label}
                  </button>
                ))}
              </div>
              <form
                className="flex gap-2 border-t border-stone p-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (input.trim()) ask(input.trim());
                }}
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about products…"
                  className="flex-1 border border-stone bg-transparent px-3 py-2 text-sm outline-none focus:border-aubergine/40"
                />
                <button
                  type="submit"
                  className="inline-flex h-10 w-10 items-center justify-center bg-aubergine text-porcelain"
                  aria-label="Send"
                >
                  <Icon icon={Send} size={16} className="text-brass" />
                </button>
              </form>
              <button
                type="button"
                onClick={() => setStep("ticket")}
                className="border-t border-stone px-4 py-3 text-center text-[10px] uppercase tracking-nav text-copper"
              >
                Talk to a human — raise ticket
              </button>
            </>
          )}

          {step === "ticket" && (
            <form onSubmit={submitTicket} className="space-y-3 px-4 py-4">
              <p className="text-xs text-aubergine/65">
                Share your details. We’ll email your ticket ID and continue on WhatsApp.
              </p>
              <FormInput required placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="mt-0" />
              <FormInput required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-0" />
              <FormInput required placeholder="Phone / WhatsApp" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-0" />
              <FormTextarea rows={3} placeholder="How can we help?" value={details} onChange={(e) => setDetails(e.target.value)} className="mt-0" />
              <FormCheckbox
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                label="Contact me on WhatsApp about this ticket"
              />
              {error && <p className="text-xs text-copper">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-aubergine py-3 text-[10px] uppercase tracking-nav text-porcelain disabled:opacity-50"
              >
                {loading ? "Sending…" : "Submit ticket"}
              </button>
              <button type="button" onClick={() => setStep("chat")} className="w-full text-[10px] uppercase tracking-nav text-aubergine/50">
                Back to chat
              </button>
            </form>
          )}

          {step === "done" && (
            <div className="space-y-3 px-4 py-6 text-sm text-aubergine/75">
              <p className="font-display text-2xl text-aubergine">Ticket raised</p>
              <p>
                Check your email for ticket <strong>{ticketId}</strong>. We’ll reach you on WhatsApp shortly.
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-full border border-stone py-3 text-[10px] uppercase tracking-nav"
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
