import type { Position } from "@/data/snapshot.schema";
import { pct, usd, dirColor } from "@/lib/format";

export function MoversList({ up, down }: { up: Position[]; down: Position[] }) {
  const Row = ({ p }: { p: Position }) => (
    <li className="flex items-center justify-between py-1.5">
      <div>
        <span className="font-medium">{p.symbol}</span>
        {p.name && <span className="ml-2 text-xs text-muted">{p.name}</span>}
      </div>
      <div className="text-right tabular-nums">
        <span className={dirColor(p.dayChangePct)}>{pct(p.dayChangePct)}</span>
        <span className="ml-3 text-xs text-muted">{usd(p.price)}</span>
      </div>
    </li>
  );
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
      <div>
        <h3 className="text-xs uppercase tracking-wide text-up mb-1">Gainers</h3>
        <ul className="divide-y divide-border/50">
          {up.length ? up.map((p) => <Row key={p.symbol} p={p} />) : <li className="py-1.5 text-sm text-muted">None</li>}
        </ul>
      </div>
      <div>
        <h3 className="text-xs uppercase tracking-wide text-down mb-1">Losers</h3>
        <ul className="divide-y divide-border/50">
          {down.length ? down.map((p) => <Row key={p.symbol} p={p} />) : <li className="py-1.5 text-sm text-muted">None</li>}
        </ul>
      </div>
    </div>
  );
}
