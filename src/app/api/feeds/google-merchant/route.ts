import { NextResponse } from "next/server";
import { buildGoogleMerchantFeedXml } from "@/lib/google-merchant-feed";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function authorized(request: Request) {
  const expected = process.env.GOOGLE_MERCHANT_FEED_TOKEN?.trim();
  if (!expected) return false;
  const token = new URL(request.url).searchParams.get("token")?.trim();
  return Boolean(token && token === expected);
}

export async function GET(request: Request) {
  if (!process.env.GOOGLE_MERCHANT_FEED_TOKEN?.trim()) {
    return NextResponse.json(
      {
        error:
          "GOOGLE_MERCHANT_FEED_TOKEN is not configured on the server.",
      },
      { status: 503 }
    );
  }

  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const xml = await buildGoogleMerchantFeedXml();
    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  } catch (error) {
    console.error("[google-merchant-feed]", error);
    return NextResponse.json(
      { error: "Unable to build merchant feed." },
      { status: 500 }
    );
  }
}
