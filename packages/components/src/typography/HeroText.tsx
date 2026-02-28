import type { CSSProperties, ReactNode } from 'react';

export interface HeroTextProps {
  children: ReactNode;
  gradient?: boolean;
  shadow?: boolean;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function HeroText({
  children,
  gradient,
  shadow,
  className = '',
  style,
  animate,
}: HeroTextProps) {
  const baseStyle: CSSProperties = {
    fontSize: 'clamp(3rem, 8vw, 8rem)',
    lineHeight: 1.1,
    ...(gradient
      ? {
          background: 'linear-gradient(to right, var(--sm-primary), var(--sm-accent))',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
        }
      : {}),
    ...(shadow ? { textShadow: '0 4px 24px rgba(0,0,0,0.3)' } : {}),
    ...style,
  };

  const animClass = animate ? 'sm-fade-up' : '';

  return (
    <h1
      className={`font-bold tracking-tight text-[var(--sm-text)] ${animClass} ${className}`.trim()}
      style={baseStyle}
    >
      {children}
    </h1>
  );
}
