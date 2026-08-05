import { NextResponse } from "next/server";
import { removeSubscriber, verifyUnsubscribeToken } from "@/lib/newsletter";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email")?.trim().toLowerCase() ?? "";
  const token = url.searchParams.get("token") ?? "";

  if (!email || !(await verifyUnsubscribeToken(email, token))) {
    return NextResponse.json({ error: "Invalid or expired unsubscribe link" }, { status: 400 });
  }

  removeSubscriber(email);
  return NextResponse.redirect(new URL("/newsletter/unsubscribed", request.url));
}
