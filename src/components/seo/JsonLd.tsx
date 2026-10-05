import { siteConfig } from "@/lib/site";

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    logo: `${siteConfig.url}/logo.png`,
    image: `${siteConfig.url}/logo.png`,
    sameAs: siteConfig.sameAs,
    email: siteConfig.email,
    areaServed: "PK",
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
      slogan: siteConfig.tagline,
      logo: `${siteConfig.url}/logo.png`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ProductJsonLd({
  product,
}: {
  product: {
    name: string;
    slug: string;
    description: string;
    price: number;
    currency: string;
    image?: string;
    availability: "InStock" | "OutOfStock" | "PreOrder";
  };
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image ? [product.image] : undefined,
    brand: { "@type": "Brand", name: "ZAYUNE" },
    url: `${siteConfig.url}/product/${product.slug}`,
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/product/${product.slug}`,
      priceCurrency: product.currency,
      price: product.price,
      availability: `https://schema.org/${product.availability}`,
      seller: { "@type": "Organization", name: "ZAYUNE" },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
