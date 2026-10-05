import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  className?: string;
  size?: number;
  label?: string;
};

/** Thin, brand-quiet icon wrapper — copper accents by default. */
export function Icon({ icon: Lucide, className, size = 18, label }: Props) {
  if (!Lucide) return null;

  return (
    <Lucide
      size={size}
      strokeWidth={1.5}
      aria-hidden={!label}
      aria-label={label}
      className={cn("shrink-0 text-copper", className)}
    />
  );
}
