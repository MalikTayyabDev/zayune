"use client";

import Script from "next/script";

type Props = {
  orderId: string;
  email: string;
  /** ISO date YYYY-MM-DD */
  estimatedDeliveryDate: string;
  deliveryCountry?: string;
};

declare global {
  interface Window {
    renderOptIn?: () => void;
    gapi?: {
      load: (name: string, cb: () => void) => void;
      surveyoptin?: {
        render: (config: Record<string, unknown>) => void;
      };
    };
  }
}

/**
 * Google Customer Reviews opt-in — confirmation page only.
 * Merchant Center ID 5879055103.
 */
export function GoogleCustomerReviewsOptIn({
  orderId,
  email,
  estimatedDeliveryDate,
  deliveryCountry = "PK",
}: Props) {
  return (
    <>
      <Script id="gcr-optin-fn" strategy="afterInteractive">
        {`
          window.renderOptIn = function() {
            if (!window.gapi || !window.gapi.load) return;
            window.gapi.load('surveyoptin', function() {
              window.gapi.surveyoptin.render({
                merchant_id: 5879055103,
                order_id: ${JSON.stringify(orderId)},
                email: ${JSON.stringify(email)},
                delivery_country: ${JSON.stringify(deliveryCountry)},
                estimated_delivery_date: ${JSON.stringify(estimatedDeliveryDate)}
              });
            });
          };
        `}
      </Script>
      <Script
        src="https://apis.google.com/js/platform.js?onload=renderOptIn"
        strategy="afterInteractive"
      />
    </>
  );
}
