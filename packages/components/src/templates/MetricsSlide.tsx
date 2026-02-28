import type { MetricsSlideProps } from './types';
import { Headline } from '../Headline';
import { StatCallout } from '../typography/StatCallout';

export function MetricsSlide({ title, subtitle, metrics }: MetricsSlideProps) {
  const cols = metrics.length <= 2 ? 2 : metrics.length === 3 ? 3 : 4;
  return (
    <div className="flex flex-1 flex-col">
      {title && <Headline>{title}</Headline>}
      {subtitle && (
        <p className="sm-fade-up sm-stagger-1" style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)', color: 'var(--sm-muted)', margin: '0 0 clamp(1rem, 2vh, 2rem)' }}>
          {subtitle}
        </p>
      )}
      <div
        className="flex flex-1 items-center justify-center"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(cols, metrics.length)}, 1fr)`,
          gap: 'clamp(0.75rem, 1.5vw, 1.5rem)',
          width: '100%',
        }}
      >
        {metrics.map((m, i) => (
          <div
            key={i}
            className={`sm-fade-up sm-stagger-${i + 1} flex items-center justify-center`}
            style={{
              padding: 'clamp(1.5rem, 3vw, 2.5rem)',
              backgroundColor: 'var(--sm-surface)',
              border: '1px solid var(--sm-border)',
              borderRadius: 'var(--sm-radius, 1rem)',
            }}
          >
            <StatCallout
              value={m.value}
              label={m.label}
              trend={m.trend && m.trend !== 'neutral' ? { direction: m.trend, value: '' } : undefined}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
