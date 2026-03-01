import { type ReactNode } from 'react';

interface SlideLayoutProps {
  children: ReactNode;
  theme?: string;
  fullWidth?: boolean;
}

export function SlideLayout({ children, theme = 'slate', fullWidth = false }: SlideLayoutProps) {
  return (
    <div
      data-theme={theme}
      className={`relative flex flex-col ${fullWidth ? 'w-screen h-screen' : 'w-full h-full'} overflow-hidden`}
      style={{
        containerType: 'size',
        backgroundColor: 'var(--sm-bg)',
        padding: 'clamp(2rem, 5cqb, 6rem) clamp(1rem, 3cqi, 3rem)',
        fontFamily: 'var(--sm-body-font, inherit)',
      }}
    >
      {children}
    </div>
  );
}
