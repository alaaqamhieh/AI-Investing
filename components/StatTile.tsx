import { dirColor } from "@/lib/format";

export function StatTile({
  label,
  value,
  sub,
  subTrend,
}: {
  label: string;
  value: string;
  sub?: string;
  subTrend?: number;
}) {
  return (
    <div className="rounded-xl border border-border bg-panel p-4">
      <div className="text-xs uppercase tracking-wide text-muted">{label}</div>
      <div className="mt-1 text-2xl font-semibold tabular-nums">{value}</div>
      {sub && <div className={`mt-1 text-sm tabular-nums ${dirColor(subTrend)}`}>{sub}</div>}
    </div>
  );
}
