import type { Account } from "@/data/snapshot.schema";
import { usd, pct, signedUsd, dirColor } from "@/lib/format";
import { PositionsTable } from "./PositionsTable";

const INSTITUTION_BADGE: Record<string, string> = {
  Robinhood: "bg-up/15 text-up",
  Chase: "bg-accent/15 text-accent",
  Empower: "bg-[#9b6cff]/15 text-[#b79bff]",
};

export function AccountCard({ account }: { account: Account }) {
  const badge = INSTITUTION_BADGE[account.institution] ?? "bg-panel2 text-muted";
  return (
    <section className="rounded-xl border border-border bg-panel">
      <div className="flex items-start justify-between px-4 py-3 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full ${badge}`}>
              {account.institution}
            </span>
            <span className="text-xs text-muted capitalize">{account.type}</span>
          </div>
          <h3 className="mt-1 font-semibold">{account.name}</h3>
        </div>
        <div className="text-right">
          <div className="text-xl font-semibold tabular-nums">{usd(account.value)}</div>
          <div className={`text-sm tabular-nums ${dirColor(account.dayChange)}`}>
            {signedUsd(account.dayChange)} ({pct(account.dayChangePct)})
          </div>
        </div>
      </div>
      <div className="p-4">
        {account.cash ? (
          <p className="text-xs text-muted mb-3">Cash: {usd(account.cash)}</p>
        ) : null}
        <PositionsTable positions={account.positions} showCost={account.type !== "retirement"} />
      </div>
    </section>
  );
}
