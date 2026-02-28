import type { CSSProperties } from 'react';

export interface EmbedFrameProps {
  src: string;
  title?: string;
  aspectRatio?: string;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function EmbedFrame({
  src,
  title,
  aspectRatio = '16/9',
  className = '',
  style,
  animate,
}: EmbedFrameProps) {
  const animClass = animate ? (animate === 'stagger' ? 'sm-stagger' : 'sm-fade-up') : '';

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      style={{
        border: '1px solid var(--sm-border)',
        borderRadius: 'var(--sm-radius)',
        overflow: 'hidden',
        ...style,
      }}
    >
      {title && (
        <div
          style={{
            padding: '0.5rem 0.75rem',
            backgroundColor: 'var(--sm-surface)',
            borderBottom: '1px solid var(--sm-border)',
            fontSize: 'clamp(0.75rem, 1.1vw, 0.85rem)',
            fontWeight: 600,
            color: 'var(--sm-text)',
          }}
        >
          {title}
        </div>
      )}
      <div style={{ position: 'relative', width: '100%', aspectRatio }}>
        <iframe
          src={src}
          title={title ?? 'Embedded content'}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
          }}
          allowFullScreen
        />
      </div>
    </div>
  );
}
