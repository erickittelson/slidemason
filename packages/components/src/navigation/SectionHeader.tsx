import type { CSSProperties } from 'react';

export interface SectionHeaderProps {
  number?: number;
  title: string;
  subtitle?: string;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function SectionHeader({
  number,
  title,
  subtitle,
  className = '',
  style,
  animate,
}: SectionHeaderProps) {
  const animClass = animate ? (animate === 'stagger' ? 'sm-stagger' : 'sm-fade-up') : '';

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100%',
        overflow: 'hidden',
        ...style,
      }}
    >
      {number != null && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            fontSize: '20rem',
            fontWeight: 900,
            opacity: 0.05,
            color: 'var(--sm-primary)',
            lineHeight: 1,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          {number}
        </span>
      )}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        <h2 style={{ margin: 0, fontSize: 'clamp(2rem, 5vw, 4rem)' }}>{title}</h2>
        {subtitle && (
          <p style={{ margin: '0.5rem 0 0', opacity: 0.7, fontSize: 'clamp(1rem, 2vw, 1.5rem)' }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
