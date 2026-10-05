import { NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payments/providers";
import { prisma } from "@/lib/prisma";
import { isDemoMode } from "@/lib/demo-data";

/**
 * Gateway webhook endpoint.
 * Verify signatures server-side via the active payment provider.
 * Never mark an order paid from a client redirect alone.
 */
export async function POST(request: Request) {
  const provider = getPaymentProvider("gateway");
  if (!provider?.verifyWebhook) {
    return NextResponse.json({ error: "Gateway not configured" }, { status: 501 });
  }

  try {
    const signature = request.headers.get("x-signature") || undefined;
    const payload = await request.json();
    const result = await provider.verifyWebhook(payload, signature);

    if (isDemoMode()) {
      return NextResponse.json({ received: true, demo: true });
    }

    if (result.paid) {
      await prisma.order.update({
        where: { id: result.orderId },
        data: {
          paymentStatus: "PAID",
          paymentRef: result.externalRef || undefined,
          status: "CONFIRMED",
        },
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Webhook verification failed" }, { status: 400 });
  }
}
