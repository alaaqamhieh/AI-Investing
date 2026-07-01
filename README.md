# AI Investing Dashboard

A personal, self-hosted dashboard for a daily consolidated view of investments across
**Robinhood**, **Chase/JPMorgan**, and **Empower Retirement** — plus a market screener
and a daily market brief.

Inspired by the "trading with Claude Code + MCP" workflow (research → decide → journal),
this Phase 1 build focuses on a clean **read-only dashboard** with an automated daily
data refresh. Trade execution and a full strategy engine are intentionally out of scope.

## How it works

The hosted site is a **dynamic Next.js app on Vercel** — two different data paths feed it:

1. **Prices, VIX, and credit-spread readings — fully code-only, real-time.** Brokerage
   MCP servers (Robinhood, Era) only authenticate inside a Claude session, but public
   market data doesn't need that. `lib/marketData.ts` calls **Yahoo Finance** directly
   (via the `yahoo-finance2` npm package, no API key needed) from two Route Handlers —
   `app/api/quotes` and `app/api/macro` — and `lib/data.ts#getLiveEnrichedSnapshot()`
   merges the results onto the committed snapshot at request time (cached ~5 min via
   Next.js `revalidate`). No Claude session is involved in this path, ever.
2. **Real holdings (quantities, cost basis) — code-only, via SnapTrade.** Once
   connected (one-time, see [Real holdings via SnapTrade](#real-holdings-via-snaptrade)
   below), `lib/snaptrade.ts` pulls real positions for Robinhood, Chase, and Empower
   directly from `app/api/holdings` — no Claude session, no manual entry. Live prices
   from Yahoo Finance are layered on top for pricing (SnapTrade itself recommends this).
   Until connected, the site falls back to the committed sample accounts below.
3. **Compliance flags, screener candidates — a scheduled Claude routine.** SOR theme
   tags and Shariah/BDS screening are analysis only a Claude session can produce, so
   they're still committed to:
   - `data/snapshot.json` — sample/fallback portfolio snapshot (typed by `data/snapshot.schema.ts`)
   - `data/tags.json` — SOR theme + compliance tags, matched onto real holdings by symbol
   - `data/brief.md` — the day's market brief

```
Yahoo Finance (yahoo-finance2)  ──/api/quotes, /api/macro──▶  live prices, VIX, credit spread
                                                                (no Claude session, ever)
SnapTrade (snaptrade-typescript-sdk)  ──/api/holdings──▶  real holdings, Robinhood/Chase/Empower
                                                                (no Claude session, ever)
Scheduled Claude routine  ──MCP pull──▶  data/tags.json + data/brief.md  ──push──▶  Vercel rebuild
                                                                (SOR theme + compliance tags, brief)
```

See **`scripts/refresh-instructions.md`** for the compliance-tagging procedure and
**`docs/SNAPTRADE-SETUP.md`** for connecting real accounts.

## Pages

- **Overview** — net worth, day change, allocation donuts (institution + asset type), SOR theme rotation, compliance summary, top movers.
- **Accounts** — per-account cards (Robinhood / Chase / Empower) with positions tables + Shariah/BDS flags. Real once SnapTrade is connected, sample data otherwise.
- **Connect** *(`/connect`)* — one-time SnapTrade account-linking page; not in the nav (visit directly once per institution).
- **Screener** — SOR two-layer screening (Shariah → BDS) with the screener stack and the 30%+ upside opportunity scan; flag, never hide.
- **Daily Brief** — the SOR-format morning brief rendered from Markdown.
- **Strategy** — the captured SOR methodology (`docs/SOR-strategy.md`).
- **Macro Gate** *(beta)* — an experimental deployment-sizing signal; VIX Level and
  Credit Spreads are live/computed, the rest are illustrative sample data.

## Strategy (SOR)

The dashboard encodes **SOR — Structured Opportunistic Rotation** (see
`docs/SOR-strategy.md`): 30%+ upside thematic rotation across AI compute, power/grid/
nuclear, robotics, biotech, and quality growth; a two-layer compliance screen (Shariah
primary via Musaffa/Zoya/PIF/Islamicly/HalalScreener, then Israeli-complicity/BDS via
AFSC/UN/Who Profits/Boycat); staged buying, trim into strength, cut losers; and two hard
rules baked into the refresh routine — **verify prices live** (never CSV/stale) and
**flag every name, never hide it**.

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (same as Vercel runs)
npm start        # serve the production build
```

The app reads holdings/compliance from the committed sample `data/snapshot.json` (no
live credentials needed) and layers in **live prices/VIX/credit-spreads from Yahoo
Finance** at request time — no API key or account required for that part either.
Without SnapTrade env vars set, `/api/holdings` and the accounts merge fail gracefully
and the site just shows the sample data — safe to run locally with zero setup.

## Real holdings via SnapTrade

Real, automatically-syncing holdings for Robinhood, Chase, and Empower — no manual
data entry — via [SnapTrade](https://snaptrade.com)'s hosted account-linking flow
(your brokerage password goes to SnapTrade, never to this app). Full walkthrough:
**`docs/SNAPTRADE-SETUP.md`**.

Short version: sign up at snaptrade.com, run `scripts/snaptrade-register-user.mjs`
once to get a user secret, set 4 `SNAPTRADE_*` env vars in Vercel, then visit
`/connect` on the deployed site and click through it three times (once per
institution). After that, Overview/Accounts show real holdings automatically, synced
on every page load — no further action needed.

**Do this only after enabling Vercel Deployment Protection** (see Privacy below) —
real holdings are more sensitive than the public market data already live on the site.

## Deploy to Vercel

1. Push this repo to GitHub (branch `claude/ai-investing-dashboard-i50u8c`).
2. At [vercel.com](https://vercel.com) → **Add New → Project** → import this repo.
3. Framework preset is auto-detected as **Next.js**; no env vars needed for Phase 1.
4. **Deploy.** You get a `*.vercel.app` URL. (Optional) add a custom domain in
   Project → Settings → Domains.

### Privacy (do this before going live with real balances)

The Vercel URL is publicly reachable. The snapshot contains balances and positions but
**no account numbers or credentials**. To keep it private, enable
**Project → Settings → Deployment Protection → Vercel Authentication** (or Password
Protection on Pro), so only you can view it.

## Daily refresh

The refresh must run as a **scheduled Claude Code (web) session**, because the data
comes from the Robinhood + Era Context **MCP servers, which authenticate inside a Claude
session** — a GitHub Action or plain cron can't reach them.

- Procedure the session runs: **`scripts/refresh-instructions.md`**
- Ready-to-paste trigger prompt + setup steps: **`scripts/daily-refresh-prompt.md`**

Each run regenerates `data/snapshot.json` + `data/brief.md`, commits, and pushes —
triggering a Vercel rebuild. **Arm it for real data only after the Vercel site is
password-protected** (see Privacy above).

## Roadmap (later phases)

- Wire in your real **screener filters** and **strategy rules** (from "Alaa's Investing World").
- Historical net-worth chart and per-position performance over time.
- Strategy signals / alerts in the daily brief.
- Optional: trade execution and automation (separate, carefully-gated phase).

## Project structure

```
app/            Next.js App Router pages (overview, accounts, screener, brief)
components/     UI components (cards, tables, donut chart, movers, etc.)
lib/            data loaders (data.ts) + formatting helpers (format.ts)
data/           snapshot.json, brief.md, snapshot.schema.ts (the data contract)
scripts/        refresh-instructions.md (the daily routine procedure)
```
