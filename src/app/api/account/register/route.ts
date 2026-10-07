import { NextResponse } from "next/server";
import { z } from "zod";
import { getDemoCustomers } from "@/lib/demo-customers";
import { isDemoMode } from "@/lib/demo-data";
import { friendlyError } from "@/lib/api-error";
import { sendWelcomeAccountEmail } from "@/lib/email";
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
    const passwordHash = hashPassword(data.password);

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
        passwordHash,
        name: data.name,
        phone: data.phone || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      store.set(email, customer);
      void sendWelcomeAccountEmail({ to: email, name: data.name });
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
        passwordHash,
        name: data.name,
        phone: data.phone || null,
      },
    });

    void sendWelcomeAccountEmail({ to: email, name: data.name });
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
