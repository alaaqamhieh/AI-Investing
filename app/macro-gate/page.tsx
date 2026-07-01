import { getSnapshot } from "@/lib/data";
import { LastUpdated } from "@/components/LastUpdated";
import { MacroGateCard } from "@/components/MacroGateCard";

export default function MacroGatePage() {
  const snap = getSnapshot();
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
        from the Shariah/BDS screening and opportunity scan. Values below are illustrative
        sample data — no live macro feed is wired up yet. See{" "}
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
