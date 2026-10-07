import { clsx, type ClassValue } from "clsx";

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
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567";
  const site =
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://zayune.com";
  const message = `Hi ZAYUNE — I'd like to order: ${productName}\n${site}/product/${slug}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
