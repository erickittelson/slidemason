import type { CSSProperties } from 'react';
import * as icons from 'lucide-react';

export interface IconListProps {
  items: Array<{ icon: string; text: string }>;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function IconList({ items, className = '', style, animate }: IconListProps) {
  return (
    <ul
      className={`${className}`.trim()}
      style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', ...style }}
    >
      {items.map((item, i) => {
        const IconComponent = (icons as Record<string, React.ComponentType<{ size?: number; style?: CSSProperties }>>)[item.icon];
        const animClass = animate
          ? `sm-fade-up${animate === 'stagger' ? ` sm-stagger-${i + 1}` : ''}`
          : '';
        return (
          <li
            key={i}
            className={animClass}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {IconComponent && (
              <IconComponent size={20} style={{ color: 'var(--sm-primary)', flexShrink: 0 }} />
            )}
            <span style={{ color: 'var(--sm-text)' }}>{item.text}</span>
          </li>
        );
      })}
    </ul>
  );
}
