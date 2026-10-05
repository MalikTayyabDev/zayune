import { SectionHeading } from "@/components/ui/SectionHeading";
import { CopperStar } from "@/components/brand/CopperStar";

const steps = [
  {
    title: "Idea",
    body: "A line, a proportion, a feeling worth making physical.",
  },
  {
    title: "Sketch",
    body: "Drawn until the form is quiet enough to stand alone.",
  },
  {
    title: "Material",
    body: "Chosen for hand-feel, color, and how it holds shape.",
  },
  {
    title: "Making",
    body: "Formed by hand in the studio — slow, precise, considered.",
  },
  {
    title: "Finished piece",
    body: "Checked, photographed, and released with its story intact.",
  },
];

export function StoryBlock() {
  return (
    <section className="container-content py-20 sm:py-28">
      <SectionHeading
        eyebrow="Process"
        title="From sketch to piece"
        description="Every ZAYUNE piece moves through the same considered path — design first, craft second, never the other way around."
        accent="star"
      />

      <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
        {steps.map((step, index) => (
          <li key={step.title} className="relative">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-nav text-copper">
                {String(index + 1).padStart(2, "0")}
              </span>
              {index < steps.length - 1 && (
                <CopperStar size={8} className="hidden lg:inline opacity-60" />
              )}
            </div>
            <h3 className="font-display text-xl text-aubergine">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-aubergine/65">
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
