import type { CSSProperties, ReactNode } from 'react';

export interface GradientTextProps {
  children: ReactNode;
  from?: string;
  to?: string;
  direction?: string;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function GradientText({
  children,
  from = 'var(--sm-primary)',
  to = 'var(--sm-accent)',
  direction = 'to right',
  className = '',
  style,
  animate,
}: GradientTextProps) {
  const gradientStyle: CSSProperties = {
    background: `linear-gradient(${direction}, ${from}, ${to})`,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    ...style,
  };

  const animClass = animate ? 'sm-fade-in' : '';

  return (
    <span
      className={`${animClass} ${className}`.trim()}
      style={gradientStyle}
    >
      {children}
    </span>
  );
}
