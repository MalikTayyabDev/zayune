/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "public.blob.vercel-storage.com",
      },
    ],
  },
  async redirects() {
    return [
      // ——— Old WordPress / Hostinger paths (GSC 404 + 403) ———
      {
        source: "/product-category/:slug*",
        destination: "/shop",
        permanent: true,
      },
      {
        source: "/feed",
        destination: "/",
        permanent: true,
      },
      {
        source: "/feed/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/comments/feed",
        destination: "/",
        permanent: true,
      },
      {
        source: "/comments/feed/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/wp-admin",
        destination: "/",
        permanent: true,
      },
      {
        source: "/wp-admin/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/wp-content",
        destination: "/",
        permanent: true,
      },
      {
        source: "/wp-content/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/wp-includes",
        destination: "/",
        permanent: true,
      },
      {
        source: "/wp-includes/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/wp-json",
        destination: "/",
        permanent: true,
      },
      {
        source: "/wp-json/:path*",
        destination: "/",
        permanent: true,
      },
      // WordPress PHP entrypoints Google still probes
      {
        source: "/:path*.php",
        destination: "/",
        permanent: true,
      },
      // Broken WP import slug Google still crawls
      {
        source: "/product/https-zayune-com-product-mehboob-perfume",
        destination: "/shop",
        permanent: true,
      },
      {
        source: "/product/https-zayune-com-product-mehboob-perfume/:path*",
        destination: "/shop",
        permanent: true,
      },

      // ——— Unpublished jewelry / non-crochet → shop ———
      {
        source: "/shop/jewelry",
        destination: "/shop",
        permanent: true,
      },
      {
        source: "/shop/engagement",
        destination: "/shop/mehndi",
        permanent: true,
      },
      {
        source: "/product/pearl-beaded-jewelry-set",
        destination: "/shop",
        permanent: true,
      },
      {
        source: "/product/beaded-jhumka-earrings-mehndi",
        destination: "/shop/mehndi",
        permanent: true,
      },
      {
        source: "/product/floral-maang-tikka-mehndi",
        destination: "/shop/mehndi",
        permanent: true,
      },
      {
        source: "/product/engagement-pearl-necklace-earring-set",
        destination: "/shop/mehndi",
        permanent: true,
      },
      {
        source: "/product/pearl-tikka-jhumar-set-engagement",
        destination: "/shop/mehndi",
        permanent: true,
      },
      {
        source: "/product/pearl-bead-hair-pins-pack",
        destination: "/shop/hair-accessories",
        permanent: true,
      },
      {
        source: "/product/beaded-bracelet-ring-duo-engagement",
        destination: "/shop/mehndi",
        permanent: true,
      },
      {
        source: "/product/hand-painted-organza-dupatta",
        destination: "/shop",
        permanent: true,
      },
      {
        source: "/product/kundan-style-choker-set-walima",
        destination: "/shop/walima",
        permanent: true,
      },
      {
        source: "/product/pearl-hair-comb-walima",
        destination: "/shop/walima",
        permanent: true,
      },
      {
        source: "/product/embellished-clutch-potli-walima",
        destination: "/shop/walima",
        permanent: true,
      },
      {
        source: "/product/engagement-pearl-set-bundle",
        destination: "/shop/mehndi",
        permanent: true,
      },
      {
        source: "/product/walima-elegance-set",
        destination: "/shop/walima",
        permanent: true,
      },

      // Legacy category URLs (pre–Winter Special taxonomy) → live collections
      {
        source: "/shop/crochet-flowers",
        destination: "/shop/hair-accessories",
        permanent: true,
      },
      {
        source: "/shop/keychains",
        destination: "/shop/ornaments-gifts",
        permanent: true,
      },
      {
        source: "/shop/custom-orders",
        destination: "/custom",
        permanent: true,
      },
      // First winter seed product slugs (replaced by the 10 winning products)
      {
        source: "/product/frost-bloom-crochet-flower",
        destination: "/shop/hair-accessories",
        permanent: true,
      },
      {
        source: "/product/winter-rose-crochet-pin",
        destination: "/shop/hair-accessories",
        permanent: true,
      },
      {
        source: "/product/snowdrop-cluster-crochet",
        destination: "/shop/hair-accessories",
        permanent: true,
      },
      {
        source: "/product/ember-drop-earrings",
        destination: "/shop",
        permanent: true,
      },
      {
        source: "/product/soft-frost-necklace",
        destination: "/shop",
        permanent: true,
      },
      {
        source: "/product/brass-thread-hoops",
        destination: "/shop",
        permanent: true,
      },
      {
        source: "/product/midnight-bloom-keychain",
        destination: "/shop/ornaments-gifts",
        permanent: true,
      },
      {
        source: "/product/cocoa-petal-keychain",
        destination: "/shop/ornaments-gifts",
        permanent: true,
      },
      {
        source: "/product/holly-berry-charm-keychain",
        destination: "/shop/ornaments-gifts",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/sitemap.xml",
        headers: [
          { key: "Content-Type", value: "text/xml; charset=utf-8" },
          {
            key: "Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=86400",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
      {
        source: "/sitemap/sitemap.xml",
        headers: [
          { key: "Content-Type", value: "text/xml; charset=utf-8" },
          {
            key: "Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=86400",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
      {
        source: "/robots.txt",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
