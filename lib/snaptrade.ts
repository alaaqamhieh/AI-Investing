// Real brokerage holdings via SnapTrade (https://snaptrade.com) — covers
// Robinhood, Chase, and Empower in one API. The user authenticates each
// institution once through SnapTrade's own hosted Connection Portal; their
// brokerage password is federated through SnapTrade and never touches this
// app. See docs/SNAPTRADE-SETUP.md for the one-time setup steps.
//
// Env vars (Vercel, server-side only):
//   SNAPTRADE_CLIENT_ID, SNAPTRADE_CONSUMER_KEY — from the SnapTrade dashboard
//   SNAPTRADE_USER_ID     — arbitrary fixed string, chosen once (e.g. "alaa")
//   SNAPTRADE_USER_SECRET — generated once via registerSnapTradeUser, then persisted

import { Snaptrade } from "snaptrade-typescript-sdk";

function getCredentials() {
  const clientId = process.env.SNAPTRADE_CLIENT_ID;
  const consumerKey = process.env.SNAPTRADE_CONSUMER_KEY;
  const userId = process.env.SNAPTRADE_USER_ID;
  const userSecret = process.env.SNAPTRADE_USER_SECRET;
  if (!clientId || !consumerKey || !userId || !userSecret) {
    throw new Error(
      "SnapTrade env vars not set (SNAPTRADE_CLIENT_ID/CONSUMER_KEY/USER_ID/USER_SECRET)"
    );
  }
  return { clientId, consumerKey, userId, userSecret };
}

let client: Snaptrade | null = null;
function getClient(clientId: string, consumerKey: string): Snaptrade {
  if (!client) client = new Snaptrade({ clientId, consumerKey });
  return client;
}

export type ConnectedAccount = {
  id: string;
  name: string;
  institution: string;
  number: string;
};

export async function listConnectedAccounts(): Promise<ConnectedAccount[]> {
  const { clientId, consumerKey, userId, userSecret } = getCredentials();
  const snaptrade = getClient(clientId, consumerKey);
  const res = await snaptrade.accountInformation.listUserAccounts({ userId, userSecret });
  return res.data.map((a) => ({
    id: a.id,
    name: a.name ?? a.institution_name,
    institution: a.institution_name,
    number: a.number,
  }));
}

export type RealPosition = {
  accountId: string;
  accountName: string;
  institution: string;
  symbol: string;
  name?: string;
  qty: number;
  price: number;
  costBasis?: number;
};

// Pulls real positions across every connected account. Loops per-account since
// SnapTrade's unified positions endpoint (getAllAccountPositions) is scoped to
// one account at a time.
export async function getRealHoldings(): Promise<RealPosition[]> {
  const { clientId, consumerKey, userId, userSecret } = getCredentials();
  const snaptrade = getClient(clientId, consumerKey);
  const accounts = await listConnectedAccounts();

  const perAccount = await Promise.all(
    accounts.map(async (acct) => {
      const res = await snaptrade.accountInformation.getAllAccountPositions({
        userId,
        userSecret,
        accountId: acct.id,
      });
      return res.data.results
        .filter((p) => p.instrument.kind !== "option") // options handled separately if ever needed
        .map((p) => ({
          accountId: acct.id,
          accountName: acct.name,
          institution: acct.institution,
          symbol: p.instrument.symbol,
          name: p.instrument.description ?? undefined,
          qty: Number(p.units ?? 0),
          price: Number(p.price ?? 0),
          costBasis: p.cost_basis ? Number(p.cost_basis) * Number(p.units ?? 0) : undefined,
        }));
    })
  );

  return perAccount.flat();
}

// Generates a one-time Connection Portal URL for the user to link a brokerage
// account (Robinhood, Chase, or Empower). The portal handles the actual login;
// no credentials are ever passed through our code.
export async function getConnectionPortalUrl(broker?: string): Promise<string> {
  const { clientId, consumerKey, userId, userSecret } = getCredentials();
  const snaptrade = getClient(clientId, consumerKey);
  const res = await snaptrade.authentication.loginSnapTradeUser({
    userId,
    userSecret,
    ...(broker ? { snapTradeLoginUserRequestBody: { broker } } : {}),
  });
  const data = res.data as { redirectURI?: string };
  if (!data.redirectURI) {
    throw new Error("SnapTrade did not return a Connection Portal URL");
  }
  return data.redirectURI;
}
