import type { CSSProperties } from 'react';

export interface InfoCardProps {
  title: string;
  content: string;
  accent?: string;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function InfoCard({ title, content, accent, className = '', style, animate }: InfoCardProps) {
  const animClass = animate ? 'sm-fade-up' : '';

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      style={{
        padding: '1.25rem',
        paddingLeft: '1.5rem',
        backgroundColor: 'var(--sm-surface)',
        borderLeft: `4px solid ${accent || 'var(--sm-primary)'}`,
        borderRadius: 'var(--sm-radius)',
        ...style,
      }}
    >
      <div style={{ fontWeight: 700, color: 'var(--sm-text)', fontSize: 'clamp(0.85rem, 1.3vw, 1.05rem)', marginBottom: '0.25rem' }}>
        {title}
      </div>
      <div style={{ color: 'var(--sm-muted)', fontSize: 'clamp(0.75rem, 1.1vw, 0.85rem)' }}>
        {content}
      </div>
    </div>
  );
}
