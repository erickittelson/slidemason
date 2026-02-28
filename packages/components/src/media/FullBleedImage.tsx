import type { CSSProperties, ReactNode } from 'react';

export interface FullBleedImageProps {
  src: string;
  alt: string;
  children?: ReactNode;
  overlay?: 'dark' | 'light' | 'gradient';
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

const overlayStyles: Record<string, CSSProperties> = {
  dark: { position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1 },
  light: { position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.5)', zIndex: 1 },
  gradient: { position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.7))', zIndex: 1 },
};

export function FullBleedImage({ src, alt, children, overlay, className = '', style, animate }: FullBleedImageProps) {
  const animClass = animate ? 'sm-fade-up' : '';

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100%', ...style }}
    >
      <img
        src={src}
        alt={alt}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />
      {overlay && <div style={overlayStyles[overlay]} />}
      {children && (
        <div style={{ position: 'relative', zIndex: 10 }}>
          {children}
        </div>
      )}
    </div>
  );
}
