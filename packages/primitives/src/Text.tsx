import { motion } from 'framer-motion';
import { useStagger } from './StaggerContext';

const SIZES = {
  xs: 'clamp(0.6rem, 0.9vw, 0.75rem)',
  sm: 'clamp(0.8rem, 1.3vw, 1.05rem)',
  md: 'clamp(0.85rem, 1.4vw, 1.1rem)',
} as const;

const EASE = [0.22, 1, 0.36, 1] as const;

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
  const i = useStagger();

  return (
    <motion.p
      className={className}
      style={{
        fontSize: SIZES[size],
        color: muted ? 'var(--sm-muted)' : 'var(--sm-text)',
        lineHeight: 1.5,
        ...style,
      }}
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 * i, duration: 0.7, ease: EASE }}
    >
      {children}
    </motion.p>
  );
}
