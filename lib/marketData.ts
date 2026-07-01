// Live market data via Yahoo Finance (no API key required).
// Used by app/api/quotes and app/api/macro route handlers — runs server-side
// on Vercel at request time, no scheduled Claude session involved.

import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

export type LiveQuote = {
  symbol: string;
  price: number | null;
  changePct: number | null;
  asOf: string | null;
};

export async function getLiveQuotes(symbols: string[]): Promise<LiveQuote[]> {
  if (symbols.length === 0) return [];
  const results = await yahooFinance.quote(symbols);
  const list = Array.isArray(results) ? results : [results];
  return list.map((q) => ({
    symbol: q.symbol,
    price: q.regularMarketPrice ?? null,
    changePct: q.regularMarketChangePercent ?? null,
    asOf: q.regularMarketTime ? new Date(q.regularMarketTime).toISOString() : null,
  }));
}

// Daily closes for the trailing ~1 year, oldest first.
async function trailingYearCloses(symbol: string): Promise<number[]> {
  const period2 = new Date();
  const period1 = new Date(period2);
  period1.setFullYear(period1.getFullYear() - 1);
  const chart = await yahooFinance.chart(symbol, { period1, period2, interval: "1d" });
  return chart.quotes.map((q) => q.close).filter((c): c is number => typeof c === "number");
}

function percentileRank(value: number, history: number[]): number {
  if (history.length === 0) return 50;
  const countAtOrBelow = history.filter((h) => h <= value).length;
  return (countAtOrBelow / history.length) * 100;
}

function mean(xs: number[]): number {
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

function stdev(xs: number[]): number {
  const m = mean(xs);
  return Math.sqrt(mean(xs.map((x) => (x - m) ** 2)));
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export type LiveMacroSignal = {
  name: string;
  score: number;
  raw: string;
  live: true;
};

// Real, code-computed macro signals — no Claude session, no approximation.
// VIX: percentile-ranked against its own trailing 1yr; low percentile (calm) = high score.
// Credit-spread proxy: HYG/TLT relative-price z-score against its own trailing 1yr;
// a proxy for credit-market health (not the institutional HY-Treasury OAS spread).
export async function getLiveMacroSignals(): Promise<{
  vix: LiveMacroSignal;
  creditSpread: LiveMacroSignal;
}> {
  const [vixQuote, vixHistory, hygHistory, tltHistory] = await Promise.all([
    getLiveQuotes(["^VIX"]),
    trailingYearCloses("^VIX"),
    trailingYearCloses("HYG"),
    trailingYearCloses("TLT"),
  ]);

  const vixNow = vixQuote[0]?.price ?? vixHistory[vixHistory.length - 1];
  const vixPct = percentileRank(vixNow, vixHistory);
  const vixScore = clamp(Math.round(100 - vixPct), 0, 100);

  const n = Math.min(hygHistory.length, tltHistory.length);
  const ratios = Array.from({ length: n }, (_, i) => hygHistory[i] / tltHistory[i]);
  const ratioNow = ratios[ratios.length - 1];
  const z = stdev(ratios) === 0 ? 0 : (ratioNow - mean(ratios)) / stdev(ratios);
  const creditScore = clamp(Math.round(50 + z * 25), 0, 100);

  return {
    vix: {
      name: "VIX Level",
      score: vixScore,
      raw: `VIX ${vixNow.toFixed(2)} (${Math.round(vixPct)}th percentile of trailing 1yr) — live, computed`,
      live: true,
    },
    creditSpread: {
      name: "Credit Spreads",
      score: creditScore,
      raw: `HYG/TLT ratio z-score ${z.toFixed(2)} vs trailing 1yr (proxy, not institutional HY-Treasury OAS) — live, computed`,
      live: true,
    },
  };
}
