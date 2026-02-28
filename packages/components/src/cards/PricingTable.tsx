import type { CSSProperties } from 'react';

export interface PricingTier {
  name: string;
  price: string;
  period?: string;
  features: string[];
  highlighted?: boolean;
}

export interface PricingTableProps {
  tiers: PricingTier[];
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function PricingTable({ tiers, className = '', style, animate }: PricingTableProps) {
  const animClass = animate ? 'sm-fade-up' : '';

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', ...style }}
    >
      {tiers.map((tier, i) => {
        const staggerClass = animate === 'stagger' ? `sm-fade-up sm-stagger-${i + 1}` : '';
        return (
          <div
            key={i}
            className={staggerClass}
            style={{
              flex: '1 1 0',
              padding: '1.5rem',
              backgroundColor: 'var(--sm-surface)',
              border: tier.highlighted ? '2px solid var(--sm-primary)' : '1px solid var(--sm-border)',
              borderRadius: 'var(--sm-radius)',
              position: 'relative',
            }}
          >
            {tier.highlighted && (
              <div
                style={{
                  position: 'absolute',
                  top: '-0.75rem',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'var(--sm-primary)',
                  color: 'var(--sm-bg)',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '0.15rem 0.75rem',
                  borderRadius: '999px',
                }}
              >
                Popular
              </div>
            )}
            <div style={{ fontWeight: 700, color: 'var(--sm-text)', fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)', marginBottom: '0.5rem' }}>
              {tier.name}
            </div>
            <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 700, color: 'var(--sm-text)' }}>
              {tier.price}
              {tier.period && (
                <span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--sm-muted)' }}>/{tier.period}</span>
              )}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {tier.features.map((feature, j) => (
                <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--sm-text)', fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)' }}>
                  <span style={{ color: 'var(--sm-primary)' }}>✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
