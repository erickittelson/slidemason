import type { CSSProperties } from 'react';

export interface TrafficLightProps {
  items: Array<{ label: string; status: 'green' | 'yellow' | 'red'; note?: string }>;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

const statusColors: Record<string, string> = {
  green: 'var(--sm-success, #22c55e)',
  yellow: 'var(--sm-warning, #f59e0b)',
  red: 'var(--sm-danger, #ef4444)',
};

export function TrafficLight({ items, className = '', style, animate }: TrafficLightProps) {
  const animClass = animate ? 'sm-fade-up' : '';

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        ...style,
      }}
    >
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.5rem 0.75rem',
            ...(animate === 'stagger' ? { animation: `sm-fade-in 0.3s ease-out ${i * 0.08}s both` } : {}),
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              backgroundColor: statusColors[item.status],
              flexShrink: 0,
            }}
          />
          <span style={{ color: 'var(--sm-text)', fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)', fontWeight: 600 }}>
            {item.label}
          </span>
          {item.note && (
            <span style={{ color: 'var(--sm-muted, #9ca3af)', fontSize: 'clamp(0.65rem, 1vw, 0.8rem)', marginLeft: 'auto' }}>
              {item.note}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
