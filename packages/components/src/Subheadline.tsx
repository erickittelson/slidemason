import type { CSSProperties, ReactNode } from 'react';

export interface SubheadlineProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Subheadline({ children, className = '', style }: SubheadlineProps) {
  return (
    <h2 className={`font-medium text-[var(--sm-muted)] ${className}`.trim()} style={{ fontSize: 'clamp(1.25rem, 2.5vw, 2rem)', ...style }}>
      {children}
    </h2>
  );
}
