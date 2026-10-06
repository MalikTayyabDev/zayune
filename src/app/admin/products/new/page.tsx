import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { authOptions } from "@/lib/auth";
import { getDemoCatalog } from "@/lib/demo-catalog";
import { isDemoMode } from "@/lib/demo-data";
import { getCategories } from "@/lib/products";
import { prisma } from "@/lib/prisma";

export default async function NewProductPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const [categories, products] = await Promise.all([
    getCategories(),
    isDemoMode()
      ? Promise.resolve(getDemoCatalog())
      : prisma.product.findMany({ select: { id: true, name: true } }),
  ]);

  return (
    <div className="py-4">
      <ProductForm
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        catalog={products.map((p) => ({ id: p.id, name: p.name }))}
      />
    </div>
  );
}
