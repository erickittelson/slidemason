import type { CSSProperties } from 'react';

export interface BlockQuoteStackProps {
  quotes: Array<{ text: string; author?: string }>;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function BlockQuoteStack({
  quotes,
  className = '',
  style,
  animate,
}: BlockQuoteStackProps) {
  const animClass = animate ? 'sm-fade-up' : '';

  return (
    <div
      className={`relative ${animClass} ${className}`.trim()}
      style={style}
    >
      {quotes.map((q, i) => (
        <div key={i} className="relative" style={{ paddingLeft: '1.5rem' }}>
          {/* Vertical connector line */}
          {i < quotes.length - 1 && (
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '2px',
                backgroundColor: 'var(--sm-border)',
              }}
            />
          )}
          {/* Last item still gets the line portion for its content */}
          {i === quotes.length - 1 && quotes.length > 1 && (
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '2px',
                backgroundColor: 'var(--sm-border)',
              }}
            />
          )}
          <blockquote
            className={animate === 'stagger' ? `sm-fade-up sm-stagger-${i + 1}` : ''}
            style={{ paddingBottom: i < quotes.length - 1 ? '1.5rem' : 0 }}
          >
            <p className="italic text-[var(--sm-text)]">{q.text}</p>
            {q.author && (
              <footer className="mt-1 text-sm text-[var(--sm-muted)]">
                {'\u2014'} {q.author}
              </footer>
            )}
          </blockquote>
        </div>
      ))}
    </div>
  );
}
