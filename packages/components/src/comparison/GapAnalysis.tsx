import type { CSSProperties } from 'react';

export interface GapAnalysisProps {
  current: { label: string; value: string };
  desired: { label: string; value: string };
  gap: string;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function GapAnalysis({ current, desired, gap, className = '', style, animate }: GapAnalysisProps) {
  const animClass = animate ? 'sm-fade-up' : '';

  const boxStyle: CSSProperties = {
    padding: '1rem 1.25rem',
    backgroundColor: 'var(--sm-surface)',
    border: '1px solid var(--sm-border)',
    borderRadius: 'var(--sm-radius)',
    textAlign: 'center',
  };

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        gap: '1rem',
        alignItems: 'center',
        ...style,
      }}
    >
      {/* Current */}
      <div style={boxStyle}>
        <div style={{ fontWeight: 700, fontSize: 'clamp(0.8rem, 1.3vw, 0.95rem)', color: 'var(--sm-text)', marginBottom: '0.3rem' }}>
          {current.label}
        </div>
        <div style={{ fontSize: 'clamp(0.7rem, 1.1vw, 0.85rem)', color: 'var(--sm-muted, #9ca3af)' }}>
          {current.value}
        </div>
      </div>
      {/* Gap arrow */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
        <div style={{ fontSize: '1.5rem', color: 'var(--sm-warning, #f59e0b)', fontWeight: 700 }}>→</div>
        <div style={{ fontSize: 'clamp(0.65rem, 1vw, 0.8rem)', color: 'var(--sm-warning, #f59e0b)', fontWeight: 600, textAlign: 'center' }}>
          {gap}
        </div>
      </div>
      {/* Desired */}
      <div style={{ ...boxStyle, borderColor: 'var(--sm-primary)', borderWidth: 2 }}>
        <div style={{ fontWeight: 700, fontSize: 'clamp(0.8rem, 1.3vw, 0.95rem)', color: 'var(--sm-text)', marginBottom: '0.3rem' }}>
          {desired.label}
        </div>
        <div style={{ fontSize: 'clamp(0.7rem, 1.1vw, 0.85rem)', color: 'var(--sm-muted, #9ca3af)' }}>
          {desired.value}
        </div>
      </div>
    </div>
  );
}
