import { type ReactNode, useEffect, useState } from 'react';

interface SlideLayoutProps {
  children: ReactNode;
  theme?: string;
}

export function SlideLayout({ children, theme = 'slate' }: SlideLayoutProps) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function updateScale() {
      const scaleX = window.innerWidth / 1920;
      const scaleY = window.innerHeight / 1080;
      setScale(Math.min(scaleX, scaleY));
    }
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <div
      data-theme={theme}
      className="w-screen h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: 'var(--sm-bg)' }}
    >
      <div
        className="relative flex flex-col"
        style={{
          width: '1920px',
          height: '1080px',
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          padding: '4rem',
        }}
      >
        {children}
      </div>
    </div>
  );
}
