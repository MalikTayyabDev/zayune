import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CopperStar } from "@/components/brand/CopperStar";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";

const pieces = [
  {
    title: "Mehndi",
    href: "/shop/mehndi",
    image: "/products/dawat/gajra.jpg",
    note: "Crochet gajras & clips",
  },
  {
    title: "Hair",
    href: "/shop/hair-accessories",
    image: "/products/winter/flower-clips.jpg",
    note: "Clips & gajras",
  },
  {
    title: "Beanies & Hats",
    href: "/shop/beanies-hats",
    image: "/products/winter/beanie.jpg",
    note: "Winter bestseller",
  },
  {
    title: "Scarves",
    href: "/shop/scarves-mufflers",
    image: "/products/winter/scarf.jpg",
    note: "Chunky layers",
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
                <span>Handmade crochet</span>
              </p>
              <h2 className="mt-3 font-display text-3xl text-aubergine sm:text-4xl md:text-[2.75rem]">
                Shop by piece
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-aubergine/65">
                Crochet accessories only — beanies, scarves, gajras, flower clips,
                and winter warmers made by hand in Pakistan.
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-nav text-copper transition-colors hover:text-aubergine"
            >
              Shop all
              <Icon icon={ArrowUpRight} size={14} />
            </Link>
          </div>
        </Reveal>

        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {pieces.map((piece, index) => (
            <Reveal key={piece.href} delay={index * 60}>
              <Link
                href={piece.href}
                className="group relative block aspect-[4/5] overflow-hidden bg-stone/40"
              >
                <Image
                  src={piece.image}
                  alt={piece.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-aubergine/70 via-aubergine/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <p className="text-[10px] uppercase tracking-nav text-porcelain/70">
                    {piece.note}
                  </p>
                  <p className="mt-1 font-display text-xl text-porcelain sm:text-2xl">
                    {piece.title}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
