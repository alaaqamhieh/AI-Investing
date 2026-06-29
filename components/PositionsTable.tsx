import type { Position } from "@/data/snapshot.schema";
import { usd, pct, dirColor, qtyFmt } from "@/lib/format";
import { ComplianceBadge } from "./ComplianceBadge";

export function PositionsTable({
  positions,
  showCost = true,
}: {
  positions: Position[];
  showCost?: boolean;
}) {
  if (positions.length === 0) {
    return <p className="text-sm text-muted">No positions.</p>;
  }
  const hasCompliance = positions.some((p) => p.compliance);
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-border">
            <th className="py-2 pr-3 font-medium">Symbol</th>
            {hasCompliance && <th className="py-2 px-3 font-medium">Screen</th>}
            <th className="py-2 px-3 font-medium text-right">Qty</th>
            <th className="py-2 px-3 font-medium text-right">Price</th>
            <th className="py-2 px-3 font-medium text-right">Value</th>
            {showCost && <th className="py-2 px-3 font-medium text-right">Unreal. P/L</th>}
            <th className="py-2 pl-3 font-medium text-right">Day</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((p) => (
            <tr key={p.symbol} className="border-b border-border/50 last:border-0">
              <td className="py-2 pr-3">
                <span className="font-medium">{p.symbol}</span>
                {p.name && <span className="block text-xs text-muted">{p.name}</span>}
                {p.theme && <span className="block text-[10px] text-muted/70">{p.theme}</span>}
              </td>
              {hasCompliance && (
                <td className="py-2 px-3">
                  <ComplianceBadge compliance={p.compliance} size="xs" />
                </td>
              )}
              <td className="py-2 px-3 text-right tabular-nums">{qtyFmt(p.qty)}</td>
              <td className="py-2 px-3 text-right tabular-nums">{usd(p.price)}</td>
              <td className="py-2 px-3 text-right tabular-nums">{usd(p.value)}</td>
              {showCost && (
                <td className={`py-2 px-3 text-right tabular-nums ${dirColor(p.unrealizedPnl)}`}>
                  {p.unrealizedPnl !== undefined ? usd(p.unrealizedPnl) : "—"}
                  {p.unrealizedPnlPct !== undefined && (
                    <span className="block text-xs">{pct(p.unrealizedPnlPct)}</span>
                  )}
                </td>
              )}
              <td className={`py-2 pl-3 text-right tabular-nums ${dirColor(p.dayChangePct)}`}>
                {pct(p.dayChangePct)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
