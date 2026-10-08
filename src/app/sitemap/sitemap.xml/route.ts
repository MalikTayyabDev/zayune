import {
  entriesToXml,
  getSitemapEntries,
  sitemapResponse,
} from "@/lib/sitemap-data";

/** Alternate path for Google Search Console when /sitemap.xml is stuck on a cached "Couldn't fetch". */
export const revalidate = 3600;
export const dynamic = "force-dynamic";

export async function GET() {
  const entries = await getSitemapEntries();
  return sitemapResponse(entriesToXml(entries));
}
