import type { CSSProperties } from 'react';

export interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercent?: boolean;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercent,
  className,
  style,
  animate,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      className={className}
      style={{ width: '100%', ...style }}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      {(label || showPercent) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
          {label && <span>{label}</span>}
          {showPercent && <span>{Math.round(pct)}%</span>}
        </div>
      )}
      <div
        style={{
          height: 8,
          borderRadius: 4,
          backgroundColor: 'var(--sm-muted, #e5e7eb)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            borderRadius: 4,
            backgroundColor: 'var(--sm-primary, #3b82f6)',
            transition: animate ? 'width 0.4s ease-out' : undefined,
          }}
        />
      </div>
    </div>
  );
}
