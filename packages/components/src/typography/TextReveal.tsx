import type { CSSProperties } from 'react';

export interface TextRevealProps {
  lines: string[];
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function TextReveal({
  lines,
  className = '',
  style,
  animate,
}: TextRevealProps) {
  return (
    <div className={className || undefined} style={style}>
      {lines.map((line, i) => (
        <div
          key={i}
          className={
            animate
              ? `sm-fade-up sm-stagger-${i + 1}`
              : undefined
          }
        >
          {line}
        </div>
      ))}
    </div>
  );
}
