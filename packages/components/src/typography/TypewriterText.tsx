import type { CSSProperties } from 'react';

export interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function TypewriterText({
  text,
  speed = 50,
  className = '',
  style,
  animate,
}: TypewriterTextProps) {
  const charCount = text.length;
  const duration = (charCount * speed) / 1000;

  const typewriterStyle: CSSProperties = {
    display: 'inline-block',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    borderRight: '2px solid var(--sm-primary)',
    width: animate !== false ? `${charCount}ch` : `${charCount}ch`,
    animation: animate !== false
      ? `sm-typewriter ${duration}s steps(${charCount}) forwards, sm-blink-cursor 0.75s step-end infinite`
      : undefined,
    ...style,
  };

  return (
    <>
      <style>{`
        @keyframes sm-typewriter {
          from { width: 0; }
          to { width: ${charCount}ch; }
        }
        @keyframes sm-blink-cursor {
          50% { border-color: transparent; }
        }
      `}</style>
      <span
        className={className || undefined}
        style={typewriterStyle}
      >
        {text}
      </span>
    </>
  );
}
