import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { authOptions } from "@/lib/auth";
import { isDemoMode } from "@/lib/demo-data";
import { listDemoOrders } from "@/lib/demo-orders";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export default async function AdminCustomersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  let rows: Array<{
    email: string;
    name: string;
    orders: number;
    spent: number;
  }> = [];

  if (isDemoMode()) {
    const map = new Map<string, { name: string; orders: number; spent: number }>();
    for (const order of listDemoOrders()) {
      const current = map.get(order.customerEmail) || {
        name: order.customerName,
        orders: 0,
        spent: 0,
      };
      current.orders += 1;
      current.spent += order.total;
      map.set(order.customerEmail, current);
    }
    rows = Array.from(map.entries()).map(([email, data]) => ({ email, ...data }));
  } else {
    const orders = await prisma.order.findMany({
      select: {
        customerEmail: true,
        customerName: true,
        total: true,
      },
    });
    const map = new Map<string, { name: string; orders: number; spent: number }>();
    for (const order of orders) {
      const current = map.get(order.customerEmail) || {
        name: order.customerName,
        orders: 0,
        spent: 0,
      };
      current.orders += 1;
      current.spent += order.total;
      map.set(order.customerEmail, current);
    }
    rows = Array.from(map.entries()).map(([email, data]) => ({ email, ...data }));
  }

  return (
    <div className="container-content py-12">
      <SectionHeading
        title="Customers"
        description="People who have placed orders in your store."
      />
      {rows.length === 0 ? (
        <p className="mt-10 text-sm text-aubergine/60">No customer orders yet.</p>
      ) : (
        <div className="mt-10 overflow-x-auto border border-stone">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-stone text-nav text-aubergine/45">
              <tr>
                <th className="p-4 font-normal">Name</th>
                <th className="p-4 font-normal">Email</th>
                <th className="p-4 font-normal">Orders</th>
                <th className="p-4 font-normal">Total spent</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.email} className="border-b border-stone/70">
                  <td className="p-4">{row.name}</td>
                  <td className="p-4">{row.email}</td>
                  <td className="p-4">{row.orders}</td>
                  <td className="p-4">{formatPrice(row.spent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
