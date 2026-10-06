"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, UserPlus } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useCartStore } from "@/lib/cart-store";
import { cartRequiresAdvance } from "@/lib/order-policy";
import { formatPrice } from "@/lib/utils";

type Provider = {
  id: string;
  label: string;
  description: string;
};

type Props = {
  shippingFee: number;
  providers: Provider[];
};

export function CheckoutForm({ shippingFee, providers }: Props) {
  const router = useRouter();
  const { data: session } = useSession();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const discountCodeStore = useCartStore((s) => s.discountCode);
  const setDiscountCodeStore = useCartStore((s) => s.setDiscountCode);
  const clearCart = useCartStore((s) => s.clearCart);
  const [paymentMethod, setPaymentMethod] = useState(providers[0]?.id || "cod");
  const [paymentRef, setPaymentRef] = useState("");
  const [createAccount, setCreateAccount] = useState(false);
  const [password, setPassword] = useState("");
  const [discountInput, setDiscountInput] = useState(discountCodeStore || "");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountLabel, setDiscountLabel] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const shippingAfter =
    subtotal - discountAmount >= 5000 ? 0 : shippingFee;
  const total = Math.max(0, subtotal - discountAmount + shippingAfter);
  const signedIn = !!session?.user && session.user.role !== "admin";
  const advanceRequired = useMemo(
    () => cartRequiresAdvance(items),
    [items]
  );
  const advanceAmount = Math.round(total * 0.3);
  const availableProviders = useMemo(() => {
    if (!advanceRequired) return providers;
    // Made-to-order / custom: no COD — 30% bank advance before we start
    return providers.filter((p) => p.id !== "cod");
  }, [advanceRequired, providers]);

  useEffect(() => {
    if (!availableProviders.length) return;
    if (!availableProviders.some((p) => p.id === paymentMethod)) {
      setPaymentMethod(availableProviders[0].id);
    }
  }, [availableProviders, paymentMethod]);

  async function applyDiscount() {
    setError("");
    const res = await fetch("/api/discounts/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: discountInput, subtotal }),
    });
    const data = await res.json();
    if (!res.ok) {
      setDiscountAmount(0);
      setDiscountLabel(null);
      setError(data.error || "Invalid code");
      return;
    }
    setDiscountAmount(data.discountAmount || 0);
    setDiscountLabel(data.label || data.discountCode);
    setDiscountCodeStore(data.discountCode || discountInput);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const customerName = String(form.get("customerName") || "");
    const customerEmail = String(form.get("customerEmail") || "");
    const customerPhone = String(form.get("customerPhone") || "");

    try {
      if (createAccount && !signedIn) {
        if (password.length < 8) {
          throw new Error("Password must be at least 8 characters.");
        }
        const reg = await fetch("/api/account/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: customerName,
            email: customerEmail,
            phone: customerPhone || undefined,
            password,
          }),
        });
        const regData = await reg.json();
        if (!reg.ok) {
          throw new Error(regData.error || "Unable to create account");
        }
        await signIn("credentials", {
          email: customerEmail,
          password,
          portal: "customer",
          redirect: false,
        });
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          shippingAddress: form.get("shippingAddress"),
          shippingCity: form.get("shippingCity"),
          shippingNotes: form.get("shippingNotes"),
          paymentMethod,
          paymentRef: paymentRef || undefined,
          discountCode:
            discountAmount > 0
              ? discountCodeStore || discountLabel || undefined
              : undefined,
          items: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to place order");
      }

      // Bank/Raast → pay link (set as redirectUrl). COD → thank-you page.
      const next =
        data.redirectUrl ||
        data.payUrl ||
        `/order/${data.orderId}/confirmation`;
      if (typeof window !== "undefined") {
        if (data.whatsappConfirmUrl) {
          sessionStorage.setItem(
            `zayune_wa_${data.orderId}`,
            data.whatsappConfirmUrl
          );
        }
        if (data.payUrl) {
          sessionStorage.setItem(`zayune_pay_${data.orderId}`, data.payUrl);
        }
      }
      setRedirecting(true);
      clearCart();
      // Hard navigate so confirmation always loads (avoids empty-cart flash).
      if (typeof window !== "undefined") {
        window.location.assign(next);
        return;
      }
      router.push(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
      setRedirecting(false);
    }
  }

  if (redirecting) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-aubergine/60">Placing your order…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-aubergine/60">Your cart is empty.</p>
        <Button href="/shop" className="mt-6">
          Return to shop
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-12 lg:grid-cols-[1fr_340px]">
      <div className="space-y-8">
        {!signedIn && (
          <div className="border border-stone bg-stone/15 p-5">
            <p className="text-nav text-aubergine/50">Account</p>
            <p className="mt-2 text-sm text-aubergine/70">
              Already have an account?{" "}
              <Link
                href="/account/login?callbackUrl=/checkout"
                className="inline-flex items-center gap-1 text-copper hover:text-aubergine"
              >
                <Icon icon={LogIn} size={13} />
                Log in
              </Link>{" "}
              for faster checkout — or continue as a guest.
            </p>
          </div>
        )}

        {signedIn && (
          <div className="border border-stone bg-sage/10 p-5 text-sm text-aubergine/75">
            Signed in as <strong>{session?.user?.email}</strong>. Your order can be
            saved to your account history.
          </div>
        )}

        <fieldset className="space-y-4">
          <legend className="font-display text-2xl text-aubergine mb-2">
            Contact
          </legend>
          <Field
            label="Full name"
            name="customerName"
            required
            defaultValue={signedIn ? session?.user?.name || "" : ""}
          />
          <Field
            label="Email"
            name="customerEmail"
            type="email"
            required
            defaultValue={signedIn ? session?.user?.email || "" : ""}
          />
          <Field label="Phone / WhatsApp" name="customerPhone" required />
        </fieldset>

        {!signedIn && (
          <fieldset className="space-y-4 border border-stone p-5">
            <legend className="px-1 font-display text-xl text-aubergine">
              Create an account
            </legend>
            <label className="flex cursor-pointer items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={createAccount}
                onChange={(e) => setCreateAccount(e.target.checked)}
                className="mt-1 accent-[var(--aubergine)]"
              />
              <span>
                <span className="inline-flex items-center gap-1.5 font-medium text-aubergine">
                  <Icon icon={UserPlus} size={14} />
                  Register while checking out
                </span>
                <span className="mt-1 block text-xs text-aubergine/55 leading-relaxed">
                  Save your wishlist, track orders faster, and skip re-entering details next time.
                  Guest checkout still works if you skip this.
                </span>
              </span>
            </label>
            {createAccount && (
              <label className="block">
                <span className="text-nav text-aubergine/55">Create password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required={createAccount}
                  placeholder="At least 8 characters"
                  className="mt-2 w-full border border-stone bg-transparent px-4 py-3 text-sm outline-none focus:border-aubergine/40"
                />
              </label>
            )}
          </fieldset>
        )}

        <fieldset className="space-y-4">
          <legend className="font-display text-2xl text-aubergine mb-2">
            Shipping
          </legend>
          <Field label="Address" name="shippingAddress" required />
          <Field label="City" name="shippingCity" required />
          <label className="block">
            <span className="text-nav text-aubergine/55">Notes (optional)</span>
            <textarea
              name="shippingNotes"
              rows={3}
              className="mt-2 w-full border border-stone bg-transparent px-4 py-3 text-sm outline-none focus:border-aubergine/40"
            />
          </label>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="font-display text-2xl text-aubergine mb-2">
            Payment
          </legend>

          {advanceRequired && (
            <div className="border border-brass/40 bg-brass/10 px-4 py-3 text-sm leading-relaxed text-aubergine/80">
              Your cart includes made-to-order / custom pieces. Once we start
              crocheting there is no going back — so{" "}
              <strong>Cash on Delivery is not available</strong>. Please pay a{" "}
              <strong>30% bank/Raast advance</strong> (
              {formatPrice(advanceAmount)}) to confirm. Remaining balance as
              arranged / on delivery.
            </div>
          )}

          {!advanceRequired && paymentMethod === "bank_transfer" && (
            <div className="border border-stone bg-stone/20 px-4 py-3 text-sm text-aubergine/75">
              Bank / Raast: confirm with a{" "}
              <strong>30% advance ({formatPrice(advanceAmount)})</strong>. The
              rest can be paid on delivery or as arranged.
            </div>
          )}

          <div className="space-y-3">
            {availableProviders.map((provider) => (
              <label
                key={provider.id}
                className="flex cursor-pointer gap-3 border border-stone p-4 has-[:checked]:border-aubergine"
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={provider.id}
                  checked={paymentMethod === provider.id}
                  onChange={() => setPaymentMethod(provider.id)}
                  className="mt-1 accent-[var(--aubergine)]"
                />
                <span>
                  <span className="block text-sm text-aubergine">{provider.label}</span>
                  <span className="mt-1 block text-xs text-aubergine/55 leading-relaxed">
                    {provider.id === "bank_transfer"
                      ? `Pay 30% advance (${formatPrice(advanceAmount)}) by bank/Raast to confirm. Remaining balance as arranged / on delivery.`
                      : provider.id === "cod"
                        ? "Pay when your ready-made piece arrives. Not available for made-to-order / custom."
                        : provider.description}
                  </span>
                </span>
              </label>
            ))}
          </div>

          {paymentMethod === "bank_transfer" && (
            <label className="block">
              <span className="text-nav text-aubergine/55">
                Payment reference / screenshot note
              </span>
              <input
                value={paymentRef}
                onChange={(e) => setPaymentRef(e.target.value)}
                placeholder="Transaction ID or transfer note"
                className="mt-2 w-full border border-stone bg-transparent px-4 py-3 text-sm outline-none focus:border-aubergine/40"
              />
              <span className="mt-2 block text-xs text-aubergine/50">
                After placing the order you&apos;ll get a secure link with bank
                details to pay the 30% advance.
              </span>
            </label>
          )}
        </fieldset>
      </div>

      <aside className="h-fit shrink-0 border border-stone bg-stone/20 p-6">
        <h2 className="text-nav text-aubergine/50">Order</h2>
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li
              key={`${item.productId}-${item.variantId || "default"}`}
              className="flex justify-between gap-3 text-sm"
            >
              <span className="min-w-0 flex-1 text-aubergine/80">
                {item.name}
                {item.variantName ? ` · ${item.variantName}` : ""} × {item.quantity}
              </span>
              <span className="shrink-0">{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 space-y-2 border-t border-stone pt-4">
          <label className="block">
            <span className="text-nav text-aubergine/55">Discount code</span>
            <div className="mt-2 flex gap-2">
              <input
                value={discountInput}
                onChange={(e) => setDiscountInput(e.target.value.toUpperCase())}
                placeholder="WELCOME10"
                className="w-full border border-stone bg-transparent px-3 py-2 text-sm outline-none focus:border-aubergine/40"
              />
              <button
                type="button"
                onClick={applyDiscount}
                className="shrink-0 border border-aubergine px-3 py-2 text-[10px] uppercase tracking-nav text-aubergine hover:bg-aubergine hover:text-porcelain"
              >
                Apply
              </button>
            </div>
          </label>
        </div>

        <div className="mt-6 space-y-2 border-t border-stone pt-4 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-sage">
              <span>Discount {discountLabel ? `(${discountLabel})` : ""}</span>
              <span>−{formatPrice(discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>
              {shippingAfter === 0 ? "Complimentary" : formatPrice(shippingAfter)}
            </span>
          </div>
          <div className="flex justify-between font-medium pt-2">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <p className="pt-2 text-[11px] text-aubergine/45">
            Final prices are confirmed securely on the server.
          </p>
        </div>

        {error && (
          <p className="mt-4 text-xs text-copper" role="alert">
            {error}
          </p>
        )}

        <Button type="submit" className="mt-6 w-full" disabled={loading}>
          {loading
            ? "Placing order…"
            : createAccount && !signedIn
              ? "Register & place order"
              : "Place order"}
        </Button>
        <p className="mt-3 text-[11px] leading-relaxed text-aubergine/45">
          {createAccount && !signedIn
            ? "We’ll create your account, then place this order."
            : "Guest checkout available — no account required."}
        </p>
      </aside>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="text-nav text-aubergine/55">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="mt-2 w-full border border-stone bg-transparent px-4 py-3 text-sm outline-none focus:border-aubergine/40"
      />
    </label>
  );
}
