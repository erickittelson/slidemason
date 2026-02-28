import type { CSSProperties } from 'react';

export interface WaterfallChartProps {
  items: Array<{ label: string; value: number }>;
  startLabel?: string;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function WaterfallChart({
  items,
  startLabel = 'Start',
  className,
  style,
  animate,
}: WaterfallChartProps) {
  // Calculate running totals
  const cumulative: number[] = [];
  let running = 0;
  for (const item of items) {
    cumulative.push(running);
    running += item.value;
  }

  const allValues = [0, ...cumulative, running];
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);
  const range = maxVal - minVal || 1;

  const padding = { top: 10, right: 10, bottom: 30, left: 10 };
  const barWidth = 32;
  const barGap = 8;
  const chartWidth = padding.left + padding.right + (items.length + 1) * (barWidth + barGap);
  const chartHeight = 180;
  const plotHeight = chartHeight - padding.top - padding.bottom;

  function yScale(v: number) {
    return padding.top + (1 - (v - minVal) / range) * plotHeight;
  }

  return (
    <svg
      width={chartWidth}
      height={chartHeight}
      className={className}
      style={style}
      role="img"
      aria-label="Waterfall chart"
    >
      {/* Start bar */}
      <rect
        x={padding.left}
        y={yScale(0)}
        width={barWidth}
        height={0.5}
        fill="var(--sm-muted, #9ca3af)"
      />
      <text
        x={padding.left + barWidth / 2}
        y={chartHeight - padding.bottom + 14}
        textAnchor="middle"
        fontSize={9}
        fill="currentColor"
      >
        {startLabel}
      </text>

      {items.map((item, i) => {
        const x = padding.left + (i + 1) * (barWidth + barGap);
        const start = cumulative[i];
        const end = start + item.value;
        const yTop = yScale(Math.max(start, end));
        const yBot = yScale(Math.min(start, end));
        const h = Math.max(1, yBot - yTop);
        const isPositive = item.value >= 0;

        return (
          <g key={i}>
            {/* Connector line */}
            <line
              x1={x - barGap}
              y1={yScale(start)}
              x2={x}
              y2={yScale(start)}
              stroke="var(--sm-muted, #9ca3af)"
              strokeWidth={1}
              strokeDasharray="2,2"
            />
            <rect
              x={x}
              y={yTop}
              width={barWidth}
              height={h}
              fill={isPositive ? 'var(--sm-success, #10b981)' : 'var(--sm-danger, #ef4444)'}
              rx={2}
              style={
                animate
                  ? {
                      animation: `sm-fade-in 0.3s ease-out ${animate === 'stagger' ? `${i * 0.08}s` : '0s'} both`,
                    }
                  : undefined
              }
            />
            <text
              x={x + barWidth / 2}
              y={chartHeight - padding.bottom + 14}
              textAnchor="middle"
              fontSize={9}
              fill="currentColor"
            >
              {item.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
