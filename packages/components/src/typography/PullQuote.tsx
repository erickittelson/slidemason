import type { CSSProperties } from 'react';

export interface PullQuoteProps {
  quote: string;
  attribution?: string;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function PullQuote({
  quote,
  attribution,
  className = '',
  style,
  animate,
}: PullQuoteProps) {
  const animClass = animate ? 'sm-fade-up' : '';

  return (
    <blockquote
      className={`relative ${animClass} ${className}`.trim()}
      style={{ padding: '2rem 2rem 2rem 3rem', ...style }}
    >
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          fontSize: '8rem',
          lineHeight: 1,
          color: 'var(--sm-primary)',
          opacity: 0.1,
          fontFamily: 'Georgia, serif',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        {'\u201C'}
      </span>
      <p
        className="italic text-[var(--sm-text)]"
        style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', lineHeight: 1.4 }}
      >
        {quote}
      </p>
      {attribution && (
        <footer
          className="mt-4 text-[var(--sm-muted)]"
          style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1rem)' }}
        >
          {'\u2014'} {attribution}
        </footer>
      )}
    </blockquote>
  );
}
