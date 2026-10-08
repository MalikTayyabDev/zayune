import Link from "next/link";
import { getServerSession } from "next-auth";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { authOptions } from "@/lib/auth";
import { noIndexRobots } from "@/lib/seo";

export const metadata = {
  title: "Admin",
  robots: noIndexRobots,
};

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/custom-requests", label: "Custom" },
  { href: "/admin/marketing", label: "Marketing" },
  { href: "/admin/discounts", label: "Discounts" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/settings", label: "Settings" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div className="bg-porcelain">{children}</div>;
  }

  return (
    <DashboardShell title="Admin" eyebrow="ZAYUNE Studio" links={links} tone="admin">
      <div className="mb-6 flex justify-end">
        <Link
          href="/"
          className="text-nav text-copper hover:text-aubergine"
        >
          View store →
        </Link>
      </div>
      {children}
    </DashboardShell>
  );
}
