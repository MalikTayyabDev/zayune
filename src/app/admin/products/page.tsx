import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { AdminProductTable } from "@/components/admin/AdminProductTable";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { authOptions } from "@/lib/auth";
import { getDemoCatalog, isDemoMode } from "@/lib/demo-catalog";
import { prisma } from "@/lib/prisma";

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const products = isDemoMode()
    ? getDemoCatalog()
    : await prisma.product.findMany({
        include: { category: true, variants: true, images: true },
        orderBy: { updatedAt: "desc" },
      });

  const rows = products.map((product) => ({
    id: product.id,
    name: product.name,
    category: product.category.name,
    price: product.price,
    currency: product.currency,
    variants: product.variants.length,
    images: product.images.length,
    published: product.published,
    featured: product.featured,
  }));

  return (
    <div className="py-4">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          title="Products"
          description="Search, filter, and edit stories, swatches, and stock."
        />
        <Button href="/admin/products/new">New product</Button>
      </div>
      <AdminProductTable products={rows} />
    </div>
  );
}
