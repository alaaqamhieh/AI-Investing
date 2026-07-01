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

// EXPERIMENTAL — not yet governing real decisions. See docs/SOR-strategy.md
// "Macro Deployment Gate" section. Answers: should new capital go out right now,
// and how aggressively, before any individual name is even considered.
export type DeploymentPosture = "full" | "reduced" | "defensive";

export type MacroSignal = {
  name: string; // e.g. "VIX Level", "Market Breadth"
  score: number; // 0-100, higher = more supportive of deploying
  weight: number; // fraction of the composite, sums to 1 across all signals
  raw?: string; // human-readable current reading, e.g. "VIX 18.0 (61st pct)"
  live?: boolean; // true if `raw` reflects a real live market data pull (score may still be approximate)
};

export type MacroGate = {
  generatedAt: string;
  compositeScore: number; // 0-100 weighted blend of signals
  posture: DeploymentPosture;
  sizingPct: number; // % of normal position sizing implied by posture
  signals: MacroSignal[];
  note?: string;
};

// EXPERIMENTAL — Layer 4, a different sub-domain (options premium income) than
// SOR's current equity-rotation focus. Ad-hoc, single-ticker, nondeterministic
// tool: not part of the deterministic screening flow above.
export type OptionSide = "put" | "call";
export type OptionAction = "buy" | "sell";

export type OptionIdea = {
  side: OptionSide;
  action: OptionAction;
  strike: number;
  label?: string; // e.g. "ATM", "+5% OTM"
  delta: number;
  rationale: string;
};

export type OptionChainRow = {
  strike: number;
  callOi?: number;
  callVol?: number;
  callDelta?: number;
  callIv?: number;
  callBid?: number;
  callAsk?: number;
  putBid?: number;
  putAsk?: number;
  putIv?: number;
  putDelta?: number;
  putVol?: number;
  putOi?: number;
};

export type OptionsAnalysis = {
  generatedAt: string;
  ticker: string;
  expiry: string;
  spot: number;
  atmStrike: number;
  atmIv: number;
  realizedVol30d: number;
  ivRank: number; // 0-100
  skew25d: number; // percentage points, put IV minus call IV
  daysToEarnings?: number; // negative = earnings already passed
  verdictTags: string[]; // e.g. ["Neutral", "IV Rich"]
  summary: string;
  ideas: OptionIdea[];
  risks: string[];
  chain: OptionChainRow[];
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
  macroGate?: MacroGate; // experimental — see type above
  optionsAnalysis?: OptionsAnalysis; // experimental — see type above
};
