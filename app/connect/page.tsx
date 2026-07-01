import { redirect } from "next/navigation";
import { getConnectionPortalUrl } from "@/lib/snaptrade";

async function connectAction() {
  "use server";
  const url = await getConnectionPortalUrl();
  redirect(url);
}

export default function ConnectPage() {
  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-xl font-semibold">Connect Accounts</h1>

      <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 text-sm text-[#cdd3df]">
        One-time setup, via SnapTrade. Click below, then search for and log into a
        brokerage on SnapTrade's own hosted page — your password goes to them, never to
        this app. Repeat once per institution (Robinhood, Chase, Empower). After that,
        holdings sync automatically; you never need to do this again unless a connection
        expires.
      </div>

      <form action={connectAction}>
        <button
          type="submit"
          className="w-full rounded-lg bg-accent text-white font-medium py-3 hover:opacity-90 transition-opacity"
        >
          Connect a brokerage account
        </button>
      </form>

      <p className="text-xs text-muted">
        Each click opens a fresh, single-use connection link. Click it once for
        Robinhood, come back and click again for Chase, then once more for Empower.
        Requires <code>SNAPTRADE_CLIENT_ID</code>, <code>SNAPTRADE_CONSUMER_KEY</code>,{" "}
        <code>SNAPTRADE_USER_ID</code>, and <code>SNAPTRADE_USER_SECRET</code> to be set
        — see <code>docs/SNAPTRADE-SETUP.md</code>.
      </p>
    </div>
  );
}
