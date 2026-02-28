import type { CSSProperties } from 'react';

export interface StatCalloutProps {
  value: string;
  label: string;
  trend?: { direction: 'up' | 'down'; value: string };
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function StatCallout({
  value,
  label,
  trend,
  className = '',
  style,
  animate,
}: StatCalloutProps) {
  const animClass = animate ? 'sm-fade-up' : '';

  return (
    <div
      className={`text-center ${animClass} ${className}`.trim()}
      style={style}
    >
      <div
        className="font-bold text-[var(--sm-text)]"
        style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: 1.1 }}
      >
        {value}
      </div>
      <div
        className="mt-2 text-[var(--sm-muted)]"
        style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)' }}
      >
        {label}
      </div>
      {trend && (
        <div
          className="mt-2 inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium"
          style={{
            color: trend.direction === 'up' ? 'var(--sm-success, #22c55e)' : 'var(--sm-danger, #ef4444)',
            backgroundColor: trend.direction === 'up'
              ? 'rgba(34, 197, 94, 0.1)'
              : 'rgba(239, 68, 68, 0.1)',
          }}
        >
          <span>{trend.direction === 'up' ? '\u2191' : '\u2193'}</span>
          <span>{trend.value}</span>
        </div>
      )}
    </div>
  );
}
