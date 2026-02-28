import type { CSSProperties } from 'react';

export interface ScatterPlotProps {
  points: Array<{ x: number; y: number; label?: string }>;
  xLabel?: string;
  yLabel?: string;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function ScatterPlot({
  points,
  xLabel,
  yLabel,
  className,
  style,
  animate,
}: ScatterPlotProps) {
  const width = 300;
  const height = 220;
  const padding = { top: 10, right: 20, bottom: 40, left: 40 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const xMin = Math.min(...xs, 0);
  const xMax = Math.max(...xs, 1);
  const yMin = Math.min(...ys, 0);
  const yMax = Math.max(...ys, 1);
  const xRange = xMax - xMin || 1;
  const yRange = yMax - yMin || 1;

  function sx(v: number) {
    return padding.left + ((v - xMin) / xRange) * plotWidth;
  }
  function sy(v: number) {
    return padding.top + (1 - (v - yMin) / yRange) * plotHeight;
  }

  return (
    <svg
      width={width}
      height={height}
      className={className}
      style={style}
      role="img"
      aria-label="Scatter plot"
    >
      {/* Y axis */}
      <line
        x1={padding.left}
        y1={padding.top}
        x2={padding.left}
        y2={padding.top + plotHeight}
        stroke="currentColor"
        strokeWidth={1}
        opacity={0.3}
      />
      {/* X axis */}
      <line
        x1={padding.left}
        y1={padding.top + plotHeight}
        x2={padding.left + plotWidth}
        y2={padding.top + plotHeight}
        stroke="currentColor"
        strokeWidth={1}
        opacity={0.3}
      />
      {/* Axis labels */}
      {xLabel && (
        <text
          x={padding.left + plotWidth / 2}
          y={height - 4}
          textAnchor="middle"
          fontSize={10}
          fill="currentColor"
        >
          {xLabel}
        </text>
      )}
      {yLabel && (
        <text
          x={12}
          y={padding.top + plotHeight / 2}
          textAnchor="middle"
          fontSize={10}
          fill="currentColor"
          transform={`rotate(-90, 12, ${padding.top + plotHeight / 2})`}
        >
          {yLabel}
        </text>
      )}
      {/* Points */}
      {points.map((p, i) => (
        <g key={i}>
          <circle
            cx={sx(p.x)}
            cy={sy(p.y)}
            r={4}
            fill="var(--sm-primary, #3b82f6)"
            style={
              animate
                ? {
                    animation: `sm-fade-in 0.3s ease-out ${animate === 'stagger' ? `${i * 0.05}s` : '0s'} both`,
                  }
                : undefined
            }
          />
          {p.label && (
            <text
              x={sx(p.x) + 6}
              y={sy(p.y) - 6}
              fontSize={8}
              fill="currentColor"
            >
              {p.label}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}
