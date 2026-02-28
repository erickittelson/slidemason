import type { CSSProperties } from 'react';

export interface PollResultsProps {
  question?: string;
  options: Array<{ label: string; value: number; total?: number }>;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

const chartColors = [
  'var(--sm-chart-1, var(--sm-primary))',
  'var(--sm-chart-2, #38a169)',
  'var(--sm-chart-3, #dd6b20)',
  'var(--sm-chart-4, #805ad5)',
  'var(--sm-chart-5, #e53e3e)',
  'var(--sm-chart-6, #3182ce)',
];

export function PollResults({
  question,
  options,
  className = '',
  style,
  animate,
}: PollResultsProps) {
  const animClass = animate ? (animate === 'stagger' ? 'sm-stagger' : 'sm-fade-up') : '';
  const maxValue = Math.max(...options.map((o) => (o.total != null ? o.total : o.value)), 1);

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        ...style,
      }}
    >
      {question && (
        <div style={{ fontWeight: 700, fontSize: 'clamp(0.9rem, 1.4vw, 1.1rem)', color: 'var(--sm-text)', marginBottom: '0.25rem' }}>
          {question}
        </div>
      )}
      {options.map((opt, i) => {
        const pct = opt.total != null ? (opt.value / opt.total) * 100 : (opt.value / maxValue) * 100;
        const color = chartColors[i % chartColors.length];
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ minWidth: '6rem', fontSize: 'clamp(0.75rem, 1.1vw, 0.85rem)', color: 'var(--sm-text)', flexShrink: 0 }}>
              {opt.label}
            </div>
            <div
              style={{
                flex: 1,
                height: '1.25rem',
                backgroundColor: 'var(--sm-border, #e2e8f0)',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${Math.min(pct, 100)}%`,
                  height: '100%',
                  backgroundColor: color,
                  borderRadius: '4px',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
            <div style={{ minWidth: '3rem', textAlign: 'right', fontSize: 'clamp(0.7rem, 1vw, 0.8rem)', color: 'var(--sm-muted)', fontWeight: 600 }}>
              {Math.round(pct)}%
            </div>
          </div>
        );
      })}
    </div>
  );
}
