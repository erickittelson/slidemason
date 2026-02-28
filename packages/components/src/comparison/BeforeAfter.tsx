import type { CSSProperties } from 'react';

export interface BeforeAfterProps {
  before: { title: string; items: string[] };
  after: { title: string; items: string[] };
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function BeforeAfter({ before, after, className = '', style, animate }: BeforeAfterProps) {
  const animClass = animate ? 'sm-fade-up' : '';

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        gap: '1.5rem',
        alignItems: 'start',
        ...style,
      }}
    >
      {/* Before */}
      <div style={{ opacity: 0.6, color: 'var(--sm-muted, #9ca3af)' }}>
        <div style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)' }}>
          {before.title}
        </div>
        {before.items.map((item, i) => (
          <div
            key={i}
            style={{
              marginBottom: '0.4rem',
              fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)',
              ...(animate === 'stagger' ? { animation: `sm-fade-in 0.3s ease-out ${i * 0.08}s both` } : {}),
            }}
          >
            {item}
          </div>
        ))}
      </div>
      {/* Arrow divider */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          color: 'var(--sm-primary)',
          alignSelf: 'center',
          fontWeight: 700,
        }}
        aria-hidden="true"
      >
        →
      </div>
      {/* After */}
      <div
        style={{
          borderLeft: '4px solid var(--sm-primary)',
          paddingLeft: '1rem',
          color: 'var(--sm-text)',
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)' }}>
          {after.title}
        </div>
        {after.items.map((item, i) => (
          <div
            key={i}
            style={{
              marginBottom: '0.4rem',
              fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)',
              ...(animate === 'stagger' ? { animation: `sm-fade-in 0.3s ease-out ${i * 0.08}s both` } : {}),
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
