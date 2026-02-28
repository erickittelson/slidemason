import type { CSSProperties } from 'react';

export interface CircleNodeProps {
  cx: number;
  cy: number;
  r?: number;
  label?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  fontSize?: number;
  className?: string;
  style?: CSSProperties;
  animate?: boolean;
}

export function CircleNode({
  cx,
  cy,
  r = 30,
  label,
  fill = 'var(--sm-surface, #fff)',
  stroke = 'var(--sm-primary)',
  strokeWidth = 2,
  fontSize = 14,
  className = '',
  style,
  animate,
}: CircleNodeProps) {
  return (
    <g
      className={`${animate ? 'sm-fade-in' : ''} ${className}`.trim()}
      style={style}
    >
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      {label && (
        <text
          x={cx}
          y={cy}
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
