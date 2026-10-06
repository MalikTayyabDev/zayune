import Link from "next/link";
import { CopperStar } from "@/components/brand/CopperStar";
import { OrderNextSteps } from "@/components/order/OrderNextSteps";
import { Button } from "@/components/ui/Button";
import { findDemoOrder } from "@/lib/demo-orders";
import { isDemoMode } from "@/lib/demo-data";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { getPaymentProvider } from "@/lib/payments/providers";

type Props = {
  params: { id: string };
};

async function getOrder(id: string) {
  if (isDemoMode()) {
    return findDemoOrder(id);
  }
  return prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
}

export default async function OrderConfirmationPage({ params }: Props) {
  const order = await getOrder(params.id);

  if (!order) {
    return (
      <div className="container-content py-24 text-center">
        <p className="font-display text-3xl">Order not found</p>
        <p className="mx-auto mt-3 max-w-md text-sm text-aubergine/60">
          If you just placed an order, wait a moment and refresh — or check your
          email for the order number.
        </p>
        <Button href="/shop" className="mt-8">
          Continue shopping
        </Button>
      </div>
    );
  }

  const methodKey =
    order.paymentMethod === "BANK_TRANSFER"
      ? "bank_transfer"
      : order.paymentMethod === "GATEWAY"
        ? "gateway"
        : "cod";

  const provider = getPaymentProvider(methodKey);
  const payment = provider
    ? await provider.initiate({
        orderId: order.id,
        orderNumber: order.orderNumber,
        amount: order.total,
        currency: order.currency,
        customerEmail: order.customerEmail,
        customerName: order.customerName,
        returnUrl: "",
      })
    : null;

  const advanceAmount = Math.round(order.total * 0.3);

  return (
    <div className="container-content py-16 sm:py-24 max-w-narrow mx-auto text-center">
      <CopperStar animated size={18} className="mx-auto" />
      <p className="mt-6 text-nav text-aubergine/50">Order confirmed</p>
      <h1 className="mt-3 font-display text-4xl text-aubergine">Thank you</h1>
      <p className="mt-4 text-sm leading-relaxed text-aubergine/70">
        We’ve received your order, {order.customerName.split(" ")[0]}. Please
        check your confirmation email and WhatsApp us so we can move forward.
      </p>

      <div className="mt-10 border border-stone bg-stone/15 px-6 py-8 text-left">
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-aubergine/55">Order number</dt>
            <dd className="font-medium">{order.orderNumber}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-aubergine/55">Status</dt>
            <dd>{order.status}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-aubergine/55">Total</dt>
            <dd>{formatPrice(order.total, order.currency)}</dd>
          </div>
          {methodKey === "bank_transfer" && (
            <div className="flex justify-between gap-4">
              <dt className="text-aubergine/55">30% advance due</dt>
              <dd className="font-medium text-copper">
                {formatPrice(advanceAmount, order.currency)}
              </dd>
            </div>
          )}
          <div className="flex justify-between gap-4">
            <dt className="text-aubergine/55">Payment</dt>
            <dd className="capitalize">
              {methodKey.replace("_", " ")} ·{" "}
              {order.paymentStatus.toLowerCase().replace("_", " ")}
            </dd>
          </div>
        </dl>

        {payment?.instructions && (
          <div className="mt-6 border-t border-stone pt-6">
            <p className="text-nav text-aubergine/50 mb-3">Payment details</p>
            <p className="text-sm whitespace-pre-line text-aubergine/80 leading-relaxed">
              {payment.instructions}
            </p>
          </div>
        )}
      </div>

      <OrderNextSteps
        orderId={order.id}
        orderNumber={order.orderNumber}
        customerName={order.customerName}
        customerEmail={order.customerEmail}
        total={order.total}
        paymentMethod={String(order.paymentMethod)}
        isBank={methodKey === "bank_transfer"}
        advanceAmount={advanceAmount}
      />

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button href={`/track?order=${order.orderNumber}`}>Track order</Button>
        <Button href={`/order/${order.id}/invoice`} variant="secondary">
          View invoice
        </Button>
        <Button href="/shop" variant="secondary">
          Continue shopping
        </Button>
      </div>

      <p className="mt-8 text-xs text-aubergine/40">
        <Link href="/" className="hover:text-copper">
          Return home
        </Link>
      </p>
    </div>
  );
}
