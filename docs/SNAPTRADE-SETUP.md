# SnapTrade Setup — Real Holdings for Robinhood, Chase, Empower

This wires the dashboard to real, automatically-syncing holdings across all three
accounts, using [SnapTrade](https://snaptrade.com). No manual data entry — one-time
account linking per institution, then it syncs via API forever.

**How it works:** SnapTrade runs its own hosted login page (the "Connection Portal")
for each brokerage. Your Robinhood/Chase/Empower password goes to SnapTrade, never to
this app or its database — this app only ever holds an API key + a per-user secret,
both revocable credentials, not your actual brokerage login.

## 1. Sign up (free)

1. Go to [snaptrade.com](https://snaptrade.com) and create a free developer account.
2. From the dashboard, grab your **Client ID** and **Consumer Key**.

## 2. Register a user (one-time, run locally)

This app registers a single SnapTrade user (there's only one of you — no database
needed). Run once on your own machine:

```bash
SNAPTRADE_CLIENT_ID=your_client_id \
SNAPTRADE_CONSUMER_KEY=your_consumer_key \
SNAPTRADE_USER_ID=alaa \
node scripts/snaptrade-register-user.mjs
```

This prints a `SNAPTRADE_USER_SECRET` — copy it, you'll need it in the next step.
`SNAPTRADE_USER_ID` can be any fixed string you choose (not your email); `alaa` is fine.

## 3. Set environment variables in Vercel

Project → Settings → Environment Variables, add all four:

| Variable | Value |
|---|---|
| `SNAPTRADE_CLIENT_ID` | from step 1 |
| `SNAPTRADE_CONSUMER_KEY` | from step 1 |
| `SNAPTRADE_USER_ID` | the string you chose in step 2 (e.g. `alaa`) |
| `SNAPTRADE_USER_SECRET` | printed by the script in step 2 |

Redeploy after adding these (Vercel does this automatically on the next push, or trigger
a manual redeploy).

## 4. Connect your three accounts

Visit **`https://<your-site>/connect`** on the deployed site. Click **"Connect a
brokerage account"** — this opens a fresh SnapTrade-hosted login page. Search for and
log into **Robinhood**, complete the flow, then come back to `/connect` and click again
for **Chase**, then once more for **Empower**.

Each click generates a new, single-use link — that's expected; just repeat the click
for each institution.

## 5. Done

The dashboard's Overview and Accounts pages will now show real holdings automatically.
No further action needed — SnapTrade stays connected and syncs on its own. If a
connection ever needs re-linking (e.g. password changed at the brokerage), visit
`/connect` again for just that institution.

## Privacy note

Real per-account holdings are more sensitive than the public market data (prices, VIX)
already live on the site. Confirm **Vercel Deployment Protection** is turned on
(Project → Settings → Deployment Protection → Vercel Authentication) before completing
step 4, so real holdings aren't visible on the public URL.
