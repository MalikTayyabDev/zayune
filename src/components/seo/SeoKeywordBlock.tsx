import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CopperStar } from "@/components/brand/CopperStar";
import { FaqJsonLd } from "@/components/seo/JsonLd";
import { Icon } from "@/components/ui/Icon";
import {
  brandFaqs,
  collectionSeo,
  homeSeoParagraphs,
  shopIntro,
} from "@/lib/seo-copy";
import { siteConfig, whatsappHref } from "@/lib/site";

const collectionLinks = [
  {
    href: "/shop/beanies-hats",
    label: "Crochet beanies & hats",
    note: "Winter bestseller",
  },
  {
    href: "/shop/scarves-mufflers",
    label: "Chunky scarves & mufflers",
    note: "Bundle-ready",
  },
  {
    href: "/shop/gloves-warmers",
    label: "Fingerless gloves",
    note: "Gift staple",
  },
  {
    href: "/shop/ponchos-shrugs",
    label: "Ponchos & shrugs",
    note: "Statement layer",
  },
  {
    href: "/shop/ear-warmers",
    label: "Ear warmers & headbands",
    note: "Easy add-on",
  },
  {
    href: "/shop/boot-cuffs",
    label: "Boot cuffs",
    note: "Niche winter",
  },
  {
    href: "/shop/hair-accessories",
    label: "Flower clips & gajras",
    note: "Mehndi-ready",
  },
  {
    href: "/shop/mehndi",
    label: "Mehndi crochet edit",
    note: "Gajras & clips",
  },
  {
    href: "/shop/ornaments-gifts",
    label: "Ornaments & gift toppers",
    note: "Holiday sets",
  },
  {
    href: "/shop/bags-pouches",
    label: "Crochet totes & pouches",
    note: "Everyday carry",
  },
];

export function HomeSeoBlock() {
  return (
    <section className="border-y border-stone/70 bg-stone/15">
      <div className="container-content py-16 sm:py-20">
        <FaqJsonLd
          items={brandFaqs.map((f) => ({
            question: f.question,
            answer: f.answer,
          }))}
        />

        <div className="max-w-2xl">
          <p className="text-nav inline-flex items-center gap-2 text-aubergine/50">
            <CopperStar size={10} />
            Winter Special · Satellite Town, Rawalpindi
          </p>
          <h2 className="mt-3 font-display text-3xl text-aubergine sm:text-4xl">
            Handmade crochet accessories from Pakistan
          </h2>
          <div className="mt-5 space-y-3 text-sm leading-relaxed text-aubergine/70 sm:text-base">
            {homeSeoParagraphs.map((p) => (
              <p key={p.slice(0, 48)}>{p}</p>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <Link href="/shop" className="text-copper hover:underline">
              Shop all pieces
            </Link>
            <Link href="/custom" className="text-copper hover:underline">
              Custom orders
            </Link>
            <a
              href={whatsappHref("Hi ZAYUNE — ")}
              className="text-copper hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp {siteConfig.phoneDisplay}
            </a>
          </div>
        </div>

        <div className="mt-14">
          <div className="flex items-end justify-between gap-4">
            <h3 className="font-display text-2xl text-aubergine">
              Shop by collection
            </h3>
            <Link
              href="/shop"
              className="hidden items-center gap-1 text-nav text-copper hover:text-aubergine sm:inline-flex"
            >
              View shop
              <Icon icon={ArrowUpRight} size={14} />
            </Link>
          </div>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {collectionLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group flex h-full flex-col border border-stone/80 bg-porcelain px-4 py-4 transition-colors hover:border-brass/50"
                >
                  <span className="text-[10px] uppercase tracking-nav text-aubergine/40">
                    {link.note}
                  </span>
                  <span className="mt-2 text-sm text-aubergine group-hover:text-copper">
                    {link.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 border-t border-stone/70 pt-12">
          <h3 className="font-display text-2xl text-aubergine">
            Common questions
          </h3>
          <div className="mt-6 divide-y divide-stone/70 border-y border-stone/70">
            {brandFaqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="cursor-pointer list-none text-sm font-medium text-aubergine marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start justify-between gap-4">
                    {faq.question}
                    <span className="mt-0.5 text-brass transition-transform group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-aubergine/70">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ShopSeoIntro() {
  return (
    <div className="mt-8 space-y-5">
      <p className="max-w-2xl text-sm leading-relaxed text-aubergine/70 sm:text-base">
        {shopIntro}
      </p>
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {collectionLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="block border border-stone/70 bg-stone/10 px-3 py-2.5 text-sm text-aubergine/80 transition-colors hover:border-brass/40 hover:text-copper"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CollectionSeoCopy({
  slug,
  name,
  fallbackDescription,
}: {
  slug: string;
  name: string;
  fallbackDescription?: string | null;
}) {
  const copy = collectionSeo[slug];
  const body = copy?.body || fallbackDescription;

  if (!body) return null;

  return (
    <div className="mt-8 max-w-2xl space-y-4 text-sm leading-relaxed text-aubergine/70 sm:text-base">
      <p>{body}</p>
      <p>
        Prefer something personal?{" "}
        <Link href="/custom" className="text-copper hover:underline">
          Request a custom {name.toLowerCase()} piece
        </Link>{" "}
        or{" "}
        <Link href="/contact" className="text-copper hover:underline">
          contact the ZAYUNE studio
        </Link>
        .
      </p>
    </div>
  );
}
