import type { CSSProperties } from 'react';
import { CheckCircle2, Minus } from 'lucide-react';

export interface FeatureMatrixProps {
  features: string[];
  products: Array<{ name: string; values: Array<boolean | string> }>;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function FeatureMatrix({ features, products, className = '', style, animate }: FeatureMatrixProps) {
  const animClass = animate ? 'sm-fade-up' : '';

  return (
    <table
      className={`${animClass} ${className}`.trim()}
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: 'clamp(0.7rem, 1.2vw, 0.85rem)',
        color: 'var(--sm-text)',
        ...style,
      }}
    >
      <thead>
        <tr>
          <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', backgroundColor: 'var(--sm-surface)', borderBottom: '2px solid var(--sm-border)' }}>
            Feature
          </th>
          {products.map((p, i) => (
            <th key={i} style={{ textAlign: 'center', padding: '0.5rem 0.75rem', backgroundColor: 'var(--sm-surface)', borderBottom: '2px solid var(--sm-border)' }}>
              {p.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {features.map((feature, fi) => (
          <tr
            key={fi}
            style={animate === 'stagger' ? { animation: `sm-fade-in 0.3s ease-out ${fi * 0.06}s both` } : undefined}
          >
            <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--sm-border)' }}>
              {feature}
            </td>
            {products.map((p, pi) => {
              const val = p.values[fi];
              return (
                <td key={pi} style={{ textAlign: 'center', padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--sm-border)' }}>
                  {typeof val === 'boolean' ? (
                    val ? (
                      <CheckCircle2 size={18} style={{ color: 'var(--sm-success, #22c55e)' }} />
                    ) : (
                      <Minus size={18} style={{ color: 'var(--sm-muted, #9ca3af)' }} />
                    )
                  ) : (
                    val
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
