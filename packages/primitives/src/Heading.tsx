const SIZES = {
  md: 'clamp(1.5rem, 3vw, 2.25rem)',
  lg: 'clamp(2.5rem, 5vw, 3.5rem)',
  hero: 'clamp(5rem, 12vw, 9rem)',
} as const;

interface HeadingProps {
  children: React.ReactNode;
  size?: keyof typeof SIZES;
  as?: 'h1' | 'h2' | 'h3';
  style?: React.CSSProperties;
  className?: string;
}

export function Heading({
  children,
  size = 'lg',
  as: Tag = size === 'hero' ? 'h1' : 'h2',
  style,
  className = '',
}: HeadingProps) {
  return (
    <Tag
      data-pptx-type="heading"
      data-pptx-size={size}
      className={`font-bold ${className}`}
      style={{
        fontSize: SIZES[size] ?? SIZES['lg'],
        color: 'var(--sm-text)',
        lineHeight: size === 'hero' ? 0.9 : 1.1,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
