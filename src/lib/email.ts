import { Resend } from "resend";
import type { OrderStatus } from "@prisma/client";
import { siteOrigin, storeFromEmail } from "@/lib/site";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function teamEmails() {
  const raw =
    process.env.ORDER_NOTIFY_EMAILS ||
    process.env.TEAM_NOTIFY_EMAILS ||
    process.env.NEXT_PUBLIC_STUDIO_EMAIL ||
    "store@zayune.com";
  return raw
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
}

async function safeSend(
  payload: {
    from: string;
    to: string | string[];
    subject: string;
    text: string;
    html?: string;
  },
  label: string
) {
  const resend = getResend();
  if (!resend) {
    console.info(`[email skipped] ${label}`, payload.subject);
    return;
  }
  try {
    await resend.emails.send(payload);
  } catch (error) {
    console.error(`[email failed] ${label}`, error);
  }
}

const statusCopy: Partial<Record<OrderStatus, string>> = {
  CONFIRMED:
    "Your order has been confirmed. We're preparing your piece with care.",
  PACKED: "Your order has been packed and is nearly on its way.",
  SHIPPED:
    "Your order has shipped. You'll receive tracking details separately if available.",
  DELIVERED:
    "Your order has been marked as delivered. We hope it feels as considered as it looks.",
  CANCELLED:
    "Your order has been cancelled. If this is unexpected, reply to this email or WhatsApp us.",
};

export async function sendOrderConfirmationEmail(input: {
  to: string;
  orderNumber: string;
  customerName: string;
  total: number;
  currency: string;
  paymentMethod?: string;
  advanceAmount?: number;
  itemsSummary?: string;
  payUrl?: string;
  whatsappCustomerUrl?: string | null;
}) {
  const from = storeFromEmail();
  const site = siteOrigin();
  const isBank = input.paymentMethod === "BANK_TRANSFER" || input.paymentMethod === "bank_transfer";
  const advance =
    input.advanceAmount ??
    (isBank ? Math.round(input.total * 0.3) : 0);

  const text = [
    `Dear ${input.customerName},`,
    "",
    "Thank you for your ZAYUNE order.",
    `Order number: ${input.orderNumber}`,
    `Total: ${input.total.toLocaleString("en-PK")} ${input.currency}`,
    input.itemsSummary ? `Items: ${input.itemsSummary}` : "",
    "",
    input.payUrl
      ? `Confirm / pay advance here (updates your order on the site):\n${input.payUrl}`
      : "Please keep your order number handy.",
    isBank
      ? [
          "",
          "Bank / Raast:",
          `Please transfer 30% advance (${advance.toLocaleString("en-PK")} ${input.currency}) to confirm your order.`,
          "Use your order number as the payment reference.",
          "Open the link above for full bank details, then tap “I’ve sent the 30% advance”.",
        ].join("\n")
      : "Open the confirmation link above to confirm your order.",
    "",
    `Track anytime: ${site}/track?order=${encodeURIComponent(input.orderNumber)}`,
    "",
    "Designed, not just made.",
    "— ZAYUNE",
  ]
    .filter(Boolean)
    .join("\n");

  await safeSend(
    {
      from,
      to: input.to,
      subject: `ZAYUNE — Order ${input.orderNumber} confirmed`,
      text,
    },
    "order confirmation"
  );

  const team = teamEmails();
  if (team.length) {
    await safeSend(
      {
        from,
        to: team,
        subject: `New order ${input.orderNumber} — ${input.customerName}`,
        text: [
          "New ZAYUNE order",
          `Order: ${input.orderNumber}`,
          `Customer: ${input.customerName}`,
          `Email: ${input.to}`,
          `Total: ${input.total.toLocaleString("en-PK")} ${input.currency}`,
          `Payment: ${input.paymentMethod || "n/a"}`,
          isBank ? `Advance due (30%): ${advance.toLocaleString("en-PK")} ${input.currency}` : "",
          input.itemsSummary ? `Items: ${input.itemsSummary}` : "",
          input.payUrl ? `Customer pay link: ${input.payUrl}` : "",
          input.whatsappCustomerUrl
            ? `WhatsApp customer (prefilled): ${input.whatsappCustomerUrl}`
            : "",
          `${site}/admin/orders`,
        ]
          .filter(Boolean)
          .join("\n"),
      },
      "team order notify"
    );
  }
}

export async function sendOrderStatusEmail(input: {
  to: string;
  orderNumber: string;
  customerName: string;
  status: OrderStatus;
}) {
  const from = storeFromEmail();
  const body = statusCopy[input.status];
  if (!body) return;

  await safeSend(
    {
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
    },
    "status update"
  );
}

export async function sendSupportTicketEmail(input: {
  to: string;
  name: string;
  ticketId: string;
  message: string;
  phone: string;
}) {
  const from = storeFromEmail();

  await safeSend(
    {
      from,
      to: input.to,
      subject: `ZAYUNE support ticket ${input.ticketId}`,
      text: [
        `Hi ${input.name},`,
        "",
        "We received your support request.",
        `Ticket: ${input.ticketId}`,
        "",
        "Our team will follow up on WhatsApp using the phone number you shared.",
        "Please keep an eye on your email and WhatsApp.",
        "",
        "— ZAYUNE Support",
      ].join("\n"),
    },
    "support customer"
  );

  const team = teamEmails();
  if (team.length) {
    await safeSend(
      {
        from,
        to: team,
        subject: `Support ticket ${input.ticketId} — ${input.name}`,
        text: [
          `Ticket: ${input.ticketId}`,
          `Name: ${input.name}`,
          `Email: ${input.to}`,
          `Phone: ${input.phone}`,
          "",
          input.message,
        ].join("\n"),
      },
      "support team"
    );
  }
}

export async function sendSubscribeEmail(input: {
  to: string;
  code: string;
}) {
  const from = storeFromEmail();
  await safeSend(
    {
      from,
      to: input.to,
      subject: "Your 5% ZAYUNE welcome code",
      text: [
        "Welcome to ZAYUNE.",
        "",
        `Use code ${input.code} at checkout for 5% off.`,
        "One-time use per email.",
        "",
        "— ZAYUNE",
      ].join("\n"),
    },
    "subscribe"
  );
}
