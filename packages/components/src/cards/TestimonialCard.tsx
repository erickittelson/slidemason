import type { CSSProperties } from 'react';

export interface TestimonialCardProps {
  quote: string;
  name: string;
  title?: string;
  company?: string;
  avatar?: string;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function TestimonialCard({ quote, name, title, company, avatar, className = '', style, animate }: TestimonialCardProps) {
  const animClass = animate ? 'sm-fade-up' : '';

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      style={{
        padding: '1.5rem',
        backgroundColor: 'var(--sm-surface)',
        border: '1px solid var(--sm-border)',
        borderRadius: 'var(--sm-radius)',
        ...style,
      }}
    >
      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <span
          style={{
            position: 'absolute',
            top: '-0.5rem',
            left: '-0.25rem',
            fontSize: '3rem',
            lineHeight: 1,
            color: 'var(--sm-primary)',
            opacity: 0.3,
            fontFamily: 'serif',
          }}
          aria-hidden="true"
        >
          &ldquo;
        </span>
        <p style={{ fontStyle: 'italic', color: 'var(--sm-text)', fontSize: 'clamp(0.8rem, 1.3vw, 1rem)', margin: 0, paddingLeft: '1rem' }}>
          {quote}
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {avatar && (
          <img
            src={avatar}
            alt={name}
            style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
          />
        )}
        <div>
          <div style={{ fontWeight: 700, color: 'var(--sm-text)', fontSize: 'clamp(0.8rem, 1.2vw, 0.95rem)' }}>
            {name}
          </div>
          {(title || company) && (
            <div style={{ color: 'var(--sm-muted)', fontSize: 'clamp(0.7rem, 1vw, 0.8rem)' }}>
              {[title, company].filter(Boolean).join(', ')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
