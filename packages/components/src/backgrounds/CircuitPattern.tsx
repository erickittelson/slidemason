import type { CSSProperties, ReactNode } from 'react';

export interface CircuitPatternProps {
  children?: ReactNode;
  opacity?: number;
  className?: string;
  style?: CSSProperties;
  animate?: boolean;
}

export function CircuitPattern({
  children,
  opacity = 0.03,
  className = '',
  style,
  animate,
}: CircuitPatternProps) {
  const animClass = animate ? 'sm-fade-up' : '';
  const patternId = 'sm-circuit';

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
          <pattern id={patternId} x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="2" fill="currentColor" />
            <circle cx="50" cy="50" r="2" fill="currentColor" />
            <line x1="10" y1="10" x2="10" y2="30" stroke="currentColor" strokeWidth="0.5" />
            <line x1="10" y1="30" x2="50" y2="30" stroke="currentColor" strokeWidth="0.5" />
            <line x1="50" y1="30" x2="50" y2="50" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="10" cy="30" r="1" fill="currentColor" />
            <circle cx="50" cy="30" r="1" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
      {children && <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>}
    </div>
  );
}
