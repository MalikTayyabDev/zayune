import { clsx, type ClassValue } from "clsx";
import { siteOrigin, whatsappHref } from "@/lib/site";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(amount: number, currency = "PKR") {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateOrderNumber() {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ZY-${stamp}-${rand}`;
}

export function whatsappOrderUrl(productName: string, slug: string) {
  const message = `Hi ZAYUNE — I'd like to order: ${productName}\n${siteOrigin()}/product/${slug}`;
  return whatsappHref(message);
}
