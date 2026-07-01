import type { MacroGate, DeploymentPosture } from "@/data/snapshot.schema";
import { Term } from "./Term";
import type { GlossaryKey } from "@/lib/glossary";

const POSTURE_STYLE: Record<DeploymentPosture, { label: string; cls: string }> = {
  full: { label: "FULL DEPLOY", cls: "bg-up/15 text-up" },
  reduced: { label: "REDUCED", cls: "bg-[#e0a23a]/15 text-[#e0a23a]" },
  defensive: { label: "DEFENSIVE", cls: "bg-down/15 text-down" },
};

const SIGNAL_TERM: Record<string, GlossaryKey> = {
  "VIX Level": "vix",
  "VIX Term Structure": "vixTermStructure",
  "Market Breadth": "marketBreadth",
  "Credit Spreads": "creditSpreads",
  "Put/Call Sentiment": "putCallSentiment",
  "Factor Crowding": "factorCrowding",
};

function scoreColor(score: number): string {
  if (score >= 70) return "bg-up";
  if (score >= 40) return "bg-[#e0a23a]";
  return "bg-down";
}

export function MacroGateCard({ gate }: { gate: MacroGate }) {
  const posture = POSTURE_STYLE[gate.posture];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-panel p-4">
          <div className="text-xs uppercase tracking-wide text-muted">
            <Term k="deploymentScore">Deployment score</Term>
          </div>
          <div className="mt-1 text-4xl font-semibold tabular-nums">
            {gate.compositeScore}
            <span className="text-lg text-muted">/100</span>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-panel p-4">
          <div className="text-xs uppercase tracking-wide text-muted">Posture</div>
          <span className={`inline-block mt-1 text-sm font-semibold px-2.5 py-1 rounded-full ${posture.cls}`}>
            {posture.label}
          </span>
          <div className="mt-2 text-sm text-muted">
            Deploy at <strong className="text-[#cdd3df]">{gate.sizingPct}%</strong> of normal sizing.
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-panel p-4">
        <div className="text-xs uppercase tracking-wide text-muted mb-3">Signal mix</div>
        <div className="space-y-2.5">
          {gate.signals.map((s) => (
            <div key={s.name} className="flex items-center gap-3">
              <div className="w-40 shrink-0 text-sm">
                {SIGNAL_TERM[s.name] ? <Term k={SIGNAL_TERM[s.name]}>{s.name}</Term> : s.name}
              </div>
              <div className="flex-1 h-2 rounded-full bg-panel2 overflow-hidden">
                <div className={`h-full rounded-full ${scoreColor(s.score)}`} style={{ width: `${s.score}%` }} />
              </div>
              <div className="w-10 shrink-0 text-sm text-right tabular-nums">{s.score}</div>
              {s.raw && <div className="hidden md:block w-64 shrink-0 text-xs text-muted">{s.raw}</div>}
            </div>
          ))}
        </div>
      </div>

      {gate.note && <p className="text-xs text-muted">{gate.note}</p>}
    </div>
  );
}
