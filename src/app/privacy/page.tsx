import { SectionHeading } from "@/components/ui/SectionHeading";

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
          When you place an order, we collect the details needed to fulfill it — name,
          contact information, and shipping address. We do not create public customer
          accounts in this version of the site.
        </p>
        <p>
          Payment information for card or wallet checkout is handled by our payment
          provider when connected; we do not store full card numbers on our servers.
        </p>
        <p>
          [Full privacy policy — to be supplied by counsel or founder before launch.]
        </p>
      </div>
    </div>
  );
}
