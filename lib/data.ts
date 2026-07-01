// Typed loaders for the committed snapshot + daily brief.
// These run at build/request time on the server (no MCP access at runtime).

import fs from "node:fs";
import path from "node:path";
import type { Account, Position, Snapshot } from "@/data/snapshot.schema";
import { getLiveQuotes, getLiveMacroSignals, type LiveQuote } from "@/lib/marketData";
import { getRealHoldings, type RealPosition } from "@/lib/snaptrade";

const DATA_DIR = path.join(process.cwd(), "data");

export function getSnapshot(): Snapshot {
  const raw = fs.readFileSync(path.join(DATA_DIR, "snapshot.json"), "utf-8");
  return JSON.parse(raw) as Snapshot;
}

type SymbolTag = {
  name?: string;
  theme?: Position["theme"];
  sorStage?: Position["sorStage"];
  compliance?: Position["compliance"];
};

function getTags(): Record<string, SymbolTag> {
  try {
    const raw = fs.readFileSync(path.join(DATA_DIR, "tags.json"), "utf-8");
    const parsed = JSON.parse(raw);
    delete parsed._note;
    return parsed;
  } catch {
    return {};
  }
}

// Groups SnapTrade's flat position list into Account[], applying SOR theme/compliance
// tags by symbol (SnapTrade knows real holdings, not SOR classification).
function buildAccountsFromRealHoldings(positions: RealPosition[]): Account[] {
  const tags = getTags();
  const byAccount = new Map<string, RealPosition[]>();
  for (const p of positions) {
    const list = byAccount.get(p.accountId) ?? [];
    list.push(p);
    byAccount.set(p.accountId, list);
  }

  return [...byAccount.entries()].map(([accountId, positions]) => {
    const first = positions[0];
    const builtPositions: Position[] = positions
      .filter((p) => p.qty !== 0)
      .map((p) => {
        const tag = tags[p.symbol];
        return {
          symbol: p.symbol,
          name: tag?.name ?? p.name,
          qty: p.qty,
          price: p.price,
          value: p.qty * p.price,
          costBasis: p.costBasis,
          unrealizedPnl: p.costBasis !== undefined ? p.qty * p.price - p.costBasis : undefined,
          unrealizedPnlPct:
            p.costBasis !== undefined && p.costBasis !== 0
              ? ((p.qty * p.price - p.costBasis) / p.costBasis) * 100
              : undefined,
          theme: tag?.theme,
          sorStage: tag?.sorStage,
          compliance: tag?.compliance,
        };
      });
    return {
      id: accountId,
      institution: first.institution,
      name: first.accountName,
      type: "brokerage",
      value: builtPositions.reduce((sum, p) => sum + p.value, 0),
      dayChange: 0,
      dayChangePct: 0,
      positions: builtPositions,
    };
  });
}

function collectSymbols(snap: Snapshot): string[] {
  const symbols = new Set<string>();
  for (const acct of snap.accounts) for (const p of acct.positions) symbols.add(p.symbol);
  for (const p of snap.watchlist) symbols.add(p.symbol);
  for (const s of snap.screeners) for (const r of s.results) symbols.add(r.symbol);
  return [...symbols];
}

function applyLiveQuote(p: Position, q: LiveQuote | undefined) {
  if (!q || q.price === null) return;
  p.price = q.price;
  if (q.changePct !== null) p.dayChangePct = q.changePct;
  p.value = p.qty * q.price;
  if (p.costBasis !== undefined) {
    p.unrealizedPnl = p.value - p.costBasis;
    p.unrealizedPnlPct = p.costBasis !== 0 ? (p.unrealizedPnl / p.costBasis) * 100 : undefined;
  }
}

