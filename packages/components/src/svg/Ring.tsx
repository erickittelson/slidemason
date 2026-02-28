import type { CSSProperties } from 'react';

export interface RingProps {
  cx: number;
  cy: number;
  radius?: number;
  thickness?: number;
  fillPercent?: number;
  color?: string;
  trackColor?: string;
  className?: string;
  style?: CSSProperties;
  animate?: boolean;
}

export function Ring({
  cx,
  cy,
  radius = 40,
  thickness = 8,
  fillPercent = 100,
  color = 'var(--sm-primary)',
  trackColor = 'var(--sm-muted, #e5e7eb)',
  className = '',
  style,
  animate,
}: RingProps) {
  const circumference = 2 * Math.PI * radius;
  const filled = (fillPercent / 100) * circumference;
  const gap = circumference - filled;

  return (
    <g
      className={`${animate ? 'sm-fade-in' : ''} ${className}`.trim()}
      style={style}
    >
      {/* Background track */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke={trackColor}
        strokeWidth={thickness}
      />
      {/* Filled portion */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={thickness}
        strokeDasharray={`${filled} ${gap}`}
        strokeDashoffset={circumference / 4}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
      />
    </g>
  );
}
