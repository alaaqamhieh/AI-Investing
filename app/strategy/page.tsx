import fs from "node:fs";
import path from "node:path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function getStrategy(): string {
  try {
    return fs.readFileSync(path.join(process.cwd(), "docs", "SOR-strategy.md"), "utf-8");
  } catch {
    return "# SOR Strategy\n\n_Strategy document not found._";
  }
}

export default function StrategyPage() {
  const md = getStrategy();
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Strategy — SOR</h1>
      <article className="rounded-xl border border-border bg-panel p-6 prose-brief">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{md}</ReactMarkdown>
      </article>
    </div>
  );
}
