import type { CSSProperties } from 'react';
import { Star } from 'lucide-react';

export interface RatingStarsProps {
  items: Array<{ label: string; rating: number; max?: number }>;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function RatingStars({ items, className = '', style, animate }: RatingStarsProps) {
  const animClass = animate ? 'sm-fade-up' : '';

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
        ...style,
      }}
    >
      {items.map((item, i) => {
        const max = item.max ?? 5;
        return (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              ...(animate === 'stagger' ? { animation: `sm-fade-in 0.3s ease-out ${i * 0.08}s both` } : {}),
            }}
          >
            <span style={{ color: 'var(--sm-text)', fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)', fontWeight: 600, minWidth: '6rem' }}>
              {item.label}
            </span>
            <span style={{ display: 'flex', gap: '0.15rem' }}>
              {Array.from({ length: max }, (_, si) => (
                <Star
                  key={si}
                  size={18}
                  fill={si < item.rating ? 'var(--sm-accent, var(--sm-primary))' : 'none'}
                  style={{
                    color: si < item.rating ? 'var(--sm-accent, var(--sm-primary))' : 'var(--sm-muted, #9ca3af)',
                  }}
                />
              ))}
            </span>
          </div>
        );
      })}
    </div>
  );
}
