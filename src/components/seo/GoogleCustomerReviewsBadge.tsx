"use client";

import Script from "next/script";

/**
 * Google Customer Reviews seller-rating badge (sitewide).
 * Shows "no rating available" until reviews exist — expected for new merchants.
 */
export function GoogleCustomerReviewsBadge() {
  return (
    <Script id="gcr-merchant-badge" strategy="afterInteractive">
      {`
        (function() {
          var s = document.createElement('script');
          s.id = 'merchantWidgetScript';
          s.src = 'https://www.gstatic.com/shopping/merchant/merchantwidget.js';
          s.defer = true;
          s.addEventListener('load', function () {
            if (window.merchantwidget && window.merchantwidget.start) {
              window.merchantwidget.start({
                merchant_id: 5879055103,
                position: 'BOTTOM_LEFT'
              });
            }
          });
          document.body.appendChild(s);
        })();
      `}
    </Script>
  );
}
