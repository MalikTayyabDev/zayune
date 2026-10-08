import Image from "next/image";
import Link from "next/link";
import { StoryBlock } from "@/components/brand/StoryBlock";
import { Button } from "@/components/ui/Button";
import { EditorialQuote } from "@/components/ui/EditorialQuote";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pageMetadata } from "@/lib/seo";
import { studioLocationLine } from "@/lib/site";
import { siteImages } from "@/lib/site-images";

export const metadata = pageMetadata({
  title: "About the Studio",
  description: `ZAYUNE is a designer-led handmade label from ${studioLocationLine()} — two sisters making crochet flowers, jewelry, keychains, and custom orders with quiet confidence.`,
  path: "/about",
  keywords: [
    "ZAYUNE Rawalpindi",
    "handmade Satellite Town",
    "crochet studio Rawalpindi",
  ],
});

export default function AboutPage() {
  return (
    <>
      <div className="container-content py-14 sm:py-20">
        <SectionHeading
          as="h1"
          eyebrow="About"
          title="Two sisters. One point of view."
          description={`ZAYUNE is a designer-led handmade label from ${studioLocationLine()} — jewelry, crochet flowers, keychains, and custom orders. Quiet confidence, careful craft, pieces that begin on paper.`}
          accent="star"
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/5] overflow-hidden bg-stone/40">
            <Image
              src={siteImages.studio.flowersBook}
              alt="ZAYUNE studio — handmade crochet flowers in progress"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
          <div className="space-y-6 text-sm sm:text-base leading-relaxed text-aubergine/75">
            <p>
              The house was built on a shared belief: handmade should still be
              designed. Tiny things, big vibes — shaped with intention from the
              first line, then finished by hand in the studio.
            </p>
            <p>
              Today we make jewelry, crochet flowers, keychains, and{" "}
              <Link href="/custom" className="text-copper hover:underline">
                custom orders
              </Link>
              . Follow the making at @zayune.pk. Bags and clothing will follow as
              the vocabulary grows.
            </p>
            <EditorialQuote
              quote="Made by hand. Led by design."
              attribution="Brand line"
            />
            <div className="flex flex-wrap gap-3 pt-2">
              <Button href="/shop">Shop the edit</Button>
              <Button href="/contact" variant="secondary">
                Contact the studio
              </Button>
            </div>
          </div>
        </div>
      </div>

      <StoryBlock />

      <section className="bg-sage/15 border-y border-stone/60">
        <div className="container-content py-20 max-w-narrow mx-auto text-center">
          <SectionHeading
            align="center"
            title="Pieces with a hand, a story, and a point of view."
            accent="rule"
          />
          <p className="mt-6 text-sm text-aubergine/65 leading-relaxed">
            We do not speak in discounts or countdowns. Value lives in the design,
            the making, and the way a piece sits in a life.
          </p>
        </div>
      </section>
    </>
  );
}
