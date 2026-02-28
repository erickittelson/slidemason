import type { CSSProperties } from 'react';
import * as icons from 'lucide-react';

export interface ProcessFlowProps {
  steps: Array<{ label: string; icon?: string }>;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function ProcessFlow({ steps, className = '', style, animate }: ProcessFlowProps) {
  return (
    <div
      className={`${className}`.trim()}
      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', ...style }}
    >
      {steps.map((step, i) => {
        const IconComponent = step.icon
          ? (icons as Record<string, React.ComponentType<{ size?: number; style?: CSSProperties }>>)[step.icon]
          : undefined;
        const animClass = animate
          ? `sm-fade-up${animate === 'stagger' ? ` sm-stagger-${i + 1}` : ''}`
          : '';
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              className={animClass}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: 'var(--sm-surface)',
                border: '1px solid var(--sm-border)',
                borderRadius: '0.5rem',
              }}
            >
              {IconComponent && (
                <IconComponent size={18} style={{ color: 'var(--sm-primary)' }} />
              )}
              <span style={{ color: 'var(--sm-text)', fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)' }}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span style={{ color: 'var(--sm-muted)', fontSize: '1.25rem' }} aria-hidden="true">
                →
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
