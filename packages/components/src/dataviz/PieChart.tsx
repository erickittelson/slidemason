import type { CSSProperties } from 'react';

export interface PieChartProps {
  slices: Array<{ label: string; value: number }>;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

const CHART_COLORS = [
  'var(--sm-chart-1, #3b82f6)',
  'var(--sm-chart-2, #10b981)',
  'var(--sm-chart-3, #f59e0b)',
  'var(--sm-chart-4, #ef4444)',
  'var(--sm-chart-5, #8b5cf6)',
  'var(--sm-chart-6, #ec4899)',
];

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export function PieChart({ slices, className, style, animate }: PieChartProps) {
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 80;
  const labelRadius = radius + 24;
  const total = slices.reduce((s, sl) => s + sl.value, 0) || 1;

  let currentAngle = 0;

  return (
    <svg
      width={size}
      height={size}
      className={className}
      style={style}
      role="img"
      aria-label="Pie chart"
    >
      {slices.map((slice, i) => {
        const sliceAngle = (slice.value / total) * 360;
        const startAngle = currentAngle;
        const endAngle = currentAngle + sliceAngle;
        currentAngle = endAngle;

        const start = polarToCartesian(cx, cy, radius, startAngle);
        const end = polarToCartesian(cx, cy, radius, endAngle);
        const largeArc = sliceAngle > 180 ? 1 : 0;

        const path =
          sliceAngle >= 360
            ? `M ${cx - radius} ${cy} A ${radius} ${radius} 0 1 1 ${cx + radius} ${cy} A ${radius} ${radius} 0 1 1 ${cx - radius} ${cy}`
            : `M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;

        const midAngle = startAngle + sliceAngle / 2;
        const labelPos = polarToCartesian(cx, cy, labelRadius, midAngle);
        const lineEnd = polarToCartesian(cx, cy, radius + 8, midAngle);

        return (
          <g key={i}>
            <path
              d={path}
              fill={CHART_COLORS[i % CHART_COLORS.length]}
              style={
                animate
                  ? {
                      animation: `sm-fade-in 0.3s ease-out ${animate === 'stagger' ? `${i * 0.1}s` : '0s'} both`,
                    }
                  : undefined
              }
            />
            {/* Label line */}
            <line
              x1={lineEnd.x}
              y1={lineEnd.y}
              x2={labelPos.x}
              y2={labelPos.y}
              stroke="currentColor"
              strokeWidth={0.5}
              opacity={0.5}
            />
            <text
              x={labelPos.x}
              y={labelPos.y}
              textAnchor={labelPos.x > cx ? 'start' : 'end'}
              dominantBaseline="central"
              fontSize={9}
              fill="currentColor"
            >
              {slice.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
