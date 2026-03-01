import { motion } from 'framer-motion';
import { useStagger } from './StaggerContext';
import type { ComponentType } from 'react';

const EASE = [0.22, 1, 0.36, 1] as const;

interface StatBoxProps {
  value: string;
  label: string;
  icon?: ComponentType<{ size?: number; style?: React.CSSProperties }>;
  color?: string;
  style?: React.CSSProperties;
}

export function StatBox({ value, label, icon: Icon, color, style }: StatBoxProps) {
  const i = useStagger();

  return (
    <motion.div
      style={{
        background: 'var(--sm-glass-bg)',
        backdropFilter: 'blur(12px)',
        border: '1px solid var(--sm-border)',
        borderRadius: 'var(--sm-radius)',
        padding: 'clamp(1.5rem, 3vw, 2.5rem)',
        textAlign: 'center',
        ...style,
      }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15 * i, duration: 0.6, ease: EASE }}
    >
      {Icon && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'clamp(0.75rem, 1.5vh, 1rem)' }}>
          <div style={{
            width: 'clamp(52px,6.5vw,72px)',
            height: 'clamp(52px,6.5vw,72px)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--sm-surface)',
            border: '2px solid var(--sm-border)',
          }}>
            <Icon size={24} style={{ color: color || 'var(--sm-primary)' }} />
          </div>
        </div>
      )}
      <div
        className="font-extrabold"
        style={{
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          color: color || 'var(--sm-text)',
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 'clamp(0.7rem, 1vw, 0.85rem)',
          color: 'var(--sm-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          marginTop: '0.25rem',
        }}
      >
        {label}
      </div>
    </motion.div>
  );
}
