import { cn } from "@/lib/utils";
import { CopperStar } from "@/components/brand/CopperStar";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  accent?: "star" | "rule" | "none";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  accent = "rule",
  className,
}: Props) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <p className="text-nav mb-4 text-aubergine/60">{eyebrow}</p>
      )}
      <div
        className={cn(
          "flex items-center gap-3",
          align === "center" && "justify-center"
        )}
      >
        {accent === "star" && <CopperStar className="shrink-0" />}
        <h2 className="font-display text-3xl sm:text-4xl md:text-[2.75rem] leading-tight text-aubergine">
          {title}
        </h2>
      </div>
      {accent === "rule" && (
        <div
          className={cn(
            "mt-5 h-px w-16 bg-brass/70",
            align === "center" && "mx-auto"
          )}
        />
      )}
      {description && (
        <p className="mt-5 text-sm sm:text-base leading-relaxed text-aubergine/70">
          {description}
        </p>
      )}
    </div>
  );
}
