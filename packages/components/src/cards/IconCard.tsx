import type { CSSProperties } from 'react';
import * as icons from 'lucide-react';

export interface IconCardProps {
  icon: string;
  title: string;
  description: string;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function IconCard({ icon, title, description, className = '', style, animate }: IconCardProps) {
  const IconComponent = (icons as unknown as Record<string, React.ComponentType<{ size?: number; style?: CSSProperties }>>)[icon];
  const animClass = animate ? 'sm-fade-up' : '';

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      style={{
        padding: '1.5rem',
        backgroundColor: 'var(--sm-surface)',
        border: '1px solid var(--sm-border)',
        borderRadius: 'var(--sm-radius)',
        ...style,
      }}
    >
      {IconComponent && (
        <IconComponent size={40} style={{ color: 'var(--sm-primary)', marginBottom: '0.75rem' }} />
      )}
      <div style={{ fontWeight: 700, color: 'var(--sm-text)', fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)', marginBottom: '0.25rem' }}>
        {title}
      </div>
      <div style={{ color: 'var(--sm-muted)', fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)' }}>
        {description}
      </div>
    </div>
  );
}
