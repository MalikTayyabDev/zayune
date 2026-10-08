import { noIndexRobots } from "@/lib/seo";

export const metadata = {
  title: "Order",
  robots: noIndexRobots,
};

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
