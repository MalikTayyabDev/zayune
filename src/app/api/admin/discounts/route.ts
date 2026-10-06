import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import {
  getDemoDiscounts,
  upsertDemoDiscount,
  type DemoDiscount,
} from "@/lib/demo-discounts";
import { isDemoMode } from "@/lib/demo-data";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  code: z.string().min(2).max(32),
  type: z.enum(["PERCENT", "FIXED"]),
  value: z.number().int().positive(),
  minSubtotal: z.number().int().nonnegative().default(0),
  maxUses: z.number().int().positive().nullable().optional(),
  usageType: z
    .enum(["UNLIMITED", "LIMITED", "ONE_TIME", "ONE_TIME_EMAIL"])
    .default("UNLIMITED"),
  productIds: z.string().nullable().optional(),
  active: z.boolean().default(true),
  isIntroOffer: z.boolean().default(false),
  description: z.string().optional().nullable(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isDemoMode()) {
    return NextResponse.json(getDemoDiscounts());
  }

  const discounts = await prisma.discountCode.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(discounts);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = schema.parse(await request.json());
    const code = data.code.trim().toUpperCase();

    if (isDemoMode()) {
      const entry: DemoDiscount = {
        id: `disc_${Date.now().toString(36)}`,
        code,
        type: data.type,
        value: data.value,
        minSubtotal: data.minSubtotal,
        maxUses: data.maxUses ?? null,
        usedCount: 0,
        active: data.active,
        isIntroOffer: data.isIntroOffer,
        usageType: data.usageType,
        productIds: data.productIds || null,
        startsAt: null,
        endsAt: null,
        description: data.description || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      upsertDemoDiscount(entry);
      return NextResponse.json(entry);
    }

    const created = await prisma.discountCode.create({
      data: {
        code,
        type: data.type,
        value: data.value,
        minSubtotal: data.minSubtotal,
        maxUses: data.maxUses ?? null,
        usageType: data.usageType,
        productIds: data.productIds || null,
        active: data.active,
        isIntroOffer: data.isIntroOffer,
        description: data.description || null,
      },
    });
    return NextResponse.json(created);
  } catch {
    return NextResponse.json(
      { error: "Unable to create discount. Code may already exist." },
      { status: 400 }
    );
  }
}
