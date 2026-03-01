import type { ComponentType } from 'react';

interface PipelineItem {
  icon: ComponentType<{ size?: number; style?: React.CSSProperties }>;
  label: string;
  sub?: string;
}

interface PipelineProps {
  items: PipelineItem[];
  style?: React.CSSProperties;
}

export function Pipeline({ items, style }: PipelineProps) {
  return (
    <div
      data-pptx-type="pipeline"
      className="flex items-center justify-center w-full relative"
      style={{ maxWidth: '90%', gap: 0, ...style }}
    >
      <div
        className="absolute"
        style={{
          left: '10%',
          right: '10%',
          top: '50%',
          height: 2,
          marginTop: -1,
          background: 'linear-gradient(90deg, var(--sm-primary), var(--sm-secondary), var(--sm-accent))',
          opacity: 0.4,
          zIndex: 0,
        }}
      />

      {items.map(({ icon: Icon, label, sub }, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <div
            key={label}
            className="flex flex-col items-center text-center relative z-10"
            style={{ flex: 1 }}
          >
            <div
              style={{
                width: 'clamp(52px,6.5vw,72px)',
                height: 'clamp(52px,6.5vw,72px)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isLast ? 'var(--sm-primary)' : 'var(--sm-surface)',
                border: `2px solid ${isLast ? 'var(--sm-primary)' : 'var(--sm-border)'}`,
              }}
            >
              <Icon size={24} style={{ color: isLast ? 'var(--sm-bg)' : 'var(--sm-primary)' }} />
            </div>
            <span
              className="font-semibold"
              style={{
                fontSize: 'clamp(0.75rem,1.2vw,0.95rem)',
                color: 'var(--sm-text)',
                marginTop: 'clamp(0.75rem,1.5vh,1rem)',
              }}
            >
              {label}
            </span>
            {sub && (
              <span
                style={{
                  fontSize: 'clamp(0.6rem,0.9vw,0.75rem)',
                  color: 'var(--sm-muted)',
                  marginTop: '0.25rem',
                }}
              >
                {sub}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
