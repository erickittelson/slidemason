import type { CSSProperties } from 'react';

export interface StepCardsProps {
  steps: Array<{ number: number; title: string; description: string }>;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function StepCards({ steps, className = '', style, animate }: StepCardsProps) {
  return (
    <div
      className={`${className}`.trim()}
      style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', ...style }}
    >
      {steps.map((step, i) => {
        const animClass = animate
          ? `sm-fade-up${animate === 'stagger' ? ` sm-stagger-${i + 1}` : ''}`
          : '';
        return (
          <div
            key={i}
            className={animClass}
            style={{
              flex: '1 1 200px',
              padding: '1.25rem',
              backgroundColor: 'var(--sm-surface)',
              border: '1px solid var(--sm-border)',
              borderRadius: '0.5rem',
            }}
          >
            <div
              style={{
                color: 'var(--sm-primary)',
                fontWeight: 700,
                fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                marginBottom: '0.5rem',
              }}
            >
              {String(step.number).padStart(2, '0')}
            </div>
            <div style={{ color: 'var(--sm-text)', fontWeight: 600, fontSize: 'clamp(0.85rem, 1.5vw, 1.1rem)', marginBottom: '0.25rem' }}>
              {step.title}
            </div>
            <div style={{ color: 'var(--sm-muted)', fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)' }}>
              {step.description}
            </div>
          </div>
        );
      })}
    </div>
  );
}
