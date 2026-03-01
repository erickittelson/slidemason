const SIZES = {
  xs: 'clamp(0.65rem, 1.1cqi, 0.85rem)',
  sm: 'clamp(0.75rem, 1.4cqi, 1.05rem)',
  md: 'clamp(0.85rem, 1.7cqi, 1.2rem)',
} as const;

interface TextProps {
  children: React.ReactNode;
  size?: keyof typeof SIZES;
  muted?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function Text({
  children,
  size = 'md',
  muted = false,
  style,
  className = '',
}: TextProps) {
  return (
    <p
      data-pptx-type="text"
      {...(muted ? { 'data-pptx-muted': '' } : {})}
      className={className}
      style={{
        fontSize: SIZES[size],
        color: muted ? 'var(--sm-muted)' : 'var(--sm-text)',
        lineHeight: 1.5,
        ...style,
      }}
    >
      {children}
    </p>
  );
}
