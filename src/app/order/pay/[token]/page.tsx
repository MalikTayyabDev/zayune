import Link from "next/link";
import { notFound } from "next/navigation";
import { CopperStar } from "@/components/brand/CopperStar";
import { OrderPayActions } from "@/components/order/OrderPayActions";
import { Button } from "@/components/ui/Button";
import { formatAdvance, getBankDetails } from "@/lib/bank-details";
import { findDemoOrder } from "@/lib/demo-orders";
import { ensureDatabaseUrl } from "@/lib/env";
import { formatBalanceOnDelivery } from "@/lib/order-policy";
import { verifyOrderAccessToken } from "@/lib/order-token";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { whatsappToStudioUrl } from "@/lib/whatsapp-order";

type Props = {
  params: { token: string };
};

export const dynamic = "force-dynamic";

async function getOrderFromToken(token: string) {
  const payload = verifyOrderAccessToken(token);
  if (!payload) return null;

  if (ensureDatabaseUrl()) {
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id: payload.id }, { orderNumber: payload.n }],
      },
      include: { items: true },
    });
    if (!order || order.orderNumber !== payload.n) return null;
    return order;
  }

  return findDemoOrder(payload.id) || findDemoOrder(payload.n) || null;
}

export default async function OrderPayPage({ params }: Props) {
  const token = decodeURIComponent(params.token);
  const order = await getOrderFromToken(token);
  if (!order) notFound();

  const advance = formatAdvance(order.total);
  const balance = formatBalanceOnDelivery(order.total);
  const bank = getBankDetails();
  const advanceMarked =
    order.paymentStatus === "AWAITING_VERIFICATION" ||
    order.paymentStatus === "PAID";

  const studioWa = whatsappToStudioUrl(
    `Hi ZAYUNE — I’ve opened my payment link for order ${order.orderNumber}. I’m transferring the 30% advance (Rs ${advance.toLocaleString("en-PK")}). Remaining 70% on delivery.`
  );

  return (
    <div className="container-content max-w-narrow mx-auto py-14 sm:py-20">
      <CopperStar animated size={16} className="mx-auto" />
      <p className="mt-5 text-center text-nav text-aubergine/50">
        Order {order.orderNumber}
      </p>
      <h1 className="mt-2 text-center font-display text-4xl text-aubergine">
        Pay 30% to confirm
      </h1>
      <p className="mx-auto mt-3 max-w-md text-center text-sm text-aubergine/65">
        Hi {order.customerName.split(" ")[0]} — we emailed this link to{" "}
        <strong>{order.customerEmail}</strong>. Transfer the advance, attach your
        receipt, and the remaining 70% is due on delivery.
      </p>
      <p className="mx-auto mt-2 text-center text-xs uppercase tracking-nav text-aubergine/45">
        Status: {order.status.replace("_", " ")} · Payment{" "}
        {order.paymentStatus.replace("_", " ")}
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3 text-center text-sm">
        <div className="border border-stone bg-stone/15 px-3 py-4">
          <p className="text-nav text-aubergine/45">Due now (30%)</p>
          <p className="mt-1 font-display text-2xl text-copper">
            {formatPrice(advance, order.currency)}
          </p>
        </div>
        <div className="border border-stone bg-stone/15 px-3 py-4">
          <p className="text-nav text-aubergine/45">On delivery (70%)</p>
          <p className="mt-1 font-display text-2xl text-aubergine">
            {formatPrice(balance, order.currency)}
          </p>
        </div>
      </div>

      <div className="mt-6 border border-stone bg-stone/15 px-5 py-6">
        <p className="text-nav text-aubergine/50">Bank / Raast</p>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-aubergine/55">Account title</dt>
            <dd>{bank.accountTitle}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-aubergine/55">Bank</dt>
            <dd>{bank.bankName}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-aubergine/55">Account</dt>
            <dd>{bank.accountNumber}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-aubergine/55">IBAN / Raast</dt>
            <dd className="text-right">{bank.iban}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-aubergine/55">Payment reference</dt>
            <dd className="font-medium">{order.orderNumber}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-8">
        <OrderPayActions
          token={token}
          isBank
          alreadyConfirmed={false}
          advanceMarked={advanceMarked}
        />
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button href={studioWa} target="_blank" rel="noreferrer">
          WhatsApp ZAYUNE
        </Button>
        <Button href={`/track?order=${order.orderNumber}`} variant="secondary">
          Track order
        </Button>
      </div>

      <p className="mt-10 text-center text-xs text-aubergine/40">
        <Link href="/" className="hover:text-copper">
          Return home
        </Link>
      </p>
    </div>
  );
}
