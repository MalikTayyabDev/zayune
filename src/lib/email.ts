import { Resend } from "resend";
import type { OrderStatus } from "@prisma/client";
import {
  advanceNotifyTeamHtml,
  customRequestCustomerHtml,
  customRequestStatusHtml,
  customRequestTeamHtml,
  marketingBroadcastHtml,
  orderConfirmationCustomerHtml,
  orderConfirmationTeamHtml,
  orderStatusCustomerHtml,
  statusEmailCopy,
  statusLabels,
  subscribeWelcomeHtml,
  supportCustomerHtml,
  supportTeamHtml,
  waitlistJoinedHtml,
  waitlistRestockHtml,
  welcomeAccountHtml,
} from "@/lib/email-templates";
import { siteConfig, siteOrigin, storeFromEmail } from "@/lib/site";

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
  const isBank =
    input.paymentMethod === "BANK_TRANSFER" ||
    input.paymentMethod === "bank_transfer";
  const advance =
    input.advanceAmount ?? (isBank ? Math.round(input.total * 0.3) : 0);
  const trackUrl = `${site}/track?order=${encodeURIComponent(input.orderNumber)}`;

  const text = [
    `Dear ${input.customerName},`,
    "",
    "Thank you for your ZAYUNE order.",
    `Order number: ${input.orderNumber}`,
    `Total: ${input.total.toLocaleString("en-PK")} ${input.currency}`,
    input.itemsSummary ? `Items: ${input.itemsSummary}` : "",
    "",
    input.payUrl
      ? `Confirm / pay advance here:\n${input.payUrl}`
      : "Please keep your order number handy.",
    isBank
      ? [
          "",
          "Bank / Raast:",
          `Please transfer 30% advance (${advance.toLocaleString("en-PK")} ${input.currency}) to confirm your order.`,
          "Use your order number as the payment reference.",
        ].join("\n")
      : "",
    "",
    `Track anytime: ${trackUrl}`,
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
      html: orderConfirmationCustomerHtml({
        customerName: input.customerName,
        orderNumber: input.orderNumber,
        total: input.total,
        currency: input.currency,
        itemsSummary: input.itemsSummary,
        isBank,
        advance,
        payUrl: input.payUrl,
        trackUrl,
      }),
    },
    "order confirmation"
  );

  const team = teamEmails();
  if (team.length) {
    const teamText = [
      "New ZAYUNE order",
      `Order: ${input.orderNumber}`,
      `Customer: ${input.customerName}`,
      `Email: ${input.to}`,
      `Total: ${input.total.toLocaleString("en-PK")} ${input.currency}`,
      `Payment: ${input.paymentMethod || "n/a"}`,
      isBank
        ? `Advance due (30%): ${advance.toLocaleString("en-PK")} ${input.currency}`
        : "",
      input.itemsSummary ? `Items: ${input.itemsSummary}` : "",
      input.payUrl ? `Customer pay link: ${input.payUrl}` : "",
      input.whatsappCustomerUrl
        ? `WhatsApp customer: ${input.whatsappCustomerUrl}`
        : "",
      `${site}/admin/orders`,
    ]
      .filter(Boolean)
      .join("\n");

    await safeSend(
      {
        from,
        to: team,
        subject: `New order ${input.orderNumber} — ${input.customerName}`,
        text: teamText,
        html: orderConfirmationTeamHtml({
          customerName: input.customerName,
          customerEmail: input.to,
          orderNumber: input.orderNumber,
          total: input.total,
          currency: input.currency,
          paymentMethod: input.paymentMethod,
          itemsSummary: input.itemsSummary,
          isBank,
          advance,
          payUrl: input.payUrl,
          whatsappCustomerUrl: input.whatsappCustomerUrl,
          adminUrl: `${site}/admin/orders`,
        }),
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
  const copy = statusEmailCopy[input.status];
  if (!copy) return;
  const site = siteOrigin();
  const trackUrl = `${site}/track?order=${encodeURIComponent(input.orderNumber)}`;
  const contactUrl = `${site}/contact`;
  const statusLabel = statusLabels[input.status] || input.status;
  const subject = `ZAYUNE — Order ${input.orderNumber} ${copy.subjectSuffix}`;

  await safeSend(
    {
      from,
      to: input.to,
      subject,
      text: [
        `Dear ${input.customerName},`,
        "",
        copy.message,
        "",
        `Order number: ${input.orderNumber}`,
        `Status: ${statusLabel}`,
        "",
        input.status === "CANCELLED"
          ? `Contact us: ${contactUrl}`
          : `Track: ${trackUrl}`,
        "",
        `Follow us on Instagram: ${siteConfig.instagramHandle}`,
        "",
        "— ZAYUNE",
      ].join("\n"),
      html: orderStatusCustomerHtml({
        customerName: input.customerName,
        orderNumber: input.orderNumber,
        status: input.status,
        trackUrl,
        contactUrl,
      }),
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
  source?: "support" | "contact";
}) {
  const from = storeFromEmail();
  const source = input.source || "support";
  const isContact = source === "contact";

  await safeSend(
    {
      from,
      to: input.to,
      subject: isContact
        ? `ZAYUNE — We received your message`
        : `ZAYUNE support ticket ${input.ticketId}`,
      text: [
        `Hi ${input.name},`,
        "",
        isContact
          ? "Thanks for writing to ZAYUNE. We’ve received your message."
          : "We received your support request.",
        `${isContact ? "Reference" : "Ticket"}: ${input.ticketId}`,
        "",
        "We’ll follow up on email or WhatsApp soon.",
        "",
        "— ZAYUNE",
      ].join("\n"),
      html: supportCustomerHtml({
        name: input.name,
        ticketId: input.ticketId,
        source,
      }),
    },
    isContact ? "contact customer" : "support customer"
  );

  const team = teamEmails();
  if (team.length) {
    await safeSend(
      {
        from,
        to: team,
        subject: isContact
          ? `Contact message ${input.ticketId} — ${input.name}`
          : `Support ticket ${input.ticketId} — ${input.name}`,
        text: [
          `${isContact ? "Reference" : "Ticket"}: ${input.ticketId}`,
          `Name: ${input.name}`,
          `Email: ${input.to}`,
          `Phone: ${input.phone}`,
          "",
          input.message,
        ].join("\n"),
        html: supportTeamHtml({
          name: input.name,
          email: input.to,
          phone: input.phone,
          ticketId: input.ticketId,
          message: input.message,
          source,
        }),
      },
      isContact ? "contact team" : "support team"
    );
  }
}

export async function sendSubscribeEmail(input: {
  to: string;
  code: string;
}) {
  const from = storeFromEmail();
  const shopUrl = `${siteOrigin()}/shop`;
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
      html: subscribeWelcomeHtml({ code: input.code, shopUrl }),
    },
    "subscribe"
  );
}

export async function sendAdvanceNotifyEmail(input: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  paymentRef?: string | null;
  paymentProofUrl?: string | null;
}) {
  const from = storeFromEmail();
  const team = teamEmails();
  if (!team.length) return;
  const adminUrl = `${siteOrigin()}/admin/orders`;

  await safeSend(
    {
      from,
      to: team,
      subject: `Advance marked paid — ${input.orderNumber}`,
      text: [
        `${input.customerName} marked 30% advance as sent.`,
        `Order: ${input.orderNumber}`,
        `Email: ${input.customerEmail}`,
        input.paymentRef ? `Reference: ${input.paymentRef}` : "",
        input.paymentProofUrl ? `Receipt: ${input.paymentProofUrl}` : "",
        `Verify in admin: ${adminUrl}`,
      ]
        .filter(Boolean)
        .join("\n"),
      html: advanceNotifyTeamHtml({
        ...input,
        adminUrl,
      }),
    },
    "advance notify"
  );
}

