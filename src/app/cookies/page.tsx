import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/lib/site";

export const metadata = {
  title: "Cookie policy",
};

export default function CookiesPage() {
  return (
    <div className="container-content py-14 sm:py-20 max-w-narrow">
      <SectionHeading
        eyebrow="Care"
        title="Cookie policy"
        description="How ZAYUNE uses cookies and similar storage in the browser."
      />

      <div className="mt-12 space-y-8 text-sm leading-relaxed text-aubergine/75">
        <section className="space-y-3">
          <h2 className="font-display text-2xl text-aubergine">What are cookies?</h2>
          <p>
            Cookies are small files stored on your device. We also use related
            browser storage (like localStorage) for your cart and cookie
            preferences. Some are essential for the shop to work; others are
            optional.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl text-aubergine">Essential</h2>
          <p>Always on. These keep the store secure and usable:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Sign-in / admin session (Auth.js)</li>
            <li>Cart and checkout continuity</li>
            <li>Security and fraud prevention basics</li>
            <li>Remembering your cookie preference choice</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl text-aubergine">Analytics (optional)</h2>
          <p>
            Only if you accept analytics. Used to understand which pages are
            visited (for example Google Analytics or similar), so we can improve
            the site. We do not turn these on until you opt in.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl text-aubergine">Marketing (optional)</h2>
          <p>
            Only if you accept marketing. Used for ads or remarketing tags if we
            add them later. Never loaded without your consent.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl text-aubergine">How to change your mind</h2>
          <p>
            Use <strong className="font-medium text-aubergine">Cookie settings</strong>{" "}
            in the footer anytime, or clear site data in your browser. Questions:{" "}
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-copper hover:text-aubergine"
            >
              {siteConfig.email}
            </a>
            .
          </p>
          <p>
            See also our{" "}
            <Link href="/privacy" className="text-copper hover:text-aubergine">
              Privacy
            </Link>{" "}
            page.
          </p>
        </section>
      </div>
    </div>
  );
}
