import type { CSSProperties } from 'react';

export interface WavesDividerProps {
  color?: string;
  position?: 'top' | 'bottom';
  flip?: boolean;
  className?: string;
  style?: CSSProperties;
  animate?: boolean;
}

export function WavesDivider({
  color = 'var(--sm-primary)',
  position = 'bottom',
  flip = false,
  className = '',
  style,
  animate,
}: WavesDividerProps) {
  const animClass = animate ? 'sm-fade-up' : '';
  const scaleY = flip ? -1 : 1;

  return (
    <svg
      className={`${animClass} ${className}`.trim()}
      viewBox="0 0 1200 60"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: 'absolute',
        [position]: 0,
        left: 0,
        width: '100%',
        height: 60,
        transform: `scaleY(${scaleY})`,
        ...style,
      }}
    >
      <path
        d="M0,30 C200,60 400,0 600,30 C800,60 1000,0 1200,30 L1200,60 L0,60 Z"
        fill={color}
      />
    </svg>
  );
}
