import { getLiveEnrichedSnapshot } from "@/lib/data";
import { ScreenerTable } from "@/components/ScreenerTable";
import { LastUpdated } from "@/components/LastUpdated";
import { Card } from "@/components/Card";

export const revalidate = 300;

export default async function ScreenerPage() {
  const snap = await getLiveEnrichedSnapshot();
  const stack = snap.screenerStack;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Screener</h1>
        <LastUpdated iso={snap.generatedAt} />
      </div>

      <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 text-sm text-[#cdd3df]">
        <strong className="text-white">SOR screening — flag, never hide.</strong> Every
        candidate runs through both layers and is shown with its flags rather than omitted.
        <span className="text-muted">
          {" "}
          Primary: Shariah compliance. Secondary: Israeli-complicity / BDS. 30%+ upside,
          thematic.
        </span>
      </div>

      {stack && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card title="Layer 1 · Shariah compliance">
            <p className="text-sm text-muted mb-2">
              Primary screen — AAOIFI-aligned, cross-referenced across:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {stack.shariah.map((s, i) => (
                <span
                  key={s}
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    i === 0 ? "bg-up/15 text-up" : "bg-panel2 text-muted"
                  }`}
                >
                  {s}
                  {i === 0 ? " (primary)" : ""}
                </span>
              ))}
            </div>
          </Card>
          <Card title="Layer 2 · Israeli-complicity / BDS">
            <p className="text-sm text-muted mb-2">
              Secondary screen — always applied. Sources:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {stack.bds.map((s) => (
                <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-panel2 text-muted">
                  {s}
                </span>
              ))}
            </div>
          </Card>
        </div>
      )}

      <div className="space-y-4">
        {snap.screeners.map((s, i) => (
          <ScreenerTable key={i} screener={s} />
        ))}
      </div>
    </div>
  );
}
