import type { CSSProperties } from 'react';

export interface ConcentricCirclesProps {
  rings: Array<{ label: string }>;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function ConcentricCircles({
  rings,
  className = '',
  style,
  animate,
}: ConcentricCirclesProps) {
  const size = 400;
  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = size * 0.42;
  const n = rings.length;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={`sm-concentric-circles ${animate ? 'sm-fade-in' : ''} ${className}`.trim()}
      style={style}
      role="img"
    >
      {/* Draw from outermost to innermost so inner rings appear on top */}
      {[...rings].reverse().map((ring, ri) => {
        const i = n - 1 - ri; // original index
        const radius = (maxRadius * (i + 1)) / n;
        const opacity = 1 - (i / n) * 0.6; // innermost = full opacity, outermost = lighter

        return (
          <g
            key={i}
            className={animate === 'stagger' ? 'sm-fade-in' : ''}
            style={
              animate === 'stagger'
                ? ({ animationDelay: `${ri * 0.1}s` } as CSSProperties)
                : undefined
            }
          >
            <circle
              cx={cx}
              cy={cy}
              r={radius}
              fill="var(--sm-primary, #3b82f6)"
              opacity={opacity * 0.3}
              stroke="var(--sm-primary, #3b82f6)"
              strokeWidth={1.5}
              strokeOpacity={opacity}
            />
            <text
              x={cx}
              y={cy - radius + (maxRadius / n) * 0.5}
              textAnchor="middle"
              dominantBaseline="central"
              fill="currentColor"
              fontSize={11}
            >
              {ring.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
