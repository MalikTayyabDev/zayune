import type { Metadata } from "next";
import { Bodoni_Moda, Cormorant_Garamond, Inter } from "next/font/google";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SubscribePopup } from "@/components/marketing/SubscribePopup";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";
import { ConsentScripts } from "@/components/cookies/ConsentScripts";
import { CookieConsent } from "@/components/cookies/CookieConsent";
import { SupportChat } from "@/components/support/SupportChat";
import { WhatsAppFloat } from "@/components/support/WhatsAppFloat";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  display: "swap",
  adjustFontFallback: false,
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "ZAYUNE — Designed, not just made. | Handmade Jewelry & Crochet Pakistan",
    template: "%s · ZAYUNE",
  },
  description: siteConfig.description,
  keywords: [
    "ZAYUNE",
    "handmade jewelry Pakistan",
    "crochet flowers",
    "handmade keychains",
    "custom crochet orders",
    "zayune.pk",
    "designer handmade accessories",
  ],
  authors: [{ name: "ZAYUNE" }],
  creator: "ZAYUNE",
  openGraph: {
    title: "ZAYUNE — Designed, not just made.",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: "ZAYUNE",
    locale: siteConfig.locale,
    type: "website",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "ZAYUNE" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ZAYUNE — Designed, not just made.",
    description: siteConfig.description,
    images: ["/logo.png"],
  },
  alternates: {
    canonical: siteConfig.url,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "512x512" },
      { url: "/monogram.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bodoni.variable} ${inter.variable} ${cormorant.variable}`}>
      <body>
        <SessionProvider>
          <OrganizationJsonLd />
          <AnnouncementBar />
          <Header />
          <main className="min-h-[70vh]">{children}</main>
          <Footer />
          <CartDrawer />
          <WhatsAppFloat />
          <SupportChat />
          <SubscribePopup />
          <CookieConsent />
          <ConsentScripts />
        </SessionProvider>
      </body>
    </html>
  );
}
