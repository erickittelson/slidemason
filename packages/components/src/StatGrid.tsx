import { StatCard } from './StatCard';

export interface StatGridProps {
  stats: Array<{ value: string; label: string }>;
  className?: string;
}

export function StatGrid({ stats, className = '' }: StatGridProps) {
  return (
    <div
      className={`grid gap-6 ${stats.length <= 2 ? 'grid-cols-2' : stats.length === 3 ? 'grid-cols-3' : 'grid-cols-4'} ${className}`.trim()}
    >
      {stats.map((stat, i) => (
        <StatCard key={i} value={stat.value} label={stat.label} />
      ))}
    </div>
  );
}
