import { type ReactNode } from 'react';

interface SlideLayoutProps {
  children: ReactNode;
  theme?: string;
}

export function SlideLayout({ children, theme = 'slate' }: SlideLayoutProps) {
  return (
    <div
      data-theme={theme}
      className="relative flex flex-col w-screen h-screen overflow-hidden"
      style={{ backgroundColor: 'var(--sm-bg)', padding: 'clamp(2rem, 4vw, 5rem)' }}
    >
      {children}
    </div>
  );
}
