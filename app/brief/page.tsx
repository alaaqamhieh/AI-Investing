import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getBrief, getSnapshot } from "@/lib/data";
import { LastUpdated } from "@/components/LastUpdated";

export default function BriefPage() {
  const brief = getBrief();
  const snap = getSnapshot();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Daily Brief</h1>
        <LastUpdated iso={snap.generatedAt} />
      </div>
      <article className="rounded-xl border border-border bg-panel p-6 prose-brief">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{brief}</ReactMarkdown>
      </article>
    </div>
  );
}
