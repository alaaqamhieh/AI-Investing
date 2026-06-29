// Shared types for the committed portfolio snapshot.
// A scheduled Claude routine regenerates data/snapshot.json against this shape.
// See scripts/refresh-instructions.md for how the data is pulled via MCP.

export type AssetType = "equity" | "option" | "etf" | "crypto" | "cash" | "other";

export type Position = {
  symbol: string;
  name?: string;
  assetType?: AssetType;
  qty: number;
  price: number;
  value: number;
  costBasis?: number;
  unrealizedPnl?: number;
  unrealizedPnlPct?: number;
  dayChangePct?: number;
};

export type Institution = "Robinhood" | "Chase" | "Empower" | string;

export type AccountType = "brokerage" | "retirement" | "bank" | "other";

export type Account = {
  id: string;
  institution: Institution;
  name: string;
  type: AccountType;
  value: number;
  dayChange: number;
  dayChangePct: number;
  cash?: number;
  positions: Position[];
};

export type ScreenerRow = {
  symbol: string;
  name?: string;
  price?: number;
  changePct?: number;
  [metric: string]: string | number | undefined;
};

export type Screener = {
  name: string;
  description?: string;
  // Source of the screen: a real Robinhood saved scan, or a placeholder
  // until the user's own screener filters are wired in.
  source: "robinhood-scan" | "placeholder" | "custom";
  columns?: string[];
  results: ScreenerRow[];
};

export type Totals = {
  netWorth: number;
  investable: number;
  dayChange: number;
  dayChangePct: number;
};

export type Snapshot = {
  generatedAt: string; // ISO timestamp of when the routine pulled the data
  totals: Totals;
  accounts: Account[];
  topMovers: { up: Position[]; down: Position[] };
  watchlist: Position[];
  screeners: Screener[];
};
