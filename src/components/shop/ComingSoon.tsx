import { Button } from "@/components/ui/Button";
import { siteConfig, whatsappHref } from "@/lib/site";

type Props = {
  title?: string;
  description?: string;
};

export function ComingSoon({
  title = "Products coming soon",
  description = "We’re finishing the first studio edit — handmade crochet flowers, jewelry, and keychains. Meanwhile, custom orders are open.",
}: Props) {
  return (
    <div className="mt-14 border border-stone/80 bg-stone/20 px-6 py-14 text-center sm:px-10">
      <p className="text-nav text-brass">Studio update</p>
      <h2 className="mt-3 font-display text-3xl text-aubergine sm:text-4xl">
        {title}
      </h2>
      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-aubergine/70">
        {description}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button href="/custom">Request a custom piece</Button>
        <Button
          href={whatsappHref(
            "Hi ZAYUNE — I’d like to hear when new pieces drop."
          )}
          variant="secondary"
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp {siteConfig.phoneDisplay}
        </Button>
      </div>
    </div>
  );
}
