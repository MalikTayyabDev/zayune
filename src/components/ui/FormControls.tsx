"use client";

import type {
  ChangeEvent,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

export function FieldLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("text-nav text-aubergine/55", className)}>{children}</span>
  );
}

export function FormInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "mt-2 w-full border border-stone bg-porcelain px-4 py-3 text-sm text-aubergine outline-none transition focus:border-aubergine/50 focus:ring-1 focus:ring-aubergine/20",
        className
      )}
    />
  );
}

export function FormTextarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "mt-2 w-full border border-stone bg-porcelain px-4 py-3 text-sm text-aubergine outline-none transition focus:border-aubergine/50 focus:ring-1 focus:ring-aubergine/20",
        className
      )}
    />
  );
}

export function FormSelect({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "form-select mt-2 w-full appearance-none border border-stone px-4 py-3 pr-10 text-sm text-aubergine outline-none transition focus:border-aubergine/50 focus:ring-1 focus:ring-aubergine/20",
        className
      )}
    >
      {children}
    </select>
  );
}

export function FormCheckbox({
  className,
  label,
  description,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  description?: string;
}) {
  return (
    <label className={cn("flex cursor-pointer items-start gap-3 text-sm", className)}>
      <input
        type="checkbox"
        {...props}
        className="form-checkbox mt-0.5 h-4 w-4 shrink-0 border-stone text-aubergine accent-[var(--aubergine)]"
      />
      <span>
        <span className="font-medium text-aubergine">{label}</span>
        {description ? (
          <span className="mt-1 block text-xs leading-relaxed text-aubergine/55">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}

export type { ChangeEvent };
