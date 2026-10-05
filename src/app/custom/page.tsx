import {
  Flower2,
  KeyRound,
  MessageCircle,
  Palette,
  Sparkles,
} from "lucide-react";
import { CustomRequestForm } from "@/components/custom/CustomRequestForm";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/lib/site";

export const metadata = {
  title: "Custom Orders | Handmade by ZAYUNE",
  description:
    "Request a made-to-order crochet flower, jewelry piece, keychain, or custom colorway from ZAYUNE Pakistan.",
  alternates: {
    canonical: `${siteConfig.url}/custom`,
  },
};

const steps = [
  {
    title: "Share your idea",
    text: "Tell us the piece type, colors, and any inspiration — even a rough note is enough.",
  },
  {
    title: "We quote & plan",
    text: "You’ll get a price, materials note, and lead time before anything is made.",
  },
  {
    title: "We make & ship",
    text: "Once you approve, we crochet by hand and ship with the same care as our studio edit.",
  },
];

const requestables = [
  {
    icon: Flower2,
    title: "Crochet flowers",
    text: "Single blooms, small bouquets, or soft keepsakes in your palette.",
  },
  {
    icon: Sparkles,
    title: "Jewelry",
    text: "Earrings, accents, and quiet statement pieces designed with you.",
  },
  {
    icon: KeyRound,
    title: "Keychains",
    text: "Names, initials, or motifs that travel with you every day.",
  },
  {
    icon: Palette,
    title: "Custom colorways",
    text: "Recolor an existing ZAYUNE piece to match your story.",
  },
];

const faqs = [
  {
    q: "How long does a custom piece take?",
    a: "Most requests take about 7–14 days after you approve the quote. Tight dates are possible — note them in the form.",
  },
  {
    q: "How is pricing decided?",
    a: "We quote after reviewing complexity, materials, and size. Nothing is charged until you say yes.",
  },
  {
    q: "Can I request changes?",
    a: "Yes — small revisions are welcome at the quote stage. Once making starts, bigger changes may affect price or timing.",
  },
  {
    q: "Is this good for gifts?",
    a: "Absolutely. Add a gift note in your details and we’ll pack it with care.",
  },
];

export default function CustomOrdersPage() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567";

  return (
    <div>
      <section className="relative overflow-hidden border-b border-stone/70">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 20% 20%, rgba(183,155,99,0.18), transparent 55%), radial-gradient(ellipse 70% 50% at 90% 80%, rgba(127,139,120,0.2), transparent 50%), linear-gradient(165deg, #F7F3EE 0%, #EDE6DC 45%, #E4DDD2 100%)",
          }}
        />
        <div className="container-content relative py-16 sm:py-24 max-w-narrow">
          <p className="text-nav text-aubergine/55">Custom orders</p>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl md:text-[3.25rem] leading-tight text-aubergine">
            ZAYUNE
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-aubergine/70">
            Made-to-order crochet pieces — designed with you, made by hand in
            Pakistan.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="#request">Start a request</Button>
            <Button
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noreferrer"
              variant="secondary"
            >
              Chat on WhatsApp
            </Button>
          </div>
        </div>
      </section>

      <section className="container-content py-16 sm:py-20">
        <SectionHeading
          eyebrow="Process"
          title="How it works"
          description="Three quiet steps from idea to handmade piece."
        />
        <ol className="mt-12 grid gap-10 sm:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.title}>
              <p className="text-nav text-brass">0{i + 1}</p>
              <h3 className="mt-3 font-display text-2xl text-aubergine">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-aubergine/65">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-stone/70 bg-stone/15">
        <div className="container-content py-16 sm:py-20">
          <SectionHeading
            eyebrow="Studio"
            title="What you can request"
            description="Flowers, jewelry, keychains, colorways — or something in between."
          />
          <div className="card-grid-stat mt-8 lg:grid-cols-4">
            {requestables.map((item) => (
              <div
                key={item.title}
                className="flex min-h-[7rem] flex-col border border-stone/80 bg-porcelain/80 p-3 sm:min-h-0 sm:p-5"
              >
                <Icon icon={item.icon} size={18} className="sm:hidden" />
                <Icon icon={item.icon} size={20} className="hidden sm:block" />
                <h3 className="mt-2 font-body text-xs tracking-wide text-aubergine sm:mt-4 sm:text-sm">
                  {item.title}
                </h3>
                <p className="mt-1 line-clamp-3 text-xs leading-snug text-aubergine/65 sm:mt-2 sm:line-clamp-none sm:text-sm sm:leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="request" className="container-content scroll-mt-28 py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <SectionHeading
            eyebrow="Request"
            title="Tell us what you’re imagining"
            description="Share enough for a quote — colors, vibe, occasion. We’ll reply with price and timing."
          />
          <CustomRequestForm />
        </div>
      </section>

      <section className="border-t border-stone/70 bg-stone/10">
        <div className="container-content py-16 sm:py-20 max-w-narrow">
          <SectionHeading
            eyebrow="FAQ"
            title="Before you ask"
            description="Lead times, pricing, and gift notes — answered plainly."
          />
          <dl className="mt-12 space-y-8">
            {faqs.map((item) => (
              <div key={item.q}>
                <dt className="font-body text-sm text-aubergine">{item.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-aubergine/65">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="container-content py-16 sm:py-20 text-center">
        <Icon icon={MessageCircle} size={22} className="mx-auto" />
        <h2 className="mt-4 font-display text-3xl text-aubergine">
          Prefer to chat?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-aubergine/65">
          WhatsApp is often the fastest path for quick questions or photo
          references.
        </p>
        <Button
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noreferrer"
          className="mt-8"
        >
          Open WhatsApp
        </Button>
      </section>
    </div>
  );
}
