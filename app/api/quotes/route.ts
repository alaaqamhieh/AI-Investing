import { NextRequest, NextResponse } from "next/server";
import { getLiveQuotes } from "@/lib/marketData";

export const revalidate = 300; // 5 minutes

export async function GET(req: NextRequest) {
  const symbolsParam = req.nextUrl.searchParams.get("symbols");
  if (!symbolsParam) {
    return NextResponse.json({ error: "missing ?symbols=A,B,C" }, { status: 400 });
  }
  const symbols = symbolsParam
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  try {
    const quotes = await getLiveQuotes(symbols);
    return NextResponse.json({ quotes, fetchedAt: new Date().toISOString() });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "quote fetch failed" },
      { status: 502 }
    );
  }
}
