import type { CSSProperties } from 'react';
import { Mail, Phone, User } from 'lucide-react';

export interface ContactCardProps {
  name: string;
  title?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function ContactCard({
  name,
  title: jobTitle,
  email,
  phone,
  avatar,
  className = '',
  style,
  animate,
}: ContactCardProps) {
  const animClass = animate ? (animate === 'stagger' ? 'sm-stagger' : 'sm-fade-up') : '';
  const avatarSize = 64;

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1.25rem',
        backgroundColor: 'var(--sm-surface)',
        border: '1px solid var(--sm-border)',
        borderRadius: 'var(--sm-radius)',
        ...style,
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: avatarSize,
          height: avatarSize,
          borderRadius: '50%',
          overflow: 'hidden',
          flexShrink: 0,
          backgroundColor: 'var(--sm-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--sm-bg)',
          fontWeight: 700,
          fontSize: '1.2rem',
        }}
      >
        {avatar ? (
          <img src={avatar} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          getInitials(name)
        )}
      </div>

      {/* Info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <div style={{ fontWeight: 700, fontSize: 'clamp(0.95rem, 1.5vw, 1.15rem)', color: 'var(--sm-text)' }}>
          {name}
        </div>
        {jobTitle && (
          <div style={{ color: 'var(--sm-muted)', fontSize: 'clamp(0.8rem, 1.2vw, 0.9rem)' }}>
            {jobTitle}
          </div>
        )}
        {email && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--sm-muted)', fontSize: 'clamp(0.75rem, 1.1vw, 0.85rem)' }}>
            <Mail size={14} />
            <span>{email}</span>
          </div>
        )}
        {phone && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--sm-muted)', fontSize: 'clamp(0.75rem, 1.1vw, 0.85rem)' }}>
            <Phone size={14} />
            <span>{phone}</span>
          </div>
        )}
      </div>
    </div>
  );
}
