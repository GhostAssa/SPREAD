import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

const DATA_PATH = path.join(process.cwd(), "src", "data", "contact-messages.json");

function readMessages(): unknown[] {
  if (!fs.existsSync(DATA_PATH)) return [];
  return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
}

export async function POST(request: Request) {
  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || !email || !message) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const messages = readMessages();
  messages.unshift({
    id: Date.now().toString(36),
    name,
    email,
    message,
    receivedAt: new Date().toISOString(),
  });
  fs.writeFileSync(DATA_PATH, JSON.stringify(messages, null, 2) + "\n", "utf-8");

  return NextResponse.json({ ok: true });
}
