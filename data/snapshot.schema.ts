// Shared types for the committed portfolio snapshot.
// A scheduled Claude routine regenerates data/snapshot.json against this shape.
// See scripts/refresh-instructions.md for how the data is pulled via MCP.

export type AssetType = "equity" | "option" | "etf" | "crypto" | "cash" | "other";

// SOR themes the portfolio rotates across.
export type Theme =
  | "AI compute"
  | "power/grid/nuclear"
  | "robotics"
  | "biotech"
  | "quality growth"
  | "energy hedge"
  | "other";

// Where a name sits in the SOR rotation lifecycle.
export type SorStage = "building" | "holding" | "trimming" | "watch" | "exited";

// Primary screen: Shariah compliance (Musaffa/Zoya/PIF/Islamicly/HalalScreener).
export type ShariahStatus =
  | "compliant"
  | "uncomfortable"
  | "questionable"
  | "non-compliant"
  | "unknown";

export type Shariah = {
  status: ShariahStatus;
  sources?: string[]; // e.g. ["Musaffa", "Zoya", "PIF"]
  note?: string;
};

// Secondary screen: Israeli-complicity / BDS / settlement involvement.
export type BdsFlag = {
  flagged: boolean;
  sources?: string[]; // e.g. ["AFSC Investigate", "Who Profits"]
  note?: string;
};

export type Compliance = {
  shariah?: Shariah;
  bds?: BdsFlag;
};

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
  // SOR context
  theme?: Theme;
  sorStage?: SorStage;
  upsideTargetPct?: number; // SOR seeks 30%+ upside candidates
  compliance?: Compliance;
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
  theme?: Theme;
  upsideTargetPct?: number;
  compliance?: Compliance;
  // SOR notes — e.g. catalyst, watchlist trigger, "act-by" deadline.
  note?: string;
  [metric: string]: string | number | Theme | Compliance | undefined;
};

export type Screener = {
  name: string;
  description?: string;
  // SOR scan layers: "shariah" + "bds" are the compliance screens; "opportunity"
  // is the 30%+ upside thematic scan. "robinhood-scan" mirrors a saved Robinhood scan.
  // "placeholder" until wired to live data.
  source: "opportunity" | "shariah" | "bds" | "robinhood-scan" | "placeholder" | "custom";
  columns?: string[];
  results: ScreenerRow[];
};

// The SOR screener stack (which tools back each layer), surfaced on the Screener page.
export type ScreenerStack = {
  shariah: string[]; // Musaffa (primary), Zoya, HalalScreener, PIF, Islamicly
  bds: string[]; // AFSC Investigate, UN settlement database, Who Profits, Boycat
};

// Theme rotation summary across the portfolio.
export type ThemeAllocation = {
  theme: Theme;
  value: number;
  symbols: string[];
};

export type Totals = {
  netWorth: number;
  investable: number;
  dayChange: number;
  dayChangePct: number;
};

export type Snapshot = {
  generatedAt: string; // ISO timestamp of when the routine pulled the data
  sample?: boolean; // true while showing placeholder data (not a live pull)
  totals: Totals;
  accounts: Account[];
  topMovers: { up: Position[]; down: Position[] };
  watchlist: Position[];
  screeners: Screener[];
  // SOR additions
  screenerStack?: ScreenerStack;
  themeAllocation?: ThemeAllocation[];
};
