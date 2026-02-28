import type { CSSProperties } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export interface ProsConsProps {
  pros: string[];
  cons: string[];
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function ProsCons({ pros, cons, className = '', style, animate }: ProsConsProps) {
  const animClass = animate ? 'sm-fade-up' : '';

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        ...style,
      }}
    >
      <div>
        <div style={{ fontWeight: 700, color: 'var(--sm-success, #22c55e)', marginBottom: '0.75rem', fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)' }}>
          Pros
        </div>
        {pros.map((item, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
              marginBottom: '0.5rem',
              ...(animate === 'stagger' ? { animation: `sm-fade-in 0.3s ease-out ${i * 0.08}s both` } : {}),
            }}
          >
            <CheckCircle2 size={18} style={{ color: 'var(--sm-success, #22c55e)', flexShrink: 0, marginTop: '0.1rem' }} />
            <span style={{ color: 'var(--sm-text)', fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)' }}>{item}</span>
          </div>
        ))}
      </div>
      <div>
        <div style={{ fontWeight: 700, color: 'var(--sm-danger, #ef4444)', marginBottom: '0.75rem', fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)' }}>
          Cons
        </div>
        {cons.map((item, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
              marginBottom: '0.5rem',
              ...(animate === 'stagger' ? { animation: `sm-fade-in 0.3s ease-out ${i * 0.08}s both` } : {}),
            }}
          >
            <XCircle size={18} style={{ color: 'var(--sm-danger, #ef4444)', flexShrink: 0, marginTop: '0.1rem' }} />
            <span style={{ color: 'var(--sm-text)', fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)' }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
