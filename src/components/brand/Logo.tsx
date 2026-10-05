import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "default" | "light" | "mark";

type Props = {
  className?: string;
  priority?: boolean;
  href?: string | null;
  variant?: Variant;
};

const sources: Record<Variant, { src: string; width: number; height: number; alt: string }> = {
  default: { src: "/logo.png", width: 200, height: 220, alt: "ZAYUNE" },
  light: { src: "/logo-light.png", width: 200, height: 220, alt: "ZAYUNE" },
  mark: { src: "/monogram.png", width: 80, height: 80, alt: "ZAYUNE" },
};

export function Logo({
  className,
  priority = false,
  href = "/",
  variant = "default",
}: Props) {
  const asset = sources[variant];
  const mark = (
    <Image
      src={asset.src}
      alt={asset.alt}
      width={asset.width}
      height={asset.height}
      priority={priority}
      className={cn(
        variant === "mark"
          ? "h-9 w-9 object-contain"
          : "h-10 w-auto max-h-12 sm:h-12 object-contain",
        className
      )}
    />
  );

  if (href === null) return mark;

  return (
    <Link href={href} aria-label="ZAYUNE home" className="inline-block">
      {mark}
    </Link>
  );
}

export function Monogram({ className }: { className?: string }) {
  return (
    <Image
      src="/monogram.png"
      alt=""
      width={48}
      height={48}
      className={cn("h-9 w-9 object-contain", className)}
      aria-hidden
    />
  );
}
