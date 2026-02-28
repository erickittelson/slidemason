import type { CSSProperties } from 'react';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbPathProps {
  steps: string[];
  current?: number;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function BreadcrumbPath({ steps, current, className = '', style, animate }: BreadcrumbPathProps) {
  const activeIndex = current ?? steps.length - 1;

  return (
    <nav
      className={`${animate ? 'sm-fade-in' : ''} ${className}`.trim()}
      style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexWrap: 'wrap', ...style }}
      aria-label="Breadcrumb"
    >
      {steps.map((step, i) => {
        const isActive = i === activeIndex;
        return (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span
              style={{
                color: isActive ? 'var(--sm-primary)' : 'var(--sm-muted)',
                fontWeight: isActive ? 700 : 400,
                fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)',
              }}
            >
              {step}
            </span>
            {i < steps.length - 1 && (
              <ChevronRight size={14} style={{ color: 'var(--sm-muted)', flexShrink: 0 }} />
            )}
          </span>
        );
      })}
    </nav>
  );
}
