import type { CSSProperties } from 'react';

export interface ChapterCardProps {
  number: number;
  title: string;
  subtitle?: string;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function ChapterCard({
  number,
  title,
  subtitle,
  className = '',
  style,
  animate,
}: ChapterCardProps) {
  const animClass = animate ? (animate === 'stagger' ? 'sm-stagger' : 'sm-fade-up') : '';

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      style={{
        position: 'relative',
        padding: '2rem',
        ...style,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          display: 'block',
          fontSize: 'clamp(4rem, 8vw, 8rem)',
          fontWeight: 900,
          color: 'var(--sm-primary)',
          opacity: 0.3,
          lineHeight: 1,
        }}
      >
        {number}
      </span>
      <div
        style={{
          width: '4rem',
          height: '2px',
          background: 'var(--sm-primary)',
          margin: '1rem 0',
        }}
      />
      <h2 style={{ margin: 0, fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>{title}</h2>
      {subtitle && (
        <p style={{ margin: '0.5rem 0 0', opacity: 0.7 }}>{subtitle}</p>
      )}
    </div>
  );
}
