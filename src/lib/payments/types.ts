export type PaymentProviderId = "cod" | "bank_transfer" | "gateway";

export type InitiatePaymentInput = {
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  customerEmail: string;
  customerName: string;
  returnUrl: string;
};

export type InitiatePaymentResult = {
  provider: PaymentProviderId;
  paymentStatus: "UNPAID" | "AWAITING_VERIFICATION" | "PAID";
  redirectUrl?: string;
  instructions?: string;
  referenceHint?: string;
};

export type PaymentProvider = {
  id: PaymentProviderId;
  label: string;
  description: string;
  initiate: (input: InitiatePaymentInput) => Promise<InitiatePaymentResult>;
  verifyWebhook?: (payload: unknown, signature?: string) => Promise<{
    orderId: string;
    paid: boolean;
    externalRef?: string;
  }>;
};
