import { motion } from 'framer-motion';
import { useStagger } from './StaggerContext';

const PADS = {
  sm: 'clamp(0.75rem, 1.5vw, 1.25rem)',
  md: 'clamp(1.25rem, 2.5vw, 2rem)',
  lg: 'clamp(1.5rem, 3vw, 2.5rem)',
} as const;

const EASE = [0.22, 1, 0.36, 1] as const;

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
  const i = useStagger();

  return (
    <motion.div
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
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15 * i, duration: 0.6, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
