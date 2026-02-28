import type { CSSProperties } from 'react';

export interface TitleCardProps {
  title: string;
  subtitle?: string;
  background?: 'gradient' | 'image';
  bgSrc?: string;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function TitleCard({
  title,
  subtitle,
  background,
  bgSrc,
  className = '',
  style,
  animate,
}: TitleCardProps) {
  const animClass = animate ? (animate === 'stagger' ? 'sm-stagger' : 'sm-fade-up') : '';

  let bgStyle: CSSProperties = {};
  if (background === 'gradient') {
    bgStyle = {
      background: 'linear-gradient(135deg, var(--sm-gradient-start), var(--sm-gradient-end))',
    };
  } else if (background === 'image' && bgSrc) {
    bgStyle = {
      backgroundImage: `url(${bgSrc})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  }

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
        textAlign: 'center',
        ...bgStyle,
        ...style,
      }}
    >
      {background === 'image' && bgSrc && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
          }}
        />
      )}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h1
          style={{
            margin: 0,
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            color: background === 'image' ? '#fff' : undefined,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              margin: '1rem 0 0',
              fontSize: 'clamp(1rem, 2.5vw, 1.75rem)',
              opacity: 0.8,
              color: background === 'image' ? '#fff' : undefined,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
