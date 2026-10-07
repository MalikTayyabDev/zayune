"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  FormInput,
  FormSelect,
  FormTextarea,
} from "@/components/ui/FormControls";

export function MarketingBroadcastForm() {
  const [audience, setAudience] = useState<"subscribers" | "customers" | "all">(
    "subscribers"
  );
  const [counts, setCounts] = useState({ subscribers: 0, customers: 0 });
  const [subject, setSubject] = useState("");
  const [headline, setHeadline] = useState("");
  const [body, setBody] = useState("");
  const [ctaLabel, setCtaLabel] = useState("Shop now");
  const [ctaUrl, setCtaUrl] = useState("https://zayune.com/shop");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    sent: number;
    failed: number;
    total: number;
  } | null>(null);

  useEffect(() => {
    fetch("/api/admin/marketing")
      .then((r) => r.json())
      .then((d) => {
        if (typeof d.subscribers === "number") {
          setCounts({
            subscribers: d.subscribers,
            customers: d.customers,
          });
        }
      })
      .catch(() => {});
  }, []);

  const audienceSize =
    audience === "subscribers"
      ? counts.subscribers
      : audience === "customers"
        ? counts.customers
        : counts.subscribers + counts.customers;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (
      !confirm(
        `Send this email to about ${audienceSize} recipient(s)? This cannot be undone.`
      )
    ) {
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    const res = await fetch("/api/admin/marketing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        audience,
        subject,
        headline,
        body,
        ctaLabel: ctaLabel || null,
        ctaUrl: ctaUrl || null,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Unable to send.");
      return;
    }
    setResult(data);
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-5">
      <div className="border border-stone bg-porcelain px-5 py-4 text-sm text-aubergine/70">
        <p>
          Newsletter subscribers:{" "}
          <span className="text-aubergine">{counts.subscribers}</span>
        </p>
        <p className="mt-1">
          Registered accounts:{" "}
          <span className="text-aubergine">{counts.customers}</span>
        </p>
      </div>

      <FormSelect
        value={audience}
        onChange={(e) =>
          setAudience(e.target.value as "subscribers" | "customers" | "all")
        }
      >
        <option value="subscribers">
          Subscribers only ({counts.subscribers})
        </option>
        <option value="customers">
          Registered customers ({counts.customers})
        </option>
        <option value="all">Everyone (merged, no duplicates)</option>
      </FormSelect>

      <FormInput
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Email subject"
        required
      />
      <FormInput
        value={headline}
        onChange={(e) => setHeadline(e.target.value)}
        placeholder="Headline inside the email"
        required
      />
      <FormTextarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Message body (use line breaks for paragraphs)"
        rows={8}
        required
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <FormInput
          value={ctaLabel}
          onChange={(e) => setCtaLabel(e.target.value)}
          placeholder="Button label (optional)"
        />
        <FormInput
          value={ctaUrl}
          onChange={(e) => setCtaUrl(e.target.value)}
          placeholder="Button URL (optional)"
        />
      </div>

      {error ? <p className="text-sm text-copper">{error}</p> : null}
      {result ? (
        <p className="text-sm text-sage">
          Sent {result.sent} of {result.total}
          {result.failed ? ` · ${result.failed} failed` : ""}.
        </p>
      ) : null}

      <Button type="submit" disabled={loading || audienceSize === 0}>
        {loading ? "Sending…" : `Send to ~${audienceSize}`}
      </Button>
    </form>
  );
}
