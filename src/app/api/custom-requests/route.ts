import { NextResponse } from "next/server";
import { z } from "zod";
import { addDemoCustomRequest } from "@/lib/demo-custom-requests";
import { isDemoMode } from "@/lib/demo-data";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  pieceType: z.enum(["flower", "jewelry", "keychain", "colorway", "other"]),
  colors: z.string().min(2),
  details: z.string().min(10),
  occasion: z.enum(["gift", "personal", "wedding", "other"]),
  budget: z.enum(["under_2k", "2_4k", "4_7k", "open"]),
  neededBy: z.string().optional().nullable(),
  referenceUrl: z
    .union([z.string().url(), z.literal(""), z.null()])
    .optional(),
});

export async function POST(request: Request) {
  try {
    const data = schema.parse(await request.json());
    const neededBy =
      data.neededBy && data.neededBy.trim()
        ? new Date(data.neededBy)
        : null;
    const referenceUrl = data.referenceUrl?.trim() || null;

    if (neededBy && Number.isNaN(neededBy.getTime())) {
      return NextResponse.json(
        { error: "Please enter a valid needed-by date." },
        { status: 400 }
      );
    }

    if (isDemoMode()) {
      const entry = addDemoCustomRequest({
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone,
        pieceType: data.pieceType,
        colors: data.colors,
        details: data.details,
        occasion: data.occasion,
        budget: data.budget,
        neededBy,
        referenceUrl,
      });
      return NextResponse.json({ id: entry.id });
    }

    const entry = await prisma.customRequest.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone,
        pieceType: data.pieceType,
        colors: data.colors,
        details: data.details,
        occasion: data.occasion,
        budget: data.budget,
        neededBy,
        referenceUrl,
      },
    });

    return NextResponse.json({ id: entry.id });
  } catch {
    return NextResponse.json(
      { error: "Unable to submit request. Check your details and try again." },
      { status: 400 }
    );
  }
}
