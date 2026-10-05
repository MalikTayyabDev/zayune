"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  compact?: boolean;
  defaultValue?: string;
  autoFocus?: boolean;
  onNavigate?: () => void;
};

export function SearchBar({
  className,
  compact = false,
  defaultValue = "",
  autoFocus = false,
  onNavigate,
}: Props) {
  const router = useRouter();
  const [q, setQ] = useState(defaultValue);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim();
    onNavigate?.();
    router.push(query ? `/shop?q=${encodeURIComponent(query)}` : "/shop");
  }

  return (
    <form onSubmit={onSubmit} className={cn("relative w-full", className)} role="search">
      <Icon
        icon={Search}
        size={15}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-aubergine/40"
      />
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search crochet flowers, jewelry, keychains…"
        autoFocus={autoFocus}
        className={cn(
          "w-full border border-stone bg-porcelain/80 text-sm text-aubergine outline-none transition focus:border-aubergine/40",
          compact ? "py-2 pl-9 pr-3" : "py-3 pl-10 pr-4"
        )}
        aria-label="Search crochet handmade accessories"
      />
    </form>
  );
}
