import { OrderStatus, PaymentStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { findDemoOrder, updateDemoOrder } from "@/lib/demo-orders";
import { ensureDatabaseUrl } from "@/lib/env";
import {
  sendAdvanceNotifyEmail,
  sendOrderStatusEmail,
} from "@/lib/email";
import { verifyOrderAccessToken } from "@/lib/order-token";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  token: z.string().min(10),
  action: z.enum(["confirm_order", "mark_advance_sent"]),
  paymentRef: z.string().max(120).optional().nullable(),
  paymentProofUrl: z
    .string()
    .max(2_000_000)
    .optional()
    .nullable()
    .or(z.literal("")),
});

export async function POST(request: Request) {
  try {
    const data = schema.parse(await request.json());
    const payload = verifyOrderAccessToken(data.token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid or expired link." }, { status: 400 });
    }

    if (ensureDatabaseUrl()) {
      const order = await prisma.order.findFirst({
        where: {
          OR: [{ id: payload.id }, { orderNumber: payload.n }],
        },
      });
      if (!order || order.orderNumber !== payload.n) {
        return NextResponse.json({ error: "Order not found." }, { status: 404 });
      }

      if (order.status === "CANCELLED") {
        return NextResponse.json(
          { error: "This order was cancelled." },
          { status: 400 }
        );
      }

      if (data.action === "mark_advance_sent") {
        const proof = data.paymentProofUrl?.trim() || null;
        const updated = await prisma.order.update({
          where: { id: order.id },
          data: {
            status: OrderStatus.CONFIRMED,
            paymentStatus: PaymentStatus.AWAITING_VERIFICATION,
            paymentRef: data.paymentRef?.trim() || order.paymentRef,
            ...(proof ? { paymentProofUrl: proof } : {}),
          },
        });
        void sendAdvanceNotifyEmail({
          orderNumber: updated.orderNumber,
          customerName: updated.customerName,
          customerEmail: updated.customerEmail,
          paymentRef: updated.paymentRef,
          paymentProofUrl: updated.paymentProofUrl,
        });
        void sendOrderStatusEmail({
          to: updated.customerEmail,
          orderNumber: updated.orderNumber,
          customerName: updated.customerName,
          status: updated.status,
        });
        return NextResponse.json({
          ok: true,
          status: updated.status,
          paymentStatus: updated.paymentStatus,
          message:
            "Thank you — we’ve marked your advance as sent. We’ll verify the transfer (usually same day) and start your order.",
        });
      }

      const updated = await prisma.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.CONFIRMED },
      });
      void sendOrderStatusEmail({
        to: updated.customerEmail,
        orderNumber: updated.orderNumber,
        customerName: updated.customerName,
        status: updated.status,
      });
      return NextResponse.json({
        ok: true,
        status: updated.status,
        paymentStatus: updated.paymentStatus,
        message: "Your order is confirmed. We’ll be in touch on WhatsApp soon.",
      });
    }

    const demo = findDemoOrder(payload.id) || findDemoOrder(payload.n);
    if (!demo) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }
    const updated = updateDemoOrder(demo.id, {
      status: "CONFIRMED" as OrderStatus,
      ...(data.action === "mark_advance_sent"
        ? {
            paymentStatus: "AWAITING_VERIFICATION" as PaymentStatus,
            paymentRef: data.paymentRef?.trim() || demo.paymentRef,
            paymentProofUrl:
              data.paymentProofUrl?.trim() || demo.paymentProofUrl,
          }
        : {}),
    });
    return NextResponse.json({
      ok: true,
      status: updated?.status,
      paymentStatus: updated?.paymentStatus,
      message: "Order updated.",
    });
  } catch {
    return NextResponse.json({ error: "Unable to confirm order." }, { status: 400 });
  }
}
