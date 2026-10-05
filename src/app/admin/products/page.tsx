import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getDemoCatalog, isDemoMode } from "@/lib/demo-catalog";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const products = isDemoMode()
    ? getDemoCatalog()
    : await prisma.product.findMany({
        include: { category: true, variants: true, images: true },
        orderBy: { updatedAt: "desc" },
      });

  return (
    <div className="container-content py-12">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          title="Products"
          description="Edit stories, swatches, gallery roles, SEO, and stock."
        />
        <Button href="/admin/products/new">New product</Button>
      </div>

      <div className="mt-10 overflow-x-auto border border-stone">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone text-nav text-aubergine/45">
            <tr>
              <th className="p-4 font-normal">Name</th>
              <th className="p-4 font-normal">Category</th>
              <th className="p-4 font-normal">Price</th>
              <th className="p-4 font-normal">Variants</th>
              <th className="p-4 font-normal">Images</th>
              <th className="p-4 font-normal">Status</th>
              <th className="p-4 font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-stone/70">
                <td className="p-4">{product.name}</td>
                <td className="p-4 text-aubergine/65">{product.category.name}</td>
                <td className="p-4">
                  {formatPrice(product.price, product.currency)}
                </td>
                <td className="p-4">{product.variants.length}</td>
                <td className="p-4">{product.images.length}</td>
                <td className="p-4 text-aubergine/65">
                  {product.published ? "Published" : "Draft"}
                  {product.featured ? " · Featured" : ""}
                </td>
                <td className="p-4 text-right">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="text-nav text-copper hover:text-aubergine"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
