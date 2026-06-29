import type { Screener } from "@/data/snapshot.schema";

function fmtCell(v: string | number | undefined): string {
  if (v === undefined) return "—";
  if (typeof v === "number") return Number.isInteger(v) ? String(v) : v.toFixed(2);
  return v;
}

export function ScreenerTable({ screener }: { screener: Screener }) {
  const columns = screener.columns ?? ["symbol", "price", "changePct"];
  return (
    <div className="rounded-xl border border-border bg-panel">
      <div className="flex items-start justify-between px-4 py-3 border-b border-border">
        <div>
          <h3 className="font-semibold">{screener.name}</h3>
          {screener.description && (
            <p className="text-xs text-muted mt-0.5 max-w-xl">{screener.description}</p>
          )}
        </div>
        {screener.source === "placeholder" && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#e0a23a]/15 text-[#e0a23a] shrink-0">
            placeholder
          </span>
        )}
        {screener.source === "robinhood-scan" && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-up/15 text-up shrink-0">
            Robinhood scan
          </span>
        )}
      </div>
      <div className="p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-border">
              {columns.map((c) => (
                <th key={c} className="py-2 px-3 font-medium first:pl-0">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {screener.results.map((row, i) => (
              <tr key={i} className="border-b border-border/50 last:border-0">
                {columns.map((c) => (
                  <td key={c} className="py-2 px-3 tabular-nums first:pl-0 first:font-medium">
                    {fmtCell(row[c])}
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
