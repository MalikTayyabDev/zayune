import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567";
  const instagram =
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ||
    "https://www.instagram.com/zayune.pk/";

  return (
    <div className="container-content py-14 sm:py-20 max-w-narrow">
      <SectionHeading
        eyebrow="Contact"
        title="Say hello"
        description="For orders, custom requests, or studio questions — WhatsApp is often the fastest path. Email details forthcoming."
      />

      <div className="mt-12 space-y-6 text-sm leading-relaxed text-aubergine/75">
        <p>
          <span className="text-nav text-aubergine/45 block mb-2">WhatsApp</span>
          <a
            href={`https://wa.me/${whatsapp}`}
            className="hover:text-copper transition-colors"
          >
            Message the studio
          </a>
        </p>
        <p>
          <span className="text-nav text-aubergine/45 block mb-2">Instagram</span>
          <a
            href={instagram}
            target="_blank"
            rel="noreferrer"
            className="hover:text-copper transition-colors"
          >
            @zayune.pk
          </a>
        </p>
        <p>
          <span className="text-nav text-aubergine/45 block mb-2">Email</span>
          hello@zayune.com
        </p>
      </div>

      <Button
        href={`https://wa.me/${whatsapp}`}
        target="_blank"
        rel="noreferrer"
        className="mt-10"
      >
        Open WhatsApp
      </Button>
    </div>
  );
}
