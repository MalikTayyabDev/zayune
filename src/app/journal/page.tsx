import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Journal",
  description: "Process notes and studio moments from ZAYUNE.",
};

export default function JournalPage() {
  const instagram =
    process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/zayune";

  return (
    <div className="container-content py-14 sm:py-20 max-w-narrow text-center">
      <SectionHeading
        align="center"
        eyebrow="Journal"
        title="Process, quietly shared"
        description="Editorial notes and behind-the-scenes pieces will live here in a later phase. For now, follow the studio on Instagram."
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
