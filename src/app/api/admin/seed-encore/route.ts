import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { seedEncoreCatalog } from "@/lib/seed-encore-catalog";
import { revalidateSitemaps } from "@/lib/sitemap-data";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * POST /api/admin/seed-encore
 * Admin session OR ?token= matching feed/seed tokens.
 */
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const isAdmin =
    session && (session.user as { role?: string }).role === "admin";

  const url = new URL(request.url);
  const token = url.searchParams.get("token") || "";
  const expected =
    process.env.ATELIER_SEED_TOKEN ||
    process.env.DAWAT_SEED_TOKEN ||
    process.env.GOOGLE_MERCHANT_FEED_TOKEN ||
    "";
  const tokenOk = Boolean(expected) && token === expected;

  if (!isAdmin && !tokenOk) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await seedEncoreCatalog(prisma);
    await revalidateSitemaps().catch(() => null);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("[seed-encore]", error);
    return NextResponse.json(
      {
        error: "Seed failed",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
