export interface SectionLabelProps {
  label: string;
  className?: string;
}

export function SectionLabel({ label, className = '' }: SectionLabelProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`.trim()}>
      <div className="h-px flex-1 bg-[var(--sm-border)]" />
      <span className="text-xs font-semibold uppercase tracking-widest text-[var(--sm-muted)]">
        {label}
      </span>
      <div className="h-px flex-1 bg-[var(--sm-border)]" />
    </div>
  );
}
