interface GridProps {
  cols?: 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
}

const gapSizes = {
  sm: 'clamp(0.5rem, 1vw, 0.75rem)',
  md: 'clamp(0.75rem, 1.5vw, 1.25rem)',
  lg: 'clamp(1.25rem, 2.5vw, 2rem)',
};

export function Grid({ cols = 2, gap = 'md', style, className = '', children }: GridProps) {
  return (
    <div
      data-pptx-type="grid"
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: gapSizes[gap],
        ...style,
      }}
    >
      {children}
    </div>
  );
}
