import { NextResponse } from "next/server";
import { createSchwabAuthorizationUrl } from "@/lib/schwab";

export async function GET() {
  try {
    const authorizationUrl = await createSchwabAuthorizationUrl();
    return NextResponse.redirect(authorizationUrl);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to start Schwab login." },
      { status: 500 },
    );
  }
}
