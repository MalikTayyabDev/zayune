import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { authOptions } from "@/lib/auth";
import { isDemoMode } from "@/lib/demo-data";
import { listDemoOrdersByEmail } from "@/lib/demo-orders";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Your orders" };

function statusLabel(status: string) {
  return status.replace(/_/g, " ").toLowerCase();
}

export default async function AccountOrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/account/login");

  const email = session.user.email;
  const orders = isDemoMode()
    ? listDemoOrdersByEmail(email)
    : await prisma.order.findMany({
        where: { customerEmail: { equals: email, mode: "insensitive" } },
        orderBy: { createdAt: "desc" },
        include: { items: true },
      });

  return (
    <div className="py-2 sm:py-4">
      <SectionHeading
        eyebrow="Account"
        title="Your orders"
        description="Every order placed with this email."
      />
      <p className="mt-4">
        <Link href="/account" className="text-nav text-copper hover:text-aubergine">
          ← Back to account
        </Link>
      </p>

      {orders.length === 0 ? (
        <div className="mt-10 border border-stone p-8 text-sm text-aubergine/60">
          <p>No orders yet.</p>
          <Button href="/shop" className="mt-6">
            Shop the edit
          </Button>
        </div>
      ) : (
        <ul className="mt-10 divide-y divide-stone border border-stone">
          {orders.map((order) => (
            <li
              key={order.id}
              className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm text-aubergine">{order.orderNumber}</p>
                <p className="mt-1 text-xs capitalize text-aubergine/50">
                  {statusLabel(order.status)} · {statusLabel(order.paymentStatus)} ·{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                {"items" in order && Array.isArray(order.items) && (
                  <p className="mt-2 text-xs text-aubergine/55">
                    {order.items
                      .map(
                        (item: { name: string; quantity: number }) =>
                          `${item.name} × ${item.quantity}`
                      )
                      .join(" · ")}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span>{formatPrice(order.total, order.currency)}</span>
                <Link
                  href={`/order/${order.id}/confirmation`}
                  className="text-nav text-copper"
                >
                  Details
                </Link>
                <Link
                  href={`/order/${order.id}/invoice?email=${encodeURIComponent(email)}`}
                  className="text-nav text-aubergine/55 hover:text-copper"
                >
                  Invoice
                </Link>
                <Link
                  href={`/track?order=${encodeURIComponent(order.orderNumber)}&email=${encodeURIComponent(email)}`}
                  className="text-nav text-aubergine/55 hover:text-copper"
                >
                  Track
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
