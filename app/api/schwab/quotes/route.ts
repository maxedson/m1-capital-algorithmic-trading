import { NextRequest, NextResponse } from "next/server";
import { schwabFetch } from "@/lib/schwab";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbols = searchParams.get("symbols");

  if (!symbols) {
    return NextResponse.json({ error: "Provide a comma-separated symbols query parameter." }, { status: 400 });
  }

  try {
    const response = await schwabFetch(`/marketdata/v1/quotes?symbols=${encodeURIComponent(symbols)}`);
    const quotes = await response.json();
    return NextResponse.json({ symbols: symbols.split(","), quotes });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load Schwab quotes." },
      { status: 500 },
    );
  }
}
