import type { CSSProperties } from 'react';

export interface HarveyBallProps {
  value: 0 | 25 | 50 | 75 | 100;
  size?: number;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export function HarveyBall({
  value,
  size = 24,
  className,
  style,
  animate,
}: HarveyBallProps) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 1;

  let fillPath: string | null = null;

  if (value === 100) {
    // Full circle
    fillPath = `M ${cx - radius} ${cy} A ${radius} ${radius} 0 1 1 ${cx + radius} ${cy} A ${radius} ${radius} 0 1 1 ${cx - radius} ${cy}`;
  } else if (value > 0) {
    const endAngle = (value / 100) * 360;
    const end = polarToCartesian(cx, cy, radius, endAngle);
    const start = polarToCartesian(cx, cy, radius, 0);
    const largeArc = endAngle > 180 ? 1 : 0;
    fillPath = `M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
  }

  return (
    <svg
      width={size}
      height={size}
      className={className}
      style={style}
      role="img"
      aria-label={`Harvey ball: ${value}%`}
    >
      {/* Background circle */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="var(--sm-muted, #e5e7eb)"
        strokeWidth={1.5}
      />
      {/* Fill */}
      {fillPath && (
        <path
          d={fillPath}
          fill="currentColor"
          style={animate ? { animation: 'sm-fade-in 0.3s ease-out both' } : undefined}
        />
      )}
    </svg>
  );
}
