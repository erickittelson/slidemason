import type { CSSProperties } from 'react';

export interface TimelineHorizontalProps {
  milestones: Array<{ label: string; date?: string; active?: boolean }>;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function TimelineHorizontal({ milestones, className = '', style, animate }: TimelineHorizontalProps) {
  return (
    <div
      className={`${className}`.trim()}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', ...style }}
    >
      {/* Horizontal line */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: '2px',
          backgroundColor: 'var(--sm-border)',
          transform: 'translateY(-50%)',
          zIndex: 0,
        }}
      />
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
              position: 'relative',
              zIndex: 1,
            }}
          >
            <div
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                backgroundColor: ms.active ? 'var(--sm-primary)' : 'var(--sm-border)',
                border: ms.active ? '2px solid var(--sm-primary)' : '2px solid var(--sm-border)',
                marginBottom: '0.5rem',
              }}
            />
            <div style={{ color: 'var(--sm-text)', fontWeight: ms.active ? 600 : 400, fontSize: 'clamp(0.7rem, 1.2vw, 0.85rem)', textAlign: 'center' }}>
              {ms.label}
            </div>
            {ms.date && (
              <div style={{ color: 'var(--sm-muted)', fontSize: 'clamp(0.6rem, 1vw, 0.75rem)', textAlign: 'center' }}>
                {ms.date}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
