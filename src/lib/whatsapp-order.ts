import { getBankDetails, formatAdvance } from "@/lib/bank-details";
import { siteConfig } from "@/lib/site";

/** Normalize PK phone to WhatsApp international digits (no +). */
export function normalizeWhatsAppPhone(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("92") && digits.length >= 12) return digits;
  if (digits.startsWith("0") && digits.length === 11) return `92${digits.slice(1)}`;
  if (digits.length === 10 && digits.startsWith("3")) return `92${digits}`;
  if (digits.length >= 10) return digits;
  return null;
}

export function buildCustomerOrderWhatsAppText(input: {
  customerName: string;
  orderNumber: string;
  total: number;
  currency?: string;
  paymentMethod: string;
  payUrl: string;
}) {
  const currency = input.currency || "PKR";
  const isBank =
    input.paymentMethod === "BANK_TRANSFER" ||
    input.paymentMethod === "bank_transfer";
  const advance = formatAdvance(input.total);
  const bank = getBankDetails();
  // Bank (and made-to-order forced to bank) always get 30% instructions
  const needsAdvance = isBank;

  const lines = [
    `Hi ${input.customerName.split(" ")[0]},`,
    "",
    `Thank you for your ZAYUNE order ${input.orderNumber}.`,
    `Total: Rs ${input.total.toLocaleString("en-PK")} ${currency}`,
    "",
    needsAdvance
      ? [
          `To confirm your order, please pay 30% advance: Rs ${advance.toLocaleString("en-PK")}`,
          "(Required for bank payments and made-to-order / custom pieces.)",
          "",
          "Bank / Raast:",
          `${bank.accountTitle}`,
          `${bank.bankName}`,
          `Account: ${bank.accountNumber}`,
          `IBAN / Raast: ${bank.iban}`,
          `Reference: ${input.orderNumber}`,
          "",
          "Open this link to confirm & mark your advance paid (updates your order on the site):",
          input.payUrl,
        ].join("\n")
      : [
          "Open this link to confirm your order on the site:",
          input.payUrl,
        ].join("\n"),
    "",
    "Designed, not just made. — ZAYUNE",
  ];

  return lines.join("\n");
}

/** Prefill WhatsApp chat TO the customer (studio opens this). */
export function whatsappToCustomerUrl(phone: string, text: string) {
  const normalized = normalizeWhatsAppPhone(phone);
  if (!normalized) return null;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(text)}`;
}

/** Prefill WhatsApp chat TO the studio (customer opens this). */
export function whatsappToStudioUrl(text: string) {
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(text)}`;
}

/**
 * Optional Meta WhatsApp Cloud API send.
 * Set WHATSAPP_CLOUD_TOKEN + WHATSAPP_PHONE_NUMBER_ID to enable auto-send.
 */
export async function sendWhatsAppCloudMessage(input: {
  toPhone: string;
  text: string;
}): Promise<{ sent: boolean; error?: string }> {
  const token = process.env.WHATSAPP_CLOUD_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const to = normalizeWhatsAppPhone(input.toPhone);

  if (!token || !phoneNumberId || !to) {
    return { sent: false, error: "WhatsApp Cloud API not configured" };
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type: "text",
          text: { preview_url: true, body: input.text },
        }),
      }
    );
    if (!res.ok) {
      const err = await res.text();
      console.error("[whatsapp cloud]", err);
      return { sent: false, error: "WhatsApp send failed" };
    }
    return { sent: true };
  } catch (error) {
    console.error("[whatsapp cloud]", error);
    return { sent: false, error: "WhatsApp send failed" };
  }
}
