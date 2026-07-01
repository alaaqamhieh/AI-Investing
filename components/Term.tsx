import { glossary, type GlossaryKey } from "@/lib/glossary";

// Wraps a label with a hover explainer, e.g. <Term k="vix">VIX</Term>.
// Pure CSS (group-hover), no client JS needed — works fine in a static export.
export function Term({ k, children }: { k: GlossaryKey; children: React.ReactNode }) {
  const entry = glossary[k];
  return (
    <span className="relative inline-block group/term">
      <span className="cursor-help border-b border-dotted border-muted/70">{children}</span>
      <span
        className="pointer-events-none absolute left-1/2 bottom-full z-30 mb-2 w-64 -translate-x-1/2
          rounded-lg border border-border bg-panel2 p-3 text-xs leading-relaxed text-[#cdd3df]
          opacity-0 shadow-xl transition-opacity duration-100 group-hover/term:opacity-100"
      >
        <strong className="block text-white mb-1">{entry.term}</strong>
        {entry.definition}
      </span>
    </span>
  );
}
