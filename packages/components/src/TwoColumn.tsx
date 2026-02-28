import type { ReactNode } from 'react';

export interface TwoColumnProps {
  left: ReactNode;
  right: ReactNode;
  className?: string;
}

export function TwoColumn({ left, right, className = '' }: TwoColumnProps) {
  return (
    <div className={`flex gap-8 ${className}`.trim()}>
      <div className="flex-1">{left}</div>
      <div className="flex-1">{right}</div>
    </div>
  );
}
