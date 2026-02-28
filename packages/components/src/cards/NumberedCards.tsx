import type { CSSProperties } from 'react';

export interface NumberedCardsProps {
  items: Array<{ title: string; description: string }>;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function NumberedCards({ items, className = '', style, animate }: NumberedCardsProps) {
  const animClass = animate ? 'sm-fade-up' : '';

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', ...style }}
    >
      {items.map((item, i) => {
        const staggerClass = animate === 'stagger' ? `sm-fade-up sm-stagger-${i + 1}` : '';
        return (
          <div
            key={i}
            className={staggerClass}
            style={{
              flex: '1 1 200px',
              position: 'relative',
              overflow: 'hidden',
              padding: '1.5rem',
              backgroundColor: 'var(--sm-surface)',
              border: '1px solid var(--sm-border)',
              borderRadius: 'var(--sm-radius)',
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: '-0.25rem',
                right: '0.25rem',
                fontSize: 'clamp(3rem, 6vw, 5rem)',
                fontWeight: 900,
                color: 'var(--sm-text)',
                opacity: 0.1,
                lineHeight: 1,
                pointerEvents: 'none',
              }}
            >
              {String(i + 1).padStart(2, '0')}
            </div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontWeight: 700, color: 'var(--sm-text)', fontSize: 'clamp(0.85rem, 1.3vw, 1.05rem)', marginBottom: '0.25rem' }}>
                {item.title}
              </div>
              <div style={{ color: 'var(--sm-muted)', fontSize: 'clamp(0.75rem, 1.1vw, 0.85rem)' }}>
                {item.description}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
