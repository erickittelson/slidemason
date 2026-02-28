import type { CSSProperties } from 'react';

export interface MatrixQuadrantProps {
  title?: string;
  xAxis: string;
  yAxis: string;
  quadrants: [string, string, string, string];
  items?: Array<{ label: string; x: number; y: number }>;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function MatrixQuadrant({
  title,
  xAxis,
  yAxis,
  quadrants,
  items,
  className = '',
  style,
  animate,
}: MatrixQuadrantProps) {
  const size = 400;
  const margin = 50;
  const gridSize = size - margin * 2;
  const half = gridSize / 2;
  const ox = margin;
  const oy = margin;

  return (
    <svg
      viewBox={`0 0 ${size} ${size + (title ? 30 : 0)}`}
      className={`sm-matrix-quadrant ${animate ? 'sm-fade-in' : ''} ${className}`.trim()}
      style={style}
      role="img"
    >
      {title && (
        <text
          x={size / 2}
          y={20}
          textAnchor="middle"
          fill="currentColor"
          fontSize={16}
          fontWeight="600"
        >
          {title}
        </text>
      )}

      <g transform={title ? 'translate(0, 25)' : undefined}>
        {/* Grid background */}
        <rect
          x={ox}
          y={oy}
          width={gridSize}
          height={gridSize}
          fill="var(--sm-surface, #f9fafb)"
          stroke="var(--sm-border, #d1d5db)"
          strokeWidth={1}
        />

        {/* Cross lines */}
        <line
          x1={ox + half}
          y1={oy}
          x2={ox + half}
          y2={oy + gridSize}
          stroke="var(--sm-border, #d1d5db)"
          strokeWidth={1}
        />
        <line
          x1={ox}
          y1={oy + half}
          x2={ox + gridSize}
          y2={oy + half}
          stroke="var(--sm-border, #d1d5db)"
          strokeWidth={1}
        />

        {/* Quadrant labels: [top-left, top-right, bottom-left, bottom-right] */}
        {[
          { x: ox + half / 2, y: oy + half / 2 },
          { x: ox + half + half / 2, y: oy + half / 2 },
          { x: ox + half / 2, y: oy + half + half / 2 },
          { x: ox + half + half / 2, y: oy + half + half / 2 },
        ].map((pos, i) => (
          <text
            key={i}
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="central"
            fill="currentColor"
            fontSize={11}
            opacity={0.6}
          >
            {quadrants[i]}
          </text>
        ))}

        {/* Axis labels */}
        <text
          x={ox + gridSize / 2}
          y={oy + gridSize + 20}
          textAnchor="middle"
          fill="currentColor"
          fontSize={12}
          fontWeight="500"
        >
          {xAxis}
        </text>
        <text
          x={ox - 15}
          y={oy + gridSize / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fill="currentColor"
          fontSize={12}
          fontWeight="500"
          transform={`rotate(-90, ${ox - 15}, ${oy + gridSize / 2})`}
        >
          {yAxis}
        </text>

        {/* Items */}
        {items?.map((item, i) => {
          const px = ox + (item.x / 100) * gridSize;
          const py = oy + gridSize - (item.y / 100) * gridSize;
          return (
            <g
              key={i}
              className={animate === 'stagger' ? 'sm-fade-in' : ''}
              style={
                animate === 'stagger'
                  ? ({ animationDelay: `${i * 0.1}s` } as CSSProperties)
                  : undefined
              }
            >
              <circle
                cx={px}
                cy={py}
                r={5}
                fill="var(--sm-primary, #3b82f6)"
              />
              <text
                x={px + 8}
                y={py}
                dominantBaseline="central"
                fill="currentColor"
                fontSize={10}
              >
                {item.label}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
