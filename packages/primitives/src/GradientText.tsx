import { motion } from 'framer-motion';
import { useStagger } from './StaggerContext';

const SIZES = {
  md: 'clamp(2rem, 4vw, 3rem)',
  lg: 'clamp(5rem, 10vw, 7rem)',
  hero: 'clamp(5rem, 12vw, 9rem)',
  stat: 'clamp(7rem, 18vw, 14rem)',
} as const;

const EASE = [0.22, 1, 0.36, 1] as const;

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
  const i = useStagger();
  const MotionTag = motion.create(Tag);

  return (
    <MotionTag
      className={`font-extrabold ${className}`}
      style={{
        background: 'linear-gradient(135deg, var(--sm-primary), var(--sm-secondary))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontSize: SIZES[size],
        lineHeight: 0.9,
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
