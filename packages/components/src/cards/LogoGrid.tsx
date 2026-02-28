import type { CSSProperties } from 'react';

export interface LogoGridProps {
  logos: Array<{ src: string; alt: string }>;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function LogoGrid({ logos, className = '', style, animate }: LogoGridProps) {
  const animClass = animate ? 'sm-fade-up' : '';

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: '1.5rem',
        alignItems: 'center',
        justifyItems: 'center',
        ...style,
      }}
    >
      {logos.map((logo, i) => {
        const staggerClass = animate === 'stagger' ? `sm-fade-up sm-stagger-${i + 1}` : '';
        return (
          <img
            key={i}
            src={logo.src}
            alt={logo.alt}
            className={staggerClass}
            style={{
              maxWidth: '100%',
              maxHeight: 48,
              objectFit: 'contain',
              filter: 'grayscale(1)',
              opacity: 0.7,
            }}
          />
        );
      })}
    </div>
  );
}
