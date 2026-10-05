import { NextResponse } from "next/server";
import { z } from "zod";
import { getDemoWaitlist } from "@/lib/demo-customers";
import { isDemoMode } from "@/lib/demo-data";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().email(),
  productId: z.string().min(1),
  variantId: z.string().optional().nullable(),
});

export async function POST(request: Request) {
  try {
    const data = schema.parse(await request.json());
    const email = data.email.toLowerCase();
    const variantId = data.variantId || null;

    if (isDemoMode()) {
      const list = getDemoWaitlist();
      const exists = list.some(
        (entry) =>
          entry.email === email &&
          entry.productId === data.productId &&
          (entry.variantId || null) === variantId
      );
      if (!exists) {
        list.push({
          id: `wl_${Date.now()}`,
          email,
          productId: data.productId,
          variantId,
          createdAt: new Date(),
        });
      }
      return NextResponse.json({ ok: true });
    }

    const existing = await prisma.waitlistEntry.findFirst({
      where: {
        email,
        productId: data.productId,
        variantId,
      },
    });

    if (!existing) {
      await prisma.waitlistEntry.create({
        data: {
          email,
          productId: data.productId,
          variantId,
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Please enter a valid email to join the waitlist." },
      { status: 400 }
    );
  }
}
