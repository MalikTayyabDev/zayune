"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  BUDGET_RANGES,
  CUSTOM_STATUSES,
  OCCASIONS,
  PIECE_TYPES,
  labelFor,
} from "@/lib/custom-requests";

type Request = {
  id: string;
  name: string;
  email: string;
  phone: string;
  pieceType: string;
  colors: string;
  details: string;
  occasion: string;
  budget: string;
  neededBy?: string | Date | null;
  referenceUrl?: string | null;
  status: string;
  adminNotes?: string | null;
  createdAt: string | Date;
};

export function CustomRequestManager({ request }: { request: Request }) {
  const router = useRouter();
  const [status, setStatus] = useState(request.status);
  const [adminNotes, setAdminNotes] = useState(request.adminNotes || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function save() {
    setSaving(true);
    setMessage("");
    const res = await fetch(`/api/admin/custom-requests/${request.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        adminNotes: adminNotes || null,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      setMessage("Unable to save changes.");
      return;
    }
    setMessage("Saved.");
    router.refresh();
  }

  const neededBy = request.neededBy
    ? new Date(request.neededBy).toLocaleDateString()
    : "—";

  return (
    <div className="space-y-6 border border-stone p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-nav text-aubergine/45">
            {new Date(request.createdAt).toLocaleString()}
          </p>
          <h2 className="mt-1 font-display text-2xl text-aubergine">
            {request.name}
          </h2>
          <p className="mt-1 text-sm text-aubergine/60">
            {request.email} · {request.phone}
          </p>
        </div>
        <span className="text-nav text-copper">{request.status}</span>
      </div>

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-nav text-aubergine/45">Piece</dt>
          <dd className="mt-1">{labelFor(PIECE_TYPES, request.pieceType)}</dd>
        </div>
        <div>
          <dt className="text-nav text-aubergine/45">Occasion</dt>
          <dd className="mt-1">{labelFor(OCCASIONS, request.occasion)}</dd>
        </div>
        <div>
          <dt className="text-nav text-aubergine/45">Budget</dt>
          <dd className="mt-1">{labelFor(BUDGET_RANGES, request.budget)}</dd>
        </div>
        <div>
          <dt className="text-nav text-aubergine/45">Needed by</dt>
          <dd className="mt-1">{neededBy}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-nav text-aubergine/45">Colors</dt>
          <dd className="mt-1">{request.colors}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-nav text-aubergine/45">Details</dt>
          <dd className="mt-1 whitespace-pre-wrap text-aubergine/80">
            {request.details}
          </dd>
        </div>
        {request.referenceUrl && (
          <div className="sm:col-span-2">
            <dt className="text-nav text-aubergine/45">Reference</dt>
            <dd className="mt-1">
              <a
                href={request.referenceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-copper hover:text-aubergine break-all"
              >
                {request.referenceUrl}
              </a>
            </dd>
          </div>
        )}
      </dl>

      <div className="grid gap-4 border-t border-stone pt-6 sm:grid-cols-2">
        <label className="block">
          <span className="text-nav text-aubergine/55">Status</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-2 w-full border border-stone bg-transparent px-4 py-3 text-sm outline-none focus:border-aubergine/40"
          >
            {CUSTOM_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="text-nav text-aubergine/55">Admin notes</span>
          <textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            rows={3}
            className="mt-2 w-full border border-stone bg-transparent px-4 py-3 text-sm outline-none focus:border-aubergine/40"
          />
        </label>
      </div>

      {message && <p className="text-xs text-aubergine/55">{message}</p>}
      <Button type="button" onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save"}
      </Button>
    </div>
  );
}
