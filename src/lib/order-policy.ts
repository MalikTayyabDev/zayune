/**
 * Business rules (ZAYUNE):
 * - Every order: 30% bank/Raast advance to confirm
 * - Remaining 70% paid on delivery (or as arranged)
 * - Bank transfer receipt can be attached on the pay/confirm link
 */

export { formatAdvance } from "@/lib/bank-details";

export type FulfillmentLike = string | null | undefined;

export function isMadeToOrder(fulfillment: FulfillmentLike) {
  return fulfillment === "MADE_TO_ORDER";
}

/** All carts require 30% advance before fulfillment starts. */
export function cartRequiresAdvance(
  _lines?: Array<{ fulfillment?: FulfillmentLike }>
) {
  return true;
}

export function paymentRequiresAdvance(paymentMethod: string) {
  return (
    paymentMethod === "bank_transfer" ||
    paymentMethod === "BANK_TRANSFER" ||
    paymentMethod === "cod" // COD = remaining 70% on delivery after advance
  );
}

/** True when this order must collect 30% before production / packing. */
export function orderRequiresAdvance(_input?: {
  paymentMethod?: string;
  lines?: Array<{ fulfillment?: FulfillmentLike }>;
}) {
  return true;
}

export function formatBalanceOnDelivery(total: number) {
  return Math.max(0, total - Math.round(total * 0.3));
}
