import type { CSSProperties } from 'react';

export interface QRCodeProps {
  url: string;
  size?: number;
  label?: string;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

/** Generate a deterministic pseudo-QR pattern from a string */
function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return h;
}

export function QRCode({
  url,
  size = 128,
  label,
  className = '',
  style,
  animate,
}: QRCodeProps) {
  const animClass = animate ? (animate === 'stagger' ? 'sm-stagger' : 'sm-fade-up') : '';
  const gridSize = 21;
  const cellSize = size / gridSize;
  const hash = hashCode(url);

  const cells: Array<{ x: number; y: number }> = [];

  // Finder patterns (three corners)
  const finderPositions = [
    [0, 0],
    [gridSize - 7, 0],
    [0, gridSize - 7],
  ];
  for (const [fx, fy] of finderPositions) {
    for (let dx = 0; dx < 7; dx++) {
      for (let dy = 0; dy < 7; dy++) {
        const isOuter = dx === 0 || dx === 6 || dy === 0 || dy === 6;
        const isInner = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4;
        if (isOuter || isInner) {
          cells.push({ x: fx + dx, y: fy + dy });
        }
      }
    }
  }

  // Data area: pseudo-random fill
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      // Skip finder regions
      const inFinder = finderPositions.some(
        ([fx, fy]) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7
      );
      if (inFinder) continue;
      const v = ((hash * (x + 1) * 31 + (y + 1) * 17) >>> 0) % 3;
      if (v === 0) {
        cells.push({ x, y });
      }
    }
  }

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        ...style,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`QR code for ${url}`}
        style={{ backgroundColor: '#fff', border: '1px solid var(--sm-border, #e2e8f0)', borderRadius: '4px' }}
      >
        {cells.map((c, i) => (
          <rect
            key={i}
            x={c.x * cellSize}
            y={c.y * cellSize}
            width={cellSize}
            height={cellSize}
            fill="var(--sm-text, #1a202c)"
          />
        ))}
      </svg>
      {label && (
        <div style={{ color: 'var(--sm-muted)', fontSize: 'clamp(0.7rem, 1vw, 0.85rem)', textAlign: 'center' }}>
          {label}
        </div>
      )}
    </div>
  );
}
