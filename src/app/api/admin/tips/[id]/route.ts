import { NextResponse } from "next/server";
import { deleteTip } from "@/lib/tips";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  deleteTip(id);
  return NextResponse.json({ ok: true });
}
