export function LastUpdated({ iso }: { iso: string }) {
  const d = new Date(iso);
  const valid = !Number.isNaN(d.getTime());
  const label = valid
    ? d.toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "America/New_York",
      }) + " ET"
    : "unknown";
  return (
    <span className="text-xs text-muted">
      <span className="inline-block h-2 w-2 rounded-full bg-up mr-1.5 align-middle" />
      Updated {label}
    </span>
  );
}
