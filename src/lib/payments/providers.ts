import type { PaymentProvider } from "./types";

const codProvider: PaymentProvider = {
  id: "cod",
  label: "Cash on Delivery",
  description: "Pay when your piece arrives. Available for selected cities.",
  async initiate() {
    return {
      provider: "cod",
      paymentStatus: "UNPAID",
      instructions: "Please keep the exact amount ready for the courier.",
    };
  },
};

const bankTransferProvider: PaymentProvider = {
  id: "bank_transfer",
  label: "Bank / Raast Transfer",
  description: "Transfer to our account and share your payment reference.",
  async initiate(input) {
    const bankName = process.env.BANK_NAME || "[Bank name — to be supplied]";
    const title = process.env.BANK_ACCOUNT_TITLE || "ZAYUNE";
    const number = process.env.BANK_ACCOUNT_NUMBER || "[Account number — to be supplied]";
    const iban = process.env.BANK_IBAN || "[IBAN / Raast ID — to be supplied]";

    return {
      provider: "bank_transfer",
      paymentStatus: "AWAITING_VERIFICATION",
      referenceHint: input.orderNumber,
      instructions: [
        `Transfer ${input.amount.toLocaleString("en-PK")} ${input.currency} to:`,
        `${title}`,
        `${bankName}`,
        `Account: ${number}`,
        `IBAN / Raast: ${iban}`,
        `Use reference: ${input.orderNumber}`,
        "We will confirm payment manually and update your order.",
      ].join("\n"),
    };
  },
};

/** Placeholder for Safepay / PayFast / Paymob — swap implementation without changing checkout UI. */
const gatewayProvider: PaymentProvider = {
  id: "gateway",
  label: "Card / Wallet",
  description: "Pay securely by card or local wallet. [Gateway — to be connected]",
  async initiate(input) {
    const enabled = process.env.PAYMENT_GATEWAY_PROVIDER && process.env.PAYMENT_GATEWAY_PROVIDER !== "none";

    if (!enabled) {
      return {
        provider: "gateway",
        paymentStatus: "UNPAID",
        instructions:
          "Card and wallet payments will be available once the local gateway is connected. Please choose Cash on Delivery or bank transfer for now.",
      };
    }

    // Provider-specific redirect would be built here using PAYMENT_GATEWAY_* env vars.
    return {
      provider: "gateway",
      paymentStatus: "UNPAID",
      redirectUrl: `${input.returnUrl}?pending=1`,
      instructions: "You will be redirected to complete payment.",
    };
  },
  async verifyWebhook() {
    // Server-side webhook verification must be implemented per gateway.
    // Never trust client-side redirect alone.
    throw new Error("Gateway webhook verification is not configured.");
  },
};

const providers: PaymentProvider[] = [
  codProvider,
  bankTransferProvider,
  gatewayProvider,
];

export function listPaymentProviders() {
  const gatewayEnabled =
    process.env.PAYMENT_GATEWAY_PROVIDER &&
    process.env.PAYMENT_GATEWAY_PROVIDER !== "none";

  return providers.filter((p) => p.id !== "gateway" || gatewayEnabled);
}

export function getPaymentProvider(id: string) {
  return providers.find((p) => p.id === id);
}
