import { NextResponse } from "next/server";

// Placeholder for election CRUD
export async function POST(request: Request) {
  const payload = await request.json();
  return NextResponse.json({ ok: true, election: { ...payload, id: "demo-election" } });
}
