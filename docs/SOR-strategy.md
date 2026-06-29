# SOR — Structured Opportunistic Rotation

> Captured from "Alaa's Investing World" project memory. This is the reference the
> dashboard and the daily refresh routine follow. Source of truth for the strategy's
> rules; update here when the methodology evolves.

## Purpose & context

An active retail investor running a personally developed methodology — **SOR (Structured
Opportunistic Rotation)** — aimed at aggressive but disciplined portfolio growth. Core
objectives: identify stocks with **30%+ upside**, continuously rotate into the best
risk-adjusted opportunities, protect winners, and cut losers decisively — while avoiding
stale data, broken dips, and emotional trading. Holdings are split primarily between
**J.P. Morgan / Chase (main)** and **Robinhood (secondary)**.

Themes in focus: **AI compute, power / grid / nuclear, robotics, biotech, and quality
growth**.

## Screening framework (applied to every stock — flag, never hide)

Every candidate runs through both layers. **Nothing is omitted** — all stocks are shown
with flags rather than hidden.

1. **Primary — Shariah compliance.** Broadest coverage, scholar-backed, AAOIFI-aligned,
   with real-time alerts. Cross-referenced across **Musaffa (primary), Zoya,
   HalalScreener, PIF, Islamicly** (and Anel Invest). PIF labels:
   comfortable / uncomfortable / questionable. Any flag from any source is clearly noted.
2. **Secondary — Israeli-complicity / BDS / illegal-settlement involvement.** Always
   applied, secondary to Shariah. Sources: **AFSC Investigate, UN settlement database,
   Who Profits, Boycat**.

**NVDA example:** passes AAOIFI financial ratios across most screeners, **but** PIF rates
it "uncomfortable" and it carries a BDS flag for deep Israeli R&D footprint (via Mellanox).
**Decision: do not own NVDA** — but always include it in scans for awareness, with flags
applied.

Quarterly re-screening of all holdings for Shariah-status changes.

## Principles & key learnings

### Pricing discipline
Always verify **live/current prices via web search or the Robinhood connector** before any
buy / sell / trim / hold call. **Never** rely on CSV uploads, screenshots, or prior-session
prices for execution — CSV data is for **shares & cost basis only**.

### Hedging — match the hedge to the crisis mechanism
- **Gold / NEM / GLD are NOT war hedges.** Gold hedges real interest rates and Fed
  credibility (debasement risk); it *falls* when inflation is hot and the Fed stays
  hawkish (rising real yields are gold's kryptonite). During the 2026 Iran war GLD fell
  ~20% and NEM ~23% while "supposed to" protect.
- **The real oil-shock / Middle-East-war hedge is ENERGY.** XOM, CVX, integrated majors
  with low breakeven. Oil up → inflation up → yields up → crushes gold, lifts energy.
  Energy was the best S&P sector in 2026 (+25%) while gold fell. Defense/aerospace
  (GE, LMT, RTX) is a secondary war beneficiary. **Move early (week one)**, and **exit
  fast** once a ceasefire/peace framework appears — oil round-trips quickly.

### Index inclusion / exclusion timing (Rule #7 sub-strategy)
Always check the market-holiday calendar relative to the **effective date**. If it falls
on a Monday or just after a holiday, the practical last entry is the **last open market
day before it** — count back over weekends *and* holidays. Surface the deadline as
"**act by [last open day]**", not as if later days are acceptable. (2026 example:
NBIS/MRVL effective Mon Jun 22; NYSE/Nasdaq closed Fri Jun 19 for Juneteenth →
last actionable session was Thu Jun 18.)

## Execution patterns

- **Staged buying** — build positions in tranches, timed around catalysts or technical
  levels (not all at once).
- **Trim into strength** — take profits at targets rather than holding for perfection
  (e.g. MU trimmed repeatedly post-Q3 blowout).
- **Cut losers decisively** — flag underperformers early and exit (e.g. VITL, UPXI closed).
- **Screen before action** — every new opportunity passes both screening layers before
  it's treated as actionable.

## Current state (as of late June 2026, illustrative)

- **MU (Micron)** — built ahead of Jun 24 earnings; trimmed into strength post-blowout Q3
  FY26 (~$46B rev, strong EPS beat, ~$50B Q4 guide vs ~$42.9B exp, 86% Q4 GM guide).
  HBM4/memory-supercycle thesis validated.
- **CEG (Constellation Energy)** — significantly expanded on an add in the ~$250 zone.
- **MRVL / NBIS** — traded as index-inclusion plays; exited ahead of the Jun 22 effective date.
- **VITL / UPXI** — repeatedly flagged for exit; positions closed.
- **WDC (Western Digital)** — new opportunity; hit watchlist trigger on sympathy selling
  (not company-specific news).

## Tooling

- **Brokerages:** J.P. Morgan / Chase (primary), Robinhood (secondary, Claude connector active).
- **Aggregator:** Era Context (used here for Chase + Empower). Monarch has no Claude connector.
- **Portfolio data:** CSV for shares/cost-basis only; live pricing via web search / Robinhood.
- **Shariah screeners:** Musaffa (primary), Zoya, HalalScreener, PIF, Islamicly, Anel Invest.
- **BDS / ethical screeners:** AFSC Investigate, UN settlement database, Who Profits, Boycat.

## Daily update structure (SOR)

An 11-section daily update with rules around price labeling, staged buying, thematic
organization, and position sizing. The dashboard's **Daily Brief** mirrors this: live
prices, market headlines, big droppers, analyst targets, holdings review with
compliance flags, watchlist triggers, theme rotation, and "act-by" deadlines.
