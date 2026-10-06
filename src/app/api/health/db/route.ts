import { NextResponse } from "next/server";
import { ensureDatabaseUrl, isServerlessRuntime } from "@/lib/env";
import { isDemoMode } from "@/lib/demo-data";
import { prisma } from "@/lib/prisma";

/** Lightweight check so we can confirm Vercel can see Neon. No secrets returned. */
export async function GET() {
  const url = ensureDatabaseUrl();
  const demo = isDemoMode();

  if (!url) {
    return NextResponse.json({
      ok: false,
      demoMode: demo,
      serverless: isServerlessRuntime(),
      databaseConfigured: false,
      message:
        "DATABASE_URL (or Neon POSTGRES_PRISMA_URL) is missing. Orders will not persist.",
    });
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      ok: true,
      demoMode: demo,
      serverless: isServerlessRuntime(),
      databaseConfigured: true,
      message: demo
        ? "Database reachable, but FORCE_DEMO_DATA is on — turn it off for real orders."
        : "Database reachable. Orders should persist.",
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        demoMode: demo,
        serverless: isServerlessRuntime(),
        databaseConfigured: true,
        message: "DATABASE_URL is set but the connection failed.",
      },
      { status: 503 }
    );
  }
}
