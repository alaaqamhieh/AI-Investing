# Daily Refresh — Scheduled Session Prompt

Paste the prompt below when creating a **scheduled Claude Code session / trigger** in the
Claude Code web app (https://code.claude.com/docs → triggers / scheduled sessions).

## Why a scheduled session (and not a cron or GitHub Action)

The dashboard data comes from the **Robinhood** and **Era Context** MCP servers, which
are authenticated **inside a Claude session**. That means:

- A **GitHub Action** can't pull the data — it has no access to those MCP servers.
- An **in-session cron** (`CronCreate`) only lives as long as one session and expires in
  7 days — not durable.

So the durable mechanism is a **recurring scheduled Claude session** that has the
Robinhood + Era MCP servers connected and write access to this repo.

## Setup

1. Create a scheduled session on the repo `alaaqamhieh/AI-Investing`, branch
   `claude/ai-investing-dashboard-i50u8c` (or `main` after merge).
2. Schedule: **weekdays at ~9:45 AM ET** (after the open). Avoid round minutes.
3. Ensure the session has the **Robinhood** and **Era Context** MCP servers connected.
4. Paste the trigger prompt below.

> ⚠️ **Privacy gate:** this run writes your **real** balances into `data/snapshot.json`,
> which renders on the public Vercel URL. Only arm this to push real data **after** you
> have enabled Vercel Deployment Protection / password on the project. Until then, leave
> the schedule disarmed or keep the sample data.

## Trigger prompt (paste this)

```
Refresh the AI Investing Dashboard data for today.

Follow scripts/refresh-instructions.md exactly:
1. Pull live data (read-only) from the Robinhood MCP (accounts, portfolio, equity +
   option positions, quotes, watchlists, saved scans, earnings calendar) and the Era
   Context MCP (list_financial_accounts, financial overview) for Chase + Empower.
2. Assemble data/snapshot.json to match data/snapshot.schema.ts (totals, accounts,
   topMovers, watchlist, screeners). Set generatedAt to now.
3. Write data/brief.md: a short market brief (indices, my notable holding moves,
   watchlist movers, earnings to watch).
4. Do NOT place or cancel any orders — read-only only.
5. Commit both files with message "data: daily refresh <YYYY-MM-DD>" and push to
   claude/ai-investing-dashboard-i50u8c (or main after merge). This triggers a Vercel
   rebuild.

If the Robinhood or Era MCP server is not connected, stop and report it instead of
committing partial/sample data.
```
