import type { CSSProperties } from 'react';

export interface VersusSlideProps {
  left: { label: string; points?: string[] };
  right: { label: string; points?: string[] };
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function VersusSlide({ left, right, className = '', style, animate }: VersusSlideProps) {
  const animClass = animate ? 'sm-fade-up' : '';

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        gap: '1.5rem',
        alignItems: 'start',
        ...style,
      }}
    >
      {/* Left */}
      <div>
        <div style={{ fontWeight: 700, fontSize: 'clamp(1rem, 2vw, 1.3rem)', color: 'var(--sm-text)', marginBottom: '0.75rem' }}>
          {left.label}
        </div>
        {left.points?.map((p, i) => (
          <div
            key={i}
            style={{
              marginBottom: '0.4rem',
              color: 'var(--sm-text)',
              fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)',
              paddingLeft: '0.75rem',
              ...(animate === 'stagger' ? { animation: `sm-fade-in 0.3s ease-out ${i * 0.08}s both` } : {}),
            }}
          >
            {'\u2022'} {p}
          </div>
        ))}
      </div>
      {/* VS */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
          color: 'var(--sm-primary)',
          alignSelf: 'center',
        }}
      >
        VS
      </div>
      {/* Right */}
      <div>
        <div style={{ fontWeight: 700, fontSize: 'clamp(1rem, 2vw, 1.3rem)', color: 'var(--sm-text)', marginBottom: '0.75rem' }}>
          {right.label}
        </div>
        {right.points?.map((p, i) => (
          <div
            key={i}
            style={{
              marginBottom: '0.4rem',
              color: 'var(--sm-text)',
              fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)',
              paddingLeft: '0.75rem',
              ...(animate === 'stagger' ? { animation: `sm-fade-in 0.3s ease-out ${i * 0.08}s both` } : {}),
            }}
          >
            {'\u2022'} {p}
          </div>
        ))}
      </div>
    </div>
  );
}
