"use client";

import Link from "next/link";
import { LogIn, LogOut, UserPlus, UserRound } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type Props = {
  onNavigate?: () => void;
  tone?: "light" | "dark";
};

export function AccountLinks({ onNavigate, tone = "light" }: Props) {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const signedIn = !!session?.user;
  const isAdmin = session?.user?.role === "admin";
  const dark = tone === "dark";

  if (loading) {
    return (
      <span
        className={cn(
          "text-nav",
          dark ? "text-porcelain/40" : "text-aubergine/40"
        )}
      >
        …
      </span>
    );
  }

  if (signedIn) {
    return (
      <div className="flex items-center gap-3 sm:gap-4">
        <Link
          href={isAdmin ? "/admin" : "/account"}
          onClick={onNavigate}
          className={cn(
            "inline-flex items-center gap-1.5 text-nav transition",
            dark ? "text-porcelain hover:text-brass" : "hover:text-copper"
          )}
        >
          <Icon icon={UserRound} size={14} className={dark ? "text-brass" : undefined} />
          <span className="max-w-[8rem] truncate">
            {session.user?.name?.split(" ")[0] || "Account"}
          </span>
        </Link>
        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            signOut({ callbackUrl: "/" });
          }}
          className={cn(
            "inline-flex items-center gap-1.5 text-nav transition",
            dark
              ? "text-porcelain/65 hover:text-brass"
              : "text-aubergine/55 hover:text-copper"
          )}
        >
          <Icon icon={LogOut} size={14} className={dark ? "text-brass" : undefined} />
          Log out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <Link
        href="/account/login"
        onClick={onNavigate}
        className={cn(
          "inline-flex items-center gap-1.5 text-nav transition",
          dark ? "text-porcelain hover:text-brass" : "hover:text-copper"
        )}
      >
        <Icon icon={LogIn} size={14} className={dark ? "text-brass" : undefined} />
        Log in
      </Link>
      <Link
        href="/account/register"
        onClick={onNavigate}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-nav transition",
          dark
            ? "bg-brass text-aubergine hover:bg-porcelain"
            : "bg-aubergine text-porcelain hover:bg-aubergine/90"
        )}
      >
        <Icon
          icon={UserPlus}
          size={12}
          className={dark ? "text-aubergine" : "text-brass"}
        />
        Register
      </Link>
    </div>
  );
}
