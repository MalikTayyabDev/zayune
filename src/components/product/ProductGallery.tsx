"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type ImageItem = {
  url: string;
  alt: string;
  kind?: string;
};

type Props = {
  images: ImageItem[];
  productName: string;
};

export function ProductGallery({ images, productName }: Props) {
  const [active, setActive] = useState(0);
  const current = images[active] || images[0];

  if (!current) {
    return (
      <div className="aspect-[4/5] bg-stone/50 flex items-center justify-center text-sm text-aubergine/50">
        Image forthcoming
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/5] overflow-hidden bg-stone/40">
        <Image
          key={current.url}
          src={current.url}
          alt={current.alt || productName}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover fade-in"
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`View image ${index + 1}`}
              className={cn(
                "relative h-20 w-16 shrink-0 overflow-hidden border transition-colors",
                active === index
                  ? "border-aubergine"
                  : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <Image
                src={image.url}
                alt={image.alt || `${productName} ${index + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
