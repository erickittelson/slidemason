import type { CSSProperties } from 'react';

export interface ScreenshotAnnotatedProps {
  src: string;
  alt: string;
  annotations: Array<{ x: number; y: number; label: string }>;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function ScreenshotAnnotated({ src, alt, annotations, className = '', style, animate }: ScreenshotAnnotatedProps) {
  const animClass = animate ? 'sm-fade-up' : '';

  return (
    <div className={`${animClass} ${className}`.trim()} style={style}>
      <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
        <img src={src} alt={alt} style={{ width: '100%', display: 'block', borderRadius: 'var(--sm-radius, 0.5rem)' }} />
        {annotations.map((ann, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${ann.x}%`,
              top: `${ann.y}%`,
              transform: 'translate(-50%, -50%)',
              width: 28,
              height: 28,
              borderRadius: '50%',
              backgroundColor: 'var(--sm-primary, #3b82f6)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 700,
              ...(animate === 'stagger' ? { animation: `sm-fade-in 0.3s ease-out ${i * 0.1}s both` } : {}),
            }}
          >
            {i + 1}
          </div>
        ))}
      </div>
      {/* Legend */}
      <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {annotations.map((ann, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'clamp(0.7rem, 1.1vw, 0.85rem)', color: 'var(--sm-text)' }}>
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                backgroundColor: 'var(--sm-primary, #3b82f6)',
                color: '#fff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.65rem',
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {i + 1}
            </span>
            <span>{ann.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
