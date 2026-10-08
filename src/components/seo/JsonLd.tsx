import { siteConfig } from "@/lib/site";

export function OrganizationJsonLd() {
  const base = siteConfig.url.replace(/\/$/, "");
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: base,
    description: siteConfig.description,
    logo: `${base}/logo.png`,
    image: `${base}/logo.png`,
    sameAs: siteConfig.sameAs,
    email: siteConfig.email,
    areaServed: "PK",
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
      slogan: siteConfig.tagline,
      logo: `${base}/logo.png`,
    },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: base,
    description: siteConfig.description,
    inLanguage: "en-PK",
    publisher: { "@type": "Organization", name: siteConfig.name },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${base}/shop?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
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
