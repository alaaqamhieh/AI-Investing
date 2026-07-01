import { NextResponse } from "next/server";
import { getRealHoldings, listConnectedAccounts } from "@/lib/snaptrade";

export const revalidate = 300; // 5 minutes

export async function GET() {
  try {
    const [accounts, positions] = await Promise.all([
      listConnectedAccounts(),
      getRealHoldings(),
    ]);
    return NextResponse.json({ accounts, positions, fetchedAt: new Date().toISOString() });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "holdings fetch failed" },
      { status: 502 }
    );
  }
}
