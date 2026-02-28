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
      <div className="font-bold text-[var(--sm-primary)]" style={{ fontSize: 'clamp(2rem, 4vw, 3.75rem)' }}>{value}</div>
      <div className="mt-2 text-[var(--sm-muted)]" style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)' }}>{label}</div>
    </div>
  );
}
