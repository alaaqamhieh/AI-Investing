import type { Screener, ScreenerRow, Compliance } from "@/data/snapshot.schema";
import { ComplianceBadge } from "./ComplianceBadge";

function fmtCell(v: unknown): string {
  if (v === undefined || v === null) return "—";
  if (typeof v === "number") return Number.isInteger(v) ? String(v) : v.toFixed(2);
  return String(v);
}

const SOURCE_BADGE: Record<string, { cls: string; label: string }> = {
  opportunity: { cls: "bg-accent/15 text-accent", label: "SOR opportunity" },
  shariah: { cls: "bg-up/15 text-up", label: "Shariah screen" },
  bds: { cls: "bg-[#9b6cff]/15 text-[#b79bff]", label: "BDS screen" },
  "robinhood-scan": { cls: "bg-up/15 text-up", label: "Robinhood scan" },
  placeholder: { cls: "bg-[#e0a23a]/15 text-[#e0a23a]", label: "placeholder" },
  custom: { cls: "bg-panel2 text-muted", label: "custom" },
};

function Cell({ col, row }: { col: string; row: ScreenerRow }) {
  if (col === "compliance") {
    return <ComplianceBadge compliance={row.compliance as Compliance | undefined} size="xs" />;
  }
  if (col === "changePct" || col === "upsideTargetPct") {
    const v = row[col] as number | undefined;
    if (v === undefined) return <>—</>;
    const cls = v > 0 ? "text-up" : v < 0 ? "text-down" : "";
    return <span className={cls}>{`${v > 0 ? "+" : ""}${v.toFixed(2)}%`}</span>;
  }
  return <>{fmtCell(row[col])}</>;
}

export function ScreenerTable({ screener }: { screener: Screener }) {
  const columns = screener.columns ?? ["symbol", "price", "changePct"];
  const badge = SOURCE_BADGE[screener.source] ?? SOURCE_BADGE.custom;
  return (
    <div className="rounded-xl border border-border bg-panel">
      <div className="flex items-start justify-between px-4 py-3 border-b border-border gap-3">
        <div>
          <h3 className="font-semibold">{screener.name}</h3>
          {screener.description && (
            <p className="text-xs text-muted mt-0.5 max-w-2xl">{screener.description}</p>
          )}
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${badge.cls}`}>{badge.label}</span>
      </div>
      <div className="p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-border">
              {columns.map((c) => (
                <th key={c} className="py-2 px-3 font-medium first:pl-0">
                  {c === "upsideTargetPct" ? "upside" : c === "changePct" ? "day" : c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {screener.results.map((row, i) => (
              <tr key={i} className="border-b border-border/50 last:border-0 align-top">
                {columns.map((c) => (
                  <td key={c} className="py-2 px-3 tabular-nums first:pl-0 first:font-medium">
                    <Cell col={c} row={row} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
