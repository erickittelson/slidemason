import type { CSSProperties, ReactNode } from 'react';

export interface BrowserMockupProps {
  url?: string;
  src?: string;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function BrowserMockup({ url, src, children, className = '', style, animate }: BrowserMockupProps) {
  const animClass = animate ? 'sm-fade-up' : '';
  const dotStyle = (color: string): CSSProperties => ({
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor: color,
  });

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      style={{
        border: '1px solid var(--sm-border, #d1d5db)',
        borderRadius: 'var(--sm-radius, 0.5rem)',
        overflow: 'hidden',
        backgroundColor: 'var(--sm-surface, #fff)',
        ...style,
      }}
    >
      {/* Chrome bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 0.75rem',
          borderBottom: '1px solid var(--sm-border, #d1d5db)',
          backgroundColor: 'var(--sm-surface, #f9fafb)',
        }}
      >
        <div style={{ display: 'flex', gap: '6px' }}>
          <span style={dotStyle('#ef4444')} />
          <span style={dotStyle('#eab308')} />
          <span style={dotStyle('#22c55e')} />
        </div>
        {url && (
          <div
            style={{
              flex: 1,
              padding: '0.25rem 0.75rem',
              borderRadius: '4px',
              backgroundColor: 'var(--sm-bg, #f3f4f6)',
              fontSize: '0.75rem',
              color: 'var(--sm-muted, #6b7280)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {url}
          </div>
        )}
      </div>
      {/* Content area */}
      <div style={{ position: 'relative' }}>
        {src && (
          <img src={src} alt="" style={{ width: '100%', display: 'block' }} />
        )}
        {children}
      </div>
    </div>
  );
}
