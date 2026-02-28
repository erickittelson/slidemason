import type { CSSProperties, ReactNode } from 'react';

export interface GridLinesProps {
  children?: ReactNode;
  spacing?: number;
  opacity?: number;
  className?: string;
  style?: CSSProperties;
  animate?: boolean;
}

export function GridLines({
  children,
  spacing = 40,
  opacity = 0.05,
  className = '',
  style,
  animate,
}: GridLinesProps) {
  const animClass = animate ? 'sm-fade-up' : '';
  const patternId = 'sm-grid-lines';

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      style={{ position: 'relative', ...style }}
    >
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity,
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id={patternId} x="0" y="0" width={spacing} height={spacing} patternUnits="userSpaceOnUse">
            <line x1={spacing} y1="0" x2={spacing} y2={spacing} stroke="var(--sm-border)" strokeWidth="0.5" />
            <line x1="0" y1={spacing} x2={spacing} y2={spacing} stroke="var(--sm-border)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
      {children && <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>}
    </div>
  );
}
