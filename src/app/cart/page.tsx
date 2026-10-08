import { CartView } from "@/components/cart/CartView";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Cart",
  description: "Your ZAYUNE shopping cart.",
  path: "/cart",
  noIndex: true,
});

export default function CartPage() {
  return (
    <div className="container-content py-14 sm:py-20">
      <SectionHeading as="h1" title="Cart" accent="rule" className="mb-12" />
      <CartView />
    </div>
  );
}
