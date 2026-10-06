import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_BYTES = 4.5 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const form = await request.formData();
    const file = form.get("file");
    const allowGuest = form.get("guest") === "true";

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!allowGuest && session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only images are allowed" }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Image must be under 4.5MB" }, { status: 400 });
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (token) {
      const blob = await put(`zayune/${Date.now()}-${file.name}`, file, {
        access: "public",
        token,
      });
      return NextResponse.json({ url: blob.url });
    }

    // Local / demo fallback: data URL (fine for small reference images)
    const buffer = Buffer.from(await file.arrayBuffer());
    const dataUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
    if (dataUrl.length > 900_000) {
      return NextResponse.json(
        {
          error:
            "Add BLOB_READ_WRITE_TOKEN on Vercel for image uploads, or use a smaller image.",
        },
        { status: 400 }
      );
    }
    return NextResponse.json({ url: dataUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