export async function sendCustomRequestEmails(input: {
  to: string;
  name: string;
  phone: string;
  requestId: string;
  pieceType: string;
  colors: string;
  occasion: string;
  budget: string;
  details: string;
  neededBy?: string | null;
}) {
  const from = storeFromEmail();
  const site = siteOrigin();

  await safeSend(
    {
      from,
      to: input.to,
      subject: "ZAYUNE — Custom request received",
      text: [
        `Dear ${input.name},`,
        "",
        "We’ve received your custom request and will review it carefully.",
        `Reference: ${input.requestId}`,
        `Piece: ${input.pieceType}`,
        "",
        "— ZAYUNE",
      ].join("\n"),
      html: customRequestCustomerHtml({
        name: input.name,
        requestId: input.requestId,
        pieceType: input.pieceType,
      }),
    },
    "custom request customer"
  );

  const team = teamEmails();
  if (team.length) {
    await safeSend(
      {
        from,
        to: team,
        subject: `Custom request — ${input.name}`,
        text: [
          `Reference: ${input.requestId}`,
          `Name: ${input.name}`,
          `Email: ${input.to}`,
          `Phone: ${input.phone}`,
          `Piece: ${input.pieceType}`,
          `Colors: ${input.colors}`,
          `Occasion: ${input.occasion}`,
          `Budget: ${input.budget}`,
          input.neededBy ? `Needed by: ${input.neededBy}` : "",
          "",
          input.details,
          "",
          `${site}/admin/custom-requests`,
        ]
          .filter(Boolean)
          .join("\n"),
        html: customRequestTeamHtml({
          ...input,
          email: input.to,
          adminUrl: `${site}/admin/custom-requests`,
        }),
      },
      "custom request team"
    );
  }
}

const customStatusCopy: Record<
  string,
  { label: string; message: string; subjectSuffix: string }
