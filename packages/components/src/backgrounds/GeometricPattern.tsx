import type { CSSProperties, ReactNode } from 'react';

export interface GeometricPatternProps {
  children?: ReactNode;
  pattern?: 'dots' | 'lines' | 'triangles' | 'crosses';
  opacity?: number;
  className?: string;
  style?: CSSProperties;
  animate?: boolean;
}

function patternContent(pattern: string) {
  switch (pattern) {
    case 'dots':
      return {
        width: 20,
        height: 20,
        content: <circle cx="10" cy="10" r="1.5" fill="currentColor" />,
      };
    case 'lines':
      return {
        width: 20,
        height: 20,
        content: <line x1="0" y1="20" x2="20" y2="0" stroke="currentColor" strokeWidth="0.5" />,
      };
    case 'triangles':
      return {
        width: 24,
        height: 24,
        content: <polygon points="12,4 20,20 4,20" fill="none" stroke="currentColor" strokeWidth="0.5" />,
      };
    case 'crosses':
      return {
        width: 20,
        height: 20,
        content: (
          <>
            <line x1="7" y1="10" x2="13" y2="10" stroke="currentColor" strokeWidth="0.5" />
            <line x1="10" y1="7" x2="10" y2="13" stroke="currentColor" strokeWidth="0.5" />
          </>
        ),
      };
    default:
      return {
        width: 20,
        height: 20,
        content: <circle cx="10" cy="10" r="1.5" fill="currentColor" />,
      };
  }
}

export function GeometricPattern({
  children,
  pattern = 'dots',
  opacity = 0.05,
  className = '',
  style,
  animate,
}: GeometricPatternProps) {
  const animClass = animate ? 'sm-fade-up' : '';
  const { width, height, content } = patternContent(pattern);
  const patternId = `sm-geo-${pattern}`;

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
          <pattern id={patternId} x="0" y="0" width={width} height={height} patternUnits="userSpaceOnUse">
            {content}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
      {children && <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>}
    </div>
  );
}
