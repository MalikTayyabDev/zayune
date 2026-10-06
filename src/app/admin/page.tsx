import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getDemoMetrics, isDemoMode } from "@/lib/demo-catalog";
import { listDemoOrders } from "@/lib/demo-orders";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

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

  const primary = [
    {
      label: "Revenue",
      value: formatPrice(metrics.revenue),
      href: "/admin/orders",
      hint: "Paid & delivered",
    },
    {
      label: "Orders",
      value: String(metrics.orderCount),
      href: "/admin/orders",
      hint: "All time",
    },
    {
      label: "Pending",
      value: String(metrics.pendingCount),
      href: "/admin/orders",
      hint: "Needs attention",
      alert: metrics.pendingCount > 0,
    },
    {
      label: "Low stock",
      value: String(metrics.lowStockCount),
      href: "/admin/products?stock=low",
      hint: "In-stock ≤ 2",
      alert: metrics.lowStockCount > 0,
    },
  ];

  const secondary = [
    {
      label: "Products",
      value: `${metrics.publishedCount}/${metrics.productCount}`,
      href: "/admin/products",
    },
    {
      label: "Shipped",
      value: String(metrics.shippedCount),
      href: "/admin/orders",
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
    <div className="space-y-10">
      <header className="flex flex-col gap-5 border-b border-stone pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-nav text-aubergine/45">Dashboard</p>
          <h1 className="mt-1 font-display text-3xl text-aubergine sm:text-4xl">
            Store overview
          </h1>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-aubergine/60">
            {isDemoMode()
              ? "Demo mode — connect Postgres for production metrics."
              : "Live snapshot of orders, stock, and sales."}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center bg-aubergine px-5 py-2.5 text-[11px] uppercase tracking-nav text-porcelain"
          >
            New product
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex items-center justify-center border border-stone bg-porcelain px-5 py-2.5 text-[11px] uppercase tracking-nav text-aubergine"
          >
            Manage orders
          </Link>
        </div>
      </header>

      {/* Primary metrics — roomy */}
      <section>
        <p className="mb-3 text-nav text-aubergine/40">Key metrics</p>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {primary.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className={`flex min-h-[7.5rem] flex-col justify-between border bg-porcelain p-5 transition hover:border-aubergine/35 ${
                card.alert
                  ? "border-copper/50 shadow-[inset_3px_0_0_0_var(--copper,#B85F45)]"
                  : "border-stone"
              }`}
            >
              <p className="text-[10px] uppercase tracking-nav text-aubergine/45">
                {card.label}
              </p>
              <p className="font-display text-3xl leading-none text-aubergine sm:text-4xl">
                {card.value}
              </p>
              <p className="text-xs text-aubergine/40">{card.hint}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Secondary — compact strip */}
      <section>
        <p className="mb-3 text-nav text-aubergine/40">More</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {secondary.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="border border-stone bg-porcelain px-4 py-4 transition hover:border-aubergine/30"
            >
              <p className="text-[10px] uppercase tracking-nav text-aubergine/40">
                {card.label}
              </p>
              <p className="mt-2 font-display text-xl text-aubergine sm:text-2xl">
                {card.value}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="min-w-0">
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <h2 className="font-display text-2xl text-aubergine">Best sellers</h2>
            <Link href="/admin/products" className="text-nav text-copper">
              Products
            </Link>
          </div>
          {metrics.bestSellers.length === 0 ? (
            <p className="border border-stone bg-porcelain p-6 text-sm text-aubergine/55">
              Best sellers appear after orders are placed.
            </p>
          ) : (
            <ul className="divide-y divide-stone border border-stone bg-porcelain">
              {metrics.bestSellers.map((item, i) => (
                <li
                  key={item.name}
                  className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-5 py-4 text-sm"
                >
                  <span className="text-nav text-brass">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="truncate text-aubergine">{item.name}</span>
                  <span className="shrink-0 text-aubergine/55">{item.qty} sold</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="min-w-0">
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <h2 className="font-display text-2xl text-aubergine">Recent orders</h2>
            <Link href="/admin/orders" className="text-nav text-copper">
              All orders
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="border border-stone bg-porcelain p-6 text-sm text-aubergine/55">
              No orders yet. Place a test checkout to see metrics populate.
            </p>
          ) : (
            <ul className="divide-y divide-stone border border-stone bg-porcelain">
              {recentOrders.map((order) => (
                <li key={order.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate font-medium tracking-wide text-aubergine">
                        {order.orderNumber}
                      </p>
                      <p className="mt-1 truncate text-sm text-aubergine/60">
                        {order.customerName}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm text-aubergine">
                        {formatPrice(order.total, order.currency)}
                      </p>
                      <p className="mt-1 text-[10px] uppercase tracking-nav text-aubergine/45">
                        {order.status} · {order.paymentStatus.replace("_", " ")}
                      </p>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="mt-2 inline-block text-nav text-copper"
                      >
                        Open
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
