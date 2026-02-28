import type { CSSProperties } from 'react';

export interface LoopDiagramProps {
  stages: Array<{ label: string }>;
  direction?: 'clockwise' | 'counterclockwise';
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

export function LoopDiagram({
  stages,
  direction = 'clockwise',
  className = '',
  style,
  animate,
}: LoopDiagramProps) {
  const size = 400;
  const cx = size / 2;
  const cy = size / 2;
  const arrowRadius = size * 0.35;
  const nodeRadius = size * 0.07;
  const n = stages.length;
  const angleStep = 360 / n;

  // Continuous circular arrow path
  const arrowPath = (() => {
    const r = arrowRadius;
    // Nearly full circle arc
    const gapAngle = 20;
    const startAngle = direction === 'clockwise' ? gapAngle / 2 : 360 - gapAngle / 2;
    const endAngle = direction === 'clockwise' ? 360 - gapAngle / 2 : gapAngle / 2;

    const start = polarToCartesian(cx, cy, r, startAngle);
    const end = polarToCartesian(cx, cy, r, endAngle);
    const sweepFlag = direction === 'clockwise' ? 1 : 0;

    return `M ${start.x} ${start.y} A ${r} ${r} 0 1 ${sweepFlag} ${end.x} ${end.y}`;
  })();

  // Arrowhead at end of arc
  const arrowheadAngle =
    direction === 'clockwise' ? 360 - 10 : 10;
  const arrowTip = polarToCartesian(cx, cy, arrowRadius, arrowheadAngle);
  const arrowLeft = polarToCartesian(
    cx,
    cy,
    arrowRadius - 8,
    arrowheadAngle + (direction === 'clockwise' ? -8 : 8)
  );
  const arrowRight = polarToCartesian(
    cx,
    cy,
    arrowRadius + 8,
    arrowheadAngle + (direction === 'clockwise' ? -8 : 8)
  );

  const nodePositions = stages.map((_, i) => {
    const angle = i * angleStep;
    return polarToCartesian(cx, cy, arrowRadius, angle);
  });

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={`sm-loop-diagram ${animate ? 'sm-fade-in' : ''} ${className}`.trim()}
      style={style}
      role="img"
    >
      {/* Continuous arrow loop */}
      <path
        d={arrowPath}
        fill="none"
        stroke="var(--sm-border, #d1d5db)"
        strokeWidth={3}
      />
      <polygon
        points={`${arrowTip.x},${arrowTip.y} ${arrowLeft.x},${arrowLeft.y} ${arrowRight.x},${arrowRight.y}`}
        fill="var(--sm-border, #d1d5db)"
      />

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
            <circle cx={pos.x} cy={pos.y} r={nodeRadius} fill={color} opacity={0.9} />
            <text
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="var(--sm-bg)"
              fontSize={10}
            >
              {stage.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
