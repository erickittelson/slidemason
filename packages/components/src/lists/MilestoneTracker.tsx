import type { CSSProperties } from 'react';
import { Check } from 'lucide-react';

export interface MilestoneTrackerProps {
  milestones: Array<{ label: string; status: 'completed' | 'current' | 'upcoming' }>;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function MilestoneTracker({ milestones, className = '', style, animate }: MilestoneTrackerProps) {
  return (
    <div
      className={`${className}`.trim()}
      style={{ display: 'flex', alignItems: 'flex-start', gap: 0, ...style }}
    >
      {milestones.map((ms, i) => {
        const animClass = animate
          ? `sm-fade-up${animate === 'stagger' ? ` sm-stagger-${i + 1}` : ''}`
          : '';
        return (
          <div
            key={i}
            className={animClass}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: i < milestones.length - 1 ? 1 : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <div
                className={ms.status === 'current' ? 'sm-pulse' : ''}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor:
                    ms.status === 'completed' || ms.status === 'current'
                      ? 'var(--sm-primary)'
                      : 'transparent',
                  border:
                    ms.status === 'upcoming'
                      ? '2px solid var(--sm-border)'
                      : '2px solid var(--sm-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {ms.status === 'completed' && (
                  <Check size={14} style={{ color: 'var(--sm-bg, #fff)' }} />
                )}
              </div>
              {i < milestones.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: '2px',
                    backgroundColor:
                      ms.status === 'completed' ? 'var(--sm-primary)' : 'var(--sm-border)',
                    minWidth: '1rem',
                  }}
                />
              )}
            </div>
            <span
              style={{
                color: ms.status === 'upcoming' ? 'var(--sm-muted)' : 'var(--sm-text)',
                fontSize: 'clamp(0.65rem, 1vw, 0.8rem)',
                marginTop: '0.5rem',
                textAlign: 'center',
                fontWeight: ms.status === 'current' ? 600 : 400,
              }}
            >
              {ms.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
