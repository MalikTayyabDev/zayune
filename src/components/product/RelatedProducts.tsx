import { ProductCard } from "@/components/product/ProductCard";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  oneLiner: string;
  images: { url: string; alt: string }[];
  category: { name: string };
  variants?: { id: string; name: string; swatchHex?: string | null }[];
};

export function RelatedProducts({
  title = "You may also like",
  products,
}: {
  title?: string;
  products: Product[];
}) {
  if (products.length === 0) return null;

  return (
    <section className="mt-12 border-t border-stone pt-10 sm:mt-20 sm:pt-16">
      <div className="mb-5 flex items-end justify-between gap-4 sm:mb-8">
        <div>
          <p className="text-[10px] uppercase tracking-nav text-aubergine/50 sm:text-nav">
            More from the studio
          </p>
          <h2 className="mt-1.5 font-display text-2xl sm:mt-2 sm:text-3xl">{title}</h2>
        </div>
      </div>
      <div className="card-grid lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} showQuickAdd />
        ))}
      </div>
    </section>
  );
}
