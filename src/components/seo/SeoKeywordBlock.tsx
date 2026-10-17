import Link from "next/link";
import { FaqJsonLd } from "@/components/seo/JsonLd";
import {
  brandFaqs,
  collectionSeo,
  homeSeoParagraphs,
  shopIntro,
} from "@/lib/seo-copy";

const collectionLinks = [
  { href: "/shop/beanies-hats", label: "Crochet beanies & hats" },
  { href: "/shop/scarves-mufflers", label: "Chunky scarves" },
  { href: "/shop/gloves-warmers", label: "Fingerless gloves" },
  { href: "/shop/jewelry", label: "Pearl jewelry sets" },
  { href: "/shop/hair-accessories", label: "Flower clips & gajras" },
  { href: "/shop/bags-pouches", label: "Crochet totes" },
  { href: "/custom", label: "Custom orders" },
];

export function HomeSeoBlock() {
  return (
    <section className="border-y border-stone/70 bg-porcelain">
      <div className="container-content py-14 sm:py-16">
        <FaqJsonLd
          items={brandFaqs.map((f) => ({
            question: f.question,
            answer: f.answer,
          }))}
        />
        <h2 className="font-display text-3xl text-aubergine sm:text-4xl">
          Handmade winter crochet &amp; jewelry from Pakistan
        </h2>
        <div className="mt-6 max-w-2xl space-y-4 text-sm leading-relaxed text-aubergine/75 sm:text-base">
          {homeSeoParagraphs.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </div>
        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm">
          {collectionLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-copper hover:underline">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-10 space-y-6">
          <h3 className="font-display text-2xl text-aubergine">
            Common questions
          </h3>
          <dl className="space-y-5">
            {brandFaqs.map((faq) => (
              <div key={faq.question}>
                <dt className="text-sm font-medium text-aubergine">
                  {faq.question}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-aubergine/70">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

export function ShopSeoIntro() {
  return (
    <div className="mt-8 max-w-2xl text-sm leading-relaxed text-aubergine/70 sm:text-base">
      <p>{shopIntro}</p>
      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
        {collectionLinks.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-copper hover:underline">
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
