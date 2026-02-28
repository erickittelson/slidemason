import { type ReactNode } from 'react';

interface SlideLayoutProps {
  children: ReactNode;
  theme?: string;
  fullWidth?: boolean;
}

export function SlideLayout({ children, theme = 'slate', fullWidth = true }: SlideLayoutProps) {
  return (
    <div
      data-theme={theme}
      className={`relative flex flex-col ${fullWidth ? 'w-screen h-screen' : 'w-full h-full'} overflow-hidden`}
      style={{ backgroundColor: 'var(--sm-bg)', padding: 'clamp(2rem, 4vw, 5rem)' }}
    >
      {children}
    </div>
  );
}
