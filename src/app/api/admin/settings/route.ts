import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { isDemoMode } from "@/lib/demo-data";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  shippingFlatFee: z.number().int().nonnegative(),
  bannerText: z.string().optional(),
  bankName: z.string().optional(),
  bankAccountTitle: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankIban: z.string().optional(),
});

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isDemoMode()) {
    return NextResponse.json(
      { error: "Connect DATABASE_URL to persist settings." },
      { status: 400 }
    );
  }

  try {
    const data = schema.parse(await request.json());
    await prisma.settings.upsert({
      where: { id: "default" },
      update: {
        shippingFlatFee: data.shippingFlatFee,
        bannerText: data.bannerText || null,
        bankName: data.bankName || null,
        bankAccountTitle: data.bankAccountTitle || null,
        bankAccountNumber: data.bankAccountNumber || null,
        bankIban: data.bankIban || null,
      },
      create: {
        id: "default",
        shippingFlatFee: data.shippingFlatFee,
        bannerText: data.bannerText || null,
        bankName: data.bankName || null,
        bankAccountTitle: data.bankAccountTitle || null,
        bankAccountNumber: data.bankAccountNumber || null,
        bankIban: data.bankIban || null,
      },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const { friendlyError } = await import("@/lib/api-error");
    return NextResponse.json(
      { error: friendlyError(error, "Unable to save settings.") },
      { status: 400 }
    );
  }
}
