"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Heart,
  MessageCircle,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const itemCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const cartOpen = useCartStore((s) => s.drawerOpen);
  const openDrawer = useCartStore((s) => s.openDrawer);
  const wishCount = useWishlistStore((s) => s.items.length);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const lock = open || cartOpen;
    document.body.style.overflow = lock ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, cartOpen, mounted]);

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

  const menu =
    mounted &&
    createPortal(
      <div
        className={cn(
          "fixed inset-0 z-[100] lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!open}
      >
        <div
          className={cn(
            "absolute inset-0 flex flex-col bg-aubergine text-porcelain transition-transform duration-300 ease-out",
            open ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 50% at 0% 0%, rgba(183,155,99,0.28), transparent 55%), radial-gradient(ellipse 60% 40% at 100% 100%, rgba(127,139,120,0.22), transparent 50%)",
            }}
          />

          <div className="relative z-[1] flex h-14 shrink-0 items-center justify-between border-b border-porcelain/10 px-4">
            <Link href="/" onClick={closeMenu} aria-label="ZAYUNE home">
              <Logo href={null} variant="light" className="h-8" />
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={closeMenu}
              className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-porcelain/20"
            >
              <Icon icon={X} size={20} className="text-porcelain" />
            </button>
          </div>

          <div className="relative z-[1] flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-5 pb-8 pt-4">
            <div className="flex items-center gap-2">
              <CopperStar size={10} animated className="text-brass" />
              <p className="text-[10px] uppercase tracking-nav text-porcelain/55">
                Crochet handmade accessories
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {collections.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="border border-porcelain/15 bg-porcelain/[0.06] px-3.5 py-3 active:bg-porcelain/15"
                >
                  <p className="text-[9px] uppercase tracking-nav text-brass">
                    {item.note}
                  </p>
                  <p className="mt-1 flex items-center justify-between font-display text-xl leading-none text-porcelain">
                    {item.label}
                    <Icon icon={ArrowUpRight} size={14} className="text-brass" />
                  </p>
                </Link>
              ))}
            </div>

            <nav className="mt-5 flex flex-col">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="flex items-center justify-between border-b border-porcelain/10 py-3 first:border-t"
                >
                  <span className="font-display text-[1.65rem] leading-none text-porcelain">
                    {item.label}
                  </span>
                  <Icon icon={ArrowUpRight} size={16} className="text-brass/80" />
                </Link>
              ))}
            </nav>

            <div className="mt-8 space-y-4">
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
      </div>,
      document.body
    );

  return (
    <header className="sticky top-0 z-40 border-b border-stone/70 bg-porcelain/95 backdrop-blur-md">
      <div className="hidden border-b border-stone/60 bg-stone/20 lg:block">
        <div className="container-content flex items-center justify-between gap-3 py-3">
          <SearchBar className="max-w-xl flex-1" compact />
          <AccountLinks />
        </div>
      </div>

      <div className="container-content relative flex h-14 items-center justify-between sm:h-[4.25rem] lg:h-[4.75rem] lg:gap-4">
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          className="-ml-1 flex h-10 w-10 items-center justify-center lg:hidden"
          onClick={() => {
            setSearchOpen(false);
            setOpen(true);
          }}
        >
          <span className="hamburger" data-open="false">
            <span />
            <span />
            <span />
          </span>
        </button>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:static lg:translate-x-0 lg:translate-y-0 lg:shrink-0">
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

        <div className="-mr-1 flex items-center gap-0 lg:ml-auto">
          <button
            type="button"
            aria-label="Search"
            aria-expanded={searchOpen}
            className="inline-flex h-9 w-9 items-center justify-center lg:hidden sm:h-10 sm:w-10"
            onClick={() => {
              setOpen(false);
              setSearchOpen((v) => !v);
            }}
          >
            <Icon icon={searchOpen ? X : Search} size={18} className="text-copper" />
          </button>
          <Link
            href="/wishlist"
            className="relative inline-flex h-9 w-9 items-center justify-center sm:h-10 sm:w-10"
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
            className="relative inline-flex h-9 w-9 items-center justify-center sm:h-10 sm:w-10"
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

      {searchOpen && (
        <div className="border-t border-stone/60 bg-porcelain px-4 py-3 lg:hidden">
          <SearchBar
            autoFocus
            onNavigate={() => setSearchOpen(false)}
            className="[&_input]:py-2.5"
          />
        </div>
      )}

      {menu}
    </header>
  );
}
