export interface StatCardProps {
  value: string;
  label: string;
  className?: string;
}

export function StatCard({ value, label, className = '' }: StatCardProps) {
  return (
    <div
      className={`rounded-[var(--sm-radius)] border border-[var(--sm-border)] bg-[var(--sm-surface)] p-6 text-center ${className}`.trim()}
    >
      <div className="text-4xl font-bold text-[var(--sm-primary)]">{value}</div>
      <div className="mt-1 text-sm text-[var(--sm-muted)]">{label}</div>
    </div>
  );
}
