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
    <div className={cn("min-h-[70vh]", admin ? "bg-stone/20" : "bg-porcelain")}>
      <div className="container-content flex flex-col gap-8 py-8 lg:flex-row lg:gap-10 lg:py-12">
        <aside className="w-full shrink-0 lg:w-56">
          <div
            className={cn(
              "border p-5",
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
            <nav className="mt-6 flex flex-col gap-1">
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
