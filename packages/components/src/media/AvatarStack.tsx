import type { CSSProperties } from 'react';

export interface AvatarStackProps {
  avatars: Array<{ src?: string; name: string }>;
  max?: number;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function AvatarStack({ avatars, max = 5, className = '', style, animate }: AvatarStackProps) {
  const animClass = animate ? 'sm-fade-up' : '';
  const visible = avatars.slice(0, max);
  const overflow = avatars.length - max;

  const avatarSize = 40;
  const avatarStyle: CSSProperties = {
    width: avatarSize,
    height: avatarSize,
    borderRadius: '50%',
    border: '2px solid var(--sm-bg, #fff)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#fff',
    backgroundColor: 'var(--sm-primary, #3b82f6)',
    flexShrink: 0,
    objectFit: 'cover' as const,
  };

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      style={{ display: 'flex', alignItems: 'center', ...style }}
    >
      {visible.map((avatar, i) => (
        <div
          key={i}
          style={{
            marginLeft: i === 0 ? 0 : '-0.75rem',
            zIndex: visible.length - i,
            ...(animate === 'stagger' ? { animation: `sm-fade-in 0.3s ease-out ${i * 0.08}s both` } : {}),
          }}
        >
          {avatar.src ? (
            <img
              src={avatar.src}
              alt={avatar.name}
              style={{ ...avatarStyle }}
            />
          ) : (
            <div style={avatarStyle}>
              {getInitials(avatar.name)}
            </div>
          )}
        </div>
      ))}
      {overflow > 0 && (
        <div
          style={{
            ...avatarStyle,
            marginLeft: '-0.75rem',
            zIndex: 0,
            backgroundColor: 'var(--sm-muted, #6b7280)',
          }}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}
