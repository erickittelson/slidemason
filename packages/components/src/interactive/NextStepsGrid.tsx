import type { CSSProperties } from 'react';

export interface NextStepsGridProps {
  steps: Array<{
    action: string;
    owner?: string;
    date?: string;
    status?: 'todo' | 'in-progress' | 'done';
  }>;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

const statusColors: Record<string, { bg: string; text: string }> = {
  todo: { bg: 'var(--sm-muted, #a0aec0)', text: '#fff' },
  'in-progress': { bg: 'var(--sm-warning, #dd6b20)', text: '#fff' },
  done: { bg: 'var(--sm-success, #38a169)', text: '#fff' },
};

const statusLabels: Record<string, string> = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
};

export function NextStepsGrid({ steps, className = '', style, animate }: NextStepsGridProps) {
  const animClass = animate ? (animate === 'stagger' ? 'sm-stagger' : 'sm-fade-up') : '';

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      style={{
        width: '100%',
        overflow: 'auto',
        ...style,
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)',
        }}
      >
        <thead>
          <tr>
            {['Action', 'Owner', 'Date', 'Status'].map((col) => (
              <th
                key={col}
                style={{
                  textAlign: 'left',
                  padding: '0.5rem 0.75rem',
                  borderBottom: '2px solid var(--sm-border, #e2e8f0)',
                  color: 'var(--sm-muted)',
                  fontWeight: 600,
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {steps.map((step, i) => {
            const status = step.status ?? 'todo';
            const colors = statusColors[status] ?? statusColors.todo;
            return (
              <tr key={i}>
                <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--sm-border, #e2e8f0)', color: 'var(--sm-text)' }}>
                  {step.action}
                </td>
                <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--sm-border, #e2e8f0)', color: 'var(--sm-muted)' }}>
                  {step.owner ?? '—'}
                </td>
                <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--sm-border, #e2e8f0)', color: 'var(--sm-muted)' }}>
                  {step.date ?? '—'}
                </td>
                <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--sm-border, #e2e8f0)' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '999px',
                      fontSize: '0.75em',
                      fontWeight: 600,
                      backgroundColor: colors.bg,
                      color: colors.text,
                    }}
                  >
                    {statusLabels[status] ?? status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
