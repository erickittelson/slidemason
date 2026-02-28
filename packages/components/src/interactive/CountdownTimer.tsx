import type { CSSProperties } from 'react';

export interface CountdownTimerProps {
  targetDate: string;
  labels?: { days?: string; hours?: string; minutes?: string; seconds?: string };
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function CountdownTimer({
  targetDate,
  labels,
  className = '',
  style,
  animate,
}: CountdownTimerProps) {
  const animClass = animate ? (animate === 'stagger' ? 'sm-stagger' : 'sm-fade-up') : '';

  const target = new Date(targetDate).getTime();
  const now = Date.now();
  let diff = Math.max(0, Math.floor((target - now) / 1000));

  const days = Math.floor(diff / 86400);
  diff %= 86400;
  const hours = Math.floor(diff / 3600);
  diff %= 3600;
  const minutes = Math.floor(diff / 60);
  const seconds = diff % 60;

  const segments = [
    { value: days, label: labels?.days ?? 'Days' },
    { value: hours, label: labels?.hours ?? 'Hours' },
    { value: minutes, label: labels?.minutes ?? 'Minutes' },
    { value: seconds, label: labels?.seconds ?? 'Seconds' },
  ];

  const boxStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.75rem 1rem',
    backgroundColor: 'var(--sm-surface)',
    border: '1px solid var(--sm-border)',
    borderRadius: 'var(--sm-radius)',
    minWidth: '4rem',
  };

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      style={{
        display: 'flex',
        gap: '0.75rem',
        justifyContent: 'center',
        ...style,
      }}
    >
      {segments.map((seg, i) => (
        <div key={i} style={boxStyle}>
          <div style={{ fontWeight: 700, fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', color: 'var(--sm-text)', lineHeight: 1 }}>
            {String(seg.value).padStart(2, '0')}
          </div>
          <div style={{ fontSize: 'clamp(0.6rem, 0.9vw, 0.75rem)', color: 'var(--sm-muted)', marginTop: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {seg.label}
          </div>
        </div>
      ))}
    </div>
  );
}
