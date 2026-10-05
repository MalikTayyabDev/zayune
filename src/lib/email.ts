import { Resend } from "resend";
import type { OrderStatus } from "@prisma/client";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

const statusCopy: Partial<Record<OrderStatus, string>> = {
  CONFIRMED: "Your order has been confirmed. We're preparing your piece with care.",
  PACKED: "Your order has been packed and is nearly on its way.",
  SHIPPED: "Your order has shipped. You'll receive tracking details separately if available.",
  DELIVERED: "Your order has been marked as delivered. We hope it feels as considered as it looks.",
  CANCELLED: "Your order has been cancelled. If this is unexpected, reply to this email.",
};

export async function sendOrderConfirmationEmail(input: {
  to: string;
  orderNumber: string;
  customerName: string;
  total: number;
  currency: string;
}) {
  const resend = getResend();
  const from = process.env.RESEND_FROM_EMAIL || "orders@zayune.com";

  if (!resend) {
    console.info("[email skipped] order confirmation", input.orderNumber);
    return;
  }

  await resend.emails.send({
    from,
    to: input.to,
    subject: `ZAYUNE — Order ${input.orderNumber}`,
    text: [
      `Dear ${input.customerName},`,
      "",
      "Thank you for your order.",
      `Order number: ${input.orderNumber}`,
      `Total: ${input.total.toLocaleString("en-PK")} ${input.currency}`,
      "",
      "Designed, not just made.",
      "— ZAYUNE",
    ].join("\n"),
  });
}

export async function sendOrderStatusEmail(input: {
  to: string;
  orderNumber: string;
  customerName: string;
  status: OrderStatus;
}) {
  const resend = getResend();
  const from = process.env.RESEND_FROM_EMAIL || "orders@zayune.com";
  const body = statusCopy[input.status];

  if (!body) return;

  if (!resend) {
    console.info("[email skipped] status update", input.orderNumber, input.status);
    return;
  }

  await resend.emails.send({
    from,
    to: input.to,
    subject: `ZAYUNE — Order ${input.orderNumber} update`,
    text: [
      `Dear ${input.customerName},`,
      "",
      body,
      `Order number: ${input.orderNumber}`,
      "",
      "— ZAYUNE",
    ].join("\n"),
  });
}
