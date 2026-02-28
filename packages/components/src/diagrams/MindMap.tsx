import type { CSSProperties } from 'react';

export interface MindMapProps {
  center: string;
  branches: Array<{ label: string; children?: string[] }>;
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

export function MindMap({
  center,
  branches,
  className = '',
  style,
  animate,
}: MindMapProps) {
  const size = 500;
  const cx = size / 2;
  const cy = size / 2;
  const centerRadius = 40;
  const branchRadius = 25;
  const childRadius = 18;
  const branchDistance = 140;
  const childDistance = 80;
  const n = branches.length;
  const angleStep = 360 / n;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={`sm-mind-map ${animate ? 'sm-fade-in' : ''} ${className}`.trim()}
      style={style}
      role="img"
    >
      {/* Branch lines and nodes */}
      {branches.map((branch, i) => {
        const angle = i * angleStep;
        const pos = polarToCartesian(cx, cy, branchDistance, angle);
        const color = CHART_COLORS[i % CHART_COLORS.length];
        const childCount = branch.children?.length || 0;

        return (
          <g
            key={i}
            className={animate === 'stagger' ? 'sm-fade-in' : ''}
            style={
              animate === 'stagger'
                ? ({ animationDelay: `${(i + 1) * 0.1}s` } as CSSProperties)
                : undefined
            }
          >
            {/* Line from center to branch */}
            <line
              x1={cx}
              y1={cy}
              x2={pos.x}
              y2={pos.y}
              stroke={color}
              strokeWidth={2}
            />

            {/* Branch circle */}
            <circle cx={pos.x} cy={pos.y} r={branchRadius} fill={color} opacity={0.85} />
            <text
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#fff"
              fontSize={10}
            >
              {branch.label}
            </text>

            {/* Children */}
            {branch.children?.map((child, j) => {
              const childAngleSpread = Math.min(40, 80 / Math.max(childCount, 1));
              const baseAngle = angle - ((childCount - 1) * childAngleSpread) / 2;
              const childAngle = baseAngle + j * childAngleSpread;
              const childPos = polarToCartesian(pos.x, pos.y, childDistance, childAngle);

              return (
                <g key={j}>
                  <line
                    x1={pos.x}
                    y1={pos.y}
                    x2={childPos.x}
                    y2={childPos.y}
                    stroke={color}
                    strokeWidth={1.5}
                    opacity={0.6}
                  />
                  <circle
                    cx={childPos.x}
                    cy={childPos.y}
                    r={childRadius}
                    fill={color}
                    opacity={0.5}
                  />
                  <text
                    x={childPos.x}
                    y={childPos.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="currentColor"
                    fontSize={9}
                  >
                    {child}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}

      {/* Center node (drawn last to be on top) */}
      <circle
        cx={cx}
        cy={cy}
        r={centerRadius}
        fill="var(--sm-primary, #3b82f6)"
      />
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#fff"
        fontSize={13}
        fontWeight="600"
      >
        {center}
      </text>
    </svg>
  );
}
