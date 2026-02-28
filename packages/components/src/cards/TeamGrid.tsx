import type { CSSProperties } from 'react';

export interface TeamGridProps {
  members: Array<{ name: string; role: string; avatar?: string }>;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function TeamGrid({ members, className = '', style, animate }: TeamGridProps) {
  const animClass = animate ? 'sm-fade-up' : '';

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', ...style }}
    >
      {members.map((member, i) => {
        const staggerClass = animate === 'stagger' ? `sm-fade-up sm-stagger-${i + 1}` : '';
        return (
          <div
            key={i}
            className={staggerClass}
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--sm-surface)',
              border: '1px solid var(--sm-border)',
              borderRadius: 'var(--sm-radius)',
              textAlign: 'center',
            }}
          >
            {member.avatar ? (
              <img
                src={member.avatar}
                alt={member.name}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginBottom: '0.75rem',
                }}
              />
            ) : (
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  backgroundColor: 'var(--sm-primary)',
                  color: 'var(--sm-bg)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  marginBottom: '0.75rem',
                }}
              >
                {getInitials(member.name)}
              </div>
            )}
            <div style={{ fontWeight: 700, color: 'var(--sm-text)', fontSize: 'clamp(0.85rem, 1.3vw, 1rem)' }}>
              {member.name}
            </div>
            <div style={{ color: 'var(--sm-muted)', fontSize: 'clamp(0.75rem, 1.1vw, 0.85rem)' }}>
              {member.role}
            </div>
          </div>
        );
      })}
    </div>
  );
}
