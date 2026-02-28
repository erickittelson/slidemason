import { Headline, StatCallout, BarChart } from '@slidemason/components';

interface DataDashboardProps {
  headline: string;
  stats: Array<{ value: string; label: string }>;
  bars?: Array<{ label: string; value: number }>;
}

export function DataDashboard({ headline, stats, bars }: DataDashboardProps) {
  return (
    <div className="flex flex-col h-full" style={{ gap: 'clamp(1.5rem, 3vh, 3rem)' }}>
      <Headline>{headline}</Headline>
      <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
        {stats.map((s, i) => (
          <StatCallout key={i} value={s.value} label={s.label} />
        ))}
      </div>
      {bars && (
        <div className="flex-1 flex items-center justify-center">
          <BarChart bars={bars} />
        </div>
      )}
    </div>
  );
}
