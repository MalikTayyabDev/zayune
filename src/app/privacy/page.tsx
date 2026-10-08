import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pageMetadata } from "@/lib/seo";
import { siteConfig, studioLocationLine, whatsappHref } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How ZAYUNE collects, uses, and protects order, account, and cookie information for our handmade shop in Pakistan.",
  path: "/privacy",
  keywords: ["ZAYUNE privacy policy", "handmade shop data protection Pakistan"],
});

export default function PrivacyPage() {
  return (
    <div className="container-content py-14 sm:py-20 max-w-narrow">
      <SectionHeading
        as="h1"
        eyebrow="Care"
        title="Privacy policy"
        description="How we handle the information you share with the studio."
      />
      <div className="mt-12 space-y-8 text-sm leading-relaxed text-aubergine/75">
        <section className="space-y-3">
          <h2 className="font-display text-2xl text-aubergine">Who we are</h2>
          <p>
            ZAYUNE ({siteConfig.url}) is a handmade accessories studio based in{" "}
            {studioLocationLine()}. Contact:{" "}
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-copper hover:text-aubergine"
            >
              {siteConfig.email}
            </a>{" "}
            · WhatsApp{" "}
            <a
              href={whatsappHref()}
              className="text-copper hover:text-aubergine"
              target="_blank"
              rel="noreferrer"
            >
              {siteConfig.phoneDisplay}
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl text-aubergine">What we collect</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Order & account details: name, email, phone/WhatsApp, shipping
              address.
            </li>
            <li>
              Messages you send via forms, chat, WhatsApp, or email (custom
              requests, support).
            </li>
            <li>
              Technical basics needed to run the shop (login session, cart,
              security).
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl text-aubergine">How we use it</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Fulfill orders, custom quotes, and after-sales support.</li>
            <li>Send order updates (email and/or WhatsApp).</li>
            <li>
              Improve the site — only with optional analytics if you consent.
            </li>
            <li>
              Marketing broadcasts only to people who subscribed or opted in.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl text-aubergine">Payments</h2>
          <p>
            COD and bank transfer details are collected as needed to confirm
            payment. Card or wallet checkout (when enabled) is processed by the
            payment provider — we do not store full card numbers on our servers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl text-aubergine">Cookies</h2>
          <p>
            Essential cookies keep login, cart, and security working. Optional
            analytics or marketing cookies run only if you allow them. See our{" "}
            <Link href="/cookies" className="text-copper hover:text-aubergine">
              cookie policy
            </Link>{" "}
            and change preferences anytime via Cookie settings in the footer.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl text-aubergine">Sharing</h2>
          <p>
            We share data only with services needed to run the shop (hosting,
            email, courier, payment). We do not sell your personal information.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl text-aubergine">Your choices</h2>
          <p>
            Ask us to update or delete account details, or unsubscribe from
            marketing, by emailing{" "}
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-copper hover:text-aubergine"
            >
              {siteConfig.email}
            </a>{" "}
            or WhatsApp{" "}
            <a
              href={whatsappHref()}
              className="text-copper hover:text-aubergine"
              target="_blank"
              rel="noreferrer"
            >
              {siteConfig.phoneDisplay}
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
