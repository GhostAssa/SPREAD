import { NextResponse } from "next/server";
import { getUserById, updateUser, creditWallet, toPublicUser } from "@/lib/users";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const user = await getUserById(id);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await request.json().catch(() => ({}));

  if (typeof body.subscribed === "boolean") {
    await updateUser(id, { subscribed: body.subscribed });
  }
  if (typeof body.adjustWalletNaira === "number" && body.adjustWalletNaira !== 0) {
    await creditWallet(id, body.adjustWalletNaira);
  }

  const updated = await getUserById(id);
  return NextResponse.json({ ok: true, user: updated ? toPublicUser(updated) : null });
}
