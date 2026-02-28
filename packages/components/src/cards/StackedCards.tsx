import type { CSSProperties } from 'react';

export interface StackedCardsProps {
  cards: Array<{ title: string; content: string }>;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function StackedCards({ cards, className = '', style, animate }: StackedCardsProps) {
  const animClass = animate ? 'sm-fade-up' : '';

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      style={{ position: 'relative', minHeight: `${cards.length * 40 + 120}px`, ...style }}
    >
      {cards.map((card, i) => {
        const staggerClass = animate === 'stagger' ? `sm-fade-up sm-stagger-${i + 1}` : '';
        return (
          <div
            key={i}
            className={staggerClass}
            style={{
              position: 'absolute',
              top: i * 20,
              left: i * 12,
              right: (cards.length - 1 - i) * 12,
              padding: '1.25rem',
              backgroundColor: 'var(--sm-surface)',
              border: '1px solid var(--sm-border)',
              borderRadius: 'var(--sm-radius)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              zIndex: i,
            }}
          >
            <div style={{ fontWeight: 700, color: 'var(--sm-text)', fontSize: 'clamp(0.85rem, 1.3vw, 1.05rem)', marginBottom: '0.25rem' }}>
              {card.title}
            </div>
            <div style={{ color: 'var(--sm-muted)', fontSize: 'clamp(0.75rem, 1.1vw, 0.85rem)' }}>
              {card.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
