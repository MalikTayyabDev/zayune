import Link from "next/link";
import { getServerSession } from "next-auth";
import { Logo } from "@/components/brand/Logo";
import { authOptions } from "@/lib/auth";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/custom-requests", label: "Custom" },
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
    <div className="min-h-[70vh] bg-stone/15">
      <div className="border-b border-stone bg-aubergine text-porcelain">
        <div className="container-content flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-4">
            <Logo variant="light" href="/admin" className="h-12 w-auto" />
            <div>
              <p className="text-nav text-porcelain/50">ZAYUNE Studio</p>
              <p className="font-display text-xl">Admin</p>
            </div>
          </div>
          <nav className="flex flex-wrap gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-nav text-porcelain/75 hover:text-brass"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/" className="text-nav text-brass">
              View store →
            </Link>
          </nav>
        </div>
      </div>
      <div className="bg-porcelain">{children}</div>
    </div>
  );
}
