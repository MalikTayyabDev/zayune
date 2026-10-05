"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/brand/Logo";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);

    const result = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      portal: "customer",
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    router.push(callbackUrl.startsWith("/") ? callbackUrl : "/account");
    router.refresh();
  }

  return (
    <div className="container-content max-w-md py-16">
      <div className="text-center mb-8">
        <Logo href={null} className="mx-auto" />
        <h1 className="mt-6 font-display text-3xl">Welcome back</h1>
        <p className="mt-2 text-sm text-aubergine/60">
          Sign in to track orders and sync your wishlist.
        </p>
      </div>
      <form onSubmit={onSubmit} className="space-y-5">
        <label className="block">
          <span className="text-nav text-aubergine/55">Email</span>
          <input
            name="email"
            type="email"
            required
            className="mt-2 w-full border border-stone bg-transparent px-4 py-3 text-sm outline-none focus:border-aubergine/40"
          />
        </label>
        <label className="block">
          <span className="text-nav text-aubergine/55">Password</span>
          <input
            name="password"
            type="password"
            required
            className="mt-2 w-full border border-stone bg-transparent px-4 py-3 text-sm outline-none focus:border-aubergine/40"
          />
        </label>
        {error && <p className="text-xs text-copper">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-aubergine/60">
        New here?{" "}
        <Link href="/account/register" className="text-copper hover:text-aubergine">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default function AccountLoginPage() {
  return (
    <Suspense fallback={<div className="container-content max-w-md py-16 text-center text-sm text-aubergine/50">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
