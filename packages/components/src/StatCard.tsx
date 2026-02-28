export interface StatCardProps {
  value: string;
  label: string;
  className?: string;
}

export function StatCard({ value, label, className = '' }: StatCardProps) {
  return (
    <div
      className={`rounded-[var(--sm-radius)] border border-[var(--sm-border)] bg-[var(--sm-surface)] p-8 text-center ${className}`.trim()}
    >
      <div className="text-6xl font-bold text-[var(--sm-primary)]">{value}</div>
      <div className="mt-2 text-lg text-[var(--sm-muted)]">{label}</div>
    </div>
  );
}
