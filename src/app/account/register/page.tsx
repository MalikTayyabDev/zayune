"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/brand/Logo";
import { readApiError } from "@/lib/api-error";

export default function AccountRegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"details" | "verify">("details");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [info, setInfo] = useState("");

  async function sendCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");
    const form = new FormData(e.currentTarget);
    const nextEmail = String(form.get("email") || "").toLowerCase();
    const nextPassword = String(form.get("password") || "");

    const res = await fetch("/api/account/register/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: nextEmail,
        password: nextPassword,
        phone: form.get("phone") || undefined,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(readApiError(data, "Unable to send code"));
      return;
    }
    setEmail(nextEmail);
    setPassword(nextPassword);
    setStep("verify");
    setInfo("Check your inbox for a 6-digit code (also check spam).");
  }

  async function verifyCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const code = String(form.get("code") || "").trim();

    const res = await fetch("/api/account/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(readApiError(data, "Unable to verify code"));
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      portal: "customer",
      redirect: false,
    });

    if (result?.error) {
      router.push("/account/login");
      return;
    }

    router.push("/account");
    router.refresh();
  }

  async function resendCode() {
    setLoading(true);
    setError("");
    setInfo("");
    // User must go back to details to resend with password — keep simple
    setStep("details");
    setLoading(false);
    setInfo("Update your details if needed, then send a new code.");
  }

  return (
    <div className="container-content max-w-md py-16">
      <div className="text-center mb-8">
        <Logo href={null} className="mx-auto" />
        <h1 className="mt-6 font-display text-3xl">Create account</h1>
        <p className="mt-2 text-sm text-aubergine/60">
          {step === "details"
            ? "We’ll email you a 6-digit code to verify your address."
            : `Enter the code sent to ${email}`}
        </p>
      </div>

      {step === "details" ? (
        <form onSubmit={sendCode} className="space-y-5">
          <label className="block">
            <span className="text-nav text-aubergine/55">Name</span>
            <input
              name="name"
              required
              className="mt-2 w-full border border-stone bg-transparent px-4 py-3 text-sm outline-none focus:border-aubergine/40"
            />
          </label>
          <label className="block">
            <span className="text-nav text-aubergine/55">Email</span>
            <input
              name="email"
              type="email"
              required
              defaultValue={email}
              className="mt-2 w-full border border-stone bg-transparent px-4 py-3 text-sm outline-none focus:border-aubergine/40"
            />
          </label>
          <label className="block">
            <span className="text-nav text-aubergine/55">Phone (optional)</span>
            <input
              name="phone"
              className="mt-2 w-full border border-stone bg-transparent px-4 py-3 text-sm outline-none focus:border-aubergine/40"
            />
          </label>
          <label className="block">
            <span className="text-nav text-aubergine/55">Password</span>
            <input
              name="password"
              type="password"
              minLength={8}
              required
              defaultValue={password}
              className="mt-2 w-full border border-stone bg-transparent px-4 py-3 text-sm outline-none focus:border-aubergine/40"
            />
          </label>
          {info ? <p className="text-xs text-sage">{info}</p> : null}
          {error ? <p className="text-xs text-copper">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending…" : "Send verification code"}
          </Button>
        </form>
      ) : (
        <form onSubmit={verifyCode} className="space-y-5">
          <label className="block">
            <span className="text-nav text-aubergine/55">6-digit code</span>
            <input
              name="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="\d{6}"
              maxLength={6}
              required
              placeholder="000000"
              className="mt-2 w-full border border-stone bg-transparent px-4 py-3 text-center text-2xl tracking-[0.35em] outline-none focus:border-aubergine/40"
            />
          </label>
          {info ? <p className="text-xs text-sage">{info}</p> : null}
          {error ? <p className="text-xs text-copper">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Verifying…" : "Verify & create account"}
          </Button>
          <button
            type="button"
            onClick={resendCode}
            className="w-full text-center text-nav text-copper hover:text-aubergine"
          >
            Resend code
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-aubergine/60">
        Already have an account?{" "}
        <Link href="/account/login" className="text-copper hover:text-aubergine">
          Sign in
        </Link>
      </p>
    </div>
  );
}
