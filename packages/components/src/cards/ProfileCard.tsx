import type { CSSProperties } from 'react';

export interface ProfileCardProps {
  name: string;
  title: string;
  bio?: string;
  avatar?: string;
  social?: Array<{ platform: string; url: string }>;
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

export function ProfileCard({ name, title, bio, avatar, social, className = '', style, animate }: ProfileCardProps) {
  const animClass = animate ? 'sm-fade-up' : '';

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      style={{
        padding: '1.5rem',
        backgroundColor: 'var(--sm-surface)',
        border: '1px solid var(--sm-border)',
        borderRadius: 'var(--sm-radius)',
        textAlign: 'center',
        ...style,
      }}
    >
      {avatar ? (
        <img
          src={avatar}
          alt={name}
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            objectFit: 'cover',
            marginBottom: '0.75rem',
          }}
        />
      ) : (
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: 'var(--sm-primary)',
            color: 'var(--sm-bg)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '1.5rem',
            marginBottom: '0.75rem',
          }}
        >
          {getInitials(name)}
        </div>
      )}
      <div style={{ fontWeight: 700, color: 'var(--sm-text)', fontSize: 'clamp(0.9rem, 1.5vw, 1.15rem)' }}>
        {name}
      </div>
      <div style={{ color: 'var(--sm-muted)', fontSize: 'clamp(0.75rem, 1.1vw, 0.85rem)', marginBottom: bio ? '0.5rem' : 0 }}>
        {title}
      </div>
      {bio && (
        <div style={{ color: 'var(--sm-text)', fontSize: 'clamp(0.75rem, 1.1vw, 0.85rem)', marginBottom: social?.length ? '0.75rem' : 0, opacity: 0.85 }}>
          {bio}
        </div>
      )}
      {social && social.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {social.map((s, i) => (
            <a
              key={i}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--sm-primary)',
                fontSize: 'clamp(0.7rem, 1vw, 0.8rem)',
                textDecoration: 'none',
              }}
            >
              {s.platform}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
