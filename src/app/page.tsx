import Image from "next/image";
import Link from "next/link";
import { StoryBlock } from "@/components/brand/StoryBlock";
import { CopperStar } from "@/components/brand/CopperStar";
import { CollectionBanners } from "@/components/home/CollectionBanners";
import { HeroSlider } from "@/components/home/HeroSlider";
import { ProductTabs } from "@/components/home/ProductTabs";
import { PromoBanner } from "@/components/home/PromoBanner";
import { TrustBar } from "@/components/home/TrustBar";
import { Button } from "@/components/ui/Button";
import { InstagramIcon } from "@/components/ui/BrandIcons";
import { EditorialQuote } from "@/components/ui/EditorialQuote";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  getBestSellers,
  getFeaturedProducts,
  getNewestProducts,
  getProducts,
} from "@/lib/products";
import { siteConfig } from "@/lib/site";
import { siteImages } from "@/lib/site-images";

export default async function HomePage() {
  const [bestSellers, newest, featured, all] = await Promise.all([
    getBestSellers(4),
    getNewestProducts(4),
    getFeaturedProducts(4),
    getProducts(),
  ]);

  const alsoLike = all.filter((p) => !featured.some((f) => f.id === p.id)).slice(0, 4);
  const alsoLikeFill = alsoLike.length < 4 ? all.slice(0, 4) : alsoLike;

  return (
    <>
      <HeroSlider />
      <Reveal>
        <TrustBar />
      </Reveal>
      <CollectionBanners />

      <Reveal delay={40}>
        <ProductTabs
          tabs={[
            { id: "best-sellers", label: "Best sellers", products: bestSellers },
            { id: "new", label: "New arrivals", products: newest },
            { id: "featured", label: "Featured", products: featured },
            { id: "also-like", label: "You may also like", products: alsoLikeFill },
          ]}
        />
      </Reveal>

      <Reveal>
        <PromoBanner />
      </Reveal>

      <Reveal as="section" className="bg-aubergine text-porcelain">
        <div className="container-content grid gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-nav text-porcelain/50">Member perks</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">
              Create an account
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-porcelain/70">
              Save your wishlist, checkout faster, and track orders — guest checkout
              still available anytime. Try intro code WELCOME10 at checkout.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                href="/account/register"
                className="border-brass bg-[#2a1f2d] text-porcelain hover:border-porcelain hover:bg-[#352833]"
              >
                Register free
              </Button>
              <Button
                href="/wishlist"
                variant="secondary"
                className="border-porcelain/40 text-porcelain hover:border-brass hover:text-brass"
              >
                View wishlist
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              "Wishlist sync",
              "Order history",
              "Faster checkout",
              "Edit your details",
            ].map((perk) => (
              <div
                key={perk}
                className="border border-porcelain/15 bg-porcelain/5 px-4 py-5 text-sm text-porcelain/85"
              >
                {perk}
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="border-y border-stone/60 bg-sage/15">
        <div className="container-content grid gap-12 py-20 sm:py-24 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/5] overflow-hidden bg-stone/40">
            <Image
              src={siteImages.studio.flowersBook}
              alt="Hands finishing crochet flowers in the ZAYUNE studio"
              alt="Hands at work in the ZAYUNE studio"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <SectionHeading
              eyebrow="The founders"
              title="Two sisters. One point of view."
              description="ZAYUNE began as a shared sketchbook — design-led pieces made by hand. Tiny things, big vibes."
              accent="star"
            />
            <EditorialQuote
              className="mt-10"
              quote="We design first. Making follows."
              attribution="ZAYUNE studio"
            />
            <Button href="/about" variant="secondary" className="mt-8">
              Read the story
            </Button>
          </div>
        </div>
      </Reveal>

      <Reveal>
        <StoryBlock />
      </Reveal>

      <Reveal as="section" className="container-content pb-24">
        <div className="flex flex-col items-center border-t border-stone pt-16 text-center">
          <CopperStar animated />
          <p className="mt-6 inline-flex items-center gap-2 text-nav text-aubergine/50">
            <InstagramIcon size={14} />
            Follow the making
          </p>
          <h2 className="mt-3 font-display text-3xl text-aubergine">On Instagram</h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-aubergine/65">
            Crochet process, finished accessories, and studio notes — shared as they
            happen.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button
              href={siteConfig.instagram}
              variant="secondary"
              target="_blank"
              rel="noreferrer"
              className="gap-2"
            >
              <InstagramIcon size={14} />
              {siteConfig.instagramHandle}
            </Button>
            <Link href="/shop" className="text-nav self-center text-copper hover:text-aubergine">
              Back to shop →
            </Link>
          </div>
        </div>
      </Reveal>
    </>
  );
}
