import type { CSSProperties } from 'react';

export interface ImageCardProps {
  src: string;
  alt: string;
  title: string;
  description?: string;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function ImageCard({ src, alt, title, description, className = '', style, animate }: ImageCardProps) {
  const animClass = animate ? 'sm-fade-up' : '';

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      style={{
        overflow: 'hidden',
        backgroundColor: 'var(--sm-surface)',
        border: '1px solid var(--sm-border)',
        borderRadius: 'var(--sm-radius)',
        ...style,
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: 180,
          objectFit: 'cover',
          display: 'block',
          borderTopLeftRadius: 'var(--sm-radius)',
          borderTopRightRadius: 'var(--sm-radius)',
        }}
      />
      <div style={{ padding: '1rem' }}>
        <div style={{ fontWeight: 700, color: 'var(--sm-text)', fontSize: 'clamp(0.85rem, 1.3vw, 1.05rem)', marginBottom: '0.25rem' }}>
          {title}
        </div>
        {description && (
          <div style={{ color: 'var(--sm-muted)', fontSize: 'clamp(0.75rem, 1.1vw, 0.85rem)' }}>
            {description}
          </div>
        )}
      </div>
    </div>
  );
}
