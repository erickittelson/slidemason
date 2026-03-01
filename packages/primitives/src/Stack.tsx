interface StackProps {
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  style?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
}

const gapSizes = {
  xs: 'clamp(0.25rem, 0.5vw, 0.5rem)',
  sm: 'clamp(0.5rem, 1vw, 0.75rem)',
  md: 'clamp(0.75rem, 1.5vw, 1.25rem)',
  lg: 'clamp(1.25rem, 2.5vw, 2rem)',
  xl: 'clamp(2rem, 4vw, 3rem)',
};

export function Stack({ gap = 'md', align = 'stretch', style, className = '', children }: StackProps) {
  return (
    <div
      data-pptx-type="stack"
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: gapSizes[gap],
        alignItems: align,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
