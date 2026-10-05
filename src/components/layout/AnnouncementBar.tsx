import Link from "next/link";
import { Flower2, Percent, Truck } from "lucide-react";
import { InstagramIcon } from "@/components/ui/BrandIcons";
import { Icon } from "@/components/ui/Icon";
import { getActiveIntroOffer } from "@/lib/demo-discounts";
import { isDemoMode } from "@/lib/demo-data";
import { getSettings } from "@/lib/products";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site";

export async function AnnouncementBar() {
  const settings = await getSettings();
  const intro = isDemoMode()
    ? getActiveIntroOffer()
    : await prisma.discountCode.findFirst({
        where: { active: true, isIntroOffer: true },
        orderBy: { createdAt: "desc" },
      });

  const text =
    intro?.description ||
    settings.bannerText ||
    "Crochet handmade accessories · Flowers · Jewelry · Keychains · Custom orders";

  const items = [
    {
      key: "promo",
      node: (
        <span className="inline-flex items-center gap-2 whitespace-nowrap">
          <Icon
            icon={intro ? Percent : Flower2}
            size={12}
            className="text-brass"
          />
          <span>{text}</span>
          {intro && (
            <Link
              href="/checkout"
              className="text-brass underline-offset-2 hover:underline hover:text-porcelain"
            >
              Code {intro.code}
            </Link>
          )}
        </span>
      ),
    },
    {
      key: "ship",
      node: (
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-porcelain/75">
          <Icon icon={Truck} size={12} className="text-brass" />
          Shipping Pakistan-wide
        </span>
      ),
    },
    {
      key: "ig",
      node: (
        <Link
          href={siteConfig.instagram}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 whitespace-nowrap text-brass hover:text-porcelain"
        >
          <InstagramIcon size={12} className="text-current" />
          {siteConfig.instagramHandle}
        </Link>
      ),
    },
    {
      key: "tag",
      node: (
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-porcelain/70">
          <Icon icon={Flower2} size={12} className="text-brass" />
          Designed, not just made
        </span>
      ),
    },
  ];

  return (
    <div className="relative overflow-hidden bg-aubergine text-porcelain">
      <p className="sr-only">
        {text}
        {intro ? ` Code ${intro.code}.` : ""} Shipping Pakistan-wide.{" "}
        {siteConfig.instagramHandle}. Designed, not just made.
      </p>
      <div
        className="ticker-track flex w-max py-2.5 text-[10px] uppercase tracking-nav text-porcelain/85"
        aria-hidden
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex shrink-0 items-center gap-8 px-4"
          >
            {items.map((item, i) => (
              <span
                key={`${copy}-${item.key}`}
                className="inline-flex items-center gap-8"
              >
                {i > 0 && (
                  <span className="h-1 w-1 shrink-0 rounded-full bg-brass/70" />
                )}
                {item.node}
              </span>
            ))}
            <span className="h-1 w-1 shrink-0 rounded-full bg-brass/70" />
          </div>
        ))}
      </div>
    </div>
  );
}
