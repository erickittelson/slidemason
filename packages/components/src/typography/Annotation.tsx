import type { CSSProperties } from 'react';

export interface AnnotationProps {
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

const triangleStyles: Record<string, CSSProperties> = {
  top: {
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 0,
    height: 0,
    borderLeft: '6px solid transparent',
    borderRight: '6px solid transparent',
    borderBottom: '6px solid var(--sm-border)',
  },
  bottom: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 0,
    height: 0,
    borderLeft: '6px solid transparent',
    borderRight: '6px solid transparent',
    borderTop: '6px solid var(--sm-border)',
  },
  left: {
    position: 'absolute',
    right: '100%',
    top: '50%',
    transform: 'translateY(-50%)',
    width: 0,
    height: 0,
    borderTop: '6px solid transparent',
    borderBottom: '6px solid transparent',
    borderRight: '6px solid var(--sm-border)',
  },
  right: {
    position: 'absolute',
    left: '100%',
    top: '50%',
    transform: 'translateY(-50%)',
    width: 0,
    height: 0,
    borderTop: '6px solid transparent',
    borderBottom: '6px solid transparent',
    borderLeft: '6px solid var(--sm-border)',
  },
};

export function Annotation({
  text,
  position = 'top',
  className = '',
  style,
  animate,
}: AnnotationProps) {
  const animClass = animate ? 'sm-fade-in' : '';

  return (
    <div
      className={`relative inline-block rounded-[var(--sm-radius)] border border-[var(--sm-border)] bg-[var(--sm-surface)] px-3 py-1.5 text-xs text-[var(--sm-text)] ${animClass} ${className}`.trim()}
      style={style}
    >
      <span style={triangleStyles[position]} aria-hidden="true" />
      {text}
    </div>
  );
}
