/**
 * Business rules:
 * - Bank / Raast → always 30% advance to confirm
 * - Made-to-order / custom pieces → 30% advance required (no COD);
 *   once crocheted there is no going back
 * - In-stock ready pieces → COD allowed (pay on delivery, no advance)
 */

export type FulfillmentLike = string | null | undefined;

export function isMadeToOrder(fulfillment: FulfillmentLike) {
  return fulfillment === "MADE_TO_ORDER";
}

export function cartRequiresAdvance(
  lines: Array<{ fulfillment?: FulfillmentLike }>
) {
  return lines.some((line) => isMadeToOrder(line.fulfillment));
}

export function paymentRequiresAdvance(paymentMethod: string) {
  return (
    paymentMethod === "bank_transfer" ||
    paymentMethod === "BANK_TRANSFER"
  );
}

/** True when this order must collect 30% before production starts. */
export function orderRequiresAdvance(input: {
  paymentMethod: string;
  lines: Array<{ fulfillment?: FulfillmentLike }>;
}) {
  return (
    paymentRequiresAdvance(input.paymentMethod) ||
    cartRequiresAdvance(input.lines)
  );
}
