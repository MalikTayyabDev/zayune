import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { AccountQuickLinks } from "@/components/account/AccountQuickLinks";
import { ProfileForm } from "@/components/account/ProfileForm";
import { SignOutButton } from "@/components/account/SignOutButton";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { authOptions } from "@/lib/auth";
import {
  BUDGET_RANGES,
  PIECE_TYPES,
  labelFor,
} from "@/lib/custom-requests";
import { getDemoCustomers } from "@/lib/demo-customers";
import { isDemoMode } from "@/lib/demo-data";
import { listDemoCustomRequestsByEmail } from "@/lib/demo-custom-requests";
import { listDemoOrdersByEmail } from "@/lib/demo-orders";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Account" };

function statusLabel(status: string) {
  return status.replace(/_/g, " ").toLowerCase();
}

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/account/login");

  const email = session.user.email;

  const profile = isDemoMode()
    ? getDemoCustomers().get(email.toLowerCase())
    : await prisma.customer.findUnique({ where: { email: email.toLowerCase() } });

  const [orders, customRequests] = await Promise.all([
    isDemoMode()
      ? Promise.resolve(listDemoOrdersByEmail(email))
      : prisma.order.findMany({
          where: { customerEmail: { equals: email, mode: "insensitive" } },
          orderBy: { createdAt: "desc" },
          take: 20,
          include: { items: true },
        }),
    isDemoMode()
      ? Promise.resolve(listDemoCustomRequestsByEmail(email))
      : prisma.customRequest.findMany({
          where: { email: { equals: email, mode: "insensitive" } },
          orderBy: { createdAt: "desc" },
          take: 10,
        }),
  ]);

  const openOrders = orders.filter(
    (o) => o.status !== "DELIVERED" && o.status !== "CANCELLED"
  ).length;

  return (
    <div className="container-content py-14 sm:py-20">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          eyebrow="Account"
          title={`Hello, ${session.user.name?.split(" ")[0] || "there"}`}
          description="Your orders, wishlist, and custom requests — in one place."
        />
        <SignOutButton />
      </div>

      <div className="mt-10 border border-stone bg-stone/15 p-6 sm:p-8">
        <p className="text-nav text-aubergine/45">Signed in</p>
        <p className="mt-2 font-body text-sm text-aubergine">
          {session.user.name || "Customer"}
        </p>
        <p className="mt-1 text-sm text-aubergine/60">{email}</p>
        <div className="mt-6 flex flex-wrap gap-6 text-sm">
          <div>
            <p className="text-nav text-aubergine/45">Orders</p>
            <p className="mt-1 font-display text-2xl text-aubergine">
              {orders.length}
            </p>
          </div>
          <div>
            <p className="text-nav text-aubergine/45">In progress</p>
            <p className="mt-1 font-display text-2xl text-aubergine">
              {openOrders}
            </p>
          </div>
          <div>
            <p className="text-nav text-aubergine/45">Custom requests</p>
            <p className="mt-1 font-display text-2xl text-aubergine">
              {customRequests.length}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <AccountQuickLinks />
      </div>

      <section className="mt-14 max-w-2xl">
        <ProfileForm
          name={profile?.name || session.user.name || ""}
          email={email}
          phone={profile?.phone}
        />
      </section>

      <section className="mt-14">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display text-2xl text-aubergine">Recent orders</h2>
          {orders.length > 0 && (
            <Link href="/account/orders" className="text-nav text-copper hover:text-aubergine">
              View all
            </Link>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="border border-stone p-8">
            <p className="text-sm text-aubergine/60">
              No orders on this account yet. Place an order while signed in (or
              use the same email at checkout) and it will show up here.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/shop">Shop the edit</Button>
              <Button href="/custom" variant="secondary">
                Request custom
              </Button>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-stone border border-stone">
            {orders.slice(0, 5).map((order) => (
              <li
                key={order.id}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="text-sm text-aubergine">{order.orderNumber}</p>
                  <p className="mt-1 text-xs capitalize text-aubergine/50">
                    {statusLabel(order.status)} ·{" "}
                    {statusLabel(order.paymentStatus)} ·{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  {"items" in order && Array.isArray(order.items) && (
                    <p className="mt-2 truncate text-xs text-aubergine/55">
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
                  <span className="font-medium">
                    {formatPrice(order.total, order.currency)}
                  </span>
                  <Link
                    href={`/order/${order.id}/confirmation`}
                    className="text-nav text-copper hover:text-aubergine"
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
      </section>

      <section className="mt-14">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display text-2xl text-aubergine">
            Custom requests
          </h2>
          <Link href="/custom" className="text-nav text-copper hover:text-aubergine">
            New request
          </Link>
        </div>

        {customRequests.length === 0 ? (
          <div className="border border-stone p-8 text-sm text-aubergine/60">
            <p>No custom requests yet.</p>
            <Button href="/custom" className="mt-6">
              Start a custom request
            </Button>
          </div>
        ) : (
          <ul className="divide-y divide-stone border border-stone">
            {customRequests.map((req) => (
              <li
                key={req.id}
                className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm text-aubergine">
                    {labelFor(PIECE_TYPES, req.pieceType)}
                  </p>
                  <p className="mt-1 text-xs text-aubergine/50">
                    {labelFor(BUDGET_RANGES, req.budget)} ·{" "}
                    {new Date(req.createdAt).toLocaleDateString()}
                  </p>
                  <p className="mt-2 line-clamp-2 text-xs text-aubergine/60">
                    {req.colors} — {req.details}
                  </p>
                </div>
                <span className="text-nav text-copper shrink-0">{req.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
