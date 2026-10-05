"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/brand/Logo";

export default function AccountRegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    const res = await fetch("/api/account/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email,
        password,
        phone: form.get("phone") || undefined,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Unable to create account");
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

  return (
    <div className="container-content max-w-md py-16">
      <div className="text-center mb-8">
        <Logo href={null} className="mx-auto" />
        <h1 className="mt-6 font-display text-3xl">Create account</h1>
        <p className="mt-2 text-sm text-aubergine/60">
          Save favorites, reorder faster, and track deliveries.
        </p>
      </div>
      <form onSubmit={onSubmit} className="space-y-5">
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
            className="mt-2 w-full border border-stone bg-transparent px-4 py-3 text-sm outline-none focus:border-aubergine/40"
          />
        </label>
        {error && <p className="text-xs text-copper">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating…" : "Create account"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-aubergine/60">
        Already have an account?{" "}
        <Link href="/account/login" className="text-copper hover:text-aubergine">
          Sign in
        </Link>
      </p>
    </div>
  );
}
