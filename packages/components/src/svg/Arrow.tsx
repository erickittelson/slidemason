import type { CSSProperties } from 'react';

export interface ArrowProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
  style?: CSSProperties;
  animate?: boolean;
}

export function Arrow({
  x1,
  y1,
  x2,
  y2,
  color = 'var(--sm-primary)',
  strokeWidth = 2,
  className = '',
  style,
  animate,
}: ArrowProps) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  const length = Math.sqrt(dx * dx + dy * dy);
  const headSize = 8;

  return (
    <g
      className={`${animate ? 'sm-draw' : ''} ${className}`.trim()}
      style={style}
    >
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={animate ? length : undefined}
        style={
          animate
            ? ({ '--sm-path-length': length } as CSSProperties)
            : undefined
        }
      />
      <polygon
        points={`0,-${headSize / 2} ${headSize},0 0,${headSize / 2}`}
        fill={color}
        transform={`translate(${x2},${y2}) rotate(${angle})`}
      />
    </g>
  );
}
