import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { authOptions } from "@/lib/auth";
import { getSettings } from "@/lib/products";

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const settings = await getSettings();

  return (
    <div className="py-4">
      <SectionHeading
        title="Settings"
        description="Shipping rate, optional banner, and bank transfer details."
        className="mb-10"
      />
      <SettingsForm
        adminEmailHint={process.env.ADMIN_EMAIL || undefined}
        initial={{
          shippingFlatFee: settings.shippingFlatFee,
          bannerText: settings.bannerText || "",
          bankName: settings.bankName || "",
          bankAccountTitle: settings.bankAccountTitle || "",
          bankAccountNumber: settings.bankAccountNumber || "",
          bankIban: settings.bankIban || "",
        }}
      />
    </div>
  );
}
