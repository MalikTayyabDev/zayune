import { NextResponse } from "next/server";
import { z } from "zod";
import { friendlyError } from "@/lib/api-error";
import { getDemoCustomers } from "@/lib/demo-customers";
import { isDemoMode } from "@/lib/demo-data";
import { sendVerificationCodeEmail } from "@/lib/email";
import {
  generateVerificationCode,
  savePendingRegistration,
} from "@/lib/email-verification";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  phone: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const data = schema.parse(await request.json());
    const email = data.email.toLowerCase();

    if (isDemoMode()) {
      if (getDemoCustomers().has(email)) {
        return NextResponse.json(
          { error: "An account with this email already exists." },
          { status: 400 }
        );
      }
    } else {
      const existing = await prisma.customer.findUnique({ where: { email } });
      if (existing) {
        return NextResponse.json(
          { error: "An account with this email already exists." },
          { status: 400 }
        );
      }
    }

    const code = generateVerificationCode();
    await savePendingRegistration({
      email,
      code,
      name: data.name,
      phone: data.phone || null,
      passwordHash: hashPassword(data.password),
    });

    void sendVerificationCodeEmail({
      to: email,
      name: data.name,
      code,
    });

    return NextResponse.json({
      ok: true,
      message: "We sent a 6-digit code to your email.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: friendlyError(
          error,
          "Unable to send verification code. Check your details and try again."
        ),
      },
      { status: 400 }
    );
  }
}
