import type { CSSProperties } from 'react';

export interface ImageGridProps {
  images: Array<{ src: string; alt: string }>;
  columns?: 2 | 3;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function ImageGrid({ images, columns = 3, className = '', style, animate }: ImageGridProps) {
  const animClass = animate ? 'sm-fade-up' : '';

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: '0.75rem',
        ...style,
      }}
    >
      {images.map((img, i) => (
        <img
          key={i}
          src={img.src}
          alt={img.alt}
          style={{
            width: '100%',
            aspectRatio: '1',
            objectFit: 'cover',
            borderRadius: 'var(--sm-radius, 0.5rem)',
            ...(animate === 'stagger' ? { animation: `sm-fade-in 0.3s ease-out ${i * 0.08}s both` } : {}),
          }}
        />
      ))}
    </div>
  );
}
