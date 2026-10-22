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
        destination: "/shop/jewelry",
        permanent: true,
      },
      {
        source: "/product/soft-frost-necklace",
        destination: "/shop/jewelry",
        permanent: true,
      },
      {
        source: "/product/brass-thread-hoops",
        destination: "/shop/jewelry",
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
