const PADS = {
  sm: 'clamp(0.75rem, 1.5vw, 1.25rem)',
  md: 'clamp(1.25rem, 2.5vw, 2rem)',
  lg: 'clamp(1.5rem, 3vw, 2.5rem)',
} as const;

interface CardProps {
  children: React.ReactNode;
  glass?: boolean;
  pad?: keyof typeof PADS;
  style?: React.CSSProperties;
  className?: string;
}

export function Card({
  children,
  glass = true,
  pad = 'md',
  style,
  className = '',
}: CardProps) {
  return (
    <div
      data-pptx-type="card"
      className={className}
      style={{
        ...(glass
          ? {
              background: 'var(--sm-glass-bg)',
              backdropFilter: 'blur(12px)',
              border: '1px solid var(--sm-border)',
              borderRadius: 'var(--sm-radius)',
            }
          : {}),
        padding: PADS[pad],
        ...style,
      }}
    >
      {children}
    </div>
  );
}
