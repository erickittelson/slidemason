import { StatCallout } from '@slidemason/components';

interface NumbersImpactProps {
  stats: Array<{ value: string; label: string }>;
}

export function NumbersImpact({ stats }: NumbersImpactProps) {
  return (
    <div className="flex h-full items-center justify-center">
      <div style={{ display: 'flex', gap: 'clamp(2rem, 5vw, 5rem)', justifyContent: 'center' }}>
        {stats.map((s, i) => (
          <StatCallout key={i} value={s.value} label={s.label} />
        ))}
      </div>
    </div>
  );
}
