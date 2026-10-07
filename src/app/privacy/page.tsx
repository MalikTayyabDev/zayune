import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/lib/site";

export const metadata = {
  title: "Privacy",
};

export default function PrivacyPage() {
  return (
    <div className="container-content py-14 sm:py-20 max-w-narrow">
      <SectionHeading
        eyebrow="Care"
        title="Privacy"
        description="How we handle the information you share with us."
      />
      <div className="mt-12 space-y-6 text-sm leading-relaxed text-aubergine/75">
        <p>
          When you place an order or create an account, we collect details needed
          to fulfill and support your purchase — name, email, phone, and shipping
          address.
        </p>
        <p>
          Payment information for card or wallet checkout is handled by our
          payment provider when connected; we do not store full card numbers on
          our servers.
        </p>
        <p>
          We use essential cookies for login, cart, and security. Optional
          analytics or marketing cookies only run if you allow them. See our{" "}
          <Link href="/cookies" className="text-copper hover:text-aubergine">
            cookie policy
          </Link>{" "}
          and change preferences anytime via Cookie settings in the footer.
        </p>
        <p>
          Questions:{" "}
          <a
            href={`mailto:${siteConfig.email}`}
            className="text-copper hover:text-aubergine"
          >
            {siteConfig.email}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
