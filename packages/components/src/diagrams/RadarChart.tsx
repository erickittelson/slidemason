import type { CSSProperties } from 'react';

export interface RadarChartProps {
  axes: Array<{ label: string; value: number; max?: number }>;
  size?: number;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export function RadarChart({
  axes,
  size = 400,
  className = '',
  style,
  animate,
}: RadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = size * 0.35;
  const n = axes.length;
  const angleStep = 360 / n;
  const gridLevels = 4;

  // Concentric grid polygons
  const gridPolygons = Array.from({ length: gridLevels }, (_, level) => {
    const r = (maxRadius * (level + 1)) / gridLevels;
    const points = axes
      .map((_, i) => {
        const pos = polarToCartesian(cx, cy, r, i * angleStep);
        return `${pos.x},${pos.y}`;
      })
      .join(' ');
    return points;
  });

  // Data polygon
  const dataPoints = axes
    .map((axis, i) => {
      const max = axis.max ?? 100;
      const ratio = Math.min(axis.value / max, 1);
      const pos = polarToCartesian(cx, cy, maxRadius * ratio, i * angleStep);
      return `${pos.x},${pos.y}`;
    })
    .join(' ');

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={`sm-radar-chart ${animate ? 'sm-fade-in' : ''} ${className}`.trim()}
      style={style}
      role="img"
    >
      {/* Grid lines */}
      {gridPolygons.map((points, i) => (
        <polygon
          key={`grid-${i}`}
          points={points}
          fill="none"
          stroke="var(--sm-border, #d1d5db)"
          strokeWidth={1}
          opacity={0.5}
        />
      ))}

      {/* Axis lines */}
      {axes.map((_, i) => {
        const pos = polarToCartesian(cx, cy, maxRadius, i * angleStep);
        return (
          <line
            key={`axis-${i}`}
            x1={cx}
            y1={cy}
            x2={pos.x}
            y2={pos.y}
            stroke="var(--sm-border, #d1d5db)"
            strokeWidth={1}
            opacity={0.5}
          />
        );
      })}

      {/* Data polygon */}
      <polygon
        points={dataPoints}
        fill="var(--sm-primary, #3b82f6)"
        fillOpacity={0.3}
        stroke="var(--sm-primary, #3b82f6)"
        strokeWidth={2}
      />

      {/* Data points */}
      {axes.map((axis, i) => {
        const max = axis.max ?? 100;
        const ratio = Math.min(axis.value / max, 1);
        const pos = polarToCartesian(cx, cy, maxRadius * ratio, i * angleStep);
        return (
          <circle
            key={`point-${i}`}
            cx={pos.x}
            cy={pos.y}
            r={4}
            fill="var(--sm-primary, #3b82f6)"
          />
        );
      })}

      {/* Axis labels */}
      {axes.map((axis, i) => {
        const pos = polarToCartesian(cx, cy, maxRadius + 20, i * angleStep);
        return (
          <text
            key={`label-${i}`}
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="central"
            fill="currentColor"
            fontSize={11}
          >
            {axis.label}
          </text>
        );
      })}
    </svg>
  );
}
