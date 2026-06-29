import type { Compliance, ShariahStatus } from "@/data/snapshot.schema";

const SHARIAH_STYLE: Record<ShariahStatus, { cls: string; label: string }> = {
  compliant: { cls: "bg-up/15 text-up", label: "Halal" },
  uncomfortable: { cls: "bg-[#e0a23a]/15 text-[#e0a23a]", label: "Uncomfortable" },
  questionable: { cls: "bg-[#e0a23a]/15 text-[#e0a23a]", label: "Questionable" },
  "non-compliant": { cls: "bg-down/15 text-down", label: "Non-compliant" },
  unknown: { cls: "bg-panel2 text-muted", label: "Unscreened" },
};

// Renders the two SOR compliance flags: Shariah status + BDS flag.
// "Flag, never hide" — every position shows its status rather than being omitted.
export function ComplianceBadge({
  compliance,
  size = "sm",
}: {
  compliance?: Compliance;
  size?: "sm" | "xs";
}) {
  if (!compliance) return null;
  const pad = size === "xs" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-xs";
  const shariah = compliance.shariah;
  const bds = compliance.bds;
  return (
    <span className="inline-flex items-center gap-1 align-middle">
      {shariah && (
        <span
          className={`${pad} rounded-full ${SHARIAH_STYLE[shariah.status].cls}`}
          title={
            shariah.note
              ? `${shariah.note}${shariah.sources?.length ? ` — ${shariah.sources.join(", ")}` : ""}`
              : shariah.sources?.join(", ")
          }
        >
          {SHARIAH_STYLE[shariah.status].label}
        </span>
      )}
      {bds?.flagged && (
        <span
          className={`${pad} rounded-full bg-down/15 text-down`}
          title={bds.note ? `BDS: ${bds.note}${bds.sources?.length ? ` — ${bds.sources.join(", ")}` : ""}` : "BDS flag"}
        >
          BDS
        </span>
      )}
    </span>
  );
}
