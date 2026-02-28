import type { CSSProperties } from 'react';

export interface MetricCardProps {
  value: string;
  label: string;
  trend?: { direction: 'up' | 'down'; value: string };
  sparkline?: number[];
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function MetricCard({ value, label, trend, sparkline, className = '', style, animate }: MetricCardProps) {
  const animClass = animate ? 'sm-fade-up' : '';

  const renderSparkline = (data: number[]) => {
    if (data.length < 2) return null;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const w = 120;
    const h = 32;
    const points = data
      .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`)
      .join(' ');
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', marginTop: '0.5rem' }}>
        <polyline
          points={points}
          fill="none"
          stroke="var(--sm-primary)"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    );
  };

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      style={{
        padding: '1.5rem',
        backgroundColor: 'var(--sm-surface)',
        border: '1px solid var(--sm-border)',
        borderRadius: 'var(--sm-radius)',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
        <span style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 700, color: 'var(--sm-text)' }}>
          {value}
        </span>
        {trend && (
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              padding: '0.1rem 0.4rem',
              borderRadius: '4px',
              backgroundColor: trend.direction === 'up' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
              color: trend.direction === 'up' ? '#22c55e' : '#ef4444',
            }}
          >
            {trend.direction === 'up' ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
      <div style={{ color: 'var(--sm-muted)', fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)', marginTop: '0.25rem' }}>
        {label}
      </div>
      {sparkline && renderSparkline(sparkline)}
    </div>
  );
}
