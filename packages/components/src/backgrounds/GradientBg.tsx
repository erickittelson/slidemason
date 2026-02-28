import type { CSSProperties, ReactNode } from 'react';

export interface GradientBgProps {
  children: ReactNode;
  type?: 'linear' | 'radial' | 'conic';
  from?: string;
  to?: string;
  angle?: number;
  className?: string;
  style?: CSSProperties;
  animate?: boolean;
}

export function GradientBg({
  children,
  type = 'linear',
  from = 'var(--sm-gradient-start)',
  to = 'var(--sm-gradient-end)',
  angle = 135,
  className = '',
  style,
  animate,
}: GradientBgProps) {
  const animClass = animate ? 'sm-fade-up' : '';

  let background: string;
  if (type === 'linear') {
    background = `linear-gradient(${angle}deg, ${from}, ${to})`;
  } else if (type === 'radial') {
    background = `radial-gradient(circle, ${from}, ${to})`;
  } else {
    background = `conic-gradient(from ${angle}deg, ${from}, ${to})`;
  }

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      style={{
        position: 'relative',
        background,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
