import type { CSSProperties } from 'react';

export interface BarChartProps {
  bars: Array<{ label: string; value: number }>;
  direction?: 'horizontal' | 'vertical';
  max?: number;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function BarChart({
  bars,
  direction = 'vertical',
  max: maxProp,
  className,
  style,
  animate,
}: BarChartProps) {
  const max = maxProp ?? Math.max(...bars.map((b) => b.value), 1);
  const isVertical = direction === 'vertical';

  const padding = 40;
  const barGap = 8;

  if (isVertical) {
    const barWidth = Math.max(20, (300 - padding * 2) / bars.length - barGap);
    const chartWidth = padding * 2 + bars.length * (barWidth + barGap);
    const chartHeight = 200;
    const plotHeight = chartHeight - padding - 20;

    return (
      <svg
        width={chartWidth}
        height={chartHeight}
        className={className}
        style={style}
        role="img"
        aria-label="Bar chart"
      >
        {bars.map((bar, i) => {
          const barHeight = (bar.value / max) * plotHeight;
          const x = padding + i * (barWidth + barGap);
          const y = chartHeight - padding - barHeight;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill="var(--sm-chart-1, #3b82f6)"
                rx={2}
                style={
                  animate
                    ? {
                        animation: `sm-grow-up 0.4s ease-out ${animate === 'stagger' ? `${i * 0.08}s` : '0s'} both`,
                        transformOrigin: `${x + barWidth / 2}px ${chartHeight - padding}px`,
                      }
                    : undefined
                }
              />
              <text
                x={x + barWidth / 2}
                y={chartHeight - padding + 14}
                textAnchor="middle"
                fontSize={10}
                fill="currentColor"
              >
                {bar.label}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }

  // Horizontal
  const barHeight = Math.max(16, (200 - padding) / bars.length - barGap);
  const chartWidth = 300;
  const chartHeight = padding + bars.length * (barHeight + barGap);
  const plotWidth = chartWidth - padding - 10;

  return (
    <svg
      width={chartWidth}
      height={chartHeight}
      className={className}
      style={style}
      role="img"
      aria-label="Bar chart"
    >
      {bars.map((bar, i) => {
        const w = (bar.value / max) * plotWidth;
        const y = padding / 2 + i * (barHeight + barGap);
        return (
          <g key={i}>
            <rect
              x={padding}
              y={y}
              width={w}
              height={barHeight}
              fill="var(--sm-chart-1, #3b82f6)"
              rx={2}
              style={
                animate
                  ? {
                      animation: `sm-grow-right 0.4s ease-out ${animate === 'stagger' ? `${i * 0.08}s` : '0s'} both`,
                    }
                  : undefined
              }
            />
            <text
              x={padding - 4}
              y={y + barHeight / 2 + 4}
              textAnchor="end"
              fontSize={10}
              fill="currentColor"
            >
              {bar.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
