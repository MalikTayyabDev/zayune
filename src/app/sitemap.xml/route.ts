import {
  entriesToXml,
  fallbackSitemapXml,
  getSitemapEntries,
  sitemapResponse,
} from "@/lib/sitemap-data";

export const revalidate = 3600;
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const entries = await getSitemapEntries();
    return sitemapResponse(entriesToXml(entries));
  } catch (error) {
    console.error("[sitemap.xml] failed; serving brand fallback", error);
    return sitemapResponse(fallbackSitemapXml());
  }
}
