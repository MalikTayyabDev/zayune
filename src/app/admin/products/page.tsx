import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import {
  AdminProductTable,
  LOW_STOCK_THRESHOLD,
} from "@/components/admin/AdminProductTable";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { authOptions } from "@/lib/auth";
import { getDemoCatalog, isDemoMode } from "@/lib/demo-catalog";
import { prisma } from "@/lib/prisma";

type Props = { searchParams: { stock?: string } };

function isLowStock(product: {
  fulfillment: string;
  stock: number | null;
  variants: { stock: number | null }[];
}) {
  if (product.fulfillment === "MADE_TO_ORDER") return false;
  if (product.stock != null && product.stock < LOW_STOCK_THRESHOLD) return true;
  return product.variants.some(
    (v) => v.stock != null && v.stock < LOW_STOCK_THRESHOLD
  );
}

export default async function AdminProductsPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const products = isDemoMode()
    ? getDemoCatalog()
    : await prisma.product.findMany({
        include: { category: true, variants: true, images: true },
        orderBy: { updatedAt: "desc" },
      });

  const rows = products.map((product) => {
    const stock =
      product.fulfillment === "IN_STOCK"
        ? product.stock ??
          product.variants.reduce(
            (min, v) =>
              v.stock == null ? min : min == null ? v.stock : Math.min(min, v.stock),
            null as number | null
          )
        : null;
    return {
      id: product.id,
      name: product.name,
      sku: "sku" in product ? (product.sku as string | null) : null,
      category: product.category.name,
      price: product.price,
      currency: product.currency,
      variants: product.variants.length,
      images: product.images.length,
      published: product.published,
      featured: product.featured,
      fulfillment: product.fulfillment,
      stock,
      lowStock: isLowStock(product),
    };
  });

  return (
    <div className="py-4">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          title="Products"
          description="Images, SKUs, variants, and stock — filter low quantity anytime."
        />
        <Button href="/admin/products/new">New product</Button>
      </div>
      <AdminProductTable
        products={rows}
        initialFilter={searchParams.stock === "low" ? "low" : "all"}
      />
    </div>
  );
}