> = {
  NEW: {
    label: "Received",
    subjectSuffix: "received",
    message:
      "Your custom request is in our queue and will be reviewed by the studio soon.",
  },
  REVIEWING: {
    label: "Under review",
    subjectSuffix: "is under review",
    message:
      "We’re reviewing your custom request now — checking feasibility, materials, and timing.",
  },
  QUOTED: {
    label: "Quote ready",
    subjectSuffix: "quote is ready",
    message:
      "Your custom quote is ready. We’ll share details on WhatsApp so you can decide on next steps.",
  },
  CLOSED: {
    label: "Closed",
    subjectSuffix: "was closed",
    message:
      "This custom request has been closed. If you’d like to reopen or start a new one, reply or message us anytime.",
  },
};

export async function sendCustomRequestStatusEmail(input: {
  to: string;
  name: string;
  requestId: string;
  status: string;
}) {
  const copy = customStatusCopy[input.status];
  if (!copy) return;
  const from = storeFromEmail();

  await safeSend(
    {
      from,
      to: input.to,
      subject: `ZAYUNE — Custom request ${copy.subjectSuffix}`,
      text: [
        `Dear ${input.name},`,
        "",
        copy.message,
        `Reference: ${input.requestId}`,
        `Status: ${copy.label}`,
        "",
        "— ZAYUNE",
      ].join("\n"),
      html: customRequestStatusHtml({
        name: input.name,
        requestId: input.requestId,
        statusLabel: copy.label,
        message: copy.message,
      }),
    },
    "custom request status"
  );
}

export async function sendWaitlistJoinedEmail(input: {
  to: string;
  productName: string;
  productUrl: string;
}) {
  const from = storeFromEmail();
  await safeSend(
    {
      from,
      to: input.to,
      subject: `ZAYUNE — You’re on the waitlist for ${input.productName}`,
      text: [
        `You’re on the waitlist for ${input.productName}.`,
        "We’ll email you when it’s available again.",
        input.productUrl,
        "",
        "— ZAYUNE",
      ].join("\n"),
      html: waitlistJoinedHtml({
        email: input.to,
        productName: input.productName,
        productUrl: input.productUrl,
      }),
    },
    "waitlist joined"
  );
}

export async function sendWaitlistRestockEmail(input: {
  to: string;
  productName: string;
  productUrl: string;
}) {
  const from = storeFromEmail();
  await safeSend(
    {
      from,
      to: input.to,
      subject: `ZAYUNE — ${input.productName} is back`,
      text: [
        `${input.productName} is back in stock.`,
        input.productUrl,
        "",
        "— ZAYUNE",
      ].join("\n"),
      html: waitlistRestockHtml(input),
    },
    "waitlist restock"
  );
}

export async function sendWelcomeAccountEmail(input: {
  to: string;
  name: string;
}) {
  const from = storeFromEmail();
  const site = siteOrigin();
  await safeSend(
    {
      from,
      to: input.to,
      subject: "Welcome to ZAYUNE — your account is ready",
      text: [
        `Dear ${input.name},`,
        "",
        "Welcome to ZAYUNE. Your account is ready.",
        `${site}/account`,
        "",
        "— ZAYUNE",
      ].join("\n"),
      html: welcomeAccountHtml({
        name: input.name,
        accountUrl: `${site}/account`,
        shopUrl: `${site}/shop`,
      }),
    },
    "welcome account"
  );
}

export async function sendMarketingBroadcast(input: {
  to: string[];
  subject: string;
  headline: string;
  body: string;
  ctaLabel?: string;
  ctaUrl?: string;
}) {
  const from = storeFromEmail();
  const unique = Array.from(
    new Set(input.to.map((e) => e.toLowerCase().trim()).filter(Boolean))
  );
  let sent = 0;
  let failed = 0;

  const html = marketingBroadcastHtml({
    headline: input.headline,
    body: input.body,
    ctaLabel: input.ctaLabel,
    ctaUrl: input.ctaUrl,
  });
  const text = [
    input.headline,
    "",
    input.body,
    input.ctaUrl ? `\n${input.ctaLabel || "Open"}: ${input.ctaUrl}` : "",
    "",
    "— ZAYUNE",
  ]
    .filter(Boolean)
    .join("\n");

  // Send in small batches to stay within Resend rate limits
  const chunkSize = 8;
  for (let i = 0; i < unique.length; i += chunkSize) {
    const chunk = unique.slice(i, i + chunkSize);
    await Promise.all(
      chunk.map(async (to) => {
        const resend = getResend();
        if (!resend) {
          failed += 1;
          return;
        }
        try {
          await resend.emails.send({
            from,
            to,
            subject: input.subject,
            text,
            html,
          });
          sent += 1;
        } catch (error) {
          console.error("[email failed] marketing", to, error);
          failed += 1;
        }
      })
    );
  }

  return { sent, failed, total: unique.length };
}
