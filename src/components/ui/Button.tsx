import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary";

type CommonProps = {
  variant?: Variant;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps & {
  href: string;
  target?: string;
  rel?: string;
};

const styles: Record<Variant, string> = {
  primary:
    "bg-aubergine text-porcelain hover:bg-aubergine/90 border border-aubergine",
  secondary:
    "bg-transparent text-aubergine border border-aubergine/40 hover:border-copper hover:text-copper",
};

const base =
  "inline-flex items-center justify-center px-7 py-3 text-[11px] uppercase tracking-nav transition-colors duration-300 disabled:opacity-50 disabled:pointer-events-none";

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", className, children } = props;
  const classes = cn(base, styles[variant], className);

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes} target={props.target} rel={props.rel}>
        {children}
      </Link>
    );
  }

  const { variant: _v, className: _c, children: _ch, ...rest } = props as ButtonAsButton;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
