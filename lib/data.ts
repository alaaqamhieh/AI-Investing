// Typed loaders for the committed snapshot + daily brief.
// These run at build/request time on the server (no MCP access at runtime).

import fs from "node:fs";
import path from "node:path";
import type { Snapshot } from "@/data/snapshot.schema";

const DATA_DIR = path.join(process.cwd(), "data");

export function getSnapshot(): Snapshot {
  const raw = fs.readFileSync(path.join(DATA_DIR, "snapshot.json"), "utf-8");
  return JSON.parse(raw) as Snapshot;
}

export function getBrief(): string {
  try {
    return fs.readFileSync(path.join(DATA_DIR, "brief.md"), "utf-8");
  } catch {
    return "# Daily Market Brief\n\n_No brief available yet._";
  }
}

// Allocation buckets by institution, for the overview donut.
export function allocationByInstitution(snapshot: Snapshot) {
  return snapshot.accounts
    .map((a) => ({ label: a.institution, value: a.value }))
    .sort((x, y) => y.value - x.value);
}

// Allocation buckets by asset type across all accounts.
export function allocationByAssetType(snapshot: Snapshot) {
  const totals = new Map<string, number>();
  for (const acct of snapshot.accounts) {
    if (acct.cash) totals.set("cash", (totals.get("cash") ?? 0) + acct.cash);
    for (const p of acct.positions) {
      const key = p.assetType ?? "other";
      totals.set(key, (totals.get(key) ?? 0) + p.value);
    }
  }
  return [...totals.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((x, y) => y.value - x.value);
}
