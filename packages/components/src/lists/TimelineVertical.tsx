import type { CSSProperties } from 'react';

export interface TimelineVerticalProps {
  events: Array<{ date: string; title: string; description?: string }>;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function TimelineVertical({ events, className = '', style, animate }: TimelineVerticalProps) {
  return (
    <div
      className={`${className}`.trim()}
      style={{ position: 'relative', paddingLeft: '2rem', ...style }}
    >
      {/* Vertical line */}
      <div
        style={{
          position: 'absolute',
          left: '0.5rem',
          top: 0,
          bottom: 0,
          width: '2px',
          backgroundColor: 'var(--sm-border)',
        }}
      />
      {events.map((event, i) => {
        const animClass = animate
          ? `sm-fade-up${animate === 'stagger' ? ` sm-stagger-${i + 1}` : ''}`
          : '';
        return (
          <div
            key={i}
            className={animClass}
            style={{
              position: 'relative',
              paddingBottom: i < events.length - 1 ? '1.5rem' : 0,
            }}
          >
            {/* Dot marker */}
            <div
              style={{
                position: 'absolute',
                left: '-1.75rem',
                top: '0.25rem',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: 'var(--sm-primary)',
                border: '2px solid var(--sm-primary)',
              }}
            />
            <div style={{ color: 'var(--sm-muted)', fontSize: 'clamp(0.7rem, 1.2vw, 0.85rem)', marginBottom: '0.25rem' }}>
              {event.date}
            </div>
            <div style={{ color: 'var(--sm-text)', fontWeight: 600, fontSize: 'clamp(0.85rem, 1.5vw, 1.1rem)' }}>
              {event.title}
            </div>
            {event.description && (
              <div style={{ color: 'var(--sm-muted)', fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)', marginTop: '0.25rem' }}>
                {event.description}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
