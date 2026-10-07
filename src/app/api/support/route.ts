import { NextResponse } from "next/server";
import { z } from "zod";
import { isDemoMode } from "@/lib/demo-data";
import { getDemoTickets } from "@/lib/demo-support";
import { sendSupportTicketEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  message: z.string().min(5),
  source: z.enum(["support", "contact"]).optional(),
});

export async function POST(request: Request) {
  try {
    const data = schema.parse(await request.json());
    const ticketId = `TKT-${Date.now().toString(36).toUpperCase()}`;

    if (isDemoMode()) {
      getDemoTickets().unshift({
        id: `sup_${Date.now().toString(36)}`,
        ticketId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        status: "OPEN",
        createdAt: new Date(),
      });
    } else {
      await prisma.supportTicket.create({
        data: {
          ticketId,
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.message,
        },
      });
    }

    void sendSupportTicketEmail({
      to: data.email,
      name: data.name,
      ticketId,
      message: data.message,
      phone: data.phone,
      source: data.source || "support",
    });

    return NextResponse.json({ ticketId });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Please complete all fields." }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Unable to create ticket" }, { status: 500 });
  }
}
