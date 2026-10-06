"use client";

import { Landmark, Mail, MessageCircle } from "lucide-react";
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
  payUrl: string;
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
  payUrl,
}: Props) {
  const [waUrl, setWaUrl] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem(`zayune_wa_${orderId}`);
    if (stored) {
      setWaUrl(stored);
      return;
    }
    const bankNote = isBank
      ? ` I will send 30% advance (Rs ${advanceAmount.toLocaleString("en-PK")}) via bank/Raast. Pay link: ${payUrl}`
      : ` Confirm link: ${payUrl}`;
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
    payUrl,
    total,
  ]);

  useEffect(() => {
    if (payUrl) {
      sessionStorage.setItem(`zayune_pay_${orderId}`, payUrl);
    }
  }, [orderId, payUrl]);

  return (
    <div className="mt-8 space-y-4 text-left">
      <div className="border border-brass/40 bg-brass/10 px-5 py-4">
        <p className="inline-flex items-center gap-2 text-nav text-aubergine">
          <Icon icon={Mail} size={14} className="text-copper" />
          Check your email
        </p>
        <p className="mt-2 text-sm leading-relaxed text-aubergine/75">
          We sent a confirmation to <strong>{customerEmail}</strong> with your
          secure pay/confirm link.
        </p>
      </div>

      <div className="border border-stone bg-porcelain px-5 py-4">
        <p className="inline-flex items-center gap-2 text-nav text-aubergine">
          <Icon icon={Landmark} size={14} className="text-copper" />
          {isBank ? "Pay 30% advance & confirm" : "Confirm your order"}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-aubergine/75">
          Open your secure link for bank/Raast details and the 30% advance (Rs{" "}
          {advanceAmount.toLocaleString("en-PK")}). Attach your transfer receipt,
          then tap “I’ve sent the 30% advance” — remaining 70% is due on delivery.
        </p>
        {payUrl && (
          <Button href={payUrl} className="mt-4 w-full sm:w-auto">
            Open bank details & attach receipt
          </Button>
        )}
      </div>

      <div className="border border-stone bg-porcelain px-5 py-4">
        <p className="inline-flex items-center gap-2 text-nav text-aubergine">
          <Icon icon={MessageCircle} size={14} className="text-copper" />
          WhatsApp ZAYUNE
        </p>
        <p className="mt-2 text-sm leading-relaxed text-aubergine/75">
          Message us with your order number
          {isBank ? " after you transfer the advance." : "."} We also email the
          studio a one-tap WhatsApp link to message you with bank details.
        </p>
        {waUrl && (
          <Button
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            variant="secondary"
            className="mt-4 w-full sm:w-auto"
          >
            WhatsApp to confirm order
          </Button>
        )}
        {isBank && (
          <p className="mt-3 text-xs leading-relaxed text-aubergine/55">
            Payment method: {paymentMethod.replace("_", " ")}. After you mark
            advance sent, status becomes Confirmed · Awaiting verification until
            we verify the transfer.
          </p>
        )}
      </div>
    </div>
  );
}
