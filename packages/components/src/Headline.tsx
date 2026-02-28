import type { ReactNode } from 'react';

export interface HeadlineProps {
  children: ReactNode;
  className?: string;
}

export function Headline({ children, className = '' }: HeadlineProps) {
  return (
    <h1 className={`text-7xl font-bold tracking-tight text-[var(--sm-text)] ${className}`.trim()}>
      {children}
    </h1>
  );
}
