import { NextResponse } from "next/server";
import { getFacts } from "@/lib/facts";

export async function GET() {
  return NextResponse.json({ facts: getFacts() });
}
