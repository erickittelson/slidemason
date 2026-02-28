import type { CSSProperties } from 'react';

export interface StackedBarProps {
  bars: Array<{
    label: string;
    segments: Array<{ value: number; label?: string }>;
  }>;
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

export function StackedBar({ bars, className, style, animate }: StackedBarProps) {
  const maxTotal = Math.max(...bars.map((b) => b.segments.reduce((s, seg) => s + seg.value, 0)), 1);

  const padding = 50;
  const barHeight = 24;
  const barGap = 12;
  const chartWidth = 350;
  const plotWidth = chartWidth - padding - 10;
  const chartHeight = padding / 2 + bars.length * (barHeight + barGap) + 40;

  // Collect unique segment labels for legend
  const allSegmentLabels: string[] = [];
  bars.forEach((b) =>
    b.segments.forEach((seg, si) => {
      const lbl = seg.label ?? `Segment ${si + 1}`;
      if (!allSegmentLabels.includes(lbl)) allSegmentLabels.push(lbl);
    })
  );

  return (
    <svg
      width={chartWidth}
      height={chartHeight}
      className={className}
      style={style}
      role="img"
      aria-label="Stacked bar chart"
    >
      {bars.map((bar, bi) => {
        const y = padding / 2 + bi * (barHeight + barGap);
        let xOffset = 0;
        return (
          <g key={bi}>
            <text
              x={padding - 4}
              y={y + barHeight / 2 + 4}
              textAnchor="end"
              fontSize={10}
              fill="currentColor"
            >
              {bar.label}
            </text>
            {bar.segments.map((seg, si) => {
              const w = (seg.value / maxTotal) * plotWidth;
              const x = padding + xOffset;
              xOffset += w;
              return (
                <rect
                  key={si}
                  x={x}
                  y={y}
                  width={w}
                  height={barHeight}
                  fill={CHART_COLORS[si % CHART_COLORS.length]}
                  rx={si === 0 ? 2 : 0}
                  style={
                    animate
                      ? {
                          animation: `sm-fade-in 0.3s ease-out ${animate === 'stagger' ? `${(bi * bar.segments.length + si) * 0.05}s` : '0s'} both`,
                        }
                      : undefined
                  }
                />
              );
            })}
          </g>
        );
      })}
      {/* Legend */}
      {allSegmentLabels.map((lbl, i) => {
        const lx = padding + i * 80;
        const ly = chartHeight - 16;
        return (
          <g key={i}>
            <rect x={lx} y={ly} width={10} height={10} fill={CHART_COLORS[i % CHART_COLORS.length]} rx={2} />
            <text x={lx + 14} y={ly + 9} fontSize={9} fill="currentColor">
              {lbl}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
