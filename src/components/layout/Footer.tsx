import Link from "next/link";
import {
  Flower2,
  Heart,
  MessageCircle,
  PackageSearch,
  Truck,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { CopperStar } from "@/components/brand/CopperStar";
import { CookieSettingsButton } from "@/components/cookies/CookieSettingsButton";
import { InstagramIcon } from "@/components/ui/BrandIcons";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/site";

const columns = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "All accessories" },
      { href: "/shop/crochet-flowers", label: "Crochet flowers" },
      { href: "/shop/jewelry", label: "Jewelry" },
      { href: "/shop/keychains", label: "Keychains" },
      { href: "/custom", label: "Custom orders" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/account", label: "My account" },
      { href: "/account/orders", label: "Orders" },
      { href: "/wishlist", label: "Wishlist" },
      { href: "/track", label: "Track order" },
      { href: "/account/register", label: "Register" },
    ],
  },
  {
    title: "Studio",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/shipping-returns", label: "Shipping & returns" },
      { href: "/privacy", label: "Privacy" },
      { href: "/cookies", label: "Cookies" },
      { href: "/journal", label: "Journal" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-stone bg-aubergine text-porcelain">
      <Reveal>
        <div className="border-b border-porcelain/10">
          <div className="container-content grid grid-cols-2 gap-6 py-8 sm:grid-cols-4">
            {[
              { icon: Flower2, label: "Crochet handmade" },
              { icon: Heart, label: "Made with care" },
              { icon: Truck, label: "Pakistan shipping" },
              { icon: PackageSearch, label: "Secure checkout" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 text-sm text-porcelain/75"
              >
                <Icon icon={item.icon} size={16} className="text-brass" />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <div className="container-content py-16">
        <Reveal>
          <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
            <div className="max-w-sm">
              <Logo variant="light" href="/" className="h-16 w-auto sm:h-20" />
              <p className="mt-6 font-display text-2xl leading-snug">
                {siteConfig.tagline}
              </p>
              <p className="mt-2 font-editorial italic text-porcelain/70">
                {siteConfig.supportingLine}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-porcelain/65">
                Crochet flowers, jewelry, keychains, and made-to-order custom pieces
                from Pakistan. Guest checkout anytime — accounts for wishlist and
                order history.
              </p>
              <p className="mt-5 text-[11px] uppercase tracking-nav text-brass/90">
                Intro code · WELCOME10
              </p>
            </div>

            <div className="grid flex-1 grid-cols-2 gap-10 sm:grid-cols-3 lg:max-w-2xl">
              {columns.map((column) => (
                <div key={column.title}>
                  <p className="mb-4 text-nav text-porcelain/50">{column.title}</p>
                  <ul className="space-y-3">
                    {column.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-sm text-porcelain/80 transition-colors hover:text-brass"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="rule-brass mt-14 opacity-40" />

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5 text-nav text-porcelain/55">
            <a
              href={siteConfig.instagram}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-brass"
            >
              <InstagramIcon size={14} className="text-current" />
              {siteConfig.instagramHandle}
            </a>
            <CopperStar size={10} />
            <a
              href={`https://wa.me/${siteConfig.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-brass"
            >
              <Icon icon={MessageCircle} size={14} className="text-current" />
              WhatsApp
            </a>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <CookieSettingsButton />
            <p className="text-[11px] uppercase tracking-nav text-porcelain/40">
              © {new Date().getFullYear()} ZAYUNE · Designed, not just made
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
