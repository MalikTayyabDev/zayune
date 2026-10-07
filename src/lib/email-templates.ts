import { siteConfig, siteOrigin } from "@/lib/site";

const colors = {
  aubergine: "#2A1F2D",
  porcelain: "#F4EEE6",
  copper: "#B85F45",
  sage: "#7F8B78",
  brass: "#B79B63",
  stone: "#D7CEC3",
  white: "#FFFFFF",
  muted: "#5C5260",
};

function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function money(amount: number, currency: string) {
  return `${amount.toLocaleString("en-PK")} ${esc(currency)}`;
}

function ctaButton(href: string, label: string) {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 8px;">
      <tr>
        <td align="center" bgcolor="${colors.aubergine}" style="border-radius:2px;">
          <a href="${esc(href)}" target="_blank"
            style="display:inline-block;padding:14px 28px;font-family:Georgia,'Times New Roman',serif;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;text-decoration:none;color:${colors.porcelain};">
            ${esc(label)}
          </a>
        </td>
      </tr>
    </table>`;
}

function secondaryLink(href: string, label: string) {
  return `
    <p style="margin:12px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:13px;">
      <a href="${esc(href)}" style="color:${colors.copper};text-decoration:none;letter-spacing:0.06em;">${esc(label)} →</a>
    </p>`;
}

function detailRow(label: string, value: string) {
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid ${colors.stone};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:${colors.muted};width:38%;vertical-align:top;">
        ${esc(label)}
      </td>
      <td style="padding:10px 0;border-bottom:1px solid ${colors.stone};font-family:Georgia,'Times New Roman',serif;font-size:15px;color:${colors.aubergine};vertical-align:top;">
        ${value}
      </td>
    </tr>`;
}

