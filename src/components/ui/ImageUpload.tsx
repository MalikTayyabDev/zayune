"use client";

import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { readApiError } from "@/lib/api-error";
import { cn } from "@/lib/utils";

type Props = {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  guest?: boolean;
  compact?: boolean;
  className?: string;
};

export function ImageUpload({
  value,
  onChange,
  label = "Upload image",
  guest = false,
  compact = false,
  className,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onFile(file: File | undefined) {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      if (guest) body.append("guest", "true");
      const res = await fetch("/api/uploads", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(readApiError(data, "Upload failed"));
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <span className="text-nav text-aubergine/55">{label}</span>
      <div className="flex items-start gap-3">
        {value ? (
          <div
            className={cn(
              "relative shrink-0 overflow-hidden border border-stone bg-stone/30",
              compact ? "h-16 w-16" : "h-24 w-24"
            )}
          >
            <Image src={value} alt="" fill className="object-cover" unoptimized />
            <button
              type="button"
              aria-label="Remove image"
              onClick={() => onChange("")}
              className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center bg-aubergine/90 text-porcelain"
            >
              <Icon icon={X} size={12} className="text-porcelain" />
            </button>
          </div>
        ) : null}
        <label
          className={cn(
            "flex flex-1 cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-aubergine/25 bg-stone/10 text-center transition hover:border-copper hover:bg-stone/20",
            compact ? "min-h-[4rem] px-3 py-3" : "min-h-[6rem] px-4 py-5"
          )}
        >
          {loading ? (
            <Icon icon={Loader2} size={18} className="animate-spin text-copper" />
          ) : (
            <Icon icon={ImagePlus} size={18} className="text-copper" />
          )}
          <span className="text-[10px] uppercase tracking-nav text-aubergine/60">
            {loading ? "Uploading…" : "Choose image"}
          </span>
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={loading}
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </label>
      </div>
      {error && <p className="text-xs text-copper">{error}</p>}
    </div>
  );
}
