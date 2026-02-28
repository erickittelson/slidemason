import type { CSSProperties } from 'react';
import { Mail, Globe, AtSign } from 'lucide-react';

export interface EndSlideProps {
  variant: 'thankyou' | 'qa' | 'contact';
  message?: string;
  contactInfo?: { email?: string; website?: string; social?: string };
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

const headingMap: Record<EndSlideProps['variant'], string> = {
  thankyou: 'Thank You',
  qa: 'Questions?',
  contact: 'Get in Touch',
};

export function EndSlide({
  variant,
  message,
  contactInfo,
  className = '',
  style,
  animate,
}: EndSlideProps) {
  const animClass = animate ? (animate === 'stagger' ? 'sm-stagger' : 'sm-fade-up') : '';

  return (
    <div
      className={`${animClass} ${className}`.trim()}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        minHeight: '100%',
        gap: '1.5rem',
        ...style,
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: 'clamp(3rem, 8vw, 6rem)',
          fontWeight: 900,
          lineHeight: 1.1,
        }}
      >
        {headingMap[variant]}
      </h1>

      {message && (
        <p style={{ margin: 0, fontSize: 'clamp(1rem, 2vw, 1.5rem)', opacity: 0.7 }}>
          {message}
        </p>
      )}

      {contactInfo && (
        <div
          style={{
            display: 'flex',
            gap: '2rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            fontSize: '1rem',
          }}
        >
          {contactInfo.email && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={18} /> {contactInfo.email}
            </span>
          )}
          {contactInfo.website && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Globe size={18} /> {contactInfo.website}
            </span>
          )}
          {contactInfo.social && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AtSign size={18} /> {contactInfo.social}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
