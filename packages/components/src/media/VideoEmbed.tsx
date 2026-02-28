import type { CSSProperties } from 'react';

export interface VideoEmbedProps {
  src: string;
  poster?: string;
  aspectRatio?: string;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function VideoEmbed({ src, poster, aspectRatio = '16/9', className = '', style, animate }: VideoEmbedProps) {
  const animClass = animate ? 'sm-fade-up' : '';
  const isEmbed = src.includes('youtube') || src.includes('vimeo');

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      style={{
        aspectRatio,
        width: '100%',
        borderRadius: 'var(--sm-radius, 0.5rem)',
        overflow: 'hidden',
        backgroundColor: '#000',
        ...style,
      }}
    >
      {isEmbed ? (
        <iframe
          src={src}
          title="Video embed"
          style={{ width: '100%', height: '100%', border: 'none' }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <video
          src={src}
          poster={poster}
          controls
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
    </div>
  );
}
