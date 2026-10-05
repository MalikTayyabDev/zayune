"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/brand/Logo";

export default function AdminLoginPage() {
  const router = useRouter();
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
      portal: "admin",
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid credentials.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-5">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <Logo href={null} className="mx-auto" />
          <p className="mt-6 text-nav text-aubergine/50">Studio admin</p>
        </div>
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
    </div>
  );
}
