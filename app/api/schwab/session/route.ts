import { NextResponse } from "next/server";
import { disconnectSchwabSession, getSchwabConnectionStatus } from "@/lib/schwab";

export async function GET() {
  const status = await getSchwabConnectionStatus();
  return NextResponse.json(status);
}

export async function DELETE() {
  await disconnectSchwabSession();
  return NextResponse.json({ disconnected: true });
}
