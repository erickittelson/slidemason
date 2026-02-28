import type { CSSProperties } from 'react';

export interface CompetitorMapProps {
  items: Array<{ label: string; x: number; y: number }>;
  xAxis: string;
  yAxis: string;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function CompetitorMap({ items, xAxis, yAxis, className = '', style, animate }: CompetitorMapProps) {
  const animClass = animate ? 'sm-fade-up' : '';
  const w = 400;
  const h = 300;
  const pad = 40;

  return (
    <svg
      className={`${animClass} ${className}`.trim()}
      style={style}
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      role="img"
      aria-label="Competitor positioning map"
    >
      {/* Axes */}
      <line x1={pad} y1={h - pad} x2={w - 10} y2={h - pad} stroke="var(--sm-border)" strokeWidth={1.5} />
      <line x1={pad} y1={h - pad} x2={pad} y2={10} stroke="var(--sm-border)" strokeWidth={1.5} />

      {/* X axis label */}
      <text x={w / 2} y={h - 6} textAnchor="middle" fill="var(--sm-muted, #9ca3af)" fontSize={11}>
        {xAxis}
      </text>
      {/* Y axis label */}
      <text x={14} y={h / 2} textAnchor="middle" fill="var(--sm-muted, #9ca3af)" fontSize={11} transform={`rotate(-90, 14, ${h / 2})`}>
        {yAxis}
      </text>

      {/* Items */}
      {items.map((item, i) => {
        const cx = pad + (item.x / 100) * (w - pad - 20);
        const cy = (h - pad) - (item.y / 100) * (h - pad - 20);
        return (
          <g
            key={i}
            style={animate === 'stagger' ? { animation: `sm-fade-in 0.3s ease-out ${i * 0.1}s both` } : undefined}
          >
            <circle cx={cx} cy={cy} r={6} fill="var(--sm-primary)" />
            <text x={cx} y={cy - 10} textAnchor="middle" fill="var(--sm-text)" fontSize={10} fontWeight={600}>
              {item.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
