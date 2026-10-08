import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

type PageMetaInput = {
  /** Page title without brand suffix — template adds " · ZAYUNE". */
  title: string;
  description: string;
  /** Path only, e.g. `/about` or `/`. */
  path: string;
  image?: string;
  noIndex?: boolean;
  /** Skip the root title template (homepage / titles that already include the brand). */
  absoluteTitle?: boolean;
  /** Extra focus keywords merged with site defaults. */
  keywords?: string[];
};

export function absoluteUrl(path = "/"): string {
  const base = siteConfig.url.replace(/\/$/, "");
  if (!path || path === "/") return `${base}/`;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Consistent title, description, self-canonical, keywords, and social tags. */
export function pageMetadata({
  title,
  description,
  path,
  image,
  noIndex,
  absoluteTitle,
  keywords = [],
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image || "/logo.png";
  const mergedKeywords = Array.from(
    new Set([...siteConfig.focusKeywords, ...keywords])
  );

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords: mergedKeywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: [{ url: ogImage, alt: `${title} · ${siteConfig.name}` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    ...(noIndex
      ? {
          robots: {
            index: false,
            follow: false,
            googleBot: { index: false, follow: false },
          },
        }
      : {}),
  };
}

export const noIndexRobots: Metadata["robots"] = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
};
