import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { OrderStatus, PaymentMethod, PaymentStatus } from "@prisma/client";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { getDemoCustomers } from "@/lib/demo-customers";
import { isDemoMode } from "@/lib/demo-data";
import { getDemoOrdersStore } from "@/lib/demo-orders";
import { sendOrderConfirmationEmail } from "@/lib/email";
import {
  incrementDiscountUse,
  priceCartLines,
  resolveDiscount,
  resolveShipping,
} from "@/lib/order-pricing";
import { getPaymentProvider } from "@/lib/payments/providers";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

function buildWhatsAppConfirm(
  name: string,
  orderNumber: string,
  total: number,
  paymentMethod: string
) {
  const advance = Math.round(total * 0.3);
  const bankNote =
    paymentMethod === "bank_transfer"
      ? ` I will send 30% advance (Rs ${advance.toLocaleString("en-PK")}) via bank/Raast with reference ${orderNumber}.`
      : "";
  const text = `Hi ZAYUNE, this is ${name}. Please confirm my order ${orderNumber} (total Rs ${total.toLocaleString("en-PK")}).${bankNote}`;
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(text)}`;
}

const itemSchema = z.object({
  productId: z.string(),
  variantId: z.string().optional(),
  quantity: z.number().int().positive().max(20),
});

const orderSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(7),
  shippingAddress: z.string().min(5),
  shippingCity: z.string().min(2),
  shippingNotes: z.string().optional().nullable(),
  paymentMethod: z.enum(["cod", "bank_transfer", "gateway"]),
  paymentRef: z.string().optional(),
  discountCode: z.string().optional().nullable(),
  items: z.array(itemSchema).min(1),
});

const methodMap: Record<string, PaymentMethod> = {
  cod: PaymentMethod.COD,
  bank_transfer: PaymentMethod.BANK_TRANSFER,
  gateway: PaymentMethod.GATEWAY,
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = orderSchema.parse(body);
    const session = await getServerSession(authOptions);

    const pricedItems = await priceCartLines(
      data.items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
      }))
    );

    const subtotal = pricedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const discount = await resolveDiscount(data.discountCode, subtotal, {
      email: data.customerEmail,
      productIds: data.items.map((i) => i.productId),
    });
    const shippingFee = await resolveShipping(subtotal - discount.discountAmount);
    const total = Math.max(0, subtotal - discount.discountAmount + shippingFee);

    const provider = getPaymentProvider(data.paymentMethod);
    if (!provider) {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
    }

    const orderNumber = generateOrderNumber();
    const orderId = `ord_${Date.now().toString(36)}`;

    const payment = await provider.initiate({
      orderId,
      orderNumber,
      amount: total,
      currency: "PKR",
      customerEmail: data.customerEmail,
      customerName: data.customerName,
      returnUrl: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/order/${orderId}/confirmation`,
    });

    let customerId: string | null = null;
    if (session?.user?.email && session.user.role === "customer") {
      const email = session.user.email.toLowerCase();
      if (email === data.customerEmail.toLowerCase()) {
        if (isDemoMode()) {
          customerId = getDemoCustomers().get(email)?.id || null;
        } else {
          const customer = await prisma.customer.findUnique({ where: { email } });
          customerId = customer?.id || null;
        }
      }
    }

    if (isDemoMode()) {
      const now = new Date();
      getDemoOrdersStore().set(orderId, {
        id: orderId,
        orderNumber,
        status: OrderStatus.PENDING,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        shippingAddress: data.shippingAddress,
        shippingCity: data.shippingCity,
        shippingNotes: data.shippingNotes,
        paymentMethod: methodMap[data.paymentMethod],
        paymentStatus: payment.paymentStatus as PaymentStatus,
        paymentRef: data.paymentRef || payment.referenceHint || null,
        trackingNumber: null,
        trackingUrl: null,
        adminNotes: null,
        total,
        currency: "PKR",
        shippingFee,
        subtotal,
        discountCode: discount.discountCode,
        discountAmount: discount.discountAmount,
        instructions: payment.instructions,
        items: pricedItems.map((item, i) => ({
          id: `oi_${orderId}_${i}`,
          productId: item.productId,
          variantId: item.variantId,
          name: item.name,
          variantName: item.variantName,
          price: item.price,
          quantity: item.quantity,
        })),
        createdAt: now,
        updatedAt: now,
      });

      await incrementDiscountUse(discount.discountCode, data.customerEmail);
      const itemsSummary = pricedItems
        .map((i) => `${i.name}${i.variantName ? ` (${i.variantName})` : ""} × ${i.quantity}`)
        .join(", ");
      void sendOrderConfirmationEmail({
        to: data.customerEmail,
        orderNumber,
        customerName: data.customerName,
        total,
        currency: "PKR",
        paymentMethod: methodMap[data.paymentMethod],
        itemsSummary,
      });

      return NextResponse.json({
        orderId,
        orderNumber,
        instructions: payment.instructions,
        redirectUrl: payment.redirectUrl || `/order/${orderId}/confirmation`,
        whatsappConfirmUrl: buildWhatsAppConfirm(
          data.customerName,
          orderNumber,
          total,
          data.paymentMethod
        ),
      });
    }

    const order = await prisma.order.create({
      data: {
        orderNumber,
        paymentMethod: methodMap[data.paymentMethod],
        paymentStatus: payment.paymentStatus as PaymentStatus,
        paymentRef: data.paymentRef || payment.referenceHint || null,
        customerId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        shippingAddress: data.shippingAddress,
        shippingCity: data.shippingCity,
        shippingNotes: data.shippingNotes || null,
        subtotal,
        discountCode: discount.discountCode,
        discountAmount: discount.discountAmount,
        shippingFee,
        total,
        items: {
          create: pricedItems.map((item) => ({
            productId: item.productId,
            variantId: item.variantId || null,
            name: item.name,
            variantName: item.variantName || null,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
    });

    await incrementDiscountUse(discount.discountCode, data.customerEmail);
    const itemsSummary = pricedItems
      .map((i) => `${i.name}${i.variantName ? ` (${i.variantName})` : ""} × ${i.quantity}`)
      .join(", ");
    void sendOrderConfirmationEmail({
      to: data.customerEmail,
      orderNumber: order.orderNumber,
      customerName: data.customerName,
      total,
      currency: "PKR",
      paymentMethod: methodMap[data.paymentMethod],
      itemsSummary,
    });

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      instructions: payment.instructions,
      redirectUrl: payment.redirectUrl || `/order/${order.id}/confirmation`,
      whatsappConfirmUrl: buildWhatsAppConfirm(
        data.customerName,
        order.orderNumber,
        total,
        data.paymentMethod
      ),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Please check your details and try again." },
        { status: 400 }
      );
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json(
      { error: "Unable to place order. Please try again." },
      { status: 500 }
    );
  }
}
