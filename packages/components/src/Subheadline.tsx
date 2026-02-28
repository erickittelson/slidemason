import type { ReactNode } from 'react';

export interface SubheadlineProps {
  children: ReactNode;
  className?: string;
}

export function Subheadline({ children, className = '' }: SubheadlineProps) {
  return (
    <h2 className={`text-2xl font-medium text-[var(--sm-muted)] ${className}`.trim()}>
      {children}
    </h2>
  );
}
