import Image from "next/image";
import { StoryBlock } from "@/components/brand/StoryBlock";
import { EditorialQuote } from "@/components/ui/EditorialQuote";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteImages } from "@/lib/site-images";

export const metadata = {
  title: "About",
  description: "The story of ZAYUNE — two sisters, one design-led studio.",
};

export default function AboutPage() {
  return (
    <>
      <div className="container-content py-14 sm:py-20">
        <SectionHeading
          eyebrow="About"
          title="Two sisters. One point of view."
          description="ZAYUNE is a designer-led handmade label from Pakistan — jewelry, crochet flowers, keychains, and custom orders. Quiet confidence, careful craft, pieces that begin on paper."
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
              [Founder narrative — to be supplied.] The house was built on a shared
              belief: handmade should still be designed. Tiny things, big vibes —
              shaped with intention from the first line.
            </p>
            <p>
              Today the studio makes jewelry, crochet flowers, keychains, and
              custom orders. Follow the making at @zayune.pk. Bags and clothing
              will follow as the vocabulary grows.
            </p>
            <EditorialQuote
              quote="Made by hand. Led by design."
              attribution="Brand line"
            />
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
