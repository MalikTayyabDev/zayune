import { NextResponse } from "next/server";
import { z } from "zod";
import { isDemoMode } from "@/lib/demo-data";
import { getDemoDiscounts, upsertDemoDiscount } from "@/lib/demo-discounts";
import { getDemoSubscribers } from "@/lib/demo-support";
import { sendSubscribeEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
});

const CODE = "SUBSCRIBE5";

async function ensureSubscribeCode() {
  if (isDemoMode()) {
    if (!getDemoDiscounts().some((d) => d.code === CODE)) {
      upsertDemoDiscount({
        id: "disc-sub5",
        code: CODE,
        type: "PERCENT",
        value: 5,
        minSubtotal: 0,
        maxUses: null,
        usedCount: 0,
        active: true,
        isIntroOffer: false,
        usageType: "ONE_TIME_EMAIL",
        productIds: null,
        startsAt: null,
        endsAt: null,
        description: "Subscribe offer — 5% off (one-time per email)",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return;
  }

  const existing = await prisma.discountCode.findUnique({ where: { code: CODE } });
  if (!existing) {
    await prisma.discountCode.create({
      data: {
        code: CODE,
        type: "PERCENT",
        value: 5,
        maxUses: null,
        active: true,
        usageType: "ONE_TIME_EMAIL",
        description: "Subscribe offer — 5% off (one-time per email)",
      },
    });
  }
}

export async function POST(request: Request) {
  try {
    const data = schema.parse(await request.json());
    const email = data.email.toLowerCase();

    await ensureSubscribeCode();

    if (isDemoMode()) {
      const subs = getDemoSubscribers();
      if (subs.some((s) => s.email === email)) {
        return NextResponse.json({ code: CODE, already: true });
      }
      subs.unshift({
        id: `sub_${Date.now().toString(36)}`,
        email,
        name: data.name || null,
        couponCode: CODE,
        createdAt: new Date(),
      });
    } else {
      await prisma.subscriber.upsert({
        where: { email },
        create: {
          email,
          name: data.name || null,
          couponCode: CODE,
        },
        update: { name: data.name || null },
      });
    }

    void sendSubscribeEmail({ to: email, code: CODE });
    return NextResponse.json({ code: CODE });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Unable to subscribe" }, { status: 500 });
  }
}
