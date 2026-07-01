// One-time script: registers a single SnapTrade user for this app and prints the
// userSecret to store as a Vercel env var. Run locally once, never in production.
//
// Usage:
//   SNAPTRADE_CLIENT_ID=xxx SNAPTRADE_CONSUMER_KEY=yyy SNAPTRADE_USER_ID=alaa \
//     node scripts/snaptrade-register-user.mjs
//
// See docs/SNAPTRADE-SETUP.md for the full setup walkthrough.

import { Snaptrade } from "snaptrade-typescript-sdk";

const clientId = process.env.SNAPTRADE_CLIENT_ID;
const consumerKey = process.env.SNAPTRADE_CONSUMER_KEY;
const userId = process.env.SNAPTRADE_USER_ID;

if (!clientId || !consumerKey || !userId) {
  console.error(
    "Missing env vars. Set SNAPTRADE_CLIENT_ID, SNAPTRADE_CONSUMER_KEY, and SNAPTRADE_USER_ID first."
  );
  process.exit(1);
}

const snaptrade = new Snaptrade({ clientId, consumerKey });

try {
  const res = await snaptrade.authentication.registerSnapTradeUser({ userId });
  console.log("\nRegistered SnapTrade user:", userId);
  console.log("\nSNAPTRADE_USER_SECRET =", res.data.userSecret);
  console.log(
    "\nCopy the value above into your Vercel project's environment variables as\n" +
      "SNAPTRADE_USER_SECRET (along with SNAPTRADE_CLIENT_ID, SNAPTRADE_CONSUMER_KEY,\n" +
      "and SNAPTRADE_USER_ID). Store it securely — it grants read access to whatever\n" +
      "brokerage accounts get connected under this user.\n"
  );
} catch (err) {
  console.error("Registration failed:", err.message ?? err);
  process.exit(1);
}
