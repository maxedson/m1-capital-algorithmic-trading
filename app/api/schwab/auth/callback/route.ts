import { NextRequest, NextResponse } from "next/server";
import { completeSchwabAuthorization } from "@/lib/schwab";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  if (error) {
    const message = errorDescription ? `${error}: ${errorDescription}` : error;
    return NextResponse.redirect(new URL(`/trading?schwabError=${encodeURIComponent(message)}`, request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/trading?schwabError=Missing%20authorization%20code", request.url));
  }

  try {
    await completeSchwabAuthorization(code, state);
    return NextResponse.redirect(new URL("/trading?schwabConnected=1", request.url));
  } catch (authError) {
    const message = authError instanceof Error ? authError.message : "Unable to complete Schwab login.";
    return NextResponse.redirect(new URL(`/trading?schwabError=${encodeURIComponent(message)}`, request.url));
  }
}
