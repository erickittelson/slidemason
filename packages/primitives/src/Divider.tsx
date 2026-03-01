import { motion } from 'framer-motion';
import { useStagger } from './StaggerContext';

const EASE = [0.22, 1, 0.36, 1] as const;

interface DividerProps {
  width?: string;
  style?: React.CSSProperties;
}

export function Divider({ width = 'clamp(2.5rem, 5vw, 3.5rem)', style }: DividerProps) {
  const i = useStagger();

  return (
    <motion.div
      style={{
        width,
        height: 3,
        background: 'linear-gradient(90deg, var(--sm-primary), var(--sm-secondary))',
        borderRadius: 2,
        ...style,
      }}
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ delay: 0.15 * i, duration: 0.6, ease: EASE }}
    />
  );
}
