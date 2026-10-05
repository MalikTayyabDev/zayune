import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata = {
  title: "Shipping & returns",
};

export default function ShippingReturnsPage() {
  return (
    <div className="container-content py-14 sm:py-20 max-w-narrow">
      <SectionHeading
        eyebrow="Care"
        title="Shipping & returns"
        description="Clear policies, quietly stated. Final details will be confirmed before launch."
      />

      <div className="mt-12 space-y-10 text-sm leading-relaxed text-aubergine/75">
        <section>
          <h2 className="font-display text-2xl text-aubergine mb-3">Shipping</h2>
          <p>
            [Shipping regions, rates, and timelines — to be supplied.] Made-to-order
            pieces ship according to the lead time noted on each product page. In-stock
            pieces are prepared as orders are confirmed.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-aubergine mb-3">Returns</h2>
          <p>
            [Returns and exchanges policy — to be supplied.] One-of-a-kind and
            made-to-order pieces may have different terms; we will state these clearly
            at checkout.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-aubergine mb-3">Care</h2>
          <p>
            [Care guidance — to be supplied.] Each piece will include simple care notes
            appropriate to its materials.
          </p>
        </section>
      </div>
    </div>
  );
}
