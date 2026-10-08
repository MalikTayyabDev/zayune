import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Wishlist",
  description: "Saved ZAYUNE pieces.",
  path: "/wishlist",
  noIndex: true,
});

export default function WishlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
