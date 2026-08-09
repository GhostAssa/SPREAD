import { NextResponse } from "next/server";
import { createUser, getUserByEmail, toPublicUser } from "@/lib/users";
import { createSessionToken, SESSION_COOKIE } from "@/lib/session";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!name || !EMAIL_RE.test(email) || password.length < 8) {
    return NextResponse.json(
      { error: "Please provide a name, a valid email, and a password of at least 8 characters." },
      { status: 400 }
    );
  }

  if (await getUserByEmail(email)) {
    return NextResponse.json(
      { error: "An account with that email already exists." },
      { status: 409 }
    );
  }

  const user = await createUser({ name, email, password });
  const token = await createSessionToken(user.id, user.sessionVersion);

  const res = NextResponse.json({ ok: true, user: toPublicUser(user) });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
