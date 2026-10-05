import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { authOptions } from "@/lib/auth";
import { isDemoMode } from "@/lib/demo-data";
import { listDemoOrders } from "@/lib/demo-orders";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const orders = isDemoMode()
    ? listDemoOrders()
    : await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: { items: true },
      });

  return (
    <div className="container-content py-12">
      <SectionHeading
        title="Orders"
        description="Update status, payment, tracking, and open invoices."
      />

      {orders.length === 0 ? (
        <p className="mt-10 text-sm text-aubergine/60">No orders yet.</p>
      ) : (
        <div className="mt-10 overflow-x-auto border border-stone">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-stone text-nav text-aubergine/45">
              <tr>
                <th className="p-4 font-normal">Order</th>
                <th className="p-4 font-normal">Customer</th>
                <th className="p-4 font-normal">Total</th>
                <th className="p-4 font-normal">Status</th>
                <th className="p-4 font-normal">Payment</th>
                <th className="p-4 font-normal">Tracking</th>
                <th className="p-4 font-normal"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-stone/70">
                  <td className="p-4">{order.orderNumber}</td>
                  <td className="p-4">
                    <div>{order.customerName}</div>
                    <div className="text-xs text-aubergine/50">{order.customerEmail}</div>
                  </td>
                  <td className="p-4">{formatPrice(order.total, order.currency)}</td>
                  <td className="p-4">{order.status}</td>
                  <td className="p-4">{order.paymentStatus.replace("_", " ")}</td>
                  <td className="p-4 text-xs text-aubergine/60">
                    {"trackingNumber" in order && order.trackingNumber
                      ? order.trackingNumber
                      : "—"}
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-nav text-copper"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
