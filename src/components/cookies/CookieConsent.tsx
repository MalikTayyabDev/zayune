"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  defaultConsent,
  readConsent,
  writeConsent,
  type CookieConsentState,
} from "@/lib/cookie-consent";

export function CookieConsent() {
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [manage, setManage] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const existing = readConsent();
    if (existing) {
      setAnalytics(existing.analytics);
      setMarketing(existing.marketing);
      setOpen(false);
    } else {
      setOpen(true);
    }
    setReady(true);

    function onOpenPreferences() {
      const current = readConsent() || defaultConsent();
      setAnalytics(current.analytics);
      setMarketing(current.marketing);
      setManage(true);
      setOpen(true);
    }
    window.addEventListener("zayune:open-cookie-preferences", onOpenPreferences);
    return () => {
      window.removeEventListener(
        "zayune:open-cookie-preferences",
        onOpenPreferences
      );
    };
  }, []);

  function save(next: Pick<CookieConsentState, "analytics" | "marketing">) {
    writeConsent(next);
    setAnalytics(next.analytics);
    setMarketing(next.marketing);
    setOpen(false);
    setManage(false);
  }

  if (!ready || !open) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] p-4 sm:p-6">
      <div className="mx-auto max-w-2xl border border-stone bg-porcelain shadow-lg">
        <div className="px-5 py-5 sm:px-6 sm:py-6">
          <p className="text-nav text-aubergine/45">Cookies</p>
          <h2 className="mt-2 font-display text-2xl text-aubergine">
            We use cookies carefully
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-aubergine/70">
            Essential cookies keep checkout, login, and your cart working.
            Optional analytics and marketing cookies help us improve the shop —
            only if you allow them.{" "}
            <Link href="/cookies" className="text-copper hover:text-aubergine">
              Cookie policy
            </Link>
          </p>

          {manage ? (
            <div className="mt-5 space-y-3 border border-stone bg-stone/20 px-4 py-4 text-sm">
              <label className="flex items-start gap-3 text-aubergine/80">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="mt-1 accent-[var(--aubergine,#2A1F2D)]"
                />
                <span>
                  <span className="font-medium text-aubergine">Essential</span>
                  <span className="mt-1 block text-xs text-aubergine/55">
                    Always on — session, security, cart, and order flow.
                  </span>
                </span>
              </label>
              <label className="flex items-start gap-3 text-aubergine/80">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="mt-1 accent-[var(--aubergine,#2A1F2D)]"
                />
                <span>
                  <span className="font-medium text-aubergine">Analytics</span>
                  <span className="mt-1 block text-xs text-aubergine/55">
                    Anonymous visit stats (e.g. Google Analytics) when connected.
                  </span>
                </span>
              </label>
              <label className="flex items-start gap-3 text-aubergine/80">
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="mt-1 accent-[var(--aubergine,#2A1F2D)]"
                />
                <span>
                  <span className="font-medium text-aubergine">Marketing</span>
                  <span className="mt-1 block text-xs text-aubergine/55">
                    Ads / remarketing tags only if we add them later.
                  </span>
                </span>
              </label>
            </div>
          ) : null}

          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={() => save({ analytics: true, marketing: true })}
              className="bg-aubergine px-5 py-3 text-[11px] uppercase tracking-nav text-porcelain"
            >
              Accept all
            </button>
            <button
              type="button"
              onClick={() => save({ analytics: false, marketing: false })}
              className="border border-stone bg-porcelain px-5 py-3 text-[11px] uppercase tracking-nav text-aubergine"
            >
              Essential only
            </button>
            {manage ? (
              <button
                type="button"
                onClick={() => save({ analytics, marketing })}
                className="border border-copper/40 px-5 py-3 text-[11px] uppercase tracking-nav text-copper"
              >
                Save preferences
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setManage(true)}
                className="px-5 py-3 text-[11px] uppercase tracking-nav text-copper"
              >
                Manage
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Call from footer “Cookie settings” link. */
export function openCookiePreferences() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("zayune:open-cookie-preferences"));
}
