import { motion } from 'framer-motion';
import { useStagger } from './StaggerContext';
import type { ComponentType } from 'react';

const SIZES = {
  sm: { box: 'clamp(28px,3.5vw,40px)', icon: 16 },
  md: { box: 'clamp(40px,5vw,52px)', icon: 20 },
  lg: { box: 'clamp(52px,6.5vw,72px)', icon: 24 },
} as const;

const EASE = [0.22, 1, 0.36, 1] as const;

interface IconCircleProps {
  icon: ComponentType<{ size?: number; style?: React.CSSProperties }>;
  size?: keyof typeof SIZES;
  active?: boolean;
  color?: string;
  style?: React.CSSProperties;
}

export function IconCircle({
  icon: Icon,
  size = 'md',
  active = false,
  color = 'var(--sm-primary)',
  style,
}: IconCircleProps) {
  const i = useStagger();
  const s = SIZES[size];

  return (
    <motion.div
      style={{
        width: s.box,
        height: s.box,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: active ? color : 'var(--sm-surface)',
        border: `2px solid ${active ? color : 'var(--sm-border)'}`,
        flexShrink: 0,
        ...style,
      }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15 * i, duration: 0.6, ease: EASE }}
    >
      <Icon size={s.icon} style={{ color: active ? 'var(--sm-bg)' : color }} />
    </motion.div>
  );
}
