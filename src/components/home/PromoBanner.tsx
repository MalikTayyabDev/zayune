import Link from "next/link";
import { Flower2, UserPlus } from "lucide-react";
import { CopperStar } from "@/components/brand/CopperStar";
import { Icon } from "@/components/ui/Icon";

export function PromoBanner() {
  return (
    <section className="container-content py-6">
      <div className="relative overflow-hidden border border-stone bg-gradient-to-r from-stone/50 via-porcelain to-sage/20 px-6 py-10 sm:px-10 sm:py-12">
        <div className="relative z-10 max-w-lg">
          <p className="text-nav inline-flex items-center gap-2 text-aubergine/50">
            <CopperStar size={10} />
            Gift-ready crochet
          </p>
          <h2 className="mt-2 font-display text-3xl text-aubergine sm:text-4xl">
            Best-loved handmade accessories
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-aubergine/65">
            Explore our most-requested crochet flowers, jewelry, and keychains —
            or join the waitlist when a colorway sells out.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/shop?sort=best-sellers"
              className="inline-flex items-center gap-2 bg-aubergine px-6 py-3 text-[11px] uppercase tracking-nav text-porcelain"
            >
              <Icon icon={Flower2} size={14} className="text-brass" />
              Shop best sellers
            </Link>
            <Link
              href="/account/register"
              className="inline-flex items-center gap-1.5 text-nav self-center text-copper hover:text-aubergine"
            >
              <Icon icon={UserPlus} size={14} />
              Register for early access
            </Link>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-8 top-1/2 hidden h-40 w-40 -translate-y-1/2 rounded-full border border-brass/40 sm:block" />
        <div className="pointer-events-none absolute right-16 top-1/2 hidden h-24 w-24 -translate-y-1/2 rounded-full border border-copper/30 sm:block" />
      </div>
    </section>
  );
}
