import { NextResponse } from "next/server";
import { encryptBallotServer } from "@/lib/crypto";

export async function POST(request: Request) {
  const payload = await request.json();
  const result = await encryptBallotServer(payload);
  return NextResponse.json({ ok: true, result });
}
