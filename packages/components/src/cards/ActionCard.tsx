import type { CSSProperties } from 'react';
import * as icons from 'lucide-react';

export interface ActionCardProps {
  icon: string;
  title: string;
  description: string;
  action: string;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function ActionCard({ icon, title, description, action, className = '', style, animate }: ActionCardProps) {
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
        display: 'flex',
        flexDirection: 'column',
        ...style,
      }}
    >
      {IconComponent && (
        <IconComponent size={32} style={{ color: 'var(--sm-primary)', marginBottom: '0.75rem' }} />
      )}
      <div style={{ fontWeight: 700, color: 'var(--sm-text)', fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)', marginBottom: '0.25rem' }}>
        {title}
      </div>
      <div style={{ color: 'var(--sm-muted)', fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)', marginBottom: '1rem', flex: 1 }}>
        {description}
      </div>
      <button
        style={{
          backgroundColor: 'var(--sm-primary)',
          color: 'var(--sm-bg)',
          border: 'none',
          borderRadius: 'var(--sm-radius)',
          padding: '0.5rem 1rem',
          fontWeight: 600,
          fontSize: 'clamp(0.75rem, 1.1vw, 0.85rem)',
          cursor: 'pointer',
          alignSelf: 'flex-start',
        }}
      >
        {action}
      </button>
    </div>
  );
}
