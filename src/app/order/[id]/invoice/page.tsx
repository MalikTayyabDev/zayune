import { notFound } from "next/navigation";
import { isDemoMode } from "@/lib/demo-data";
import { findDemoOrder } from "@/lib/demo-orders";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

type Props = {
  params: { id: string };
  searchParams: { email?: string };
};

async function getOrder(idOrNumber: string, email?: string) {
  if (isDemoMode()) {
    const order = findDemoOrder(idOrNumber);
    if (!order) return null;
    if (email && order.customerEmail.toLowerCase() !== email.toLowerCase()) {
      return null;
    }
    return order;
  }

  const order = await prisma.order.findFirst({
    where: {
      OR: [{ id: idOrNumber }, { orderNumber: idOrNumber }],
      ...(email
        ? { customerEmail: { equals: email, mode: "insensitive" } }
        : {}),
    },
    include: { items: true },
  });
  return order;
}

export default async function InvoicePage({ params, searchParams }: Props) {
  const order = await getOrder(params.id, searchParams.email);
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-3xl bg-white px-6 py-10 text-aubergine print:p-0">
      <div className="flex items-start justify-between gap-6 border-b border-stone pb-6">
        <div>
          <p className="text-nav text-aubergine/50">Invoice</p>
          <h1 className="mt-2 font-display text-4xl">{siteConfig.name}</h1>
          <p className="mt-1 text-sm text-aubergine/60">{siteConfig.tagline}</p>
        </div>
        <div className="text-right text-sm">
          <p className="font-medium">{order.orderNumber}</p>
          <p className="mt-1 text-aubergine/60">
            {new Date(
              "createdAt" in order && order.createdAt
                ? order.createdAt
                : Date.now()
            ).toLocaleDateString("en-PK")}
          </p>
          <p className="mt-1 text-aubergine/60">{order.status}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 text-sm">
        <div>
          <p className="text-nav text-aubergine/45 mb-2">Bill to</p>
          <p>{order.customerName}</p>
          <p className="text-aubergine/70">{order.customerEmail}</p>
          <p className="text-aubergine/70">{order.customerPhone}</p>
        </div>
        <div>
          <p className="text-nav text-aubergine/45 mb-2">Ship to</p>
          <p>{order.shippingAddress}</p>
          <p className="text-aubergine/70">{order.shippingCity}</p>
        </div>
      </div>

      <table className="mt-10 w-full text-left text-sm">
        <thead className="border-b border-stone text-nav text-aubergine/45">
          <tr>
            <th className="py-3 font-normal">Item</th>
            <th className="py-3 font-normal">Qty</th>
            <th className="py-3 font-normal text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.id} className="border-b border-stone/60">
              <td className="py-3">
                {item.name}
                {item.variantName ? ` · ${item.variantName}` : ""}
              </td>
              <td className="py-3">{item.quantity}</td>
              <td className="py-3 text-right">
                {formatPrice(item.price * item.quantity, order.currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 ml-auto w-full max-w-xs space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(order.subtotal, order.currency)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{formatPrice(order.shippingFee, order.currency)}</span>
        </div>
        <div className="flex justify-between border-t border-stone pt-2 font-medium">
          <span>Total</span>
          <span>{formatPrice(order.total, order.currency)}</span>
        </div>
        <div className="flex justify-between text-aubergine/60">
          <span>Payment</span>
          <span>
            {order.paymentMethod.replace("_", " ")} ·{" "}
            {order.paymentStatus.replace("_", " ")}
          </span>
        </div>
      </div>

      <p className="mt-12 text-center text-xs text-aubergine/45">
        {siteConfig.url} · {siteConfig.instagramHandle} · Print this page to save a PDF
      </p>

      <style>{`@media print { body { background: white; } header, footer, .sticky { display: none !important; } }`}</style>
    </div>
  );
}
