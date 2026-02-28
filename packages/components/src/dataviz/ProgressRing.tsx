import type { CSSProperties } from 'react';

export interface ProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  label?: string;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function ProgressRing({
  value,
  max = 100,
  size = 120,
  label,
  className,
  style,
  animate,
}: ProgressRingProps) {
  const pct = Math.min(1, Math.max(0, value / max));
  const cx = size / 2;
  const cy = size / 2;
  const strokeWidth = size * 0.1;
  const radius = (size - strokeWidth) / 2 - 4;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - pct);

  return (
    <svg
      width={size}
      height={size}
      className={className}
      style={style}
      role="img"
      aria-label={`Progress: ${Math.round(pct * 100)}%`}
    >
      {/* Background ring */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="var(--sm-muted, #e5e7eb)"
        strokeWidth={strokeWidth}
      />
      {/* Fill ring */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="var(--sm-primary, #3b82f6)"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={animate ? { transition: 'stroke-dashoffset 0.6s ease-out' } : undefined}
      />
      {label && (
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={size * 0.14}
          fill="currentColor"
          fontWeight="bold"
        >
          {label}
        </text>
      )}
    </svg>
  );
}
