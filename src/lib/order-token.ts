import { createHmac, timingSafeEqual } from "crypto";
import { siteOrigin } from "@/lib/site";

function secret() {
  return (
    process.env.NEXTAUTH_SECRET ||
    process.env.ORDER_TOKEN_SECRET ||
    "zayune-dev-order-token"
  );
}

export type OrderTokenPayload = {
  id: string;
  n: string; // orderNumber
};

export function createOrderAccessToken(order: {
  id: string;
  orderNumber: string;
}): string {
  const payload: OrderTokenPayload = { id: order.id, n: order.orderNumber };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifyOrderAccessToken(
  token: string
): OrderTokenPayload | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = createHmac("sha256", secret()).update(body).digest("base64url");
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    const parsed = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8")
    ) as OrderTokenPayload;
    if (!parsed?.id || !parsed?.n) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function orderPayPath(token: string) {
  return `/order/pay/${encodeURIComponent(token)}`;
}

export function orderPayUrl(token: string) {
  return `${siteOrigin()}${orderPayPath(token)}`;
}
