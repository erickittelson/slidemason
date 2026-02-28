import type { CSSProperties } from 'react';

export interface LabelProps {
  text: string;
  color?: string;
  variant?: 'filled' | 'outline';
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function Label({
  text,
  color,
  variant = 'filled',
  className = '',
  style,
  animate,
}: LabelProps) {
  const resolvedColor = color || 'var(--sm-primary)';
  const animClass = animate ? 'sm-fade-in' : '';

  const variantStyle: CSSProperties =
    variant === 'filled'
      ? {
          backgroundColor: resolvedColor,
          color: 'var(--sm-bg)',
        }
      : {
          backgroundColor: 'transparent',
          border: `1px solid ${resolvedColor}`,
          color: resolvedColor,
        };

  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${animClass} ${className}`.trim()}
      style={{ ...variantStyle, ...style }}
    >
      {text}
    </span>
  );
}
