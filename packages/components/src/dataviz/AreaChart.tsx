import type { CSSProperties } from 'react';

export interface AreaChartProps {
  data: Array<{ label: string; value: number }>;
  fill?: boolean;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function AreaChart({
  data,
  fill = true,
  className,
  style,
  animate,
}: AreaChartProps) {
  if (data.length === 0) return <svg width={300} height={160} className={className} style={style} />;

  const padding = { top: 10, right: 10, bottom: 28, left: 10 };
  const width = 300;
  const height = 160;
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const values = data.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  const points = data.map((d, i) => {
    const x = padding.left + (data.length === 1 ? plotWidth / 2 : (i / (data.length - 1)) * plotWidth);
    const y = padding.top + (1 - (d.value - minVal) / range) * plotHeight;
    return { x, y };
  });

  const linePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  const fillPoints = fill
    ? `${padding.left},${padding.top + plotHeight} ${linePoints} ${points[points.length - 1].x},${padding.top + plotHeight}`
    : '';

  return (
    <svg
      width={width}
      height={height}
      className={className}
      style={style}
      role="img"
      aria-label="Area chart"
    >
      {fill && (
        <polygon
          points={fillPoints}
          fill="var(--sm-primary, #3b82f6)"
          opacity={0.2}
        />
      )}
      <polyline
        points={linePoints}
        fill="none"
        stroke="var(--sm-primary, #3b82f6)"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        style={animate ? { animation: 'sm-fade-in 0.4s ease-out both' } : undefined}
      />
      {/* X-axis labels */}
      {data.map((d, i) => {
        const x = padding.left + (data.length === 1 ? plotWidth / 2 : (i / (data.length - 1)) * plotWidth);
        return (
          <text
            key={i}
            x={x}
            y={height - 4}
            textAnchor="middle"
            fontSize={9}
            fill="currentColor"
          >
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}
