import { getSnapshot } from "@/lib/data";
import { ScreenerTable } from "@/components/ScreenerTable";
import { LastUpdated } from "@/components/LastUpdated";

export default function ScreenerPage() {
  const snap = getSnapshot();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Screener</h1>
        <LastUpdated iso={snap.generatedAt} />
      </div>

      <div className="rounded-xl border border-border bg-panel2/40 p-4 text-sm text-muted">
        These screens are <strong className="text-[#cdd3df]">placeholders</strong> until your own
        screener is wired in. Share your strategy/screener from “Alaa’s Investing World” and the
        daily routine will populate this from your real filters — or from your saved Robinhood scans.
      </div>

      <div className="space-y-4">
        {snap.screeners.map((s, i) => (
          <ScreenerTable key={i} screener={s} />
        ))}
      </div>
    </div>
  );
}
