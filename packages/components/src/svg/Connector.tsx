import type { CSSProperties } from 'react';

export interface ConnectorProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  curvature?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
  style?: CSSProperties;
  animate?: boolean;
}

export function Connector({
  x1,
  y1,
  x2,
  y2,
  curvature = 0.3,
  color = 'var(--sm-primary)',
  strokeWidth = 2,
  className = '',
  style,
  animate,
}: ConnectorProps) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const length = Math.sqrt(dx * dx + dy * dy);

  // Offset the control point perpendicular to the line
  const nx = -dy * curvature;
  const ny = dx * curvature;
  const cx = mx + nx;
  const cy = my + ny;

  const d = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;

  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      className={`${animate ? 'sm-draw' : ''} ${className}`.trim()}
      style={
        animate
          ? ({ ...style, '--sm-path-length': length } as CSSProperties)
          : style
      }
      strokeDasharray={animate ? length : undefined}
    />
  );
}
