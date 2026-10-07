import { NextResponse } from "next/server";
import { z } from "zod";
import { findDemoOrder } from "@/lib/demo-orders";
import { ensureDatabaseUrl, isServerlessRuntime } from "@/lib/env";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  orderNumber: z.string().min(3),
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const data = schema.parse(await request.json());
    const email = data.email.toLowerCase();
    const orderNumber = data.orderNumber.trim();

    if (ensureDatabaseUrl()) {
      const order = await prisma.order.findFirst({
        where: {
          orderNumber,
          customerEmail: { equals: email, mode: "insensitive" },
        },
      });

      if (!order) {
        return NextResponse.json(
          { error: "We couldn’t find an order with those details." },
          { status: 404 }
        );
      }

      return NextResponse.json({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        total: order.total,
        currency: order.currency,
        trackingNumber: order.trackingNumber,
        trackingUrl: order.trackingUrl,
        customerName: order.customerName,
        updatedAt: order.updatedAt,
      });
    }

    if (isServerlessRuntime()) {
      return NextResponse.json(
        { error: "Order tracking requires DATABASE_URL on the server." },
        { status: 503 }
      );
    }

    const order = findDemoOrder(orderNumber);
    if (!order || order.customerEmail.toLowerCase() !== email) {
      return NextResponse.json(
        { error: "We couldn’t find an order with those details." },
        { status: 404 }
      );
    }
    return NextResponse.json({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      total: order.total,
      currency: order.currency,
      trackingNumber: order.trackingNumber,
      trackingUrl: order.trackingUrl,
      customerName: order.customerName,
      updatedAt: order.updatedAt,
    });
  } catch (error) {
    const { friendlyError } = await import("@/lib/api-error");
    return NextResponse.json(
      { error: friendlyError(error, "Please enter a valid order number and email.") },
      { status: 400 }
    );
  }
}
