import type { CSSProperties } from 'react';

export interface PyramidLayerProps {
  cx: number;
  cy: number;
  level: number;
  totalLevels: number;
  totalHeight?: number;
  totalWidth?: number;
  label?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  fontSize?: number;
  className?: string;
  style?: CSSProperties;
  animate?: boolean;
}

export function PyramidLayer({
  cx,
  cy,
  level,
  totalLevels,
  totalHeight = 200,
  totalWidth = 200,
  label,
  fill = 'var(--sm-primary)',
  stroke = 'var(--sm-border, #fff)',
  strokeWidth = 1,
  fontSize = 12,
  className = '',
  style,
  animate,
}: PyramidLayerProps) {
  const layerHeight = totalHeight / totalLevels;
  const topY = cy - totalHeight / 2 + level * layerHeight;
  const bottomY = topY + layerHeight;

  // Width grows linearly from top (narrow) to bottom (wide)
  const topWidthFrac = (level / totalLevels) * totalWidth;
  const bottomWidthFrac = ((level + 1) / totalLevels) * totalWidth;

  const points = [
    `${cx - topWidthFrac / 2},${topY}`,
    `${cx + topWidthFrac / 2},${topY}`,
    `${cx + bottomWidthFrac / 2},${bottomY}`,
    `${cx - bottomWidthFrac / 2},${bottomY}`,
  ].join(' ');

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
          x={cx}
          y={topY + layerHeight / 2}
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
