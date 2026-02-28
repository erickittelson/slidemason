import type { CSSProperties } from 'react';
import * as icons from 'lucide-react';

export interface CTAButtonProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: string;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function CTAButton({
  text,
  variant = 'primary',
  icon,
  className = '',
  style,
  animate,
}: CTAButtonProps) {
  const IconComponent = icon
    ? (icons as unknown as Record<string, React.ComponentType<{ size?: number; style?: CSSProperties }>>)[icon]
    : undefined;
  const animClass = animate ? (animate === 'stagger' ? 'sm-stagger' : 'sm-fade-up') : '';

  const baseStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    borderRadius: 'var(--sm-radius)',
    fontWeight: 700,
    fontSize: 'clamp(0.9rem, 1.4vw, 1.1rem)',
    border: 'none',
    cursor: 'default',
  };

  const variantStyles: Record<string, CSSProperties> = {
    primary: {
      backgroundColor: 'var(--sm-primary)',
      color: '#fff',
    },
    secondary: {
      backgroundColor: 'var(--sm-secondary, var(--sm-surface))',
      color: 'var(--sm-text)',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--sm-primary)',
      border: '2px solid var(--sm-primary)',
    },
  };

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      style={{
        ...baseStyle,
        ...variantStyles[variant],
        ...style,
      }}
      role="button"
      aria-label={text}
    >
      {IconComponent && <IconComponent size={20} />}
      <span>{text}</span>
    </div>
  );
}
