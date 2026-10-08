import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Track Order",
  description: "Track your ZAYUNE order.",
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
