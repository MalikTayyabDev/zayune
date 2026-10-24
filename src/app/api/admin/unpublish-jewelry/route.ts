import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidateSitemaps } from "@/lib/sitemap-data";
import { unpublishJewelryProducts } from "@/lib/unpublish-jewelry";

export const dynamic = "force-dynamic";

/** POST /api/admin/unpublish-jewelry — admin or feed/seed token. */
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const isAdmin =
    session && (session.user as { role?: string }).role === "admin";
  const url = new URL(request.url);
  const token = url.searchParams.get("token") || "";
  const expected =
    process.env.DAWAT_SEED_TOKEN || process.env.GOOGLE_MERCHANT_FEED_TOKEN || "";
  const tokenOk = Boolean(expected) && token === expected;

  if (!isAdmin && !tokenOk) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await unpublishJewelryProducts(prisma);
    await revalidateSitemaps().catch(() => null);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("[unpublish-jewelry]", error);
    return NextResponse.json(
      {
        error: "Failed",
        detail: error instanceof Error ? error.message : "Unknown",
      },
      { status: 500 }
    );
  }
}
