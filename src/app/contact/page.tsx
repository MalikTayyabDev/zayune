import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/contact/ContactForm";
import { pageMetadata } from "@/lib/seo";
import { siteConfig, whatsappHref } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Contact",
  description: `Contact ZAYUNE on WhatsApp ${siteConfig.phoneDisplay}, Instagram, or email for orders and custom requests.`,
  path: "/contact",
  keywords: [
    "contact ZAYUNE",
    "ZAYUNE WhatsApp",
    "custom crochet Pakistan contact",
  ],
});

export default function ContactPage() {
  return (
    <div className="container-content py-14 sm:py-20 max-w-narrow">
      <SectionHeading
        as="h1"
        eyebrow="Contact"
        title="Say hello"
        description="WhatsApp is often fastest — or send a note below and we’ll reply by email."
      />

      <div className="mt-12 space-y-6 text-sm leading-relaxed text-aubergine/75">
        <p>
          <span className="text-nav text-aubergine/45 block mb-2">WhatsApp</span>
          <a
            href={whatsappHref("Hi ZAYUNE — ")}
            className="hover:text-copper transition-colors"
            target="_blank"
            rel="noreferrer"
          >
            {siteConfig.phoneDisplay}
          </a>
        </p>
        <p>
          <span className="text-nav text-aubergine/45 block mb-2">Instagram</span>
          <a
            href={siteConfig.instagram}
            target="_blank"
            rel="noreferrer"
            className="hover:text-copper transition-colors"
          >
            {siteConfig.instagramHandle}
          </a>
        </p>
        <p>
          <span className="text-nav text-aubergine/45 block mb-2">Email</span>
          <a
            href={`mailto:${siteConfig.email}`}
            className="hover:text-copper transition-colors"
          >
            {siteConfig.email}
          </a>
        </p>
      </div>

      <Button
        href={whatsappHref("Hi ZAYUNE — ")}
        target="_blank"
        rel="noreferrer"
        className="mt-10"
      >
        Open WhatsApp
      </Button>

      <ContactForm />

      <p className="mt-10 text-sm text-aubergine/55">
        Looking for a made-to-order piece?{" "}
        <Link href="/custom" className="text-copper hover:underline">
          Start a custom request
        </Link>
      </p>
    </div>
  );
}
