import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { DiscountManager } from "@/components/admin/DiscountManager";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { authOptions } from "@/lib/auth";
import { getDemoDiscounts } from "@/lib/demo-discounts";
import { isDemoMode } from "@/lib/demo-data";
import { prisma } from "@/lib/prisma";

export default async function AdminDiscountsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const discounts = isDemoMode()
    ? getDemoDiscounts()
    : await prisma.discountCode.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="container-content py-12">
      <SectionHeading
        title="Discounts & intro offers"
        description="Create codes for checkout. Mark one as an introductory offer to promote it in the top bar."
      />
      <DiscountManager discounts={discounts} />
    </div>
  );
}
