import type { CSSProperties } from 'react';

export interface SWOTGridProps {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

const quadrants = [
  { key: 'strengths' as const, label: 'Strengths', color: 'var(--sm-success, #22c55e)' },
  { key: 'weaknesses' as const, label: 'Weaknesses', color: 'var(--sm-danger, #ef4444)' },
  { key: 'opportunities' as const, label: 'Opportunities', color: 'var(--sm-primary)' },
  { key: 'threats' as const, label: 'Threats', color: 'var(--sm-warning, #f59e0b)' },
] as const;

export function SWOTGrid(props: SWOTGridProps) {
  const { className = '', style, animate } = props;
  const animClass = animate ? 'sm-fade-up' : '';

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: '0.75rem',
        ...style,
      }}
    >
      {quadrants.map((q, qi) => (
        <div
          key={q.key}
          style={{
            backgroundColor: 'var(--sm-surface)',
            border: `2px solid ${q.color}`,
            borderRadius: 'var(--sm-radius)',
            padding: '1rem',
            ...(animate === 'stagger' ? { animation: `sm-fade-in 0.3s ease-out ${qi * 0.1}s both` } : {}),
          }}
        >
          <div style={{ fontWeight: 700, color: q.color, marginBottom: '0.5rem', fontSize: 'clamp(0.85rem, 1.4vw, 1rem)' }}>
            {q.label}
          </div>
          {props[q.key].map((item, i) => (
            <div
              key={i}
              style={{
                fontSize: 'clamp(0.7rem, 1.1vw, 0.8rem)',
                color: 'var(--sm-text)',
                marginBottom: '0.3rem',
                paddingLeft: '0.5rem',
              }}
            >
              {'\u2022'} {item}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
