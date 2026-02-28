import type { CSSProperties } from 'react';

export interface AgendaNavProps {
  items: Array<{ label: string; active?: boolean }>;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function AgendaNav({
  items,
  className = '',
  style,
  animate,
}: AgendaNavProps) {
  const animClass = animate ? (animate === 'stagger' ? 'sm-stagger' : 'sm-fade-up') : '';

  return (
    <nav
      className={`${animClass} ${className}`.trim()}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        ...style,
      }}
    >
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            paddingLeft: '1rem',
            padding: '0.5rem 1rem',
            borderLeft: item.active ? '4px solid var(--sm-primary)' : '4px solid transparent',
            fontWeight: item.active ? 700 : 400,
            color: item.active ? 'var(--sm-primary)' : 'var(--sm-muted)',
          }}
        >
          {item.label}
        </div>
      ))}
    </nav>
  );
}
