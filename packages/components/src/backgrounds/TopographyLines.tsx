import type { CSSProperties, ReactNode } from 'react';

export interface TopographyLinesProps {
  children?: ReactNode;
  opacity?: number;
  className?: string;
  style?: CSSProperties;
  animate?: boolean;
}

export function TopographyLines({
  children,
  opacity = 0.05,
  className = '',
  style,
  animate,
}: TopographyLinesProps) {
  const animClass = animate ? 'sm-fade-up' : '';
  const patternId = 'sm-topo';

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
          <pattern id={patternId} x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M10,80 Q30,60 50,70 T90,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <path d="M5,60 Q25,40 50,50 T95,30" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <path d="M0,40 Q20,20 50,30 T100,10" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <path d="M15,95 Q35,75 55,85 T85,70" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
      {children && <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>}
    </div>
  );
}
