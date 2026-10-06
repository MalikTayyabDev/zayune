import { getServerSession } from "next-auth";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { authOptions } from "@/lib/auth";

const links = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Orders" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/custom", label: "Custom request" },
  { href: "/track", label: "Track order" },
  { href: "/shop", label: "Shop" },
];

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role === "admin") {
    return <>{children}</>;
  }

  return (
    <DashboardShell title="Account" eyebrow="Member" links={links} tone="account">
      {children}
    </DashboardShell>
  );
}
