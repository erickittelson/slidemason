import type { CSSProperties, ReactNode } from 'react';

export interface LaptopMockupProps {
  src?: string;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function LaptopMockup({ src, children, className = '', style, animate }: LaptopMockupProps) {
  const animClass = animate ? 'sm-fade-up' : '';

  return (
    <svg
      className={`${animClass} ${className}`.trim()}
      style={style}
      viewBox="0 0 640 440"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Screen frame */}
      <rect
        x="80"
        y="20"
        width="480"
        height="320"
        rx="12"
        stroke="var(--sm-border, #d1d5db)"
        strokeWidth="4"
        fill="var(--sm-surface, #fff)"
      />
      {/* Screen area */}
      <clipPath id="laptop-screen">
        <rect x="92" y="32" width="456" height="296" rx="4" />
      </clipPath>
      {src && (
        <image
          href={src}
          x="92"
          y="32"
          width="456"
          height="296"
          clipPath="url(#laptop-screen)"
          preserveAspectRatio="xMidYMid slice"
        />
      )}
      {children && (
        <foreignObject x="92" y="32" width="456" height="296" clipPath="url(#laptop-screen)">
          {children}
        </foreignObject>
      )}
      {/* Keyboard base (trapezoid) */}
      <path
        d="M40 360 L600 360 L620 420 L20 420 Z"
        stroke="var(--sm-border, #d1d5db)"
        strokeWidth="4"
        fill="var(--sm-surface, #f9fafb)"
        strokeLinejoin="round"
      />
    </svg>
  );
}
