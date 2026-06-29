import {
  getSnapshot,
  allocationByInstitution,
  allocationByAssetType,
  themeAllocation,
  complianceSummary,
} from "@/lib/data";
import { usd, pct, signedUsd } from "@/lib/format";
import { StatTile } from "@/components/StatTile";
import { Card } from "@/components/Card";
import { AllocationChart } from "@/components/AllocationChart";
import { MoversList } from "@/components/MoversList";
import { LastUpdated } from "@/components/LastUpdated";

export default function OverviewPage() {
  const snap = getSnapshot();
  const { totals } = snap;
  const themes = themeAllocation(snap);
  const compliance = complianceSummary(snap);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Overview</h1>
        <LastUpdated iso={snap.generatedAt} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Net Worth" value={usd(totals.netWorth)} />
        <StatTile
          label="Day Change"
          value={signedUsd(totals.dayChange)}
          sub={pct(totals.dayChangePct)}
          subTrend={totals.dayChange}
        />
        <StatTile label="Investable" value={usd(totals.investable)} />
        <StatTile
          label="Compliance"
          value={`${compliance.flagged} flagged`}
          sub={`${compliance.bds} BDS · ${compliance.total} holdings`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Allocation">
          <div className="grid grid-cols-1 gap-6">
            <AllocationChart data={allocationByInstitution(snap)} title="By institution" />
            <div className="border-t border-border/50 pt-5">
              <AllocationChart data={allocationByAssetType(snap)} title="By asset type" />
            </div>
          </div>
        </Card>
        <div className="space-y-4">
          <Card title="Top Movers Today">
            <MoversList up={snap.topMovers.up} down={snap.topMovers.down} />
          </Card>
          {themes.length > 0 && (
            <Card title="SOR Theme Rotation">
              <AllocationChart data={themes} title="By theme" />
            </Card>
          )}
        </div>
      </div>

      <Card title="Accounts">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-border">
                <th className="py-2 pr-3 font-medium">Account</th>
                <th className="py-2 px-3 font-medium text-right">Value</th>
                <th className="py-2 pl-3 font-medium text-right">Day</th>
              </tr>
            </thead>
            <tbody>
              {snap.accounts.map((a) => (
                <tr key={a.id} className="border-b border-border/50 last:border-0">
                  <td className="py-2 pr-3">
                    <span className="font-medium">{a.institution}</span>
                    <span className="block text-xs text-muted">{a.name}</span>
                  </td>
                  <td className="py-2 px-3 text-right tabular-nums">{usd(a.value)}</td>
                  <td
                    className={`py-2 pl-3 text-right tabular-nums ${
                      a.dayChange >= 0 ? "text-up" : "text-down"
                    }`}
                  >
                    {pct(a.dayChangePct)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
