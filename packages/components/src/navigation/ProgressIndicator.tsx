import type { CSSProperties } from 'react';

export interface ProgressIndicatorProps {
  current: number;
  total: number;
  position?: 'top' | 'bottom';
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function ProgressIndicator({
  current,
  total,
  position = 'top',
  className = '',
  style,
  animate,
}: ProgressIndicatorProps) {
  const animClass = animate ? (animate === 'stagger' ? 'sm-stagger' : 'sm-fade-up') : '';
  const pct = total > 0 ? Math.min((current / total) * 100, 100) : 0;

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={total}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        height: '4px',
        background: 'var(--sm-muted, #e0e0e0)',
        ...(position === 'top' ? { top: 0 } : { bottom: 0 }),
        ...style,
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${pct}%`,
          background: 'var(--sm-primary)',
          transition: 'width 0.3s ease',
        }}
      />
    </div>
  );
}
