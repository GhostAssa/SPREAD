import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { addTip } from "@/lib/tips";
import { sendTipAlertEmail } from "@/lib/resend";
import { getCurrentUser } from "@/lib/session";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "tips");
const MAX_FILE_BYTES = 10 * 1024 * 1024;

const ALLOWED_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/gif": "gif",
  "image/webp": "webp",
  "application/pdf": "pdf",
  "audio/mpeg": "mp3",
  "audio/wav": "wav",
  "audio/mp4": "m4a",
  "audio/ogg": "ogg",
};

export async function POST(request: Request) {
  const formData = await request.formData();
  const category = String(formData.get("tip-type") ?? "");
  const urgency = String(formData.get("urgency") ?? "");
  const message = String(formData.get("message") ?? "").trim();
  const evidence = formData.get("evidence");

  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  let evidenceUrl: string | undefined;

  if (evidence instanceof File && evidence.size > 0) {
    if (evidence.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: "File is over the 10MB limit" }, { status: 400 });
    }
    const ext = ALLOWED_TYPES[evidence.type];
    if (!ext) {
      return NextResponse.json(
        { error: "Unsupported file type. Please attach an image, PDF, or audio file." },
        { status: 400 }
      );
    }

    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    const filename = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const buffer = Buffer.from(await evidence.arrayBuffer());
    fs.writeFileSync(path.join(UPLOAD_DIR, filename), buffer);
    evidenceUrl = `/uploads/tips/${filename}`;
  }

  const user = await getCurrentUser();

  const tip = {
    id: Date.now().toString(36),
    category,
    urgency,
    message,
    evidenceUrl,
    receivedAt: new Date().toISOString(),
    userId: user?.id,
  };
  await addTip(tip);

  // Best-effort: the tip is already saved above regardless of whether the
  // alert email succeeds, so a Resend hiccup should never fail the submission.
  try {
    await sendTipAlertEmail(tip);
  } catch (err) {
    console.error("[tips] Failed to send tip alert email:", err);
  }

  return NextResponse.json({ ok: true });
}
