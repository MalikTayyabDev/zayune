"use client";

import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { siteConfig, whatsappHref } from "@/lib/site";

export function WhatsAppFloat() {
  const href = whatsappHref(
    "Hi ZAYUNE — I have a question about an order / product."
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={`Chat on WhatsApp ${siteConfig.phoneDisplay}`}
      className="whatsapp-float fixed bottom-5 right-5 z-[55] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 sm:bottom-8 sm:right-8"
    >
      <span className="whatsapp-ripple" aria-hidden />
      <span className="whatsapp-ripple delay" aria-hidden />
      <WhatsAppIcon size={28} className="relative z-[1] text-white" />
    </a>
  );
}
