import type { CSSProperties } from 'react';

export interface FlywheelProps {
  segments: Array<{ label: string }>;
  size?: number;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const sweep = endAngle - startAngle;
  const largeArc = sweep > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

const CHART_COLORS = [
  'var(--sm-chart-1, #3b82f6)',
  'var(--sm-chart-2, #10b981)',
  'var(--sm-chart-3, #f59e0b)',
  'var(--sm-chart-4, #ef4444)',
  'var(--sm-chart-5, #8b5cf6)',
  'var(--sm-chart-6, #ec4899)',
];

export function Flywheel({
  segments,
  size = 400,
  className = '',
  style,
  animate,
}: FlywheelProps) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.35;
  const n = segments.length;
  const angleStep = 360 / n;
  const arrowRadius = radius + 20;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={`sm-flywheel ${animate ? 'sm-fade-in' : ''} ${className}`.trim()}
      style={style}
      role="img"
    >
      {segments.map((seg, i) => {
        const startAngle = i * angleStep;
        const endAngle = startAngle + angleStep;
        const midAngle = startAngle + angleStep / 2;
        const labelPos = polarToCartesian(cx, cy, radius * 0.75, midAngle);
        const color = CHART_COLORS[i % CHART_COLORS.length];

        // Arc path for segment
        const arcD = describeArc(cx, cy, radius, startAngle + 2, endAngle - 2);

        // Arrow at end of arc
        const arrowStart = polarToCartesian(cx, cy, arrowRadius, endAngle - 5);
        const arrowEnd = polarToCartesian(cx, cy, arrowRadius, endAngle + 5);
        const arrowTip = polarToCartesian(cx, cy, arrowRadius + 10, endAngle);

        return (
          <g
            key={i}
            style={
              animate === 'stagger'
                ? ({ animationDelay: `${i * 0.1}s` } as CSSProperties)
                : undefined
            }
            className={animate === 'stagger' ? 'sm-fade-in' : ''}
          >
            <path
              d={arcD}
              fill="none"
              stroke={color}
              strokeWidth={size * 0.06}
              strokeLinecap="round"
            />
            <polygon
              points={`${arrowStart.x},${arrowStart.y} ${arrowEnd.x},${arrowEnd.y} ${arrowTip.x},${arrowTip.y}`}
              fill={color}
            />
            <text
              x={labelPos.x}
              y={labelPos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="currentColor"
              fontSize={12}
            >
              {seg.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
