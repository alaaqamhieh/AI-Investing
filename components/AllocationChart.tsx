import { usd } from "@/lib/format";

type Slice = { label: string; value: number };

const PALETTE = ["#4c8dff", "#26a96c", "#e0a23a", "#9b6cff", "#e5484d", "#3ec5c5", "#8b95a7"];

// Lightweight SVG donut — no chart library dependency.
export function AllocationChart({ data, title }: { data: Slice[]; title: string }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  const segments = data.map((d, i) => {
    const frac = d.value / total;
    const len = frac * circumference;
    const seg = {
      color: PALETTE[i % PALETTE.length],
      dasharray: `${len} ${circumference - len}`,
      dashoffset: -offset,
      label: d.label,
      value: d.value,
      pct: frac * 100,
    };
    offset += len;
    return seg;
  });

  return (
    <div>
      <h3 className="text-xs uppercase tracking-wide text-muted mb-3">{title}</h3>
      <div className="flex items-center gap-5">
        <svg viewBox="0 0 160 160" className="h-36 w-36 shrink-0 -rotate-90">
          {segments.map((s, i) => (
            <circle
              key={i}
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke={s.color}
              strokeWidth="20"
              strokeDasharray={s.dasharray}
              strokeDashoffset={s.dashoffset}
            />
          ))}
        </svg>
        <ul className="space-y-1.5 text-sm">
          {segments.map((s, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: s.color }} />
              <span className="capitalize">{s.label}</span>
              <span className="text-muted tabular-nums ml-auto pl-3">
                {usd(s.value, { compact: true })} · {s.pct.toFixed(0)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
