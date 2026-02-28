import type { CSSProperties } from 'react';

export interface ProgressStepsProps {
  steps: string[];
  current: number;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function ProgressSteps({ steps, current, className = '', style, animate }: ProgressStepsProps) {
  return (
    <div
      className={`${className}`.trim()}
      style={{ display: 'flex', alignItems: 'center', gap: 0, ...style }}
    >
      {steps.map((step, i) => {
        const isCompleted = i < current;
        const isCurrent = i === current;
        const animClass = animate
          ? `sm-fade-up${animate === 'stagger' ? ` sm-stagger-${i + 1}` : ''}`
          : '';
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
            <div
              className={`${animClass}${isCurrent ? ' sm-pulse' : ''}`.trim()}
              title={step}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: isCompleted || isCurrent ? 'var(--sm-primary)' : 'transparent',
                border: isCompleted || isCurrent ? '2px solid var(--sm-primary)' : '2px solid var(--sm-border)',
                flexShrink: 0,
              }}
            />
            {i < steps.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: '2px',
                  backgroundColor: isCompleted ? 'var(--sm-primary)' : 'var(--sm-border)',
                  minWidth: '1rem',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
