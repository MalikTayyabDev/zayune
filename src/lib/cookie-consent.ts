export type CookieCategory = "necessary" | "analytics" | "marketing";

export type CookieConsentState = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

export const COOKIE_CONSENT_KEY = "zayune_cookie_consent";

export const defaultConsent = (): CookieConsentState => ({
  necessary: true,
  analytics: false,
  marketing: false,
  updatedAt: new Date().toISOString(),
});

export function readConsent(): CookieConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CookieConsentState>;
    return {
      necessary: true,
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
      updatedAt: parsed.updatedAt || new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function writeConsent(
  partial: Pick<CookieConsentState, "analytics" | "marketing">
): CookieConsentState {
  const next: CookieConsentState = {
    necessary: true,
    analytics: partial.analytics,
    marketing: partial.marketing,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("zayune:cookie-consent", { detail: next }));
  return next;
}

export function hasConsent(category: CookieCategory): boolean {
  if (category === "necessary") return true;
  const consent = readConsent();
  if (!consent) return false;
  return Boolean(consent[category]);
}
