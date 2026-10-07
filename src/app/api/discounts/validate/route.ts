import { NextResponse } from "next/server";
import { z } from "zod";
import { friendlyError } from "@/lib/api-error";
import { resolveDiscount } from "@/lib/order-pricing";

const schema = z.object({
  code: z.string().trim().min(1, "Please enter a discount code."),
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
        error: friendlyError(error, "Unable to apply discount."),
      },
      { status: 400 }
    );
  }
}
