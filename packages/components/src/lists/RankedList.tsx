import type { CSSProperties } from 'react';

export interface RankedListProps {
  items: Array<{ label: string; value: number }>;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function RankedList({ items, className = '', style, animate }: RankedListProps) {
  const maxValue = Math.max(...items.map((item) => item.value), 1);

  return (
    <div
      className={`${className}`.trim()}
      style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', ...style }}
    >
      {items.map((item, i) => {
        const barWidth = (item.value / maxValue) * 100;
        const animClass = animate
          ? `sm-fade-up${animate === 'stagger' ? ` sm-stagger-${i + 1}` : ''}`
          : '';
        return (
          <div
            key={i}
            className={animClass}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          >
            <span
              style={{
                color: 'var(--sm-muted)',
                fontWeight: 700,
                fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)',
                minWidth: '1.5rem',
                textAlign: 'right',
              }}
            >
              {i + 1}
            </span>
            <span
              style={{
                color: 'var(--sm-text)',
                fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)',
                minWidth: '6rem',
              }}
            >
              {item.label}
            </span>
            <div style={{ flex: 1, height: '0.5rem', backgroundColor: 'var(--sm-border)', borderRadius: '0.25rem', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${barWidth}%`,
                  height: '100%',
                  backgroundColor: 'var(--sm-primary)',
                  borderRadius: '0.25rem',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
