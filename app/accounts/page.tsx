import { getSnapshot } from "@/lib/data";
import { AccountCard } from "@/components/AccountCard";
import { LastUpdated } from "@/components/LastUpdated";

export default function AccountsPage() {
  const snap = getSnapshot();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Accounts</h1>
        <LastUpdated iso={snap.generatedAt} />
      </div>
      <div className="grid grid-cols-1 gap-4">
        {snap.accounts.map((a) => (
          <AccountCard key={a.id} account={a} />
        ))}
      </div>
    </div>
  );
}
