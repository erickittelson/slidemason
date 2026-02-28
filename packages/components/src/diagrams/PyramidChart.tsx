import type { CSSProperties } from 'react';

export interface PyramidChartProps {
  layers: Array<{ label: string }>;
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

export function PyramidChart({
  layers,
  className = '',
  style,
  animate,
}: PyramidChartProps) {
  const width = 400;
  const totalHeight = 350;
  const n = layers.length;
  const layerHeight = totalHeight / n;
  const cx = width / 2;
  const maxWidth = 360;

  return (
    <svg
      viewBox={`0 0 ${width} ${totalHeight + 20}`}
      className={`sm-pyramid-chart ${animate ? 'sm-fade-in' : ''} ${className}`.trim()}
      style={style}
      role="img"
    >
      {layers.map((layer, i) => {
        const topFrac = i / n;
        const bottomFrac = (i + 1) / n;
        const topWidth = topFrac * maxWidth;
        const bottomWidth = bottomFrac * maxWidth;
        const y = i * layerHeight + 10;
        const color = CHART_COLORS[i % CHART_COLORS.length];

        const points = [
          `${cx - topWidth / 2},${y}`,
          `${cx + topWidth / 2},${y}`,
          `${cx + bottomWidth / 2},${y + layerHeight}`,
          `${cx - bottomWidth / 2},${y + layerHeight}`,
        ].join(' ');

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
            <polygon points={points} fill={color} stroke="var(--sm-bg)" strokeWidth={1} />
            <text
              x={cx}
              y={y + layerHeight / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fill="var(--sm-bg)"
              fontSize={13}
            >
              {layer.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
