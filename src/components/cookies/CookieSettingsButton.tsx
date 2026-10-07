"use client";

import { openCookiePreferences } from "@/components/cookies/CookieConsent";

export function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => openCookiePreferences()}
      className="text-left text-porcelain/55 transition hover:text-brass"
    >
      Cookie settings
    </button>
  );
}
