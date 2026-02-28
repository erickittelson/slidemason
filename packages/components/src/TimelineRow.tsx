export interface TimelineRowProps {
  date: string;
  title: string;
  description?: string;
  className?: string;
}

export function TimelineRow({ date, title, description, className = '' }: TimelineRowProps) {
  return (
    <div className={`flex gap-4 ${className}`.trim()}>
      <div className="w-24 shrink-0 text-sm font-semibold text-[var(--sm-primary)]">{date}</div>
      <div className="relative pl-4 before:absolute before:left-0 before:top-0 before:h-full before:w-0.5 before:bg-[var(--sm-border)]">
        <div className="font-medium text-[var(--sm-text)]">{title}</div>
        {description && (
          <div className="mt-1 text-sm text-[var(--sm-muted)]">{description}</div>
        )}
      </div>
    </div>
  );
}
