import type { CSSProperties } from 'react';

export interface BoxNodeProps {
  x: number;
  y: number;
  width?: number;
  height?: number;
  label?: string;
  rx?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  fontSize?: number;
  className?: string;
  style?: CSSProperties;
  animate?: boolean;
}

export function BoxNode({
  x,
  y,
  width = 120,
  height = 50,
  label,
  rx = 8,
  fill = 'var(--sm-surface, #fff)',
  stroke = 'var(--sm-primary)',
  strokeWidth = 2,
  fontSize = 14,
  className = '',
  style,
  animate,
}: BoxNodeProps) {
  return (
    <g
      className={`${animate ? 'sm-fade-in' : ''} ${className}`.trim()}
      style={style}
    >
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={rx}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      {label && (
        <text
          x={x + width / 2}
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
