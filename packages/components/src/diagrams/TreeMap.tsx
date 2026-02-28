import type { CSSProperties } from 'react';

export interface TreeMapProps {
  items: Array<{ label: string; value: number }>;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

const CHART_COLORS = [
  'var(--sm-chart-1, #3b82f6)',
  'var(--sm-chart-2, #10b981)',
  'var(--sm-chart-3, #f59e0b)',
  'var(--sm-chart-4, #ef4444)',
  'var(--sm-chart-5, #8b5cf6)',
  'var(--sm-chart-6, #ec4899)',
];

export function TreeMap({
  items,
  className = '',
  style,
  animate,
}: TreeMapProps) {
  const width = 500;
  const height = 300;
  const total = items.reduce((s, item) => s + item.value, 0);

  // Simple horizontal strip layout: proportional widths
  let currentX = 0;
  const rects = items.map((item, i) => {
    const w = total > 0 ? (item.value / total) * width : width / items.length;
    const x = currentX;
    currentX += w;
    return { ...item, x, w, color: CHART_COLORS[i % CHART_COLORS.length] };
  });

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`sm-tree-map ${animate ? 'sm-fade-in' : ''} ${className}`.trim()}
      style={style}
      role="img"
    >
      {rects.map((rect, i) => (
        <g
          key={i}
          className={animate === 'stagger' ? 'sm-fade-in' : ''}
          style={
            animate === 'stagger'
              ? ({ animationDelay: `${i * 0.08}s` } as CSSProperties)
              : undefined
          }
        >
          <rect
            x={rect.x}
            y={0}
            width={rect.w}
            height={height}
            fill={rect.color}
            stroke="var(--sm-bg)"
            strokeWidth={2}
          />
          {rect.w > 30 && (
            <text
              x={rect.x + rect.w / 2}
              y={height / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fill="var(--sm-bg)"
              fontSize={12}
            >
              {rect.label}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}
