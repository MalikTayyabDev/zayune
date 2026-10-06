"use client";

import { Mail, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { siteConfig } from "@/lib/site";

type Props = {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  paymentMethod: string;
  isBank: boolean;
  advanceAmount: number;
};

export function OrderNextSteps({
  orderId,
  orderNumber,
  customerName,
  customerEmail,
  total,
  paymentMethod,
  isBank,
  advanceAmount,
}: Props) {
  const [waUrl, setWaUrl] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem(`zayune_wa_${orderId}`);
    if (stored) {
      setWaUrl(stored);
      return;
    }
    const bankNote = isBank
      ? ` I will send 30% advance (Rs ${advanceAmount.toLocaleString("en-PK")}) via bank/Raast with reference ${orderNumber}.`
      : "";
    const text = `Hi ZAYUNE, this is ${customerName}. Please confirm my order ${orderNumber} (total Rs ${total.toLocaleString("en-PK")}).${bankNote}`;
    setWaUrl(
      `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(text)}`
    );
  }, [
    advanceAmount,
    customerName,
    isBank,
    orderId,
    orderNumber,
    total,
  ]);

  return (
    <div className="mt-8 space-y-4 text-left">
      <div className="border border-brass/40 bg-brass/10 px-5 py-4">
        <p className="inline-flex items-center gap-2 text-nav text-aubergine">
          <Icon icon={Mail} size={14} className="text-copper" />
          Check your email
        </p>
        <p className="mt-2 text-sm leading-relaxed text-aubergine/75">
          We sent a confirmation to <strong>{customerEmail}</strong>. Please open
          it and keep your order number handy. If it doesn’t arrive in a few
          minutes, check spam.
        </p>
      </div>

      <div className="border border-stone bg-porcelain px-5 py-4">
        <p className="inline-flex items-center gap-2 text-nav text-aubergine">
          <Icon icon={MessageCircle} size={14} className="text-copper" />
          Confirm on WhatsApp
        </p>
        <p className="mt-2 text-sm leading-relaxed text-aubergine/75">
          In Pakistan, orders move faster when you confirm on WhatsApp. Tap below
          to message us with your order number
          {isBank
            ? ` and arrange the 30% advance (Rs ${advanceAmount.toLocaleString("en-PK")}).`
            : "."}
        </p>
        {waUrl && (
          <Button
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 w-full sm:w-auto"
          >
            WhatsApp to confirm order
          </Button>
        )}
        {isBank && (
          <p className="mt-3 text-xs leading-relaxed text-aubergine/55">
            Payment method: {paymentMethod.replace("_", " ")}. Your order stays
            awaiting verification until the advance transfer is confirmed.
          </p>
        )}
      </div>
    </div>
  );
}
