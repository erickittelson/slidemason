import type { CSSProperties } from 'react';

export interface BlobShapeProps {
  color?: string;
  size?: number;
  position?: { x: string; y: string };
  className?: string;
  style?: CSSProperties;
  animate?: boolean;
}

export function BlobShape({
  color = 'var(--sm-primary)',
  size = 200,
  position = { x: '50%', y: '50%' },
  className = '',
  style,
  animate,
}: BlobShapeProps) {
  const animClass = animate ? 'sm-fade-up' : '';

  return (
    <svg
      className={`${animClass} ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: 'absolute',
        top: position.y,
        left: position.x,
        transform: 'translate(-50%, -50%)',
        ...style,
      }}
    >
      <path
        d="M 100 20 C 140 20, 180 50, 180 100 C 180 150, 150 180, 100 180 C 50 180, 20 140, 30 100 C 40 60, 60 20, 100 20 Z"
        fill={color}
      />
    </svg>
  );
}
