import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { authOptions } from "@/lib/auth";
import { getDemoCatalog } from "@/lib/demo-catalog";
import { isDemoMode } from "@/lib/demo-data";
import { getCategories, getProductById } from "@/lib/products";
import { prisma } from "@/lib/prisma";

type Props = { params: { id: string } };

export default async function EditProductPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const [categories, product, products] = await Promise.all([
    getCategories(),
    getProductById(params.id),
    isDemoMode()
      ? Promise.resolve(getDemoCatalog())
      : prisma.product.findMany({ select: { id: true, name: true } }),
  ]);

  if (!product) notFound();

  const compareAt =
    "compareAtPrice" in product ? (product.compareAtPrice as number | null) : null;
  const isBundle =
    "isBundle" in product ? Boolean(product.isBundle) : false;
  const bundleProductIds =
    "bundleProductIds" in product && Array.isArray(product.bundleProductIds)
      ? (product.bundleProductIds as string[])
      : [];
  const introOfferPercent =
    "introOfferPercent" in product
      ? (product.introOfferPercent as number | null)
      : null;

  return (
    <div className="py-4">
      <ProductForm
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        catalog={products.map((p) => ({ id: p.id, name: p.name }))}
        initial={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          oneLiner: product.oneLiner,
          story: product.story,
          materials: product.materials,
          handmadeProof: product.handmadeProof,
          stylingNote: product.stylingNote,
          price: product.price,
          compareAtPrice: compareAt,
          categoryId: product.categoryId,
          fulfillment: product.fulfillment,
          stock: product.stock,
          leadTimeDays: product.leadTimeDays,
          featured: product.featured,
          published: product.published,
          isBundle,
          bundleProductIds,
          introOfferPercent,
          seoTitle: product.seoTitle || "",
          seoDescription: product.seoDescription || "",
          tags: (product.tags || []).join(", "),
          images:
            product.images.length > 0
              ? product.images.map((img, i) => ({
                  url: img.url,
                  alt: img.alt,
                  kind: img.kind,
                  sortOrder: i,
                }))
              : [{ url: "", alt: product.name, kind: "hero", sortOrder: 0 }],
          variants:
            product.variants.length > 0
              ? product.variants.map((v) => ({
                  id: v.id,
                  name: v.name,
                  optionGroup:
                    "optionGroup" in v ? String(v.optionGroup) : "Color",
                  swatchHex:
                    "swatchHex" in v && v.swatchHex
                      ? String(v.swatchHex)
                      : "#B85F45",
                  imageUrl:
                    "imageUrl" in v && v.imageUrl ? String(v.imageUrl) : "",
                  priceDelta: v.priceDelta,
                  stock: v.stock == null ? "" : String(v.stock),
                  sku: v.sku || "",
                }))
              : [
                  {
                    name: "Default",
                    optionGroup: "Color",
                    swatchHex: "#B85F45",
                    imageUrl: "",
                    priceDelta: 0,
                    stock: "",
                    sku: "",
                  },
                ],
        }}
      />
    </div>
  );
}
