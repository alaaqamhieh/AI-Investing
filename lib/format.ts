// Formatting + color helpers shared across dashboard components.

export function usd(n: number | undefined, opts: { compact?: boolean } = {}): string {
  if (n === undefined || Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: opts.compact ? "compact" : "standard",
    maximumFractionDigits: opts.compact ? 1 : 2,
  }).format(n);
}

export function pct(n: number | undefined): string {
  if (n === undefined || Number.isNaN(n)) return "—";
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}

export function signedUsd(n: number | undefined): string {
  if (n === undefined || Number.isNaN(n)) return "—";
  const sign = n > 0 ? "+" : n < 0 ? "−" : "";
  return `${sign}${usd(Math.abs(n))}`;
}

// Tailwind text color for a directional value.
export function dirColor(n: number | undefined): string {
  if (n === undefined || n === 0) return "text-muted";
  return n > 0 ? "text-up" : "text-down";
}

export function qtyFmt(n: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 4 }).format(n);
}
