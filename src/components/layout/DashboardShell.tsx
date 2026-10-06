"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export type DashLink = { href: string; label: string };

type Props = {
  title: string;
  eyebrow: string;
  links: DashLink[];
  children: React.ReactNode;
  tone?: "admin" | "account";
};

export function DashboardShell({
  title,
  eyebrow,
  links,
  children,
  tone = "account",
}: Props) {
  const pathname = usePathname();
  const admin = tone === "admin";

  return (
    <div className={cn("min-h-[70vh]", admin ? "bg-stone/15" : "bg-porcelain")}>
      <div className="container-content flex flex-col gap-6 py-6 lg:flex-row lg:items-start lg:gap-12 lg:py-10">
        <aside className="w-full shrink-0 lg:sticky lg:top-24 lg:w-52 xl:w-56">
          {/* Mobile nav — horizontal scroll, not a tall stack */}
          <div className="lg:hidden">
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <p
                  className={cn(
                    "text-nav",
                    admin ? "text-brass" : "text-aubergine/45"
                  )}
                >
                  {eyebrow}
                </p>
                <p className="font-display text-xl text-aubergine">{title}</p>
              </div>
            </div>
            <nav className="-mx-1 flex gap-1 overflow-x-auto pb-1">
              {links.map((link) => {
                const active =
                  pathname === link.href ||
                  (link.href !== "/admin" &&
                    link.href !== "/account" &&
                    pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "shrink-0 px-3.5 py-2 text-[10px] uppercase tracking-nav",
                      active
                        ? "bg-aubergine text-porcelain"
                        : "border border-stone bg-porcelain text-aubergine/65"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Desktop sidebar */}
          <div
            className={cn(
              "hidden border p-5 lg:block",
              admin
                ? "border-aubergine/20 bg-aubergine text-porcelain"
                : "border-stone bg-stone/15"
            )}
          >
            <p
              className={cn(
                "text-nav",
                admin ? "text-brass" : "text-aubergine/45"
              )}
            >
              {eyebrow}
            </p>
            <p
              className={cn(
                "mt-1 font-display text-2xl",
                admin ? "text-porcelain" : "text-aubergine"
              )}
            >
              {title}
            </p>
            <nav className="mt-6 flex flex-col gap-0.5">
              {links.map((link) => {
                const active =
                  pathname === link.href ||
                  (link.href !== "/admin" &&
                    link.href !== "/account" &&
                    pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-3 py-2.5 text-[11px] uppercase tracking-nav transition",
                      admin
                        ? active
                          ? "bg-porcelain/15 text-brass"
                          : "text-porcelain/70 hover:bg-porcelain/10 hover:text-porcelain"
                        : active
                          ? "bg-aubergine text-porcelain"
                          : "text-aubergine/65 hover:bg-stone/40 hover:text-aubergine"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
