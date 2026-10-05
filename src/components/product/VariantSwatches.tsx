"use client";

import { cn } from "@/lib/utils";

export type SwatchVariant = {
  id: string;
  name: string;
  optionGroup: string;
  swatchHex: string | null;
  priceDelta: number;
  stock?: number | null;
};

type Props = {
  variants: SwatchVariant[];
  value: string;
  onChange: (id: string) => void;
};

export function VariantSwatches({ variants, value, onChange }: Props) {
  const groups = variants.reduce<Record<string, SwatchVariant[]>>((acc, variant) => {
    const key = variant.optionGroup || "Option";
    acc[key] = acc[key] || [];
    acc[key].push(variant);
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      {Object.entries(groups).map(([group, options]) => {
        const selected = options.find((o) => o.id === value);
        const useColorSwatches = options.every((o) => o.swatchHex);

        return (
          <div key={group}>
            <div className="mb-3 flex items-baseline justify-between gap-3">
              <p className="text-nav text-aubergine/55">{group}</p>
              {selected && (
                <p className="text-xs text-aubergine/70">{selected.name}</p>
              )}
            </div>

            {useColorSwatches ? (
              <div className="flex flex-wrap gap-2.5">
                {options.map((option) => {
                  const unavailable = option.stock === 0;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      title={option.name}
                      aria-label={`${group}: ${option.name}`}
                      aria-pressed={value === option.id}
                      disabled={unavailable}
                      onClick={() => onChange(option.id)}
                      className={cn(
                        "relative h-9 w-9 rounded-full border-2 transition-all",
                        value === option.id
                          ? "border-aubergine scale-105"
                          : "border-stone hover:border-aubergine/40",
                        unavailable && "opacity-40 cursor-not-allowed"
                      )}
                      style={{ backgroundColor: option.swatchHex || "#D7CEC3" }}
                    >
                      {unavailable && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="h-px w-full rotate-45 bg-aubergine/70" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {options.map((option) => {
                  const unavailable = option.stock === 0;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      disabled={unavailable}
                      onClick={() => onChange(option.id)}
                      className={cn(
                        "min-w-[3rem] border px-3 py-2 text-xs tracking-wide transition-colors",
                        value === option.id
                          ? "border-aubergine bg-aubergine text-porcelain"
                          : "border-stone bg-transparent text-aubergine hover:border-aubergine/40",
                        unavailable && "opacity-40 line-through cursor-not-allowed"
                      )}
                    >
                      {option.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
