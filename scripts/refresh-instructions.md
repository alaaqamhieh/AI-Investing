# Daily Refresh Routine

This is the procedure the **scheduled Claude routine** runs each market morning to
regenerate the dashboard's data. It pulls live data via MCP, writes two files, and
commits/pushes them. The Vercel site rebuilds automatically on push.

Because the hosted site cannot call MCP servers at runtime, **all data is captured here,
inside a Claude session, and committed as static files.** Phase 1 is strictly
**read-only** — no order placement tools are ever called.

## Output files

- `data/snapshot.json` — conforms to `data/snapshot.schema.ts` (`Snapshot` type).
- `data/brief.md` — a short Markdown market brief for the day.

## Step-by-step

### 1. Pull Robinhood (live brokerage data)
- `get_accounts` → get the `account_number`(s).
- For each account: `get_portfolio` → total value, buying power, cash.
- `get_equity_positions` and `get_option_positions` → holdings (symbol, qty, price, value, cost basis).
- `get_equity_quotes` for held symbols + watchlist → current price and day % change.
- `get_realized_pnl` (optional) for realized P/L context in the brief.
- `get_watchlists` / `get_watchlist_items` → the `watchlist` array.
- `get_scans` then `run_scan` on each saved scan → populate `screeners` with
  `source: "robinhood-scan"`. (Until the user's own screener is wired in, keep the
  existing `source: "placeholder"` entry.)
- `get_earnings_calendar` → upcoming earnings for the brief.

### 2. Pull Chase + Empower (via Era Context aggregator)
- `knowledge__get_financial_context_and_overview` → net worth + per-account balances.
- `accounts__list_financial_accounts` → each linked account (Chase self-directed,
  Empower 401k) with current balance; map to `Account` entries.
- `accounts__check_account_balance` for specific accounts as needed.
- Note: aggregators expose balances/positions but not always intraday day-change for
  retirement funds — set `dayChange`/`dayChangePct` to best available (0 if unknown).

### 3. Assemble `snapshot.json`
- Build one `Account` per institution account (Robinhood, Chase, Empower).
- Compute `totals.netWorth` = sum of account values; `totals.investable` = sum of
  brokerage + cash (exclude anything illiquid if desired); `totals.dayChange` = sum of
  account day changes; `totals.dayChangePct` = dayChange / (netWorth − dayChange) × 100.
- `topMovers`: sort all positions by `dayChangePct`; take top 3 up / down.
- Set `generatedAt` to the current ISO timestamp.
- Validate the shape against `data/snapshot.schema.ts` before writing.

### 4. Write `brief.md`
Short Markdown: market overview (indices), the user's notable holding moves, watchlist
items on the move, and earnings to watch. Once the user's strategy (from "Alaa's
Investing World") is wired in, tailor the brief to the strategy's signals/rules.

### 5. Commit & push
```bash
git add data/snapshot.json data/brief.md
git commit -m "data: daily refresh $(date -u +%Y-%m-%d)"
git push -u origin claude/ai-investing-dashboard-i50u8c
```

## Scheduling

Set up a recurring Claude Code (web) session that runs this file's procedure each
trading-day morning (e.g. ~9:45 AM ET, after the open). The session needs the
**Robinhood** and **Era Context** MCP servers connected and access to this repo.

## Privacy reminder

`snapshot.json` is committed to the repo and rendered on a publicly reachable Vercel
URL. It contains **balances and positions but never account numbers or credentials**.
Before pointing real money at a public URL, enable Vercel password protection (see
`README.md`).
