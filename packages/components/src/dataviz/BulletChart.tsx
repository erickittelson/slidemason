import type { CSSProperties } from 'react';

export interface BulletChartProps {
  value: number;
  target: number;
  ranges: [number, number, number];
  label?: string;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function BulletChart({
  value,
  target,
  ranges,
  label,
  className,
  style,
  animate,
}: BulletChartProps) {
  const max = Math.max(...ranges, value, target);
  const width = 300;
  const barHeight = 32;
  const labelWidth = label ? 60 : 0;
  const chartWidth = width;
  const plotWidth = chartWidth - labelWidth - 10;

  function scale(v: number) {
    return (v / max) * plotWidth;
  }

  const grays = ['#e5e7eb', '#d1d5db', '#9ca3af'];

  return (
    <svg
      width={chartWidth}
      height={barHeight + 4}
      className={className}
      style={style}
      role="img"
      aria-label={`Bullet chart${label ? `: ${label}` : ''}`}
    >
      {label && (
        <text x={0} y={barHeight / 2 + 4} fontSize={11} fill="currentColor">
          {label}
        </text>
      )}
      {/* Range bands (light to dark) */}
      {ranges.map((r, i) => (
        <rect
          key={i}
          x={labelWidth}
          y={2}
          width={scale(r)}
          height={barHeight}
          fill={grays[i]}
          rx={i === 0 ? 2 : 0}
        />
      ))}
      {/* Value bar */}
      <rect
        x={labelWidth}
        y={barHeight * 0.3}
        width={scale(value)}
        height={barHeight * 0.4}
        fill="var(--sm-primary, #3b82f6)"
        rx={2}
        style={
          animate
            ? { animation: 'sm-grow-right 0.4s ease-out both' }
            : undefined
        }
      />
      {/* Target marker */}
      <line
        x1={labelWidth + scale(target)}
        y1={2}
        x2={labelWidth + scale(target)}
        y2={barHeight + 2}
        stroke="currentColor"
        strokeWidth={2}
      />
    </svg>
  );
}
