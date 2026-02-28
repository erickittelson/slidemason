import type { CSSProperties, ReactNode } from 'react';

export interface GlassCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function GlassCard({ children, className = '', style, animate }: GlassCardProps) {
  const animClass = animate ? 'sm-fade-up' : '';

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      style={{
        padding: '1.5rem',
        background: 'var(--sm-glass-bg, rgba(255,255,255,0.1))',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid var(--sm-border)',
        borderRadius: 'var(--sm-radius)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
