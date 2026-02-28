import type { CSSProperties } from 'react';

export interface CycleDiagramProps {
  stages: Array<{ label: string }>;
  size?: number;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

const CHART_COLORS = [
  'var(--sm-chart-1, #3b82f6)',
  'var(--sm-chart-2, #10b981)',
  'var(--sm-chart-3, #f59e0b)',
  'var(--sm-chart-4, #ef4444)',
  'var(--sm-chart-5, #8b5cf6)',
  'var(--sm-chart-6, #ec4899)',
];

export function CycleDiagram({
  stages,
  size = 400,
  className = '',
  style,
  animate,
}: CycleDiagramProps) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.32;
  const nodeRadius = size * 0.08;
  const n = stages.length;
  const angleStep = 360 / n;

  const nodePositions = stages.map((_, i) => {
    const angle = i * angleStep;
    return polarToCartesian(cx, cy, radius, angle);
  });

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={`sm-cycle-diagram ${animate ? 'sm-fade-in' : ''} ${className}`.trim()}
      style={style}
      role="img"
    >
      <defs>
        <marker
          id="sm-cycle-arrow"
          markerWidth="8"
          markerHeight="6"
          refX="8"
          refY="3"
          orient="auto"
        >
          <polygon points="0,0 8,3 0,6" fill="var(--sm-primary, #3b82f6)" />
        </marker>
      </defs>

      {/* Curved arrows between nodes */}
      {nodePositions.map((from, i) => {
        const to = nodePositions[(i + 1) % n];
        const midAngle = (i * angleStep + (i + 1) * angleStep) / 2;
        const ctrl = polarToCartesian(cx, cy, radius * 0.65, midAngle);
        return (
          <path
            key={`arrow-${i}`}
            d={`M ${from.x} ${from.y} Q ${ctrl.x} ${ctrl.y} ${to.x} ${to.y}`}
            fill="none"
            stroke="var(--sm-primary, #3b82f6)"
            strokeWidth={2}
            markerEnd="url(#sm-cycle-arrow)"
          />
        );
      })}

      {/* Stage nodes */}
      {stages.map((stage, i) => {
        const pos = nodePositions[i];
        const color = CHART_COLORS[i % CHART_COLORS.length];
        return (
          <g
            key={i}
            className={animate === 'stagger' ? 'sm-fade-in' : ''}
            style={
              animate === 'stagger'
                ? ({ animationDelay: `${i * 0.1}s` } as CSSProperties)
                : undefined
            }
          >
            <circle
              cx={pos.x}
              cy={pos.y}
              r={nodeRadius}
              fill={color}
              opacity={0.9}
            />
            <text
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="var(--sm-bg)"
              fontSize={11}
            >
              {stage.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
