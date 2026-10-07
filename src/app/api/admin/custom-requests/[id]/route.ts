import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { CUSTOM_STATUSES } from "@/lib/custom-requests";
import { isDemoMode } from "@/lib/demo-data";
import { updateDemoCustomRequest } from "@/lib/demo-custom-requests";
import { sendCustomRequestStatusEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  status: z.enum(CUSTOM_STATUSES).optional(),
  adminNotes: z.string().nullable().optional(),
});

type Params = { params: { id: string } };

export async function PATCH(request: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = schema.parse(await request.json());

    if (isDemoMode()) {
      const patch: { status?: (typeof CUSTOM_STATUSES)[number]; adminNotes?: string | null } =
        {};
      if (data.status) patch.status = data.status;
      if (data.adminNotes !== undefined) patch.adminNotes = data.adminNotes;
      const updated = updateDemoCustomRequest(params.id, patch);
      if (!updated) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      if (data.status) {
        void sendCustomRequestStatusEmail({
          to: updated.email,
          name: updated.name,
          requestId: updated.id.slice(0, 10).toUpperCase(),
          status: data.status,
        });
      }
      return NextResponse.json(updated);
    }

    const existing = await prisma.customRequest.findUnique({
      where: { id: params.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await prisma.customRequest.update({
      where: { id: params.id },
      data: {
        ...(data.status ? { status: data.status } : {}),
        ...(data.adminNotes !== undefined
          ? { adminNotes: data.adminNotes }
          : {}),
      },
    });

    if (data.status && data.status !== existing.status) {
      void sendCustomRequestStatusEmail({
        to: updated.email,
        name: updated.name,
        requestId: updated.id.slice(0, 10).toUpperCase(),
        status: data.status,
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    const { friendlyError } = await import("@/lib/api-error");
    return NextResponse.json(
      { error: friendlyError(error, "Unable to update request.") },
      { status: 400 }
    );
  }
}
