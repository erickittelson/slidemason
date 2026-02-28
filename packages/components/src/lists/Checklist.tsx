import type { CSSProperties } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

export interface ChecklistProps {
  items: Array<{ text: string; checked: boolean }>;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function Checklist({ items, className = '', style, animate }: ChecklistProps) {
  return (
    <ul
      className={`${className}`.trim()}
      style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', ...style }}
    >
      {items.map((item, i) => {
        const animClass = animate
          ? `sm-fade-up${animate === 'stagger' ? ` sm-stagger-${i + 1}` : ''}`
          : '';
        return (
          <li
            key={i}
            className={animClass}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {item.checked ? (
              <CheckCircle2 size={20} style={{ color: 'var(--sm-success, #22c55e)', flexShrink: 0 }} />
            ) : (
              <Circle size={20} style={{ color: 'var(--sm-muted)', flexShrink: 0 }} />
            )}
            <span style={{ color: item.checked ? 'var(--sm-success, #22c55e)' : 'var(--sm-muted)' }}>
              {item.text}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
