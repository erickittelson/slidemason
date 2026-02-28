import type { CSSProperties, ReactNode } from 'react';

export interface MeshGradientProps {
  children: ReactNode;
  colors?: string[];
  className?: string;
  style?: CSSProperties;
  animate?: boolean;
}

const defaultColors = [
  'var(--sm-gradient-mesh-1)',
  'var(--sm-gradient-mesh-2)',
  'var(--sm-gradient-mesh-3)',
  'var(--sm-gradient-mesh-4)',
];

const positions = [
  { top: '0%', left: '0%' },
  { top: '0%', right: '0%' },
  { bottom: '0%', left: '0%' },
  { bottom: '0%', right: '0%' },
] as const;

export function MeshGradient({
  children,
  colors = defaultColors,
  className = '',
  style,
  animate,
}: MeshGradientProps) {
  const animClass = animate ? 'sm-fade-up' : '';
  const meshColors = colors.length >= 4 ? colors : [...colors, ...defaultColors].slice(0, 4);

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      style={{
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {meshColors.map((color, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: '40%',
            height: '40%',
            borderRadius: '50%',
            background: color,
            filter: 'blur(80px)',
            ...positions[i],
          }}
        />
      ))}
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  );
}