// Merges live Yahoo Finance quotes + computed macro signals onto the committed
// snapshot. Position quantities, cost basis, compliance flags, and theme tags stay
// as committed data; price-dependent fields (price, day change, value, macro scores)
// are overwritten with real, current values fetched via lib/marketData.ts.
// Falls back silently to the committed values if a live fetch fails.
export async function getLiveEnrichedSnapshot(): Promise<Snapshot> {
  const snap: Snapshot = JSON.parse(JSON.stringify(getSnapshot()));

  // Real holdings via SnapTrade (Robinhood/Chase/Empower), if connected. Falls back to
  // the committed sample accounts if SnapTrade isn't set up yet or the fetch fails.
  // SnapTrade's own docs recommend a separate market-data source for pricing, so we
  // still overlay Yahoo Finance quotes below for price/day-change on top of these.
  try {
    const realPositions = await getRealHoldings();
    if (realPositions.length > 0) {
      snap.accounts = buildAccountsFromRealHoldings(realPositions);
    }
  } catch {
    // SnapTrade not configured / connected yet — keep committed sample accounts.
  }

  try {
    const symbols = collectSymbols(snap);
    const quotes = await getLiveQuotes(symbols);
    const bySymbol = new Map(quotes.map((q) => [q.symbol, q]));

    for (const acct of snap.accounts) {
      for (const p of acct.positions) applyLiveQuote(p, bySymbol.get(p.symbol));
      acct.value = (acct.cash ?? 0) + acct.positions.reduce((sum, p) => sum + p.value, 0);
      // Derive dollar day-change from each position's live % change (prevValue = value / (1 + pct/100)).
      const dayChange = acct.positions.reduce((sum, p) => {
        if (p.dayChangePct === undefined) return sum;
        const prevValue = p.value / (1 + p.dayChangePct / 100);
        return sum + (p.value - prevValue);
      }, 0);
      acct.dayChange = dayChange;
      const prevAcctValue = acct.value - dayChange;
      acct.dayChangePct = prevAcctValue !== 0 ? (dayChange / prevAcctValue) * 100 : 0;
    }
    for (const p of snap.watchlist) applyLiveQuote(p, bySymbol.get(p.symbol));
    for (const s of snap.screeners) {
      for (const r of s.results) {
        const q = bySymbol.get(r.symbol);
        if (q?.price !== null && q?.price !== undefined) r.price = q.price;
        if (q?.changePct !== null && q?.changePct !== undefined) r.changePct = q.changePct;
      }
    }

    snap.totals.netWorth = snap.accounts.reduce((sum, a) => sum + a.value, 0);
    snap.totals.investable = snap.accounts
      .filter((a) => a.type !== "retirement")
      .reduce((sum, a) => sum + a.value, 0);
    snap.totals.dayChange = snap.accounts.reduce((sum, a) => sum + a.dayChange, 0);
    const prevNetWorth = snap.totals.netWorth - snap.totals.dayChange;
    snap.totals.dayChangePct = prevNetWorth !== 0 ? (snap.totals.dayChange / prevNetWorth) * 100 : 0;

    // Recompute top movers from live position data across all accounts.
    const allPositions = snap.accounts.flatMap((a) => a.positions);
    const withChange = allPositions.filter((p) => p.dayChangePct !== undefined);
    const sorted = [...withChange].sort((a, b) => (b.dayChangePct ?? 0) - (a.dayChangePct ?? 0));
    snap.topMovers = {
      up: sorted.filter((p) => (p.dayChangePct ?? 0) > 0).slice(0, 3),
      down: sorted
        .filter((p) => (p.dayChangePct ?? 0) < 0)
        .slice(-3)
        .reverse(),
    };
  } catch {
    // Live quotes unavailable — keep committed values.
  }

  if (snap.macroGate) {
    try {
      const live = await getLiveMacroSignals();
      const byName = new Map(snap.macroGate.signals.map((s) => [s.name, s]));
      for (const liveSignal of [live.vix, live.creditSpread]) {
        const weight = byName.get(liveSignal.name)?.weight ?? 0;
        byName.set(liveSignal.name, { ...liveSignal, weight });
      }
      snap.macroGate.signals = [...byName.values()];

      const composite = snap.macroGate.signals.reduce((sum, s) => sum + s.score * s.weight, 0);
      snap.macroGate.compositeScore = Math.round(composite);
      if (composite >= 70) {
        snap.macroGate.posture = "full";
        snap.macroGate.sizingPct = 100;
      } else if (composite >= 40) {
        snap.macroGate.posture = "reduced";
        snap.macroGate.sizingPct = 60;
      } else {
        snap.macroGate.posture = "defensive";
        snap.macroGate.sizingPct = 25;
      }
      snap.macroGate.note =
        "VIX Level and Credit Spreads are live and computed (real percentile / z-score vs. trailing 1yr). " +
        "The remaining 4 signals stay illustrative sample values pending a bulk historical-data pipeline.";
    } catch {
      // Live macro fetch unavailable — keep committed values.
    }
  }

  snap.generatedAt = new Date().toISOString();
  return snap;
}

export function getBrief(): string {
  try {
    return fs.readFileSync(path.join(DATA_DIR, "brief.md"), "utf-8");
  } catch {
    return "# Daily Market Brief\n\n_No brief available yet._";
  }
}

// Allocation buckets by institution, for the overview donut.
export function allocationByInstitution(snapshot: Snapshot) {
  return snapshot.accounts
    .map((a) => ({ label: a.institution, value: a.value }))
    .sort((x, y) => y.value - x.value);
}

// Allocation buckets by asset type across all accounts.
export function allocationByAssetType(snapshot: Snapshot) {
  const totals = new Map<string, number>();
  for (const acct of snapshot.accounts) {
    if (acct.cash) totals.set("cash", (totals.get("cash") ?? 0) + acct.cash);
    for (const p of acct.positions) {
      const key = p.assetType ?? "other";
      totals.set(key, (totals.get(key) ?? 0) + p.value);
    }
  }
  return [...totals.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((x, y) => y.value - x.value);
}

// SOR theme rotation: value per theme across holdings. Uses precomputed
// themeAllocation if present, else derives it from position.theme tags.
export function themeAllocation(snapshot: Snapshot) {
  if (snapshot.themeAllocation?.length) {
    return snapshot.themeAllocation
      .map((t) => ({ label: t.theme, value: t.value }))
      .sort((x, y) => y.value - x.value);
  }
  const totals = new Map<string, number>();
  for (const acct of snapshot.accounts) {
    for (const p of acct.positions) {
      if (!p.theme) continue;
      totals.set(p.theme, (totals.get(p.theme) ?? 0) + p.value);
    }
  }
  return [...totals.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((x, y) => y.value - x.value);
}

// Compliance roll-up across all held positions, for an at-a-glance summary.
export function complianceSummary(snapshot: Snapshot) {
  let screened = 0;
  let flagged = 0; // any non-compliant/uncomfortable/questionable OR BDS flag
  let bds = 0;
  let total = 0;
  for (const acct of snapshot.accounts) {
    for (const p of acct.positions) {
      total += 1;
      const c = p.compliance;
      if (!c) continue;
      if (c.shariah && c.shariah.status !== "unknown") screened += 1;
      const shariahFlag =
        c.shariah && c.shariah.status !== "compliant" && c.shariah.status !== "unknown";
      if (shariahFlag || c.bds?.flagged) flagged += 1;
      if (c.bds?.flagged) bds += 1;
    }
  }
  return { total, screened, flagged, bds };
}
