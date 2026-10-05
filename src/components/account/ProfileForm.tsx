"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

type Props = {
  name: string;
  email: string;
  phone?: string | null;
};

export function ProfileForm({ name, email, phone }: Props) {
  const router = useRouter();
  const { update } = useSession();
  const [fullName, setFullName] = useState(name);
  const [phoneValue, setPhoneValue] = useState(phone || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const res = await fetch("/api/account/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fullName,
        phone: phoneValue || null,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Unable to save");
      return;
    }

    setMessage("Details saved.");
    setCurrentPassword("");
    setNewPassword("");
    await update({ name: fullName });
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 border border-stone p-6 sm:p-8">
      <div>
        <p className="text-nav text-aubergine/45">Profile</p>
        <h2 className="mt-2 font-display text-2xl text-aubergine">
          Your details
        </h2>
        <p className="mt-2 text-sm text-aubergine/60">
          Update the name and phone used for orders. Email stays as your login.
        </p>
      </div>

      <label className="block">
        <span className="text-nav text-aubergine/55">Full name</span>
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          minLength={2}
          className="mt-2 w-full border border-stone bg-transparent px-4 py-3 text-sm outline-none focus:border-aubergine/40"
        />
      </label>

      <label className="block">
        <span className="text-nav text-aubergine/55">Email</span>
        <input
          value={email}
          disabled
          className="mt-2 w-full border border-stone bg-stone/30 px-4 py-3 text-sm text-aubergine/60"
        />
      </label>

      <label className="block">
        <span className="text-nav text-aubergine/55">WhatsApp / phone</span>
        <input
          value={phoneValue}
          onChange={(e) => setPhoneValue(e.target.value)}
          className="mt-2 w-full border border-stone bg-transparent px-4 py-3 text-sm outline-none focus:border-aubergine/40"
        />
      </label>

      <div className="border-t border-stone pt-5">
        <p className="text-nav text-aubergine/45">Change password</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-nav text-aubergine/55">Current password</span>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
              className="mt-2 w-full border border-stone bg-transparent px-4 py-3 text-sm outline-none focus:border-aubergine/40"
            />
          </label>
          <label className="block">
            <span className="text-nav text-aubergine/55">New password</span>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={8}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              className="mt-2 w-full border border-stone bg-transparent px-4 py-3 text-sm outline-none focus:border-aubergine/40"
            />
          </label>
        </div>
      </div>

      {error && (
        <p className="text-xs text-copper" role="alert">
          {error}
        </p>
      )}
      {message && <p className="text-xs text-sage">{message}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? "Saving…" : "Save details"}
      </Button>
    </form>
  );
}
