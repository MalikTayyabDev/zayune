import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Journal",
  description:
    "Process notes and studio moments from ZAYUNE — coming soon. Follow @zayune.pk on Instagram for now.",
  path: "/journal",
  noIndex: true,
});

export default function JournalPage() {
  const instagram = siteConfig.instagram;

  return (
    <div className="container-content py-14 sm:py-20 max-w-narrow text-center">
      <SectionHeading
        as="h1"
        align="center"
        eyebrow="Journal"
        title="Process, quietly shared"
        description="Editorial notes and behind-the-scenes pieces will live here soon. For now, follow the studio on Instagram."
        accent="star"
      />
      <Button
        href={instagram}
        variant="secondary"
        target="_blank"
        rel="noreferrer"
        className="mt-10"
      >
        Visit Instagram
      </Button>
    </div>
  );
}
