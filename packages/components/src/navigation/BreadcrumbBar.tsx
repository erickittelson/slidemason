import type { CSSProperties } from 'react';

export interface BreadcrumbBarProps {
  items: string[];
  current?: number;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function BreadcrumbBar({
  items,
  current,
  className = '',
  style,
  animate,
}: BreadcrumbBarProps) {
  const animClass = animate ? (animate === 'stagger' ? 'sm-stagger' : 'sm-fade-up') : '';
  const activeIndex = current ?? items.length - 1;

  return (
    <nav
      className={`${animClass} ${className}`.trim()}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        background: 'var(--sm-surface, #f5f5f5)',
        fontSize: '0.875rem',
        ...style,
      }}
    >
      {items.map((item, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {i > 0 && (
            <span style={{ color: 'var(--sm-muted)', userSelect: 'none' }}>/</span>
          )}
          <span
            style={{
              fontWeight: i === activeIndex ? 700 : 400,
              color: i === activeIndex ? 'var(--sm-primary)' : 'var(--sm-muted)',
            }}
          >
            {item}
          </span>
        </span>
      ))}
    </nav>
  );
}
