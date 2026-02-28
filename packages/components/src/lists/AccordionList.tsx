import type { CSSProperties } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

export interface AccordionListProps {
  items: Array<{ title: string; content: string; expanded?: boolean }>;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function AccordionList({ items, className = '', style, animate }: AccordionListProps) {
  return (
    <div
      className={`${className}`.trim()}
      style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', ...style }}
    >
      {items.map((item, i) => {
        const animClass = animate
          ? `sm-fade-up${animate === 'stagger' ? ` sm-stagger-${i + 1}` : ''}`
          : '';
        return (
          <div
            key={i}
            className={animClass}
            style={{
              border: '1px solid var(--sm-border)',
              borderRadius: '0.375rem',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--sm-surface)',
                cursor: 'default',
              }}
            >
              {item.expanded ? (
                <ChevronDown size={18} style={{ color: 'var(--sm-primary)', flexShrink: 0 }} />
              ) : (
                <ChevronRight size={18} style={{ color: 'var(--sm-muted)', flexShrink: 0 }} />
              )}
              <span style={{ color: 'var(--sm-text)', fontWeight: 600, fontSize: 'clamp(0.8rem, 1.3vw, 1rem)' }}>
                {item.title}
              </span>
            </div>
            {item.expanded && (
              <div
                style={{
                  padding: '0.75rem 1rem 0.75rem 2.5rem',
                  color: 'var(--sm-muted)',
                  fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)',
                }}
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
