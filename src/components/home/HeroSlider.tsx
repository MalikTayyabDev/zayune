"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { CopperStar } from "@/components/brand/CopperStar";
import { Icon } from "@/components/ui/Icon";
import { siteImages } from "@/lib/site-images";
import { cn } from "@/lib/utils";

const SLIDE_MS = 6200;

const slides = [
  {
    id: 1,
    image: siteImages.hero.crochetBloom,
    eyebrow: "Crochet handmade accessories",
    title: "Designed, not just made.",
    subtitle:
      "Crochet flowers, jewelry & keychains — handmade in Pakistan.",
    cta: "Shop the edit",
    href: "/shop",
  },
  {
    id: 2,
    image: siteImages.hero.crochetBouquet,
    eyebrow: "Crochet flowers",
    title: "Blooms that last.",
    subtitle: "Soft structure, lasting color — crocheted stitch by stitch.",
    cta: "Shop flowers",
    href: "/shop/crochet-flowers",
  },
  {
    id: 3,
    image: siteImages.hero.jewelry,
    eyebrow: "Handmade jewelry",
    title: "Quiet pieces. Worn close.",
    subtitle: "Pendants and earrings finished by hand for every day.",
    cta: "Shop jewelry",
    href: "/shop/jewelry",
  },
  {
    id: 4,
    image: siteImages.hero.yarnStudio,
    eyebrow: "Custom orders",
    title: "Your palette. Our hand.",
    subtitle: "Custom colorways and one-of-a-kind crochet, made for you.",
    cta: "Start a custom",
    href: "/custom",
  },
];

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const goTo = useCallback((next: number) => {
    setIndex(((next % slides.length) + slides.length) % slides.length);
    setAnimKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      goTo(index + 1);
    }, SLIDE_MS);
    return () => window.clearInterval(id);
  }, [paused, index, goTo]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") goTo(index - 1);
      if (e.key === "ArrowRight") goTo(index + 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, goTo]);

  const slide = slides[index];

  return (
    <section
      className="relative min-h-[88vh] overflow-hidden bg-aubergine sm:min-h-[92vh]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured collections"
    >
      {slides.map((item, i) => (
        <div
          key={item.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-[1100ms] ease-out",
            i === index ? "opacity-100 z-[1]" : "opacity-0 z-0"
          )}
          aria-hidden={i !== index}
        >
          <Image
            src={item.image}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className={cn(
              "object-cover transition-transform duration-[6200ms] ease-out",
              i === index ? "scale-105" : "scale-100"
            )}
          />
          <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(42,31,45,0.88)_0%,rgba(42,31,45,0.55)_42%,rgba(42,31,45,0.18)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,transparent_0%,rgba(42,31,45,0.35)_100%)]" />
        </div>
      ))}

      {/* Soft brass edge light */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-px bg-gradient-to-r from-transparent via-brass/50 to-transparent" />

      <div className="container-content relative z-[3] flex min-h-[88vh] flex-col justify-end pb-20 pt-32 text-white sm:min-h-[92vh] sm:pb-24">
        <div key={animKey} className="max-w-2xl">
          <div className="hero-copy-in flex items-center gap-3">
            <CopperStar size={12} className="text-brass" animated />
            <p className="text-[11px] uppercase tracking-nav text-white/85">
              {slide.eyebrow}
            </p>
          </div>

          <div className="mt-5 h-px w-14 bg-brass/80 hero-copy-in [animation-delay:80ms]" />

          <h1 className="mt-6 font-display text-3xl leading-[1.12] !text-white sm:text-4xl md:text-[2.75rem] hero-copy-in [animation-delay:140ms]">
            {slide.title}
          </h1>

          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/80 sm:text-base hero-copy-in [animation-delay:220ms]">
            {slide.subtitle}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4 hero-copy-in [animation-delay:300ms]">
            <Link
              href={slide.href}
              className="group inline-flex items-center gap-3 bg-white px-8 py-3.5 text-[11px] uppercase tracking-nav text-aubergine transition hover:bg-brass hover:text-aubergine"
            >
              {slide.cta}
              <span className="inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
            <Link
              href="/shop"
              className="text-nav !text-white/75 underline-offset-4 transition hover:!text-brass hover:underline"
            >
              Browse all pieces
            </Link>
          </div>
        </div>

        {/* Progress + index */}
        <div className="mt-14 flex items-end justify-between gap-6">
          <div className="flex max-w-md flex-1 gap-2">
            {slides.map((item, i) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                onClick={() => goTo(i)}
                className="group relative h-[2px] flex-1 overflow-hidden bg-white/20"
              >
                <span
                  className={cn(
                    "absolute inset-y-0 left-0 bg-brass",
                    i === index && !paused
                      ? "hero-progress"
                      : i < index || (i === index && paused)
                        ? "w-full"
                        : "w-0"
                  )}
                  style={
                    i === index && !paused
                      ? { animationDuration: `${SLIDE_MS}ms` }
                      : undefined
                  }
                />
              </button>
            ))}
          </div>
          <p className="shrink-0 font-body text-[11px] uppercase tracking-nav text-white/55">
            <span className="text-brass">{String(index + 1).padStart(2, "0")}</span>
            <span className="mx-1.5 text-white/30">/</span>
            {String(slides.length).padStart(2, "0")}
          </p>
        </div>
      </div>

      <button
        type="button"
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 z-[4] hidden h-11 w-11 -translate-y-1/2 items-center justify-center border border-porcelain/20 bg-aubergine/30 text-porcelain backdrop-blur-sm transition hover:border-brass hover:text-brass sm:left-5 sm:flex lg:left-8"
        onClick={() => goTo(index - 1)}
      >
        <Icon icon={ChevronLeft} size={18} className="text-current" />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        className="absolute right-3 top-1/2 z-[4] hidden h-11 w-11 -translate-y-1/2 items-center justify-center border border-porcelain/20 bg-aubergine/30 text-porcelain backdrop-blur-sm transition hover:border-brass hover:text-brass sm:right-5 sm:flex lg:right-8"
        onClick={() => goTo(index + 1)}
      >
        <Icon icon={ChevronRight} size={18} className="text-current" />
      </button>
    </section>
  );
}
