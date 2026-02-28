import type { CSSProperties } from 'react';
import * as lucideIcons from 'lucide-react';

export interface IconMosaicProps {
  icons: string[];
  columns?: number;
  opacity?: number;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function IconMosaic({ icons, columns = 6, opacity = 0.05, className = '', style, animate }: IconMosaicProps) {
  const animClass = animate ? 'sm-fade-up' : '';

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: '1rem',
        opacity,
        ...style,
      }}
    >
      {icons.map((name, i) => {
        const IconComponent = (lucideIcons as unknown as Record<string, React.ComponentType<{ size?: number }>>)[name];
        if (!IconComponent || typeof IconComponent !== 'function') return null;
        return (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              ...(animate === 'stagger' ? { animation: `sm-fade-in 0.3s ease-out ${i * 0.05}s both` } : {}),
            }}
          >
            <IconComponent size={32} />
          </div>
        );
      })}
    </div>
  );
}
