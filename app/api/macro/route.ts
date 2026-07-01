import { NextResponse } from "next/server";
import { getLiveMacroSignals } from "@/lib/marketData";

export const revalidate = 300; // 5 minutes

export async function GET() {
  try {
    const signals = await getLiveMacroSignals();
    return NextResponse.json({ ...signals, fetchedAt: new Date().toISOString() });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "macro fetch failed" },
      { status: 502 }
    );
  }
}
