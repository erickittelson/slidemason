import type { CSSProperties } from 'react';
import * as icons from 'lucide-react';

export interface RecommendationBoxProps {
  title: string;
  description: string;
  icon?: string;
  priority?: 'high' | 'medium' | 'low';
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

const priorityBorderColor: Record<string, string> = {
  high: 'var(--sm-danger, #e53e3e)',
  medium: 'var(--sm-warning, #dd6b20)',
  low: 'var(--sm-primary)',
};

export function RecommendationBox({
  title,
  description,
  icon,
  priority = 'low',
  className = '',
  style,
  animate,
}: RecommendationBoxProps) {
  const IconComponent = icon
    ? (icons as Record<string, React.ComponentType<{ size?: number; style?: CSSProperties }>>)[icon]
    : undefined;
  const animClass = animate ? (animate === 'stagger' ? 'sm-stagger' : 'sm-fade-up') : '';
  const borderColor = priorityBorderColor[priority] ?? 'var(--sm-primary)';

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      style={{
        backgroundColor: 'var(--sm-surface)',
        border: `2px solid ${borderColor}`,
        borderRadius: 'var(--sm-radius)',
        padding: '1.25rem',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        {IconComponent && (
          <IconComponent size={24} style={{ color: borderColor, flexShrink: 0 }} />
        )}
        <div style={{ fontWeight: 700, fontSize: 'clamp(0.95rem, 1.5vw, 1.15rem)', color: 'var(--sm-text)' }}>
          {title}
        </div>
      </div>
      <div style={{ color: 'var(--sm-muted)', fontSize: 'clamp(0.8rem, 1.2vw, 0.95rem)', lineHeight: 1.5 }}>
        {description}
      </div>
    </div>
  );
}
