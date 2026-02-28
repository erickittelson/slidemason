import type { CSSProperties } from 'react';

export interface VennDiagramProps {
  sets: Array<{ label: string }>;
  intersection?: string;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

const CHART_COLORS = [
  'var(--sm-chart-1, #3b82f6)',
  'var(--sm-chart-2, #10b981)',
  'var(--sm-chart-3, #f59e0b)',
];

export function VennDiagram({
  sets,
  intersection,
  className = '',
  style,
  animate,
}: VennDiagramProps) {
  const size = 400;
  const cx = size / 2;
  const cy = size / 2;
  const radius = sets.length === 2 ? 110 : 90;
  const offset = sets.length === 2 ? 60 : 70;

  // Positions for 2 or 3 circles
  const positions =
    sets.length === 2
      ? [
          { x: cx - offset, y: cy },
          { x: cx + offset, y: cy },
        ]
      : [
          { x: cx, y: cy - offset * 0.6 },
          { x: cx - offset * 0.7, y: cy + offset * 0.5 },
          { x: cx + offset * 0.7, y: cy + offset * 0.5 },
        ];

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={`sm-venn-diagram ${animate ? 'sm-fade-in' : ''} ${className}`.trim()}
      style={style}
      role="img"
    >
      {sets.map((set, i) => {
        const pos = positions[i] || positions[0];
        return (
          <g
            key={i}
            className={animate === 'stagger' ? 'sm-fade-in' : ''}
            style={
              animate === 'stagger'
                ? ({ animationDelay: `${i * 0.15}s` } as CSSProperties)
                : undefined
            }
          >
            <circle
              cx={pos.x}
              cy={pos.y}
              r={radius}
              fill={CHART_COLORS[i % CHART_COLORS.length]}
              opacity={0.3}
              stroke={CHART_COLORS[i % CHART_COLORS.length]}
              strokeWidth={2}
            />
            <text
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="currentColor"
              fontSize={13}
              fontWeight="600"
            >
              {set.label}
            </text>
          </g>
        );
      })}
      {intersection && (
        <text
          x={cx}
          y={sets.length === 2 ? cy : cy + 10}
          textAnchor="middle"
          dominantBaseline="central"
          fill="currentColor"
          fontSize={11}
          fontWeight="700"
        >
          {intersection}
        </text>
      )}
    </svg>
  );
}
