import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { OrderStatus, PaymentMethod, PaymentStatus } from "@prisma/client";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { getDemoCustomers } from "@/lib/demo-customers";
import { isDemoMode } from "@/lib/demo-data";
import { getDemoOrdersStore } from "@/lib/demo-orders";
import { formatAdvance } from "@/lib/bank-details";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { isServerlessRuntime } from "@/lib/env";
import {
  createOrderAccessToken,
  orderPayUrl,
} from "@/lib/order-token";
import {
  incrementDiscountUse,
  priceCartLines,
  resolveDiscount,
  resolveShipping,
} from "@/lib/order-pricing";
import { getPaymentProvider } from "@/lib/payments/providers";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";
import {
  buildCustomerOrderWhatsAppText,
  sendWhatsAppCloudMessage,
  whatsappToCustomerUrl,
  whatsappToStudioUrl,
} from "@/lib/whatsapp-order";

function buildStudioConfirmWa(
  name: string,
  orderNumber: string,
  total: number,
  paymentMethod: string,
  payUrl: string
) {
  const advance = formatAdvance(total);
  const bankNote =
    paymentMethod === "bank_transfer"
      ? ` I will send 30% advance (Rs ${advance.toLocaleString("en-PK")}) via bank/Raast. Pay link: ${payUrl}`
      : ` Confirm link: ${payUrl}`;
  const text = `Hi ZAYUNE, this is ${name}. Please confirm my order ${orderNumber} (total Rs ${total.toLocaleString("en-PK")}).${bankNote}`;
  return whatsappToStudioUrl(text);
}

async function buildOrderNotifyBundle(input: {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  total: number;
  paymentMethod: string;
}) {
  const token = createOrderAccessToken({
    id: input.id,
    orderNumber: input.orderNumber,
  });
  const payUrl = orderPayUrl(token);
  const customerText = buildCustomerOrderWhatsAppText({
    customerName: input.customerName,
    orderNumber: input.orderNumber,
    total: input.total,
    paymentMethod: input.paymentMethod,
    payUrl,
  });
  const whatsappCustomerUrl = whatsappToCustomerUrl(
    input.customerPhone,
    customerText
  );
  const whatsappConfirmUrl = buildStudioConfirmWa(
    input.customerName,
    input.orderNumber,
    input.total,
    input.paymentMethod,
    payUrl
  );

  // Auto-send if Cloud API is configured
  void sendWhatsAppCloudMessage({
    toPhone: input.customerPhone,
    text: customerText,
  });

  return { token, payUrl, whatsappCustomerUrl, whatsappConfirmUrl };
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

    // All orders: 30% bank/Raast advance, then 70% on delivery (COD = rest on delivery)
    const paymentMethod = data.paymentMethod;
    const needsAdvance = true;

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

    const provider = getPaymentProvider(paymentMethod);
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
      returnUrl: `${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://zayune.com"}/order/${orderId}/confirmation`,
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

    // Never accept in-memory “demo” orders on Vercel — they vanish on the next request.
    if (isDemoMode()) {
      if (isServerlessRuntime()) {
        return NextResponse.json(
          {
            error:
              "Orders cannot be saved: add DATABASE_URL (Neon) on Vercel, ensure FORCE_DEMO_DATA is false, run prisma db push, and redeploy.",
          },
          { status: 503 }
        );
      }

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
        paymentMethod: methodMap[paymentMethod],
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
      const notify = await buildOrderNotifyBundle({
        id: orderId,
        orderNumber,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        total,
        paymentMethod,
      });
      void sendOrderConfirmationEmail({
        to: data.customerEmail,
        orderNumber,
        customerName: data.customerName,
        total,
        currency: "PKR",
        paymentMethod: methodMap[paymentMethod],
        itemsSummary,
        payUrl: notify.payUrl,
        whatsappCustomerUrl: notify.whatsappCustomerUrl,
        advanceAmount: formatAdvance(total),
      });

      return NextResponse.json({
        orderId,
        orderNumber,
        instructions: payment.instructions,
        // 30% advance required → land on pay/confirm link
        redirectUrl: needsAdvance
          ? notify.payUrl
          : payment.redirectUrl || `/order/${orderId}/confirmation`,
        payUrl: notify.payUrl,
        whatsappConfirmUrl: notify.whatsappConfirmUrl,
        whatsappCustomerUrl: notify.whatsappCustomerUrl,
        requiresAdvance: needsAdvance,
      });
    }

    const order = await prisma.order.create({
      data: {
        orderNumber,
        paymentMethod: methodMap[paymentMethod],
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
    const notify = await buildOrderNotifyBundle({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      total,
      paymentMethod,
    });
    void sendOrderConfirmationEmail({
      to: data.customerEmail,
      orderNumber: order.orderNumber,
      customerName: data.customerName,
      total,
      currency: "PKR",
      paymentMethod: methodMap[paymentMethod],
      itemsSummary,
      payUrl: notify.payUrl,
      whatsappCustomerUrl: notify.whatsappCustomerUrl,
      advanceAmount: formatAdvance(total),
    });

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      instructions: payment.instructions,
      redirectUrl: needsAdvance
        ? notify.payUrl
        : payment.redirectUrl || `/order/${order.id}/confirmation`,
      payUrl: notify.payUrl,
      whatsappConfirmUrl: notify.whatsappConfirmUrl,
      whatsappCustomerUrl: notify.whatsappCustomerUrl,
      requiresAdvance: needsAdvance,
    });
  } catch (error) {
    const { friendlyError } = await import("@/lib/api-error");
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: friendlyError(error, "Please check your details and try again.") },
        { status: 400 }
      );
    }
    if (error instanceof Error) {
      return NextResponse.json(
        { error: friendlyError(error, "Unable to place order. Please try again.") },
        { status: 400 }
      );
    }
    console.error(error);
    return NextResponse.json(
      { error: "Unable to place order. Please try again." },
      { status: 500 }
    );
  }
}