/** Shared ZAYUNE shell — table layout for email clients. */
export function emailLayout(input: {
  preheader?: string;
  eyebrow: string;
  title: string;
  bodyHtml: string;
}) {
  const site = siteOrigin();
  const preheader = input.preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;mso-hide:all;">${esc(input.preheader)}</div>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <title>${esc(input.title)}</title>
</head>
<body style="margin:0;padding:0;background:${colors.porcelain};">
  ${preheader}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${colors.porcelain};">
    <tr>
      <td align="center" style="padding:36px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:${colors.white};border:1px solid ${colors.stone};">
          <tr>
            <td align="center" style="padding:28px 32px 22px;border-bottom:1px solid ${colors.stone};background:linear-gradient(180deg, ${colors.porcelain} 0%, ${colors.white} 100%);">
              <a href="${esc(site)}" target="_blank" style="text-decoration:none;">
                <img
                  src="${esc(`${site}/logo.png`)}"
                  width="120"
                  height="132"
                  alt="ZAYUNE"
                  style="display:block;margin:0 auto;width:120px;height:auto;border:0;outline:none;"
                />
              </a>
              <p style="margin:14px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:13px;font-style:italic;color:${colors.copper};">
                ${esc(siteConfig.tagline)}
              </p>
            </td>
          </tr>
          <tr>
            <td style="height:3px;background:${colors.copper};font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:${colors.sage};">
                ${esc(input.eyebrow)}
              </p>
              <h1 style="margin:10px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:normal;line-height:1.25;color:${colors.aubergine};">
                ${esc(input.title)}
              </h1>
              <div style="margin-top:22px;font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.7;color:${colors.aubergine};">
                ${input.bodyHtml}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:22px 32px;background:${colors.aubergine};">
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:13px;color:${colors.porcelain};">
                Designed, not just made.
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:16px 0 0;">
                <tr>
                  <td valign="middle" style="padding-right:10px;">
                    <a href="${esc(siteConfig.instagram)}" target="_blank" style="text-decoration:none;">
                      <img
                        src="${esc(`${site}/instagram-icon.png`)}"
                        width="22"
                        height="22"
                        alt="Instagram"
                        style="display:block;width:22px;height:22px;border:0;outline:none;"
                      />
                    </a>
                  </td>
                  <td valign="middle">
                    <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:12px;color:${colors.stone};">
                      Follow us on Instagram
                    </p>
                    <p style="margin:4px 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;letter-spacing:0.08em;">
                      <a href="${esc(siteConfig.instagram)}" target="_blank" style="color:${colors.brass};text-decoration:none;">
                        ${esc(siteConfig.instagramHandle)}
                      </a>
                    </p>
                  </td>
                </tr>
              </table>
              <p style="margin:16px 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:11px;letter-spacing:0.1em;color:${colors.stone};">
                <a href="${esc(site)}" style="color:${colors.brass};text-decoration:none;">zayune.com</a>
                &nbsp;·&nbsp;
                <a href="mailto:${esc(siteConfig.email)}" style="color:${colors.brass};text-decoration:none;">${esc(siteConfig.email)}</a>
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:18px 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:11px;color:${colors.muted};">
          You’re receiving this because of activity on ZAYUNE.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function orderConfirmationCustomerHtml(input: {
  customerName: string;
  orderNumber: string;
  total: number;
  currency: string;
  itemsSummary?: string;
  isBank: boolean;
  advance: number;
  payUrl?: string;
  trackUrl: string;
}) {
  const rows = [
    detailRow("Order", esc(input.orderNumber)),
    detailRow("Total", money(input.total, input.currency)),
  ];
  if (input.itemsSummary) {
    rows.push(detailRow("Items", esc(input.itemsSummary)));
  }
  if (input.isBank) {
    rows.push(
      detailRow(
        "Advance due",
        `${money(input.advance, input.currency)} <span style="color:${colors.muted};font-size:13px;">(30%)</span>`
      )
    );
  }

  const body = `
    <p style="margin:0 0 18px;">Dear ${esc(input.customerName)},</p>
    <p style="margin:0 0 18px;">Thank you for your ZAYUNE order. We’ve received it and will take care of the next steps with the same attention we give every piece.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 4px;">
      ${rows.join("")}
    </table>
    ${
      input.payUrl
        ? ctaButton(
            input.payUrl,
            input.isBank ? "Pay 30% advance" : "Confirm order"
          )
        : ""
    }
    ${
      input.isBank
        ? `<p style="margin:16px 0 0;color:${colors.muted};font-size:14px;">Transfer the advance using your order number as the reference, then mark it sent on the payment page.</p>`
        : ""
    }
    ${secondaryLink(input.trackUrl, "Track your order")}`;

  return emailLayout({
    preheader: `Order ${input.orderNumber} — thank you for shopping ZAYUNE`,
    eyebrow: "Order confirmation",
    title: "Your order is with us",
    bodyHtml: body,
  });
}

export function orderConfirmationTeamHtml(input: {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  total: number;
  currency: string;
  paymentMethod?: string;
  itemsSummary?: string;
  isBank: boolean;
  advance: number;
  payUrl?: string;
  whatsappCustomerUrl?: string | null;
  adminUrl: string;
}) {
  const rows = [
    detailRow("Order", esc(input.orderNumber)),
    detailRow("Customer", `${esc(input.customerName)}<br/><span style="font-size:13px;color:${colors.muted};">${esc(input.customerEmail)}</span>`),
    detailRow("Total", money(input.total, input.currency)),
    detailRow("Payment", esc(input.paymentMethod || "n/a")),
  ];
  if (input.isBank) {
    rows.push(detailRow("Advance due", money(input.advance, input.currency)));
  }
  if (input.itemsSummary) {
    rows.push(detailRow("Items", esc(input.itemsSummary)));
  }

  const body = `
    <p style="margin:0 0 18px;">A new order is waiting in the studio inbox.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      ${rows.join("")}
    </table>
    ${ctaButton(input.adminUrl, "Open admin orders")}
    ${input.payUrl ? secondaryLink(input.payUrl, "Customer pay link") : ""}
    ${
      input.whatsappCustomerUrl
        ? secondaryLink(input.whatsappCustomerUrl, "WhatsApp customer")
        : ""
    }`;

  return emailLayout({
    preheader: `New order ${input.orderNumber} from ${input.customerName}`,
    eyebrow: "Studio alert",
    title: "New order received",
    bodyHtml: body,
  });
}

const statusJourney = ["CONFIRMED", "PACKED", "SHIPPED", "DELIVERED"] as const;

function statusProgressHtml(active: string) {
  if (active === "CANCELLED" || active === "PENDING") return "";
  const activeIdx = statusJourney.indexOf(
    active as (typeof statusJourney)[number]
  );
  if (activeIdx < 0) return "";

  const labels: Record<(typeof statusJourney)[number], string> = {
    CONFIRMED: "Confirmed",
    PACKED: "Packed",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
  };

  const cells = statusJourney
    .map((step, i) => {
      const on = i <= activeIdx;
      return `
        <td align="center" width="25%" style="padding:0 2px;vertical-align:top;">
          <div style="height:4px;background:${on ? colors.copper : colors.stone};border-radius:2px;font-size:0;line-height:0;">&nbsp;</div>
          <p style="margin:8px 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:10px;letter-spacing:0.06em;text-transform:uppercase;color:${on ? colors.aubergine : colors.muted};">
            ${labels[step]}
          </p>
        </td>`;
    })
    .join("");

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 22px;">
      <tr>${cells}</tr>
    </table>`;
}

export const statusLabels: Record<string, string> = {
  CONFIRMED: "Confirmed",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

/** Distinct copy + subject per order status change. */
export const statusEmailCopy: Record<
  string,
  {
    subjectSuffix: string;
    preheader: string;
    eyebrow: string;
    title: string;
    message: string;
    ctaLabel: string;
    showProgress: boolean;
  }
> = {
  CONFIRMED: {
    subjectSuffix: "confirmed",
    preheader: "We’re preparing your piece with care",
    eyebrow: "Order confirmed",
    title: "Your order is confirmed",
    message:
      "Thank you — your order is confirmed and with our studio. We’re preparing your piece carefully and will update you again when it’s packed.",
    ctaLabel: "Track your order",
    showProgress: true,
  },
  PACKED: {
    subjectSuffix: "is packed",
    preheader: "Your order is packed and nearly ready to leave",
    eyebrow: "Packed & ready",
    title: "Your order is packed",
    message:
      "Good news — your order has been packed with care and is nearly ready to leave the studio. We’ll write again as soon as it’s on its way.",
    ctaLabel: "Track your order",
    showProgress: true,
  },
  SHIPPED: {
    subjectSuffix: "has shipped",
    preheader: "Your ZAYUNE order is on its way",
    eyebrow: "On its way",
    title: "Your order has shipped",
    message:
      "Your order has left the studio and is on its way to you. Keep this email handy for your order number — we’ll share tracking details separately if available.",
    ctaLabel: "Track shipment",
    showProgress: true,
  },
  DELIVERED: {
    subjectSuffix: "delivered",
    preheader: "Your order has been marked as delivered",
    eyebrow: "Delivered",
    title: "Your order was delivered",
    message:
      "Your order has been marked as delivered. We hope it feels as considered as it looks — thank you for choosing ZAYUNE.",
    ctaLabel: "View order",
    showProgress: true,
  },
  CANCELLED: {
    subjectSuffix: "cancelled",
    preheader: "Your order has been cancelled",
    eyebrow: "Order cancelled",
    title: "Your order was cancelled",
    message:
      "Your order has been cancelled. If this wasn’t expected, reply to this email or message us on WhatsApp and we’ll help sort it out.",
    ctaLabel: "Contact the studio",
    showProgress: false,
  },
};

export function orderStatusCustomerHtml(input: {
  customerName: string;
  orderNumber: string;
  status: string;
  trackUrl: string;
  contactUrl?: string;
}) {
  const copy = statusEmailCopy[input.status];
  if (!copy) {
    return emailLayout({
      eyebrow: "Order update",
      title: "Order update",
      bodyHtml: `<p>Order ${esc(input.orderNumber)} was updated.</p>`,
    });
  }

  const ctaHref =
    input.status === "CANCELLED"
      ? input.contactUrl || input.trackUrl
      : input.trackUrl;

  const body = `
    ${copy.showProgress ? statusProgressHtml(input.status) : ""}
    <p style="margin:0 0 18px;">Dear ${esc(input.customerName)},</p>
    <p style="margin:0 0 18px;">${esc(copy.message)}</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      ${detailRow("Order", esc(input.orderNumber))}
      ${detailRow("Status", esc(statusLabels[input.status] || input.status))}
    </table>
    ${ctaButton(ctaHref, copy.ctaLabel)}
    <p style="margin:20px 0 0;color:${colors.muted};font-size:14px;">Questions? Reply to this email or message us on WhatsApp.</p>`;

  return emailLayout({
    preheader: `${copy.preheader} · ${input.orderNumber}`,
    eyebrow: copy.eyebrow,
    title: copy.title,
    bodyHtml: body,
  });
}

export function supportCustomerHtml(input: {
  name: string;
  ticketId: string;
  source?: "support" | "contact";
}) {
  const fromContact = input.source === "contact";
  const body = `
    <p style="margin:0 0 18px;">Hi ${esc(input.name)},</p>
    <p style="margin:0 0 18px;">${
      fromContact
        ? "Thanks for writing to ZAYUNE. We’ve received your message and will follow up on email or WhatsApp soon."
        : "We received your support request and will follow up on WhatsApp using the number you shared."
    }</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      ${detailRow(fromContact ? "Reference" : "Ticket", esc(input.ticketId))}
    </table>
    <p style="margin:20px 0 0;color:${colors.muted};font-size:14px;">Please keep an eye on email and WhatsApp.</p>`;

  return emailLayout({
    preheader: fromContact
      ? `We received your message · ${input.ticketId}`
      : `Support ticket ${input.ticketId} received`,
    eyebrow: fromContact ? "Contact" : "Support",
    title: fromContact ? "Thanks for reaching out" : "We’ve got your message",
    bodyHtml: body,
  });
}

export function supportTeamHtml(input: {
  name: string;
  email: string;
  phone: string;
  ticketId: string;
  message: string;
  source?: "support" | "contact";
}) {
  const fromContact = input.source === "contact";
  const body = `
    <p style="margin:0 0 18px;">${
      fromContact
        ? "A new message arrived from the contact form."
        : "A customer opened a support ticket."
    }</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      ${detailRow(fromContact ? "Reference" : "Ticket", esc(input.ticketId))}
      ${detailRow("Name", esc(input.name))}
      ${detailRow("Email", esc(input.email))}
      ${detailRow("Phone", esc(input.phone))}
    </table>
    <p style="margin:22px 0 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:${colors.muted};">Message</p>
    <p style="margin:0;padding:16px;background:${colors.porcelain};border:1px solid ${colors.stone};font-size:15px;line-height:1.65;white-space:pre-wrap;">${esc(input.message)}</p>`;

  return emailLayout({
    preheader: `${fromContact ? "Contact" : "Support"} ${input.ticketId} — ${input.name}`,
    eyebrow: "Studio alert",
    title: fromContact ? "New contact message" : "New support ticket",
    bodyHtml: body,
  });
}

export function customRequestCustomerHtml(input: {
  name: string;
  requestId: string;
  pieceType: string;
}) {
  const body = `
    <p style="margin:0 0 18px;">Dear ${esc(input.name)},</p>
    <p style="margin:0 0 18px;">We’ve received your custom request and will review it carefully. Expect a follow-up on WhatsApp or email once we’ve looked at the details.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      ${detailRow("Reference", esc(input.requestId))}
      ${detailRow("Piece", esc(input.pieceType))}
    </table>
    <p style="margin:20px 0 0;color:${colors.muted};font-size:14px;">Custom pieces are made to order — timing depends on the design and studio queue.</p>`;

  return emailLayout({
    preheader: `Custom request received · ${input.requestId}`,
    eyebrow: "Custom request",
    title: "We’ve received your custom request",
    bodyHtml: body,
  });
}

export function customRequestTeamHtml(input: {
  name: string;
  email: string;
  phone: string;
  requestId: string;
  pieceType: string;
  colors: string;
  occasion: string;
  budget: string;
  details: string;
  neededBy?: string | null;
  adminUrl: string;
}) {
  const rows = [
    detailRow("Reference", esc(input.requestId)),
    detailRow("Name", `${esc(input.name)}<br/><span style="font-size:13px;color:${colors.muted};">${esc(input.email)}</span>`),
    detailRow("Phone", esc(input.phone)),
    detailRow("Piece", esc(input.pieceType)),
    detailRow("Colors", esc(input.colors)),
    detailRow("Occasion", esc(input.occasion)),
    detailRow("Budget", esc(input.budget)),
  ];
  if (input.neededBy) rows.push(detailRow("Needed by", esc(input.neededBy)));

  const body = `
    <p style="margin:0 0 18px;">A new custom request is waiting for review.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      ${rows.join("")}
    </table>
    <p style="margin:22px 0 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:${colors.muted};">Details</p>
    <p style="margin:0;padding:16px;background:${colors.porcelain};border:1px solid ${colors.stone};font-size:15px;line-height:1.65;white-space:pre-wrap;">${esc(input.details)}</p>
    ${ctaButton(input.adminUrl, "Open custom requests")}`;

  return emailLayout({
    preheader: `Custom request · ${input.name}`,
    eyebrow: "Studio alert",
    title: "New custom request",
    bodyHtml: body,
  });
}

export function customRequestStatusHtml(input: {
  name: string;
  requestId: string;
  statusLabel: string;
  message: string;
}) {
  const body = `
    <p style="margin:0 0 18px;">Dear ${esc(input.name)},</p>
    <p style="margin:0 0 18px;">${esc(input.message)}</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      ${detailRow("Reference", esc(input.requestId))}
      ${detailRow("Status", esc(input.statusLabel))}
    </table>
    <p style="margin:20px 0 0;color:${colors.muted};font-size:14px;">We’ll continue on WhatsApp if we need anything else from you.</p>`;

  return emailLayout({
    preheader: `Custom request ${input.statusLabel.toLowerCase()} · ${input.requestId}`,
    eyebrow: "Custom update",
    title: input.statusLabel,
    bodyHtml: body,
  });
}

export function waitlistJoinedHtml(input: {
  email: string;
  productName: string;
  productUrl: string;
}) {
  const body = `
    <p style="margin:0 0 18px;">You’re on the waitlist for <strong style="font-weight:normal;">${esc(input.productName)}</strong>.</p>
    <p style="margin:0 0 18px;">We’ll email you when it’s available again — no spam, just that one note from the studio.</p>
    ${ctaButton(input.productUrl, "View product")}`;

  return emailLayout({
    preheader: `Waitlist confirmed for ${input.productName}`,
    eyebrow: "Waitlist",
    title: "You’re on the list",
    bodyHtml: body,
  });
}

export function waitlistRestockHtml(input: {
  productName: string;
  productUrl: string;
}) {
  const body = `
    <p style="margin:0 0 18px;"><strong style="font-weight:normal;">${esc(input.productName)}</strong> is back.</p>
    <p style="margin:0 0 18px;">You asked us to tell you — pieces move quickly, so claim yours while it’s available.</p>
    ${ctaButton(input.productUrl, "Shop now")}`;

  return emailLayout({
    preheader: `${input.productName} is back in stock`,
    eyebrow: "Back in stock",
    title: "It’s available again",
    bodyHtml: body,
  });
}

export function welcomeAccountHtml(input: {
  name: string;
  accountUrl: string;
  shopUrl: string;
}) {
  const body = `
    <p style="margin:0 0 18px;">Dear ${esc(input.name)},</p>
    <p style="margin:0 0 18px;">Welcome to ZAYUNE. Your account is ready — track orders, save favourites, and check out a little faster next time.</p>
    ${ctaButton(input.accountUrl, "Open your account")}
    ${secondaryLink(input.shopUrl, "Browse the shop")}`;

  return emailLayout({
    preheader: "Your ZAYUNE account is ready",
    eyebrow: "Welcome",
    title: "Your account is ready",
    bodyHtml: body,
  });
}

export function verificationCodeHtml(input: {
  name: string;
  code: string;
}) {
  const body = `
    <p style="margin:0 0 18px;">Hi ${esc(input.name)},</p>
    <p style="margin:0 0 18px;">Use this 6-digit code to finish creating your ZAYUNE account. It expires in 15 minutes.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 20px;">
      <tr>
        <td align="center" style="padding:22px;background:${colors.porcelain};border:1px dashed ${colors.copper};">
          <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:${colors.muted};">Verification code</p>
          <p style="margin:10px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:32px;letter-spacing:0.28em;color:${colors.aubergine};">${esc(input.code)}</p>
        </td>
      </tr>
    </table>
    <p style="margin:0;color:${colors.muted};font-size:14px;">If you didn’t request this, you can ignore this email.</p>`;

  return emailLayout({
    preheader: `Your ZAYUNE code is ${input.code}`,
    eyebrow: "Verify email",
    title: "Your verification code",
    bodyHtml: body,
  });
}

export function marketingBroadcastHtml(input: {
  headline: string;
  body: string;
  ctaLabel?: string;
  ctaUrl?: string;
}) {
  const paragraphs = input.body
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map(
      (p) =>
        `<p style="margin:0 0 16px;">${esc(p)}</p>`
    )
    .join("");

  const body = `
    ${paragraphs}
    ${
      input.ctaUrl && input.ctaLabel
        ? ctaButton(input.ctaUrl, input.ctaLabel)
        : ""
    }
    <p style="margin:24px 0 0;color:${colors.muted};font-size:13px;">You’re receiving this because you subscribed or have an account with ZAYUNE.</p>`;

  return emailLayout({
    preheader: input.headline,
    eyebrow: "From the studio",
    title: input.headline,
    bodyHtml: body,
  });
}

export function subscribeWelcomeHtml(input: { code: string; shopUrl: string }) {
  const body = `
    <p style="margin:0 0 18px;">Welcome to ZAYUNE.</p>
    <p style="margin:0 0 18px;">Here’s a one-time welcome code for 5% off your first order.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 20px;">
      <tr>
        <td align="center" style="padding:22px;background:${colors.porcelain};border:1px dashed ${colors.copper};">
          <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:${colors.muted};">Your code</p>
          <p style="margin:10px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:28px;letter-spacing:0.12em;color:${colors.aubergine};">${esc(input.code)}</p>
        </td>
      </tr>
    </table>
    ${ctaButton(input.shopUrl, "Shop the collection")}
    <p style="margin:16px 0 0;color:${colors.muted};font-size:14px;">One-time use per email.</p>`;

  return emailLayout({
    preheader: `Your 5% welcome code: ${input.code}`,
    eyebrow: "Welcome",
    title: "A little something for you",
    bodyHtml: body,
  });
}

export function advanceNotifyTeamHtml(input: {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  paymentRef?: string | null;
  paymentProofUrl?: string | null;
  adminUrl: string;
}) {
  const rows = [
    detailRow("Order", esc(input.orderNumber)),
    detailRow(
      "Customer",
      `${esc(input.customerName)}<br/><span style="font-size:13px;color:${colors.muted};">${esc(input.customerEmail)}</span>`
    ),
  ];
  if (input.paymentRef) {
    rows.push(detailRow("Reference", esc(input.paymentRef)));
  }

  const body = `
    <p style="margin:0 0 18px;">${esc(input.customerName)} marked their 30% advance as sent. Verify the transfer, then mark the order Paid in admin.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      ${rows.join("")}
    </table>
    ${ctaButton(input.adminUrl, "Verify in admin")}
    ${
      input.paymentProofUrl
        ? secondaryLink(input.paymentProofUrl, "View receipt")
        : ""
    }`;

  return emailLayout({
    preheader: `Advance marked sent — ${input.orderNumber}`,
    eyebrow: "Studio alert",
    title: "Advance awaiting verification",
    bodyHtml: body,
  });
}
