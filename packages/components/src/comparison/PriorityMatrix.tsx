import type { CSSProperties } from 'react';

export interface PriorityMatrixProps {
  items: Array<{ label: string; effort: number; impact: number }>;
  effortLabel?: string;
  impactLabel?: string;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function PriorityMatrix({
  items,
  effortLabel = 'Effort',
  impactLabel = 'Impact',
  className = '',
  style,
  animate,
}: PriorityMatrixProps) {
  const animClass = animate ? 'sm-fade-up' : '';
  const size = 300;
  const pad = 36;

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      style={{ position: 'relative', ...style }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          width: size,
          height: size,
          margin: '0 auto',
          border: '1px solid var(--sm-border)',
          position: 'relative',
        }}
      >
        {/* Quadrant labels */}
        {['Major Projects', 'Quick Wins', 'Low Priority', 'Fill-Ins'].map((label, qi) => (
          <div
            key={label}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'clamp(0.55rem, 0.9vw, 0.7rem)',
              color: 'var(--sm-muted, #9ca3af)',
              fontWeight: 600,
              backgroundColor: label === 'Quick Wins' ? 'rgba(34,197,94,0.06)' : undefined,
              borderRight: qi % 2 === 0 ? '1px solid var(--sm-border)' : undefined,
              borderBottom: qi < 2 ? '1px solid var(--sm-border)' : undefined,
            }}
          >
            {label}
          </div>
        ))}
        {/* Items as dots */}
        {items.map((item, i) => {
          const x = (item.effort / 100) * (size - pad * 2) + pad;
          const y = size - ((item.impact / 100) * (size - pad * 2) + pad);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x - 6,
                top: y - 6,
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: 'var(--sm-primary)',
                ...(animate === 'stagger' ? { animation: `sm-fade-in 0.3s ease-out ${i * 0.1}s both` } : {}),
              }}
              title={item.label}
            />
          );
        })}
      </div>
      {/* Axis labels */}
      <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: 'clamp(0.65rem, 1vw, 0.8rem)', color: 'var(--sm-muted, #9ca3af)' }}>
        {effortLabel} →
      </div>
      <div
        style={{
          position: 'absolute',
          left: -24,
          top: '50%',
          transform: 'rotate(-90deg)',
          fontSize: 'clamp(0.65rem, 1vw, 0.8rem)',
          color: 'var(--sm-muted, #9ca3af)',
          whiteSpace: 'nowrap',
        }}
      >
        {impactLabel} →
      </div>
    </div>
  );
}
