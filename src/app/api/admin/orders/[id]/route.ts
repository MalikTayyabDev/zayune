import { OrderStatus, PaymentStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { isDemoMode } from "@/lib/demo-data";
import { findDemoOrder, updateDemoOrder } from "@/lib/demo-orders";
import { sendOrderStatusEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  status: z
    .enum(["PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"])
    .optional(),
  paymentStatus: z
    .enum(["UNPAID", "AWAITING_VERIFICATION", "PAID", "REFUNDED", "FAILED"])
    .optional(),
  trackingNumber: z.string().optional().nullable(),
  trackingUrl: z.string().optional().nullable(),
  adminNotes: z.string().optional().nullable(),
  paymentProofUrl: z.string().optional().nullable(),
});

type Props = { params: { id: string } };

export async function GET(_request: Request, { params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isDemoMode()) {
    const order = findDemoOrder(params.id);
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(order);
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true },
  });
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(order);
}

export async function PATCH(request: Request, { params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = schema.parse(await request.json());

    if (isDemoMode()) {
      const updated = updateDemoOrder(params.id, {
        ...(data.status ? { status: data.status as OrderStatus } : {}),
        ...(data.paymentStatus
          ? { paymentStatus: data.paymentStatus as PaymentStatus }
          : {}),
        ...(data.trackingNumber !== undefined
          ? { trackingNumber: data.trackingNumber }
          : {}),
        ...(data.trackingUrl !== undefined ? { trackingUrl: data.trackingUrl } : {}),
        ...(data.adminNotes !== undefined ? { adminNotes: data.adminNotes } : {}),
        ...(data.paymentProofUrl !== undefined
          ? { paymentProofUrl: data.paymentProofUrl }
          : {}),
      });
      if (!updated) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      if (data.status || data.paymentStatus === "PAID") {
        await sendOrderStatusEmail({
          to: updated.customerEmail,
          orderNumber: updated.orderNumber,
          customerName: updated.customerName,
          status: data.paymentStatus === "PAID" ? "CONFIRMED" : updated.status,
        });
      }
      return NextResponse.json(updated);
    }

    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        ...(data.status ? { status: data.status as OrderStatus } : {}),
        ...(data.paymentStatus
          ? { paymentStatus: data.paymentStatus as PaymentStatus }
          : {}),
        ...(data.trackingNumber !== undefined
          ? { trackingNumber: data.trackingNumber }
          : {}),
        ...(data.trackingUrl !== undefined ? { trackingUrl: data.trackingUrl } : {}),
        ...(data.adminNotes !== undefined ? { adminNotes: data.adminNotes } : {}),
        ...(data.paymentProofUrl !== undefined
          ? { paymentProofUrl: data.paymentProofUrl }
          : {}),
        // Verifying advance also confirms the order
        ...(data.paymentStatus === "PAID"
          ? { status: OrderStatus.CONFIRMED }
          : {}),
      },
    });

    if (data.status || data.paymentStatus === "PAID") {
      await sendOrderStatusEmail({
        to: order.customerEmail,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        status: order.status,
      });
    }

    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Unable to update order" }, { status: 400 });
  }
}
