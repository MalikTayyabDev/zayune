import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { getDemoCustomers } from "@/lib/demo-customers";
import { isDemoMode } from "@/lib/demo-data";
import { hashPassword, verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(7).optional().nullable(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8).optional(),
});

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.role === "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = schema.parse(await request.json());
    const email = session.user.email.toLowerCase();

    if (data.newPassword && !data.currentPassword) {
      return NextResponse.json(
        { error: "Current password is required to set a new one." },
        { status: 400 }
      );
    }

    if (isDemoMode()) {
      const store = getDemoCustomers();
      const customer = store.get(email);
      if (!customer) {
        return NextResponse.json({ error: "Account not found" }, { status: 404 });
      }
      if (data.newPassword) {
        if (!verifyPassword(data.currentPassword || "", customer.passwordHash)) {
          return NextResponse.json(
            { error: "Current password is incorrect." },
            { status: 400 }
          );
        }
        customer.passwordHash = hashPassword(data.newPassword);
      }
      customer.name = data.name;
      customer.phone = data.phone || null;
      customer.updatedAt = new Date();
      store.set(email, customer);
      return NextResponse.json({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      });
    }

    const customer = await prisma.customer.findUnique({ where: { email } });
    if (!customer) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    if (data.newPassword) {
      if (!verifyPassword(data.currentPassword || "", customer.passwordHash)) {
        return NextResponse.json(
          { error: "Current password is incorrect." },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.customer.update({
      where: { email },
      data: {
        name: data.name,
        phone: data.phone || null,
        ...(data.newPassword
          ? { passwordHash: hashPassword(data.newPassword) }
          : {}),
      },
    });

    return NextResponse.json({
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
    });
  } catch (error) {
    const { friendlyError } = await import("@/lib/api-error");
    return NextResponse.json(
      { error: friendlyError(error, "Unable to update profile.") },
      { status: 400 }
    );
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.role === "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = session.user.email.toLowerCase();

  if (isDemoMode()) {
    const customer = getDemoCustomers().get(email);
    if (!customer) {
      return NextResponse.json({
        name: session.user.name || "",
        email,
        phone: null,
      });
    }
    return NextResponse.json({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
    });
  }

  const customer = await prisma.customer.findUnique({ where: { email } });
  if (!customer) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
  });
}
