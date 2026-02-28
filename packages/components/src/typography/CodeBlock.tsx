import type { CSSProperties } from 'react';

export interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function CodeBlock({
  code,
  language,
  className = '',
  style,
  animate,
}: CodeBlockProps) {
  const animClass = animate ? 'sm-fade-in' : '';
  const lines = code.split('\n');

  return (
    <div
      className={`relative overflow-hidden rounded-[var(--sm-radius)] border border-[var(--sm-border)] bg-[var(--sm-surface)] ${animClass} ${className}`.trim()}
      style={style}
    >
      {language && (
        <div
          className="absolute right-0 top-0 rounded-bl-[var(--sm-radius)] border-b border-l border-[var(--sm-border)] bg-[var(--sm-surface)] px-3 py-1 text-xs text-[var(--sm-muted)]"
        >
          {language}
        </div>
      )}
      <pre
        className="overflow-x-auto p-4"
        style={{ margin: 0, fontFamily: 'var(--sm-mono-font, ui-monospace, monospace)' }}
      >
        <code>
          {lines.map((line, i) => (
            <div key={i} className="flex">
              <span
                className="inline-block select-none text-right text-[var(--sm-muted)]"
                style={{ width: '3ch', marginRight: '1.5ch', opacity: 0.5 }}
              >
                {i + 1}
              </span>
              <span>{line}</span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}
