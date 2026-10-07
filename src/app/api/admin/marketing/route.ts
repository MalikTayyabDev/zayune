import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { isDemoMode } from "@/lib/demo-data";
import { getDemoSubscribers } from "@/lib/demo-support";
import { getDemoCustomers } from "@/lib/demo-customers";
import { sendMarketingBroadcast } from "@/lib/email";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  audience: z.enum(["subscribers", "customers", "all"]),
  subject: z.string().min(3).max(160),
  headline: z.string().min(3).max(120),
  body: z.string().min(10).max(5000),
  ctaLabel: z.string().max(60).optional().nullable(),
  ctaUrl: z.string().url().optional().nullable().or(z.literal("")),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isDemoMode()) {
    return NextResponse.json({
      subscribers: getDemoSubscribers().length,
      customers: getDemoCustomers().size,
    });
  }

  const [subscribers, customers] = await Promise.all([
    prisma.subscriber.count(),
    prisma.customer.count(),
  ]);

  return NextResponse.json({ subscribers, customers });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = schema.parse(await request.json());
    const emails = new Set<string>();

    if (isDemoMode()) {
      if (data.audience === "subscribers" || data.audience === "all") {
        getDemoSubscribers().forEach((s) => emails.add(s.email.toLowerCase()));
      }
      if (data.audience === "customers" || data.audience === "all") {
        Array.from(getDemoCustomers().values()).forEach((c) => {
          emails.add(c.email.toLowerCase());
        });
      }
    } else {
      if (data.audience === "subscribers" || data.audience === "all") {
        const subs = await prisma.subscriber.findMany({
          select: { email: true },
        });
        subs.forEach((s) => emails.add(s.email.toLowerCase()));
      }
      if (data.audience === "customers" || data.audience === "all") {
        const customers = await prisma.customer.findMany({
          select: { email: true },
        });
        customers.forEach((c) => emails.add(c.email.toLowerCase()));
      }
    }

    if (!emails.size) {
      return NextResponse.json(
        { error: "No recipients in that audience yet." },
        { status: 400 }
      );
    }

    const result = await sendMarketingBroadcast({
      to: Array.from(emails),
      subject: data.subject,
      headline: data.headline,
      body: data.body,
      ctaLabel: data.ctaLabel || undefined,
      ctaUrl: data.ctaUrl || undefined,
    });

    return NextResponse.json(result);
  } catch (error) {
    const { friendlyError } = await import("@/lib/api-error");
    console.error(error);
    return NextResponse.json(
      {
        error: friendlyError(error, "Unable to send broadcast."),
      },
      { status: 400 }
    );
  }
}
