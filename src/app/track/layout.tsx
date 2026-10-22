import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Track order",
  description: "Track your ZAYUNE order status.",
  path: "/track",
  noIndex: true,
});

export default function TrackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
