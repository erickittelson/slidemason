import type { CSSProperties } from 'react';

export interface HubSpokeProps {
  center: string;
  spokes: Array<{ label: string }>;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export function HubSpoke({
  center,
  spokes,
  className = '',
  style,
  animate,
}: HubSpokeProps) {
  const size = 400;
  const cx = size / 2;
  const cy = size / 2;
  const hubRadius = 40;
  const spokeRadius = 30;
  const spokeDistance = 140;
  const n = spokes.length;
  const angleStep = 360 / n;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={`sm-hub-spoke ${animate ? 'sm-fade-in' : ''} ${className}`.trim()}
      style={style}
      role="img"
    >
      {/* Spoke lines and nodes */}
      {spokes.map((spoke, i) => {
        const angle = i * angleStep;
        const pos = polarToCartesian(cx, cy, spokeDistance, angle);

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
            <line
              x1={cx}
              y1={cy}
              x2={pos.x}
              y2={pos.y}
              stroke="var(--sm-border, #d1d5db)"
              strokeWidth={2}
            />
            <circle
              cx={pos.x}
              cy={pos.y}
              r={spokeRadius}
              fill="var(--sm-surface, #fff)"
              stroke="var(--sm-primary, #3b82f6)"
              strokeWidth={2}
            />
            <text
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="currentColor"
              fontSize={10}
            >
              {spoke.label}
            </text>
          </g>
        );
      })}

      {/* Central hub (on top) */}
      <circle
        cx={cx}
        cy={cy}
        r={hubRadius}
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
