import type { CSSProperties } from 'react';

export interface FunnelChartProps {
  stages: Array<{ label: string; value?: number }>;
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

export function FunnelChart({
  stages,
  className = '',
  style,
  animate,
}: FunnelChartProps) {
  const n = stages.length;
  const width = 400;
  const layerHeight = 50;
  const totalHeight = n * layerHeight + 20;
  const cx = width / 2;
  const maxWidth = 360;
  const minWidth = 80;

  return (
    <svg
      viewBox={`0 0 ${width} ${totalHeight}`}
      className={`sm-funnel-chart ${animate ? 'sm-fade-in' : ''} ${className}`.trim()}
      style={style}
      role="img"
    >
      {stages.map((stage, i) => {
        const topWidth = maxWidth - (i / Math.max(n - 1, 1)) * (maxWidth - minWidth);
        const bottomWidth =
          i < n - 1
            ? maxWidth - ((i + 1) / Math.max(n - 1, 1)) * (maxWidth - minWidth)
            : minWidth;
        const y = i * layerHeight + 10;
        const color = CHART_COLORS[i % CHART_COLORS.length];

        const tl = cx - topWidth / 2;
        const tr = cx + topWidth / 2;
        const bl = cx - bottomWidth / 2;
        const br = cx + bottomWidth / 2;

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
            <polygon
              points={`${tl},${y} ${tr},${y} ${br},${y + layerHeight} ${bl},${y + layerHeight}`}
              fill={color}
            />
            <text
              x={cx}
              y={y + layerHeight / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fill="var(--sm-bg)"
              fontSize={13}
            >
              {stage.label}
              {stage.value != null ? ` (${stage.value})` : ''}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
