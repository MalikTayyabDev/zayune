import { siteConfig } from "@/lib/site";

export function OrganizationJsonLd() {
  const base = siteConfig.url.replace(/\/$/, "");

  const organization = {
    "@context": "https://schema.org",
    "@type": ["Organization", "OnlineStore"],
    name: siteConfig.name,
    url: base,
    description: siteConfig.description,
    logo: `${base}/logo.png`,
    image: `${base}/logo.png`,
    sameAs: siteConfig.sameAs,
    email: siteConfig.email,
    telephone: siteConfig.phoneE164,
    areaServed: [
      {
        "@type": "City",
        name: "Rawalpindi",
      },
      {
        "@type": "Country",
        name: "Pakistan",
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.region,
      addressCountry: siteConfig.address.countryCode,
    },
    location: {
      "@type": "Place",
      name: "ZAYUNE Studio",
      address: {
        "@type": "PostalAddress",
        streetAddress: siteConfig.address.street,
        addressLocality: siteConfig.address.city,
        addressRegion: siteConfig.address.region,
        addressCountry: siteConfig.address.countryCode,
      },
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: siteConfig.phoneE164,
        contactType: "customer service",
        areaServed: "PK",
        availableLanguage: ["English", "Urdu"],
      },
      {
        "@type": "ContactPoint",
        telephone: siteConfig.phoneE164,
        contactType: "sales",
        areaServed: "PK",
        availableLanguage: ["English", "Urdu"],
      },
    ],
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
      slogan: siteConfig.tagline,
      logo: `${base}/logo.png`,
    },
    priceRange: "$$",
    currenciesAccepted: "PKR",
    paymentAccepted: "Cash, Bank Transfer",
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: base,
    description: siteConfig.description,
    inLanguage: "en-PK",
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: `${base}/logo.png`,
    },
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
  const base = siteConfig.url.replace(/\/$/, "");
  const url = `${base}/product/${product.slug}`;
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image ? [product.image] : undefined,
    brand: { "@type": "Brand", name: "ZAYUNE" },
    url,
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: product.currency,
      price: product.price,
      availability: `https://schema.org/${product.availability}`,
      seller: {
        "@type": "Organization",
        name: "ZAYUNE",
        telephone: siteConfig.phoneE164,
      },
      priceValidUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90)
        .toISOString()
        .slice(0, 10),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; path: string }[];
}) {
  const base = siteConfig.url.replace(/\/$/, "");
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path.startsWith("http")
        ? item.path
        : `${base}${item.path.startsWith("/") ? item.path : `/${item.path}`}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function FaqJsonLd({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function CollectionJsonLd({
  name,
  description,
  path,
  products,
}: {
  name: string;
  description: string;
  path: string;
  products: { name: string; slug: string }[];
}) {
  if (products.length === 0) return null;
  const base = siteConfig.url.replace(/\/$/, "");
  const data = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: `${base}${path}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${base}/product/${product.slug}`,
        name: product.name,
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
