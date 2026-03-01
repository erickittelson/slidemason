const SIZES = {
  md: 'clamp(2rem, 4vw, 3rem)',
  lg: 'clamp(5rem, 10vw, 7rem)',
  hero: 'clamp(5rem, 12vw, 9rem)',
  stat: 'clamp(7rem, 18vw, 14rem)',
} as const;

interface GradientTextProps {
  children: React.ReactNode;
  size?: keyof typeof SIZES;
  as?: 'h1' | 'h2' | 'span' | 'div';
  style?: React.CSSProperties;
  className?: string;
}

export function GradientText({
  children,
  size = 'hero',
  as: Tag = 'h1',
  style,
  className = '',
}: GradientTextProps) {
  return (
    <Tag
      className={`font-extrabold ${className}`}
      style={{
        background: 'linear-gradient(135deg, var(--sm-primary), var(--sm-secondary))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontSize: SIZES[size],
        lineHeight: 0.9,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
