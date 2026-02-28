import type { CSSProperties, ReactNode } from 'react';

export interface NoisyGradientProps {
  children: ReactNode;
  from?: string;
  to?: string;
  className?: string;
  style?: CSSProperties;
  animate?: boolean;
}

export function NoisyGradient({
  children,
  from = 'var(--sm-gradient-start)',
  to = 'var(--sm-gradient-end)',
  className = '',
  style,
  animate,
}: NoisyGradientProps) {
  const animClass = animate ? 'sm-fade-up' : '';
  const filterId = 'sm-noise';

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      style={{
        position: 'relative',
        background: `linear-gradient(135deg, ${from}, ${to})`,
        ...style,
      }}
    >
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id={filterId}>
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${filterId})`} opacity="0.15" />
      </svg>
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  );
}
