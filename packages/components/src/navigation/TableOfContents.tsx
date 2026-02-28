import type { CSSProperties } from 'react';

export interface TableOfContentsProps {
  items: Array<{ title: string; page?: number }>;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function TableOfContents({
  items,
  className = '',
  style,
  animate,
}: TableOfContentsProps) {
  const animClass = animate ? (animate === 'stagger' ? 'sm-stagger' : 'sm-fade-up') : '';
  const firstNoPage = items.findIndex((item) => item.page == null);

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        ...style,
      }}
    >
      {items.map((item, i) => {
        const isActive = i === firstNoPage;
        return (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '0.25rem',
              color: isActive ? 'var(--sm-primary)' : 'inherit',
              fontWeight: isActive ? 700 : 400,
            }}
          >
            <span style={{ flexShrink: 0 }}>{item.title}</span>
            <span
              style={{
                flex: 1,
                borderBottom: '2px dotted var(--sm-muted, #ccc)',
                minWidth: '2rem',
                alignSelf: 'end',
                marginBottom: '0.25em',
              }}
            />
            {item.page != null && (
              <span style={{ flexShrink: 0 }}>{item.page}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
