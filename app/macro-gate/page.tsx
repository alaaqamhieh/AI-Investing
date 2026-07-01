import { getLiveEnrichedSnapshot } from "@/lib/data";
import { LastUpdated } from "@/components/LastUpdated";
import { MacroGateCard } from "@/components/MacroGateCard";

export const revalidate = 300;

export default async function MacroGatePage() {
  const snap = await getLiveEnrichedSnapshot();
  const gate = snap.macroGate;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Macro Deployment Gate</h1>
        <LastUpdated iso={snap.generatedAt} />
      </div>

      <div className="rounded-xl border border-[#e0a23a]/30 bg-[#e0a23a]/5 p-4 text-sm text-[#cdd3df]">
        <strong className="text-[#e0a23a]">Experimental — under evaluation.</strong> This
        does not govern any real buy/sell/trim decisions yet, and it's fully decoupled
        from the Shariah/BDS screening and opportunity scan. VIX Level and Credit Spreads
        are fetched live and computed (real percentile / z-score, no Claude session
        involved); the remaining 4 signals stay illustrative sample values. See{" "}
        <span className="text-white">Strategy</span> for the full write-up.
      </div>

      {gate ? (
        <MacroGateCard gate={gate} />
      ) : (
        <p className="text-sm text-muted">No macro gate data in this snapshot yet.</p>
      )}
    </div>
  );
}
