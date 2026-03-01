import { motion } from 'framer-motion';
import { useStagger } from './StaggerContext';

const SIZES = {
  md: 'clamp(1.5rem, 3vw, 2.25rem)',
  lg: 'clamp(2.5rem, 5vw, 3.5rem)',
  hero: 'clamp(5rem, 12vw, 9rem)',
} as const;

const EASE = [0.22, 1, 0.36, 1] as const;

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
  const i = useStagger();
  const MotionTag = motion.create(Tag);

  return (
    <MotionTag
      className={`font-bold ${className}`}
      style={{
        fontSize: SIZES[size],
        color: 'var(--sm-text)',
        lineHeight: size === 'hero' ? 0.9 : 1.1,
        ...style,
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 * i, duration: 0.8, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}
