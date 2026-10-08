import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pageMetadata } from "@/lib/seo";
import { siteConfig, whatsappHref } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Shipping & Returns",
  description:
    "ZAYUNE shipping across Pakistan, made-to-order lead times, returns, exchanges, and care for handmade crochet pieces.",
  path: "/shipping-returns",
  keywords: [
    "ZAYUNE shipping Pakistan",
    "handmade returns policy Pakistan",
  ],
});

export default function ShippingReturnsPage() {
  return (
    <div className="container-content py-14 sm:py-20 max-w-narrow">
      <SectionHeading
        as="h1"
        eyebrow="Care"
        title="Shipping & returns"
        description="Plain policies for handmade and made-to-order pieces. Reach us on WhatsApp anytime."
      />

      <div className="mt-12 space-y-10 text-sm leading-relaxed text-aubergine/75">
        <section>
          <h2 className="font-display text-2xl text-aubergine mb-3">Shipping</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>We ship nationwide across Pakistan.</li>
            <li>
              In-stock pieces are prepared after payment or COD confirmation.
            </li>
            <li>
              Made-to-order and custom pieces follow the lead time on the product
              page or quote (usually noted in days).
            </li>
            <li>
              You’ll get tracking by email or WhatsApp when your parcel leaves
              the studio.
            </li>
            <li>
              Shipping fees (if any) are shown at checkout. Free-shipping
              thresholds may apply when offered.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl text-aubergine mb-3">Returns & exchanges</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Damaged or incorrect in-stock items: contact us within{" "}
              <strong className="font-medium text-aubergine">48 hours</strong> of
              delivery with clear photos — we’ll arrange a replacement or refund.
            </li>
            <li>
              Change of mind on in-stock pieces may be considered case-by-case
              within 3 days if unused and in original packing; return shipping is
              the buyer’s responsibility unless we made an error.
            </li>
            <li>
              Made-to-order and custom pieces are made for you and are not
              returnable unless there is a studio fault.
            </li>
            <li>Sale or intro-offer items follow the same damage policy only.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl text-aubergine mb-3">Care</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Keep crochet dry; spot-clean gently if needed.</li>
            <li>Store away from sharp jewellery and heavy perfume sprays.</li>
            <li>Each order includes simple care notes for its materials.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl text-aubergine mb-3">Contact</h2>
          <p>
            WhatsApp:{" "}
            <a
              href={whatsappHref("Hi ZAYUNE — I have a shipping / returns question.")}
              className="text-copper hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              {siteConfig.phoneDisplay}
            </a>
            <br />
            Email:{" "}
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-copper hover:underline"
            >
              {siteConfig.email}
            </a>
            <br />
            Or use our{" "}
            <Link href="/contact" className="text-copper hover:underline">
              contact form
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
