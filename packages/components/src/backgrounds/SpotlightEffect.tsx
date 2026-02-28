import type { CSSProperties, ReactNode } from 'react';

export interface SpotlightEffectProps {
  children: ReactNode;
  x?: string;
  y?: string;
  size?: string;
  className?: string;
  style?: CSSProperties;
  animate?: boolean;
}

export function SpotlightEffect({
  children,
  x = '50%',
  y = '40%',
  size = '60%',
  className = '',
  style,
  animate,
}: SpotlightEffectProps) {
  const animClass = animate ? 'sm-fade-up' : '';

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      style={{
        position: 'relative',
        background: `radial-gradient(circle ${size} at ${x} ${y}, transparent 0%, var(--sm-bg) 100%)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
