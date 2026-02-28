import type { CSSProperties } from 'react';
import { IconCard } from './IconCard';

export interface FeatureGridProps {
  features: Array<{ icon: string; title: string; description: string }>;
  columns?: 2 | 3;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function FeatureGrid({ features, columns = 3, className = '', style, animate }: FeatureGridProps) {
  const animClass = animate ? 'sm-fade-up' : '';

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: '1rem',
        ...style,
      }}
    >
      {features.map((feature, i) => (
        <IconCard
          key={i}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
          animate={animate === 'stagger' ? 'stagger' : undefined}
        />
      ))}
    </div>
  );
}
