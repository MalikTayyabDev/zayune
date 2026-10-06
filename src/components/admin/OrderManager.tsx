"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

const statuses = [
  "PENDING",
  "CONFIRMED",
  "PACKED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

const payments = [
  "UNPAID",
  "AWAITING_VERIFICATION",
  "PAID",
  "REFUNDED",
  "FAILED",
] as const;

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingNotes?: string | null;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
  adminNotes?: string | null;
  paymentRef?: string | null;
  paymentProofUrl?: string | null;
  subtotal: number;
  shippingFee: number;
  total: number;
  currency: string;
  items: Array<{
    id: string;
    name: string;
    variantName?: string | null;
    price: number;
    quantity: number;
  }>;
};

export function OrderManager({
  order,
  whatsappCustomerUrl,
  payUrl,
}: {
  order: Order;
  whatsappCustomerUrl?: string | null;
  payUrl?: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(order.status);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || "");
  const [trackingUrl, setTrackingUrl] = useState(order.trackingUrl || "");
  const [adminNotes, setAdminNotes] = useState(order.adminNotes || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function save() {
    setSaving(true);
    setMessage("");
    const res = await fetch(`/api/admin/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        paymentStatus,
        trackingNumber: trackingNumber || null,
        trackingUrl: trackingUrl || null,
        adminNotes: adminNotes || null,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      setMessage("Unable to save changes.");
      return;
    }
    setMessage("Saved.");
    router.refresh();
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
      <div className="space-y-8">
        <section className="border border-stone p-6">
          <h2 className="font-display text-2xl">Customer</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-aubergine/50">Name</dt>
              <dd>{order.customerName}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-aubergine/50">Email</dt>
              <dd>{order.customerEmail}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-aubergine/50">Phone</dt>
              <dd>{order.customerPhone}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-aubergine/50">Ship to</dt>
              <dd className="text-right">
                {order.shippingAddress}, {order.shippingCity}
              </dd>
            </div>
            {order.shippingNotes && (
              <div className="flex justify-between gap-4">
                <dt className="text-aubergine/50">Notes</dt>
                <dd className="text-right">{order.shippingNotes}</dd>
              </div>
            )}
          </dl>
        </section>

        <section className="border border-stone p-6">
          <h2 className="font-display text-2xl">Items</h2>
          <ul className="mt-4 divide-y divide-stone">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-4 py-3 text-sm">
                <span>
                  {item.name}
                  {item.variantName ? ` · ${item.variantName}` : ""} × {item.quantity}
                </span>
                <span>{formatPrice(item.price * item.quantity, order.currency)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1 border-t border-stone pt-4 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal, order.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{formatPrice(order.shippingFee, order.currency)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>{formatPrice(order.total, order.currency)}</span>
            </div>
          </div>
        </section>
      </div>

      <aside className="space-y-5 h-fit border border-stone p-6">
        <h2 className="font-display text-2xl">Fulfillment</h2>
        <label className="block text-sm">
          <span className="text-nav text-aubergine/50">Order status</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-2 w-full border border-stone px-3 py-2"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-nav text-aubergine/50">Payment</span>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="mt-2 w-full border border-stone px-3 py-2"
          >
            {payments.map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ")}
              </option>
            ))}
          </select>
        </label>
        <p className="text-xs text-aubergine/50">
          Method: {order.paymentMethod.replace("_", " ")}
          {order.paymentRef ? ` · Ref: ${order.paymentRef}` : ""}
        </p>
        {order.paymentProofUrl && (
          <a
            href={order.paymentProofUrl}
            target="_blank"
            rel="noreferrer"
            className="block text-nav text-copper"
          >
            View transfer receipt →
          </a>
        )}
        {order.paymentMethod === "BANK_TRANSFER" &&
          paymentStatus !== "PAID" && (
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              disabled={saving}
              onClick={async () => {
                setPaymentStatus("PAID");
                setStatus("CONFIRMED");
                setSaving(true);
                setMessage("");
                const res = await fetch(`/api/admin/orders/${order.id}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    status: "CONFIRMED",
                    paymentStatus: "PAID",
                    trackingNumber: trackingNumber || null,
                    trackingUrl: trackingUrl || null,
                    adminNotes: adminNotes || null,
                  }),
                });
                setSaving(false);
                if (!res.ok) {
                  setMessage("Unable to verify payment.");
                  return;
                }
                setMessage("Advance verified — marked Paid.");
                router.refresh();
              }}
            >
              Verify advance (mark Paid)
            </Button>
          )}
        <label className="block text-sm">
          <span className="text-nav text-aubergine/50">Tracking number</span>
          <input
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className="mt-2 w-full border border-stone px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="text-nav text-aubergine/50">Tracking URL</span>
          <input
            value={trackingUrl}
            onChange={(e) => setTrackingUrl(e.target.value)}
            className="mt-2 w-full border border-stone px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="text-nav text-aubergine/50">Admin notes</span>
          <textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            rows={3}
            className="mt-2 w-full border border-stone px-3 py-2"
          />
        </label>
        {message && <p className="text-xs text-aubergine/60">{message}</p>}
        <Button type="button" onClick={save} disabled={saving} className="w-full">
          {saving ? "Saving…" : "Update order"}
        </Button>
        {whatsappCustomerUrl && (
          <a
            href={whatsappCustomerUrl}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center justify-center bg-[#25D366] px-4 py-3 text-[11px] uppercase tracking-nav text-white"
          >
            WhatsApp customer (bank + link)
          </a>
        )}
        {payUrl && (
          <Link href={payUrl} target="_blank" className="block text-center text-nav text-copper">
            Customer pay / confirm link
          </Link>
        )}
        <Link
          href={`/order/${order.id}/invoice`}
          target="_blank"
          className="block text-center text-nav text-copper"
        >
          Open invoice
        </Link>
        <Link href={`/track?order=${order.orderNumber}`} className="block text-center text-nav">
          Customer tracking link
        </Link>
        <p className="text-[11px] leading-relaxed text-aubergine/45">
          Tip: when customer marks 30% advance sent, set Payment to{" "}
          <strong>Awaiting verification</strong>, then <strong>Paid</strong> after
          you verify the transfer.
        </p>
      </aside>
    </div>
  );
}
