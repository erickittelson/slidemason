import type { CSSProperties, ReactNode } from 'react';

export interface PhoneMockupProps {
  src?: string;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function PhoneMockup({ src, children, className = '', style, animate }: PhoneMockupProps) {
  const animClass = animate ? 'sm-fade-up' : '';

  return (
    <svg
      className={`${animClass} ${className}`.trim()}
      style={style}
      viewBox="0 0 280 560"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Phone frame */}
      <rect
        x="4"
        y="4"
        width="272"
        height="552"
        rx="36"
        stroke="var(--sm-border, #d1d5db)"
        strokeWidth="4"
        fill="var(--sm-surface, #fff)"
      />
      {/* Notch */}
      <rect x="90" y="4" width="100" height="24" rx="12" fill="var(--sm-border, #d1d5db)" />
      {/* Screen area */}
      <clipPath id="phone-screen">
        <rect x="16" y="36" width="248" height="500" rx="8" />
      </clipPath>
      {src && (
        <image
          href={src}
          x="16"
          y="36"
          width="248"
          height="500"
          clipPath="url(#phone-screen)"
          preserveAspectRatio="xMidYMid slice"
        />
      )}
      {children && (
        <foreignObject x="16" y="36" width="248" height="500" clipPath="url(#phone-screen)">
          {children}
        </foreignObject>
      )}
    </svg>
  );
}
