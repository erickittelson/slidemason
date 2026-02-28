import type { CSSProperties } from 'react';

export interface HeatmapGridProps {
  rows: Array<{ label: string; cells: number[] }>;
  columnLabels?: string[];
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function HeatmapGrid({
  rows,
  columnLabels,
  className,
  style,
  animate,
}: HeatmapGridProps) {
  const allValues = rows.flatMap((r) => r.cells);
  const maxVal = Math.max(...allValues, 1);
  const colCount = Math.max(...rows.map((r) => r.cells.length), 0);

  return (
    <div className={className} style={{ display: 'inline-block', ...style }}>
      {columnLabels && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `60px repeat(${colCount}, 36px)`,
            gap: 2,
            marginBottom: 2,
          }}
        >
          <div />
          {columnLabels.map((lbl, i) => (
            <div
              key={i}
              style={{
                fontSize: 9,
                textAlign: 'center',
                color: 'currentColor',
                overflow: 'hidden',
              }}
            >
              {lbl}
            </div>
          ))}
        </div>
      )}
      {rows.map((row, ri) => (
        <div
          key={ri}
          style={{
            display: 'grid',
            gridTemplateColumns: `60px repeat(${colCount}, 36px)`,
            gap: 2,
            marginBottom: 2,
          }}
        >
          <div style={{ fontSize: 10, lineHeight: '36px', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {row.label}
          </div>
          {row.cells.map((cell, ci) => (
            <div
              key={ci}
              style={{
                width: 36,
                height: 36,
                borderRadius: 3,
                backgroundColor: 'var(--sm-primary, #3b82f6)',
                opacity: Math.max(0.1, cell / maxVal),
                ...(animate
                  ? {
                      animation: `sm-fade-in 0.3s ease-out ${animate === 'stagger' ? `${(ri * colCount + ci) * 0.03}s` : '0s'} both`,
                    }
                  : {}),
              }}
              title={String(cell)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
