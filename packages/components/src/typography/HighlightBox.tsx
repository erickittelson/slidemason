import type { CSSProperties, ReactNode } from 'react';
import { Info, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';

export interface HighlightBoxProps {
  children: ReactNode;
  variant?: 'info' | 'warning' | 'success' | 'tip';
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

const variantConfig = {
  info: {
    color: 'var(--sm-primary)',
    bg: 'var(--sm-primary)',
    Icon: Info,
  },
  warning: {
    color: 'var(--sm-warning, #f59e0b)',
    bg: 'var(--sm-warning, #f59e0b)',
    Icon: AlertTriangle,
  },
  success: {
    color: 'var(--sm-success, #22c55e)',
    bg: 'var(--sm-success, #22c55e)',
    Icon: CheckCircle,
  },
  tip: {
    color: 'var(--sm-accent)',
    bg: 'var(--sm-accent)',
    Icon: Lightbulb,
  },
};

export function HighlightBox({
  children,
  variant = 'info',
  className = '',
  style,
  animate,
}: HighlightBoxProps) {
  const config = variantConfig[variant];
  const { Icon } = config;
  const animClass = animate ? 'sm-fade-in' : '';

  return (
    <div
      className={`flex gap-3 rounded-[var(--sm-radius)] p-4 ${animClass} ${className}`.trim()}
      style={{
        borderLeft: `4px solid ${config.color}`,
        backgroundColor: 'var(--sm-surface)',
        ...style,
      }}
    >
      <div className="shrink-0 mt-0.5" style={{ color: config.color }}>
        <Icon size={20} />
      </div>
      <div className="text-[var(--sm-text)]">{children}</div>
    </div>
  );
}
