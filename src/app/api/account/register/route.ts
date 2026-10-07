import { NextResponse } from "next/server";
import { z } from "zod";
import { getDemoCustomers } from "@/lib/demo-customers";
import { isDemoMode } from "@/lib/demo-data";
import { friendlyError } from "@/lib/api-error";
import { sendWelcomeAccountEmail } from "@/lib/email";
import { consumePendingRegistration } from "@/lib/email-verification";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().email("Please enter a valid email."),
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter the 6-digit code from your email."),
});

export async function POST(request: Request) {
  try {
    const data = schema.parse(await request.json());
    const email = data.email.toLowerCase();

    const pending = await consumePendingRegistration(email, data.code);
    if (!pending) {
      return NextResponse.json(
        {
          error:
            "Invalid or expired code. Request a new verification code and try again.",
        },
        { status: 400 }
      );
    }

    if (isDemoMode()) {
      const store = getDemoCustomers();
      if (store.has(email)) {
        return NextResponse.json(
          { error: "An account with this email already exists." },
          { status: 400 }
        );
      }
      const customer = {
        id: `cus_${Date.now().toString(36)}`,
        email,
        passwordHash: pending.passwordHash,
        name: pending.name,
        phone: pending.phone,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      store.set(email, customer);
      void sendWelcomeAccountEmail({ to: email, name: pending.name });
      return NextResponse.json({ id: customer.id });
    }

    const existing = await prisma.customer.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 400 }
      );
    }

    const customer = await prisma.customer.create({
      data: {
        email,
        passwordHash: pending.passwordHash,
        name: pending.name,
        phone: pending.phone,
      },
    });

    void sendWelcomeAccountEmail({ to: email, name: pending.name });
    return NextResponse.json({ id: customer.id });
  } catch (error) {
    return NextResponse.json(
      {
        error: friendlyError(
          error,
          "Unable to create account. Check your details and try again."
        ),
      },
      { status: 400 }
    );
  }
}
