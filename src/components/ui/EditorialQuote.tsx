import { cn } from "@/lib/utils";

type Props = {
  quote: string;
  attribution?: string;
  className?: string;
};

export function EditorialQuote({ quote, attribution, className }: Props) {
  return (
    <figure className={cn("max-w-xl", className)}>
      <blockquote className="font-editorial text-2xl sm:text-3xl italic leading-snug text-aubergine/90">
        “{quote}”
      </blockquote>
      {attribution && (
        <figcaption className="mt-4 text-nav text-aubergine/55">
          {attribution}
        </figcaption>
      )}
    </figure>
  );
}
