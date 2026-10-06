import Link from "next/link";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { OrderManager } from "@/components/admin/OrderManager";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { authOptions } from "@/lib/auth";
import { isDemoMode } from "@/lib/demo-data";
import { findDemoOrder } from "@/lib/demo-orders";
import {
  createOrderAccessToken,
  orderPayPath,
  orderPayUrl,
} from "@/lib/order-token";
import { prisma } from "@/lib/prisma";
import {
  buildCustomerOrderWhatsAppText,
  whatsappToCustomerUrl,
} from "@/lib/whatsapp-order";

type Props = { params: { id: string } };

export default async function AdminOrderDetailPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const order = isDemoMode()
    ? findDemoOrder(params.id)
    : await prisma.order.findUnique({
        where: { id: params.id },
        include: { items: true },
      });

  if (!order) notFound();

  const token = createOrderAccessToken({
    id: order.id,
    orderNumber: order.orderNumber,
  });
  const payUrl = orderPayPath(token);
  const customerText = buildCustomerOrderWhatsAppText({
    customerName: order.customerName,
    orderNumber: order.orderNumber,
    total: order.total,
    currency: order.currency,
    paymentMethod: String(order.paymentMethod),
    payUrl: orderPayUrl(token),
  });
  const whatsappCustomerUrl = whatsappToCustomerUrl(
    order.customerPhone,
    customerText
  );

  return (
    <div className="py-4">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Order"
          title={order.orderNumber}
          description="Update fulfillment, payment verification, and courier tracking."
        />
        <Link href="/admin/orders" className="text-nav text-copper">
          ← All orders
        </Link>
      </div>
      <OrderManager
        order={{
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          paymentStatus: order.paymentStatus,
          paymentMethod: order.paymentMethod,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          customerPhone: order.customerPhone,
          shippingAddress: order.shippingAddress,
          shippingCity: order.shippingCity,
          shippingNotes: order.shippingNotes,
          trackingNumber: order.trackingNumber,
          trackingUrl: order.trackingUrl,
          adminNotes: order.adminNotes,
          subtotal: order.subtotal,
          shippingFee: order.shippingFee,
          total: order.total,
          currency: order.currency,
          items: order.items,
        }}
        payUrl={payUrl}
        whatsappCustomerUrl={whatsappCustomerUrl}
      />
    </div>
  );
}
