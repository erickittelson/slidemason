import React from 'react';

interface DataTableProps {
  headers: string[];
  rows: string[][];
  highlight?: number[];
  compact?: boolean;
  style?: React.CSSProperties;
}

export function DataTable({
  headers,
  rows,
  highlight = [],
  compact = false,
  style,
}: DataTableProps) {
  const cellPad = compact
    ? 'clamp(0.3rem, 0.6vw, 0.5rem) clamp(0.5rem, 1vw, 0.75rem)'
    : 'clamp(0.5rem, 1vw, 0.75rem) clamp(0.75rem, 1.5vw, 1.25rem)';

  return (
    <div
      data-pptx-type="table"
      style={{
        overflow: 'hidden',
        borderRadius: 'var(--sm-radius)',
        border: '1px solid var(--sm-border)',
        background: 'var(--sm-glass-bg)',
        backdropFilter: 'blur(12px)',
        ...style,
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: compact ? 'clamp(0.65rem, 0.9vw, 0.8rem)' : 'clamp(0.75rem, 1vw, 0.9rem)',
        }}
      >
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                style={{
                  padding: cellPad,
                  textAlign: 'left',
                  color: 'var(--sm-muted)',
                  fontWeight: 600,
                  fontSize: 'clamp(0.6rem, 0.8vw, 0.75rem)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  borderBottom: '1px solid var(--sm-border)',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => {
            const isHighlighted = highlight.includes(ri);
            return (
              <tr
                key={ri}
                style={{
                  borderBottom: ri < rows.length - 1 ? '1px solid var(--sm-border)' : undefined,
                  background: isHighlighted
                    ? 'rgba(139,92,246,0.1)'
                    : ri % 2 === 1
                      ? 'rgba(255,255,255,0.02)'
                      : undefined,
                }}
              >
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    style={{
                      padding: cellPad,
                      color: isHighlighted ? 'var(--sm-text)' : ci === 0 ? 'var(--sm-text)' : 'var(--sm-muted)',
                      fontWeight: ci === 0 || isHighlighted ? 500 : 400,
                      borderLeft: isHighlighted && ci === 0
                        ? '3px solid var(--sm-primary)'
                        : undefined,
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
