import { NextResponse } from "next/server";
import { z } from "zod";
import { resolveDiscount } from "@/lib/order-pricing";

const schema = z.object({
  code: z.string().min(1),
  subtotal: z.number().int().nonnegative(),
});

export async function POST(request: Request) {
  try {
    const data = schema.parse(await request.json());
    const result = await resolveDiscount(data.code, data.subtotal);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to apply discount.",
      },
      { status: 400 }
    );
  }
}
