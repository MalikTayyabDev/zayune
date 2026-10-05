import { CartView } from "@/components/cart/CartView";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata = {
  title: "Cart",
};

export default function CartPage() {
  return (
    <div className="container-content py-14 sm:py-20">
      <SectionHeading title="Cart" accent="rule" className="mb-12" />
      <CartView />
    </div>
  );
}
