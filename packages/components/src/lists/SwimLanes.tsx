import type { CSSProperties } from 'react';

export interface SwimLanesProps {
  lanes: Array<{
    label: string;
    items: Array<{ text: string; start: number; end: number }>;
  }>;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function SwimLanes({ lanes, className = '', style, animate }: SwimLanesProps) {
  return (
    <div
      className={`${className}`.trim()}
      style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', ...style }}
    >
      {lanes.map((lane, i) => {
        const animClass = animate
          ? `sm-fade-up${animate === 'stagger' ? ` sm-stagger-${i + 1}` : ''}`
          : '';
        return (
          <div
            key={i}
            className={animClass}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          >
            <div
              style={{
                minWidth: '6rem',
                color: 'var(--sm-text)',
                fontWeight: 600,
                fontSize: 'clamp(0.7rem, 1.2vw, 0.85rem)',
                flexShrink: 0,
              }}
            >
              {lane.label}
            </div>
            <div
              style={{
                flex: 1,
                position: 'relative',
                height: '2rem',
                backgroundColor: 'var(--sm-border)',
                borderRadius: '0.25rem',
                overflow: 'hidden',
              }}
            >
              {lane.items.map((item, j) => (
                <div
                  key={j}
                  title={item.text}
                  style={{
                    position: 'absolute',
                    left: `${item.start}%`,
                    width: `${item.end - item.start}%`,
                    top: '2px',
                    bottom: '2px',
                    backgroundColor: 'var(--sm-surface)',
                    border: '1px solid var(--sm-border)',
                    borderRadius: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 0.25rem',
                    overflow: 'hidden',
                  }}
                >
                  <span
                    style={{
                      color: 'var(--sm-text)',
                      fontSize: 'clamp(0.55rem, 0.9vw, 0.7rem)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
