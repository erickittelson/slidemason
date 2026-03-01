interface RowProps {
  gap?: 'xs' | 'sm' | 'md' | 'lg';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  wrap?: boolean;
  style?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
}

const gapSizes = {
  xs: 'clamp(0.25rem, 0.5vw, 0.5rem)',
  sm: 'clamp(0.5rem, 1vw, 0.75rem)',
  md: 'clamp(0.75rem, 1.5vw, 1.25rem)',
  lg: 'clamp(1.25rem, 2.5vw, 2rem)',
};

export function Row({ gap = 'md', align = 'center', wrap = false, style, className = '', children }: RowProps) {
  return (
    <div
      data-pptx-type="row"
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: gapSizes[gap],
        alignItems: align,
        flexWrap: wrap ? 'wrap' : 'nowrap',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
