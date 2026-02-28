import type { CSSProperties } from 'react';

export interface DonutChartProps {
  segments: Array<{ label: string; value: number }>;
  centerLabel?: string;
  size?: number;
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

export function DonutChart({
  segments,
  centerLabel,
  size = 200,
  className,
  style,
  animate,
}: DonutChartProps) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 20;
  const strokeWidth = radius * 0.35;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;

  return (
    <svg
      width={size}
      height={size}
      className={className}
      style={style}
      role="img"
      aria-label="Donut chart"
    >
      {segments.map((seg, i) => {
        const segLen = (seg.value / total) * circumference;
        const dashArray = `${segLen} ${circumference - segLen}`;
        const dashOffset = -offset;
        offset += segLen;
        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={CHART_COLORS[i % CHART_COLORS.length]}
            strokeWidth={strokeWidth}
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${cx} ${cy})`}
            style={
              animate
                ? {
                    animation: `sm-fade-in 0.4s ease-out ${animate === 'stagger' ? `${i * 0.1}s` : '0s'} both`,
                  }
                : undefined
            }
          />
        );
      })}
      {centerLabel && (
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={size * 0.1}
          fill="currentColor"
          fontWeight="bold"
        >
          {centerLabel}
        </text>
      )}
    </svg>
  );
}
