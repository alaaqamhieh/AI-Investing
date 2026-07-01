import type { OptionsAnalysis } from "@/data/snapshot.schema";
import { Term } from "./Term";
import { usd } from "@/lib/format";

function fmtStrike(row: { strike: number }) {
  return row.strike % 1 === 0 ? row.strike.toFixed(0) : row.strike.toFixed(2);
}

export function OptionsAnalyzer({ a }: { a: OptionsAnalysis }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="rounded-xl border border-border bg-panel p-3">
          <div className="text-xs uppercase tracking-wide text-muted">
            <Term k="spot">Spot</Term>
          </div>
          <div className="mt-1 text-xl font-semibold tabular-nums">{usd(a.spot)}</div>
          <div className="text-xs text-muted">
            <Term k="atm">ATM</Term> strike {fmtStrike({ strike: a.atmStrike })}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-panel p-3">
          <div className="text-xs uppercase tracking-wide text-muted">
            <Term k="atm">ATM</Term> <Term k="iv">IV</Term>
          </div>
          <div className="mt-1 text-xl font-semibold tabular-nums">{a.atmIv.toFixed(1)}%</div>
          <div className="text-xs text-muted">
            vs 30d <Term k="realizedVol">RV</Term> {a.realizedVol30d.toFixed(1)}%
          </div>
        </div>
        <div className="rounded-xl border border-border bg-panel p-3">
          <div className="text-xs uppercase tracking-wide text-muted">
            <Term k="ivRank">IV Rank</Term>
          </div>
          <div className={`mt-1 text-xl font-semibold tabular-nums ${a.ivRank >= 60 ? "text-down" : "text-up"}`}>
            {a.ivRank}
          </div>
          <div className="text-xs text-muted">{a.ivRank >= 60 ? "rich" : "cheap"}</div>
        </div>
        <div className="rounded-xl border border-border bg-panel p-3">
          <div className="text-xs uppercase tracking-wide text-muted">
            25&Delta; <Term k="skew">Skew</Term>
          </div>
          <div className="mt-1 text-xl font-semibold tabular-nums">{a.skew25d.toFixed(1)} pp</div>
          <div className="text-xs text-muted">put IV &minus; call IV</div>
        </div>
        <div className="rounded-xl border border-border bg-panel p-3">
          <div className="text-xs uppercase tracking-wide text-muted">Days to earnings</div>
          <div className="mt-1 text-xl font-semibold tabular-nums">{a.daysToEarnings}</div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-panel p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs uppercase tracking-wide text-muted">Verdict</span>
          {a.verdictTags.map((t) => (
            <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-[#e0a23a]/15 text-[#e0a23a]">
              {t}
            </span>
          ))}
        </div>
        <p className="text-sm text-[#cdd3df]">{a.summary}</p>
      </div>

      <div className="rounded-xl border border-border bg-panel p-4">
        <div className="text-xs uppercase tracking-wide text-muted mb-3">Ideas to consider</div>
        <div className="space-y-2">
          {a.ideas.map((idea, i) => (
            <div
              key={i}
              className={`rounded-lg border-l-2 bg-panel2/60 p-3 flex flex-col sm:flex-row sm:items-center gap-2 ${
                idea.action === "sell" ? "border-[#e0a23a]" : "border-up"
              }`}
            >
              <div className="flex items-center gap-2 shrink-0 w-40">
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    idea.side === "put" ? "bg-down/15 text-down" : "bg-up/15 text-up"
                  }`}
                >
                  {idea.side.toUpperCase()}
                </span>
                <span className={`text-xs font-semibold ${idea.action === "sell" ? "text-[#e0a23a]" : "text-up"}`}>
                  {idea.action.toUpperCase()}
                </span>
              </div>
              <div className="shrink-0 w-32 text-sm tabular-nums">
                {fmtStrike(idea)} {idea.label && <span className="text-xs text-muted">/ {idea.label}</span>}
              </div>
              <div className="shrink-0 w-20 text-sm tabular-nums text-muted">
                <Term k="delta">&Delta;</Term> {idea.delta >= 0 ? "+" : ""}
                {idea.delta.toFixed(2)}
              </div>
              <p className="text-sm text-muted">{idea.rationale}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-down/30 bg-down/5 p-4">
        <div className="text-xs uppercase tracking-wide text-down mb-2">Risks to know</div>
        <ul className="space-y-1.5 text-sm text-[#cdd3df] list-disc pl-4">
          {a.risks.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-border bg-panel p-4">
        <div className="text-xs uppercase tracking-wide text-muted mb-3">
          Chain &middot; expiry {a.expiry} &middot; <Term k="dte">DTE</Term>{" "}
          {Math.max(0, Math.round((new Date(a.expiry).getTime() - new Date(a.generatedAt).getTime()) / 86400000))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-muted border-b border-border">
                <th className="py-1.5 px-2 text-right"><Term k="oi">OI</Term></th>
                <th className="py-1.5 px-2 text-right">Vol</th>
                <th className="py-1.5 px-2 text-right"><Term k="delta">&Delta;</Term></th>
                <th className="py-1.5 px-2 text-right"><Term k="iv">IV</Term></th>
                <th className="py-1.5 px-2 text-right">Bid/Ask</th>
                <th className="py-1.5 px-2 text-center font-semibold text-[#cdd3df]">
                  <Term k="strike">Strike</Term>
                </th>
                <th className="py-1.5 px-2 text-left">Bid/Ask</th>
                <th className="py-1.5 px-2 text-left">IV</th>
                <th className="py-1.5 px-2 text-left">&Delta;</th>
                <th className="py-1.5 px-2 text-left">Vol</th>
                <th className="py-1.5 px-2 text-left">OI</th>
              </tr>
            </thead>
            <tbody>
              {a.chain.map((row) => (
                <tr
                  key={row.strike}
                  className={`border-b border-border/40 ${
                    Math.abs(row.strike - a.atmStrike) < 0.01 ? "bg-accent/10" : ""
                  }`}
                >
                  <td className="py-1 px-2 text-right tabular-nums">{row.callOi ?? "—"}</td>
                  <td className="py-1 px-2 text-right tabular-nums">{row.callVol ?? "—"}</td>
                  <td className="py-1 px-2 text-right tabular-nums">{row.callDelta?.toFixed(2) ?? "—"}</td>
                  <td className="py-1 px-2 text-right tabular-nums">{row.callIv?.toFixed(1) ?? "—"}%</td>
                  <td className="py-1 px-2 text-right tabular-nums">
                    {row.callBid?.toFixed(2)} / {row.callAsk?.toFixed(2)}
                  </td>
                  <td className="py-1 px-2 text-center font-semibold tabular-nums">{fmtStrike(row)}</td>
                  <td className="py-1 px-2 text-left tabular-nums">
                    {row.putBid?.toFixed(2)} / {row.putAsk?.toFixed(2)}
                  </td>
                  <td className="py-1 px-2 text-left tabular-nums">{row.putIv?.toFixed(1) ?? "—"}%</td>
                  <td className="py-1 px-2 text-left tabular-nums">{row.putDelta?.toFixed(2) ?? "—"}</td>
                  <td className="py-1 px-2 text-left tabular-nums">{row.putVol ?? "—"}</td>
                  <td className="py-1 px-2 text-left tabular-nums">{row.putOi ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
