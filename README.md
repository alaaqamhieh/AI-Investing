# AI Investing Dashboard

A personal, self-hosted dashboard for a daily consolidated view of investments across
**Robinhood**, **Chase/JPMorgan**, and **Empower Retirement** — plus a market screener
and a daily market brief.

Inspired by the "trading with Claude Code + MCP" workflow (research → decide → journal),
this Phase 1 build focuses on a clean **read-only dashboard** with an automated daily
data refresh. Trade execution and a full strategy engine are intentionally out of scope.

## How it works

The hosted site is a **Next.js** app. It cannot call brokerage APIs at runtime, so data
is captured by a **scheduled Claude routine** that pulls live numbers via MCP
(Robinhood for the brokerage, Era Context for Chase/Empower), then commits two files:

- `data/snapshot.json` — portfolio snapshot (typed by `data/snapshot.schema.ts`)
- `data/brief.md` — the day's market brief

The site renders those committed files. On each push, Vercel rebuilds automatically.

```
Scheduled Claude routine  ──MCP pull──▶  data/snapshot.json + data/brief.md  ──push──▶  Vercel rebuild
```

See **`scripts/refresh-instructions.md`** for the exact pull/assemble procedure.

## Pages

- **Overview** — net worth, day change, allocation donuts (institution + asset type), SOR theme rotation, compliance summary, top movers.
- **Accounts** — per-account cards (Robinhood / Chase / Empower) with positions tables + Shariah/BDS flags.
- **Screener** — SOR two-layer screening (Shariah → BDS) with the screener stack and the 30%+ upside opportunity scan; flag, never hide.
- **Daily Brief** — the SOR-format morning brief rendered from Markdown.
- **Strategy** — the captured SOR methodology (`docs/SOR-strategy.md`).

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

The app reads from the committed sample `data/snapshot.json`, so all pages render
without any live credentials.

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
