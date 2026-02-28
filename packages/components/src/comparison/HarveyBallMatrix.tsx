import type { CSSProperties } from 'react';
import { HarveyBall } from '../dataviz/HarveyBall';

export interface HarveyBallMatrixProps {
  criteria: string[];
  options: Array<{ name: string; scores: Array<0 | 25 | 50 | 75 | 100> }>;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function HarveyBallMatrix({ criteria, options, className = '', style, animate }: HarveyBallMatrixProps) {
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
            Criteria
          </th>
          {options.map((o, i) => (
            <th key={i} style={{ textAlign: 'center', padding: '0.5rem 0.75rem', backgroundColor: 'var(--sm-surface)', borderBottom: '2px solid var(--sm-border)' }}>
              {o.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {criteria.map((c, ci) => (
          <tr
            key={ci}
            style={animate === 'stagger' ? { animation: `sm-fade-in 0.3s ease-out ${ci * 0.06}s both` } : undefined}
          >
            <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--sm-border)' }}>
              {c}
            </td>
            {options.map((o, oi) => (
              <td key={oi} style={{ textAlign: 'center', padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--sm-border)' }}>
                <HarveyBall value={o.scores[ci]} size={20} animate={animate} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
