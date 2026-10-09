import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CopperStar } from "@/components/brand/CopperStar";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { siteImages } from "@/lib/site-images";

const pieces = [
  {
    title: "Crochet Flowers",
    href: "/shop/crochet-flowers",
    image: siteImages.flowers.clusterBlue,
    note: "Lasting blooms",
  },
  {
    title: "Jewelry",
    href: "/shop/jewelry",
    image: siteImages.jewelry.earrings,
    note: "Worn close",
  },
  {
    title: "Keychains",
    href: "/shop/keychains",
    image: siteImages.keychains.smallBloom,
    note: "Everyday charms",
  },
  {
    title: "Custom",
    href: "/custom",
    image: siteImages.studio.yarnBalls,
    note: "Made for you",
  },
];

export function CollectionBanners() {
  return (
    <section className="relative overflow-hidden border-y border-stone/60 bg-stone/20">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 0% 0%, rgba(183,155,99,0.12), transparent 55%), radial-gradient(ellipse 40% 50% at 100% 100%, rgba(127,139,120,0.14), transparent 50%)",
        }}
      />

      <div className="container-content relative py-10 sm:py-20 lg:py-24">
        <Reveal>
          <div className="mb-6 flex flex-col gap-3 sm:mb-14 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <div className="max-w-lg">
              <p className="text-nav inline-flex items-center gap-2 text-aubergine/50">
                <CopperStar size={10} />
                <span>Collections</span>
              </p>
              <h2 className="mt-3 font-display text-3xl text-aubergine sm:text-4xl md:text-[2.75rem]">
                Shop by piece
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-aubergine/65">
                Four ways into the studio edit — flowers, jewelry, keychains, and
                custom colorways.
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-nav text-copper transition hover:text-aubergine"
            >
              View all accessories
              <Icon icon={ArrowUpRight} size={14} className="text-current" />
            </Link>
          </div>
        </Reveal>

        <div className="card-grid-tiles lg:grid-cols-4">
          {pieces.map((piece, index) => (
            <Reveal key={piece.href} delay={index * 70} as="article">
              <Link
                href={piece.href}
                className="group relative block aspect-[3/4] overflow-hidden bg-stone/50"
              >
                <Image
                  src={piece.image}
                  alt={piece.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition duration-[900ms] ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-aubergine/90 via-aubergine/35 to-aubergine/10 transition duration-500" />

                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 sm:gap-3 sm:p-6">
                  <div className="min-w-0">
                    <p className="text-[9px] uppercase tracking-nav text-white/80 sm:text-[11px]">
                      {piece.note}
                    </p>
                    <h3 className="mt-1 font-display text-base leading-tight !text-white sm:mt-1.5 sm:text-[1.65rem]">
                      {piece.title}
                    </h3>
                  </div>
                  <span className="mb-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center border border-white/35 text-white transition duration-300 group-hover:border-brass group-hover:bg-brass group-hover:text-aubergine sm:mb-1 sm:h-9 sm:w-9">
                    <Icon
                      icon={ArrowUpRight}
                      size={15}
                      className="text-current transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </div>

                <span className="absolute left-3 top-3 font-body text-[9px] uppercase tracking-nav text-white/70 sm:left-6 sm:top-6 sm:text-[10px]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
