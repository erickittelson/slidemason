import type { CSSProperties } from 'react';

export interface ScoreCardProps {
  criteria: Array<{ label: string; weight: number; score: number }>;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function ScoreCard({ criteria, className = '', style, animate }: ScoreCardProps) {
  const animClass = animate ? 'sm-fade-up' : '';
  const total = criteria.reduce((sum, c) => sum + c.weight * c.score, 0);

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
          {['Criteria', 'Weight', 'Score', 'Weighted'].map((h) => (
            <th
              key={h}
              style={{
                textAlign: h === 'Criteria' ? 'left' : 'center',
                padding: '0.5rem 0.75rem',
                backgroundColor: 'var(--sm-surface)',
                borderBottom: '2px solid var(--sm-border)',
              }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {criteria.map((c, i) => (
          <tr
            key={i}
            style={animate === 'stagger' ? { animation: `sm-fade-in 0.3s ease-out ${i * 0.06}s both` } : undefined}
          >
            <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--sm-border)' }}>{c.label}</td>
            <td style={{ textAlign: 'center', padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--sm-border)' }}>{c.weight}</td>
            <td style={{ textAlign: 'center', padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--sm-border)' }}>{c.score}</td>
            <td style={{ textAlign: 'center', padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--sm-border)', fontWeight: 600 }}>
              {(c.weight * c.score).toFixed(1)}
            </td>
          </tr>
        ))}
        <tr style={{ fontWeight: 700, backgroundColor: 'var(--sm-surface)' }}>
          <td colSpan={3} style={{ padding: '0.5rem 0.75rem', borderTop: '2px solid var(--sm-border)', textAlign: 'right' }}>
            Total
          </td>
          <td style={{ textAlign: 'center', padding: '0.5rem 0.75rem', borderTop: '2px solid var(--sm-border)' }}>
            {total.toFixed(1)}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
