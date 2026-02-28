import type { CSSProperties } from 'react';

export interface BridgeDiagramProps {
  start: { label: string; value: number };
  changes: Array<{ label: string; value: number }>;
  end: { label: string; value: number };
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function BridgeDiagram({
  start,
  changes,
  end,
  className = '',
  style,
  animate,
}: BridgeDiagramProps) {
  const barWidth = 50;
  const gap = 20;
  const totalBars = 2 + changes.length; // start + changes + end
  const width = totalBars * (barWidth + gap) + gap;
  const height = 300;
  const chartTop = 40;
  const chartBottom = height - 40;
  const chartHeight = chartBottom - chartTop;

  // Find min/max for scaling
  let runningValue = start.value;
  let minVal = Math.min(start.value, end.value);
  let maxVal = Math.max(start.value, end.value);
  for (const change of changes) {
    runningValue += change.value;
    minVal = Math.min(minVal, runningValue);
    maxVal = Math.max(maxVal, runningValue);
  }

  const range = maxVal - minVal || 1;
  const scale = (v: number) => chartBottom - ((v - minVal) / range) * chartHeight;

  // Build bars
  const bars: Array<{
    label: string;
    top: number;
    bottom: number;
    color: string;
    isChange: boolean;
  }> = [];

  // Start bar
  bars.push({
    label: start.label,
    top: scale(start.value),
    bottom: scale(0 > minVal ? 0 : minVal),
    color: 'var(--sm-primary, #3b82f6)',
    isChange: false,
  });

  // Change bars (floating)
  let current = start.value;
  for (const change of changes) {
    const prev = current;
    current += change.value;
    const top = scale(Math.max(prev, current));
    const bottom = scale(Math.min(prev, current));
    bars.push({
      label: change.label,
      top,
      bottom,
      color:
        change.value >= 0
          ? 'var(--sm-success, #10b981)'
          : 'var(--sm-danger, #ef4444)',
      isChange: true,
    });
  }

  // End bar
  bars.push({
    label: end.label,
    top: scale(end.value),
    bottom: scale(0 > minVal ? 0 : minVal),
    color: 'var(--sm-primary, #3b82f6)',
    isChange: false,
  });

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`sm-bridge-diagram ${animate ? 'sm-fade-in' : ''} ${className}`.trim()}
      style={style}
      role="img"
    >
      {bars.map((bar, i) => {
        const x = gap + i * (barWidth + gap);
        const barH = Math.max(bar.bottom - bar.top, 2);

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
            <rect
              x={x}
              y={bar.top}
              width={barWidth}
              height={barH}
              fill={bar.color}
              rx={3}
            />
            {/* Connector line from previous bar */}
            {i > 0 && bar.isChange && (
              <line
                x1={x - gap}
                y1={bars[i - 1].isChange ? bars[i - 1].top : bars[i - 1].top}
                x2={x}
                y2={bars[i - 1].isChange ? bars[i - 1].top : bars[i - 1].top}
                stroke="var(--sm-border, #d1d5db)"
                strokeWidth={1}
                strokeDasharray="4,2"
              />
            )}
            <text
              x={x + barWidth / 2}
              y={chartBottom + 15}
              textAnchor="middle"
              fill="currentColor"
              fontSize={10}
            >
              {bar.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
