import type { CSSProperties, ReactNode } from 'react';

export interface ImageTextSplitProps {
  image: { src: string; alt: string };
  children: ReactNode;
  imagePosition?: 'left' | 'right';
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function ImageTextSplit({ image, children, imagePosition = 'left', className = '', style, animate }: ImageTextSplitProps) {
  const animClass = animate ? 'sm-fade-up' : '';

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      style={{
        display: 'flex',
        flexDirection: imagePosition === 'right' ? 'row-reverse' : 'row',
        width: '100%',
        minHeight: 0,
        ...style,
      }}
    >
      <div style={{ flex: '1 1 50%', minWidth: 0 }}>
        <img
          src={image.src}
          alt={image.alt}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>
      <div style={{ flex: '1 1 50%', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {children}
      </div>
    </div>
  );
}
