"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Heart,
  MessageCircle,
  ShoppingBag,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { CopperStar } from "@/components/brand/CopperStar";
import { AccountLinks } from "@/components/layout/AccountLinks";
import { SearchBar } from "@/components/layout/SearchBar";
import { InstagramIcon } from "@/components/ui/BrandIcons";
import { Icon } from "@/components/ui/Icon";
import { useCartStore } from "@/lib/cart-store";
import { siteConfig } from "@/lib/site";
import { useWishlistStore } from "@/lib/wishlist-store";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/shop", label: "Shop all" },
  { href: "/custom", label: "Custom" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/account", label: "Account" },
];

const collections = [
  { href: "/shop/crochet-flowers", label: "Flowers", note: "01" },
  { href: "/shop/jewelry", label: "Jewelry", note: "02" },
  { href: "/shop/keychains", label: "Keychains", note: "03" },
  { href: "/custom", label: "Custom", note: "04" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const itemCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const openDrawer = useCartStore((s) => s.openDrawer);
  const wishCount = useWishlistStore((s) => s.items.length);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const count = mounted ? itemCount : 0;
  const saved = mounted ? wishCount : 0;

  function closeMenu() {
    setOpen(false);
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-[background-color,border-color] duration-300",
        open
          ? "border-transparent bg-transparent"
          : "border-stone/70 bg-porcelain/95 backdrop-blur-md"
      )}
    >
      <div className="hidden border-b border-stone/60 bg-stone/20 lg:block">
        <div className="container-content flex items-center justify-between gap-3 py-3">
          <SearchBar className="max-w-xl flex-1" compact />
          <AccountLinks />
        </div>
      </div>

      <div className="container-content relative flex h-14 items-center justify-between sm:h-[4.25rem] lg:h-[4.75rem] lg:gap-4">
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className={cn(
            "relative z-[70] -ml-1 flex h-10 w-10 items-center justify-center transition-all duration-300 lg:hidden",
            open && "fixed left-4 top-[max(0.65rem,env(safe-area-inset-top))] -translate-y-0"
          )}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={cn("hamburger", open && "hamburger-on-dark")}
            data-open={open ? "true" : "false"}
          >
            <span />
            <span />
            <span />
          </span>
        </button>

        <div
          className={cn(
            "absolute left-1/2 top-1/2 z-[70] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 lg:static lg:z-auto lg:translate-x-0 lg:translate-y-0 lg:shrink-0",
            open && "pointer-events-none opacity-0 lg:pointer-events-auto lg:opacity-100"
          )}
        >
          <Logo priority className="h-9 sm:h-11 lg:h-12" />
        </div>

        <nav className="hidden flex-1 items-center justify-center gap-5 xl:gap-7 lg:flex">
          {[
            { href: "/shop", label: "Shop" },
            { href: "/shop/crochet-flowers", label: "Flowers" },
            { href: "/shop/jewelry", label: "Jewelry" },
            { href: "/shop/keychains", label: "Keychains" },
            { href: "/custom", label: "Custom" },
            { href: "/about", label: "About" },
            { href: "/contact", label: "Contact" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-nav transition-colors hover:text-copper"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div
          className={cn(
            "relative z-[70] -mr-1 flex items-center gap-0 transition-opacity duration-300 lg:ml-auto",
            open && "pointer-events-none opacity-0 lg:pointer-events-auto lg:opacity-100"
          )}
        >
          <Link
            href="/wishlist"
            className="relative inline-flex h-9 w-9 items-center justify-center text-aubergine transition-colors hover:text-copper sm:h-10 sm:w-10"
            aria-label={`Wishlist, ${saved} items`}
          >
            <Icon icon={Heart} size={18} className="text-copper" />
            {saved > 0 && (
              <span className="absolute right-0 top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-copper px-0.5 text-[8px] text-porcelain">
                {saved}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={openDrawer}
            className="relative inline-flex h-9 w-9 items-center justify-center text-aubergine transition-colors hover:text-copper sm:h-10 sm:w-10"
            aria-label={`Cart, ${count} items`}
          >
            <Icon icon={ShoppingBag} size={18} className="text-copper" />
            {count > 0 && (
              <span className="absolute right-0 top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-aubergine px-0.5 text-[8px] text-porcelain">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-[60] lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!open}
      >
        <div
          className={cn(
            "absolute inset-0 overflow-y-auto bg-aubergine text-porcelain transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          )}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 50% at 0% 0%, rgba(183,155,99,0.28), transparent 55%), radial-gradient(ellipse 60% 40% at 100% 100%, rgba(127,139,120,0.22), transparent 50%)",
            }}
          />

          <div className="relative flex min-h-full flex-col px-5 pb-10 pt-[max(3.75rem,calc(env(safe-area-inset-top)+2.75rem))]">
            <div className="flex items-center justify-between gap-3">
              <Link href="/" onClick={closeMenu} aria-label="ZAYUNE home">
                <Logo href={null} variant="light" className="h-8" />
              </Link>
              <div className="flex items-center gap-1">
                <Link
                  href="/wishlist"
                  onClick={closeMenu}
                  className="relative inline-flex h-10 w-10 items-center justify-center"
                  aria-label="Wishlist"
                >
                  <Icon icon={Heart} size={18} className="text-brass" />
                  {saved > 0 && (
                    <span className="absolute right-1 top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-brass px-0.5 text-[8px] text-aubergine">
                      {saved}
                    </span>
                  )}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    openDrawer();
                  }}
                  className="relative inline-flex h-10 w-10 items-center justify-center"
                  aria-label="Cart"
                >
                  <Icon icon={ShoppingBag} size={18} className="text-brass" />
                  {count > 0 && (
                    <span className="absolute right-1 top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-porcelain px-0.5 text-[8px] text-aubergine">
                      {count}
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <CopperStar size={10} animated className="text-brass" />
              <p className="text-[10px] uppercase tracking-nav text-porcelain/55">
                Crochet handmade accessories
              </p>
            </div>

            <div className={cn("mt-5", open && "menu-item-in")}>
              <SearchBar
                onNavigate={closeMenu}
                className="[&_input]:border-porcelain/20 [&_input]:bg-porcelain/10 [&_input]:py-3.5 [&_input]:text-porcelain [&_input]:placeholder:text-porcelain/40 [&_svg]:text-brass"
              />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              {collections.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="group border border-porcelain/15 bg-porcelain/[0.06] px-3.5 py-3.5 transition active:bg-porcelain/15"
                >
                  <p className="text-[9px] uppercase tracking-nav text-brass">
                    {item.note}
                  </p>
                  <p className="mt-1.5 flex items-center justify-between font-display text-xl leading-none text-porcelain">
                    {item.label}
                    <Icon icon={ArrowUpRight} size={14} className="text-brass" />
                  </p>
                </Link>
              ))}
            </div>

            <nav className="mt-7 flex flex-col">
              {nav.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={cn(
                    "group flex items-center justify-between border-b border-porcelain/10 py-3.5 first:border-t",
                    open && "menu-item-in"
                  )}
                  style={{ animationDelay: `${100 + index * 40}ms` }}
                >
                  <span className="font-display text-[1.85rem] leading-none tracking-tight text-porcelain">
                    {item.label}
                  </span>
                  <Icon
                    icon={ArrowUpRight}
                    size={16}
                    className="text-brass/80"
                  />
                </Link>
              ))}
            </nav>

            <div className="mt-auto space-y-5 pt-10">
              <AccountLinks onNavigate={closeMenu} tone="dark" />
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href={`https://wa.me/${siteConfig.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={closeMenu}
                  className="inline-flex items-center justify-center gap-2 border border-porcelain/20 bg-porcelain/10 py-3 text-[10px] uppercase tracking-nav text-porcelain"
                >
                  <Icon icon={MessageCircle} size={14} className="text-brass" />
                  WhatsApp
                </Link>
                <Link
                  href={siteConfig.instagram}
                  target="_blank"
                  rel="noreferrer"
                  onClick={closeMenu}
                  className="inline-flex items-center justify-center gap-2 border border-porcelain/20 bg-porcelain/10 py-3 text-[10px] uppercase tracking-nav text-porcelain"
                >
                  <InstagramIcon size={13} className="text-brass" />
                  Instagram
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
