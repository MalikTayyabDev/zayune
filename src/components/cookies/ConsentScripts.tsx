"use client";

import { useEffect, useState } from "react";
import { hasConsent } from "@/lib/cookie-consent";

/**
 * Loads optional third-party scripts only after cookie consent.
 * Add GA / Meta pixel IDs via env when ready:
 *   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXX
 *   NEXT_PUBLIC_META_PIXEL_ID=123456
 */
export function ConsentScripts() {
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    function sync() {
      setAnalytics(hasConsent("analytics"));
      setMarketing(hasConsent("marketing"));
    }
    sync();
    window.addEventListener("zayune:cookie-consent", sync);
    return () => window.removeEventListener("zayune:cookie-consent", sync);
  }, []);

  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const metaId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  useEffect(() => {
    if (!analytics || !gaId || typeof window === "undefined") return;
    if (document.getElementById("zayune-ga")) return;

    const s = document.createElement("script");
    s.id = "zayune-ga";
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(s);

    const inline = document.createElement("script");
    inline.id = "zayune-ga-inline";
    inline.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}', { anonymize_ip: true });
    `;
    document.head.appendChild(inline);
  }, [analytics, gaId]);

  useEffect(() => {
    if (!marketing || !metaId || typeof window === "undefined") return;
    if (document.getElementById("zayune-meta-pixel")) return;

    const inline = document.createElement("script");
    inline.id = "zayune-meta-pixel";
    inline.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${metaId}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(inline);
  }, [marketing, metaId]);

  return null;
}
