import type { CSSProperties } from 'react';

export interface FunnelTrapezoidProps {
  x: number;
  y: number;
  topWidth: number;
  bottomWidth: number;
  height: number;
  label?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  fontSize?: number;
  className?: string;
  style?: CSSProperties;
  animate?: boolean;
}

export function FunnelTrapezoid({
  x,
  y,
  topWidth,
  bottomWidth,
  height,
  label,
  fill = 'var(--sm-primary)',
  stroke = 'var(--sm-border, none)',
  strokeWidth = 1,
  fontSize = 14,
  className = '',
  style,
  animate,
}: FunnelTrapezoidProps) {
  const topLeft = x - topWidth / 2;
  const topRight = x + topWidth / 2;
  const bottomLeft = x - bottomWidth / 2;
  const bottomRight = x + bottomWidth / 2;

  const points = `${topLeft},${y} ${topRight},${y} ${bottomRight},${y + height} ${bottomLeft},${y + height}`;

  return (
    <g
      className={`${animate ? 'sm-fade-in' : ''} ${className}`.trim()}
      style={style}
    >
      <polygon
        points={points}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      {label && (
        <text
          x={x}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fill="currentColor"
          fontSize={fontSize}
        >
          {label}
        </text>
      )}
    </g>
  );
}
