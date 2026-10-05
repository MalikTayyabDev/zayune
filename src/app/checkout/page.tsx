import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { listPaymentProviders } from "@/lib/payments/providers";
import { getSettings } from "@/lib/products";

export const metadata = {
  title: "Checkout",
};

export default async function CheckoutPage() {
  const settings = await getSettings();
  const providers = listPaymentProviders().map((p) => ({
    id: p.id,
    label: p.label,
    description: p.description,
  }));

  return (
    <div className="container-content py-14 sm:py-20">
      <SectionHeading
        title="Checkout"
        description="Guest checkout is available — or register at checkout to save your details."
        className="mb-12"
      />
      <CheckoutForm shippingFee={settings.shippingFlatFee} providers={providers} />
    </div>
  );
}
