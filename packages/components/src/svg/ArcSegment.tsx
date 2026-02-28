import type { CSSProperties } from 'react';

export interface ArcSegmentProps {
  cx: number;
  cy: number;
  radius: number;
  startAngle: number;
  endAngle: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
  style?: CSSProperties;
  animate?: boolean;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export function ArcSegment({
  cx,
  cy,
  radius,
  startAngle,
  endAngle,
  color = 'var(--sm-primary)',
  strokeWidth = 4,
  className = '',
  style,
  animate,
}: ArcSegmentProps) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const sweep = endAngle - startAngle;
  const largeArc = sweep > 180 ? 1 : 0;
  const arcLength = (sweep / 360) * 2 * Math.PI * radius;

  const d = `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y}`;

  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      className={`${animate ? 'sm-draw' : ''} ${className}`.trim()}
      style={
        animate
          ? ({ ...style, '--sm-path-length': arcLength } as CSSProperties)
          : style
      }
      strokeDasharray={animate ? arcLength : undefined}
    />
  );
}
