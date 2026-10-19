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
    knowsAbout: siteConfig.focusKeywords,
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Custom crochet & handmade accessories",
          description:
            "Made-to-order crochet flowers, jewelry, keychains, and custom colorways from ZAYUNE Pakistan.",
        },
      },
    ],
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
    /** Offer start date (ISO date). Defaults to today. */
    validFrom?: string;
    shippingFlatFee?: number;
    freeShippingOver?: number;
    /** Only pass real customer reviews — never invent ratings. */
    aggregateRating?: {
      ratingValue: number;
      reviewCount: number;
      bestRating?: number;
      worstRating?: number;
    };
    reviews?: {
      author: string;
      datePublished: string;
      reviewBody: string;
      ratingValue: number;
    }[];
  };
}) {
  const base = siteConfig.url.replace(/\/$/, "");
  const url = `${base}/product/${product.slug}`;
  const currency = product.currency || "PKR";
  const shippingFee = product.shippingFlatFee ?? 250;
  const freeOver = product.freeShippingOver ?? 5000;
  const validFrom =
    product.validFrom || new Date().toISOString().slice(0, 10);
  const priceValidUntil = new Date(Date.now() + 1000 * 60 * 60 * 24 * 90)
    .toISOString()
    .slice(0, 10);

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image ? [product.image] : undefined,
    brand: { "@type": "Brand", name: "ZAYUNE" },
    url,
    itemCondition: "https://schema.org/NewCondition",
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: currency,
      price: product.price,
      priceValidUntil,
      validFrom,
      availability: `https://schema.org/${product.availability}`,
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "ZAYUNE",
        telephone: siteConfig.phoneE164,
        url: base,
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "PK",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 3,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
        refundType: "https://schema.org/FullRefund",
        returnPolicyCountry: "PK",
        url: `${base}/shipping-returns`,
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: product.price >= freeOver ? 0 : shippingFee,
          currency,
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "PK",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: product.availability === "PreOrder" ? 7 : 1,
            maxValue: product.availability === "PreOrder" ? 14 : 3,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 2,
            maxValue: 7,
            unitCode: "DAY",
          },
        },
      },
    },
  };

  if (product.aggregateRating && product.aggregateRating.reviewCount > 0) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.aggregateRating.ratingValue,
      reviewCount: product.aggregateRating.reviewCount,
      bestRating: product.aggregateRating.bestRating ?? 5,
      worstRating: product.aggregateRating.worstRating ?? 1,
    };
  }

  if (product.reviews && product.reviews.length > 0) {
    data.review = product.reviews.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.author },
      datePublished: r.datePublished,
      reviewBody: r.reviewBody,
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.ratingValue,
        bestRating: 5,
        worstRating: 1,
      },
    }));
  }

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
  const base = siteConfig.url.replace(/\/$/, "");
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: `${base}${path}`,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: base,
    },
    about: {
      "@type": "Thing",
      name,
      description,
    },
  };

  if (products.length > 0) {
    data.mainEntity = {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${base}/product/${product.slug}`,
        name: product.name,
      })),
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
