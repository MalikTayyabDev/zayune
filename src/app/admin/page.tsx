import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getDemoMetrics, isDemoMode } from "@/lib/demo-catalog";
import { listDemoOrders } from "@/lib/demo-orders";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default async function AdminHomePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  let metrics = {
    productCount: 0,
    publishedCount: 0,
    orderCount: 0,
    pendingCount: 0,
    shippedCount: 0,
    revenue: 0,
    customerEstimate: 0,
    lowStockCount: 0,
    avgOrderValue: 0,
    invoiceCount: 0,
    bestSellers: [] as { name: string; qty: number; revenue: number }[],
  };

  let recentOrders: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    total: number;
    currency: string;
    status: string;
    paymentStatus: string;
  }> = [];

  if (isDemoMode()) {
    const demo = getDemoMetrics();
    metrics = demo;
    recentOrders = listDemoOrders().slice(0, 6);
  } else {
    const [
      productCount,
      publishedCount,
      orderCount,
      pendingCount,
      shippedCount,
      paidOrders,
      customerEstimate,
      lowStockCount,
      recent,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { published: true } }),
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { status: "SHIPPED" } }),
      prisma.order.findMany({
        where: { OR: [{ paymentStatus: "PAID" }, { status: "DELIVERED" }] },
        select: { total: true },
      }),
      prisma.customer.count(),
      prisma.product.count({
        where: { fulfillment: "IN_STOCK", stock: { lte: 2 } },
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
    ]);

    const revenue = paidOrders.reduce((s, o) => s + o.total, 0);
    const allTotals = await prisma.order.aggregate({ _avg: { total: true } });

    const itemAgg = await prisma.orderItem.groupBy({
      by: ["name"],
      _sum: { quantity: true, price: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    });

    metrics = {
      productCount,
      publishedCount,
      orderCount,
      pendingCount,
      shippedCount,
      revenue,
      customerEstimate,
      lowStockCount,
      avgOrderValue: Math.round(allTotals._avg.total || 0),
      invoiceCount: orderCount,
      bestSellers: itemAgg.map((row) => ({
        name: row.name,
        qty: row._sum.quantity || 0,
        revenue: 0,
      })),
    };
    recentOrders = recent;
  }

  const cards = [
    { label: "Revenue", value: formatPrice(metrics.revenue), href: "/admin/orders" },
    { label: "Orders", value: String(metrics.orderCount), href: "/admin/orders" },
    { label: "Pending", value: String(metrics.pendingCount), href: "/admin/orders" },
    { label: "Shipped", value: String(metrics.shippedCount), href: "/admin/orders" },
    {
      label: "Products",
      value: `${metrics.publishedCount}/${metrics.productCount}`,
      href: "/admin/products",
    },
    {
      label: "Low stock",
      value: String(metrics.lowStockCount),
      href: "/admin/products?stock=low",
    },
    {
      label: "Customers",
      value: String(metrics.customerEstimate),
      href: "/admin/customers",
    },
    {
      label: "Avg order",
      value: formatPrice(metrics.avgOrderValue),
      href: "/admin/orders",
    },
    {
      label: "Invoices",
      value: String(metrics.invoiceCount),
      href: "/admin/orders",
    },
  ];

  return (
    <div className="py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="Dashboard"
          title="Store metrics"
          description={
            isDemoMode()
              ? "Demo mode — orders & product edits persist in memory until restart. Connect Postgres for production."
              : "Live snapshot of your ZAYUNE storefront."
          }
        />
        <div className="flex gap-3">
          <Link
            href="/admin/products/new"
            className="bg-aubergine px-4 py-2 text-nav text-porcelain"
          >
            New product
          </Link>
          <Link
            href="/admin/orders"
            className="border border-stone px-4 py-2 text-nav"
          >
            Manage orders
          </Link>
        </div>
      </div>

      <div className="card-grid-stat mt-8 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="flex min-h-[4.5rem] flex-col justify-center border border-stone bg-porcelain p-3 transition hover:border-aubergine/30 sm:min-h-0 sm:p-5"
          >
            <p className="text-[10px] uppercase tracking-nav text-aubergine/45 sm:text-nav">
              {card.label}
            </p>
            <p className="mt-1.5 font-display text-xl leading-none sm:mt-3 sm:text-3xl">
              {card.value}
            </p>
          </Link>
        ))}
      </div>

      <section className="mt-14">
        <h2 className="mb-6 font-display text-2xl">Best sellers</h2>
        {metrics.bestSellers.length === 0 ? (
          <p className="border border-stone p-6 text-sm text-aubergine/60">
            Best sellers appear after orders are placed.
          </p>
        ) : (
          <ul className="divide-y divide-stone border border-stone">
            {metrics.bestSellers.map((item, i) => (
              <li
                key={item.name}
                className="flex items-center justify-between gap-4 p-4 text-sm"
              >
                <span>
                  <span className="text-nav text-brass mr-3">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item.name}
                </span>
                <span className="text-aubergine/60">
                  {item.qty} sold
                  {item.revenue > 0 ? ` · ${formatPrice(item.revenue)}` : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-14">
        <h2 className="font-display text-2xl mb-6">Recent orders</h2>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-aubergine/60 border border-stone p-6">
            No orders yet. Place a test checkout to see metrics populate.
          </p>
        ) : (
          <div className="overflow-x-auto border border-stone">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-stone text-nav text-aubergine/45">
                <tr>
                  <th className="p-4 font-normal">Order</th>
                  <th className="p-4 font-normal">Customer</th>
                  <th className="p-4 font-normal">Total</th>
                  <th className="p-4 font-normal">Status</th>
                  <th className="p-4 font-normal">Payment</th>
                  <th className="p-4 font-normal"></th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-stone/70">
                    <td className="p-4">{order.orderNumber}</td>
                    <td className="p-4">{order.customerName}</td>
                    <td className="p-4">{formatPrice(order.total, order.currency)}</td>
                    <td className="p-4">{order.status}</td>
                    <td className="p-4">{order.paymentStatus.replace("_", " ")}</td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-nav text-copper"
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
