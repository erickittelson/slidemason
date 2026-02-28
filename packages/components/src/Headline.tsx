import type { CSSProperties, ReactNode } from 'react';

export interface HeadlineProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Headline({ children, className = '', style }: HeadlineProps) {
  return (
    <h1 className={`font-bold tracking-tight text-[var(--sm-text)] ${className}`.trim()} style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', ...style }}>
      {children}
    </h1>
  );
}
