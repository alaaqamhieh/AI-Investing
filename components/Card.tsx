export function Card({
  title,
  children,
  right,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-xl border border-border bg-panel ${className}`}>
      {(title || right) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          {title && <h2 className="text-sm font-semibold text-[#cdd3df]">{title}</h2>}
          {right}
        </div>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}
