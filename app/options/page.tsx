import { getSnapshot } from "@/lib/data";
import { LastUpdated } from "@/components/LastUpdated";
import { OptionsAnalyzer } from "@/components/OptionsAnalyzer";

export default function OptionsPage() {
  const snap = getSnapshot();
  const a = snap.optionsAnalysis;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Options Chain Analyzer</h1>
        <LastUpdated iso={snap.generatedAt} />
      </div>

      <div className="rounded-xl border border-[#9b6cff]/30 bg-[#9b6cff]/5 p-4 text-sm text-[#cdd3df]">
        <strong className="text-[#b79bff]">Experimental — outside SOR's current focus.</strong>{" "}
        This is a nondeterministic, single-ticker premium-selling read — a different sub-domain
        (options income) than SOR's equity rotation strategy. Not backtestable, not adopted, sample
        data only. See <span className="text-white">Strategy</span> for context.
      </div>

      {a ? (
        <OptionsAnalyzer a={a} />
      ) : (
        <p className="text-sm text-muted">No options analysis in this snapshot yet.</p>
      )}
    </div>
  );
}
