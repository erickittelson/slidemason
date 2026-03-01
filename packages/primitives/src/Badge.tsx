import { motion } from 'framer-motion';
import { useStagger } from './StaggerContext';

const EASE = [0.22, 1, 0.36, 1] as const;

interface BadgeProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export function Badge({ children, style, className = '' }: BadgeProps) {
  const i = useStagger();

  return (
    <motion.div
      className={className}
      style={{
        background: 'var(--sm-glass-bg)',
        backdropFilter: 'blur(12px)',
        border: '1px solid var(--sm-border)',
        borderRadius: 'var(--sm-radius)',
        padding: 'clamp(0.35rem, 0.6vw, 0.5rem) clamp(1rem, 2vw, 1.5rem)',
        fontSize: 'clamp(0.6rem, 0.9vw, 0.75rem)',
        color: 'var(--sm-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.2em',
        fontWeight: 500,
        display: 'inline-block',
        ...style,
      }}
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 * i, duration: 0.7, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
