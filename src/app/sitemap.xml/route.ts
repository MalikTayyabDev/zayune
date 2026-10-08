import {
  entriesToXml,
  getSitemapEntries,
  sitemapResponse,
} from "@/lib/sitemap-data";

export const revalidate = 3600;
export const dynamic = "force-dynamic";

export async function GET() {
  const entries = await getSitemapEntries();
  return sitemapResponse(entriesToXml(entries));
}
