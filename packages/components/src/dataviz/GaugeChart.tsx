import type { CSSProperties } from 'react';

export interface GaugeChartProps {
  value: number;
  min?: number;
  max?: number;
  label?: string;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function GaugeChart({
  value,
  min = 0,
  max = 100,
  label,
  className,
  style,
  animate,
}: GaugeChartProps) {
  const range = max - min || 1;
  const pct = Math.min(1, Math.max(0, (value - min) / range));

  const size = 200;
  const cx = size / 2;
  const cy = size / 2 + 10;
  const radius = 70;
  const strokeWidth = 14;

  // Half circle = PI radians
  const halfCircumference = Math.PI * radius;
  const fillLength = pct * halfCircumference;

  return (
    <svg
      width={size}
      height={size * 0.65}
      className={className}
      style={style}
      role="img"
      aria-label={`Gauge: ${value}`}
    >
      {/* Background arc */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="var(--sm-muted, #e5e7eb)"
        strokeWidth={strokeWidth}
        strokeDasharray={`${halfCircumference} ${halfCircumference}`}
        strokeLinecap="round"
        transform={`rotate(180 ${cx} ${cy})`}
      />
      {/* Fill arc */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="var(--sm-primary, #3b82f6)"
        strokeWidth={strokeWidth}
        strokeDasharray={`${fillLength} ${halfCircumference * 2 - fillLength}`}
        strokeLinecap="round"
        transform={`rotate(180 ${cx} ${cy})`}
        style={animate ? { transition: 'stroke-dasharray 0.6s ease-out' } : undefined}
      />
      {/* Value text */}
      <text
        x={cx}
        y={cy - 10}
        textAnchor="middle"
        fontSize={22}
        fontWeight="bold"
        fill="currentColor"
      >
        {value}
      </text>
      {label && (
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize={11} fill="currentColor">
          {label}
        </text>
      )}
    </svg>
  );
}
