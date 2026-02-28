import type { CSSProperties } from 'react';

export interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function Sparkline({
  data,
  width = 100,
  height = 30,
  color = 'var(--sm-primary, #3b82f6)',
  className,
  style,
  animate,
}: SparklineProps) {
  if (data.length === 0) return <svg width={width} height={height} className={className} style={style} />;

  const minVal = Math.min(...data);
  const maxVal = Math.max(...data);
  const range = maxVal - minVal || 1;
  const padY = 2;

  const points = data
    .map((v, i) => {
      const x = data.length === 1 ? width / 2 : (i / (data.length - 1)) * width;
      const y = padY + (1 - (v - minVal) / range) * (height - padY * 2);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg
      width={width}
      height={height}
      className={className}
      style={style}
      role="img"
      aria-label="Sparkline"
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        style={
          animate
            ? { animation: 'sm-fade-in 0.4s ease-out both' }
            : undefined
        }
      />
    </svg>
  );
}
