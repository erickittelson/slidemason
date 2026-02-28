import { type ReactNode, useCallback, useEffect, useState } from 'react';
import { MDXProvider } from '@mdx-js/react';
import * as components from '@slidemason/components';
import { SlideLayout } from './SlideLayout';
import { useDeck } from './DeckProvider';

interface SlideRendererProps {
  slides: ReactNode[];
}

export function SlideRenderer({ slides }: SlideRendererProps) {
  const { currentSlide, slideCount, goTo, next, prev, theme } = useDeck();

  const [isFullscreen, setIsFullscreen] = useState(false);

  const isPrintMode =
    typeof window !== 'undefined' &&
    window.location.search.includes('print');

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(() => {});
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  const isFirst = currentSlide === 0;
  const isLast = currentSlide === slideCount - 1;

  const btnBase =
    'cursor-pointer border-none bg-transparent p-0 text-sm leading-none transition-opacity duration-150';

  return (
    <MDXProvider components={components}>
      <SlideLayout theme={theme}>
        {slides[currentSlide]}
        {!isPrintMode && (
          <div
            className="absolute bottom-8 right-10 flex items-center gap-3 text-base"
            style={{ color: 'var(--sm-muted)', opacity: 0.5 }}
          >
            <span>{currentSlide + 1} / {slideCount}</span>
            <button
              className={btnBase}
              style={{ color: 'inherit', opacity: isFirst ? 0.3 : 1 }}
              onClick={prev}
              disabled={isFirst}
              aria-label="Previous slide"
            >
              ←
            </button>
            <button
              className={btnBase}
              style={{ color: 'inherit', opacity: isLast ? 0.3 : 1 }}
              onClick={next}
              disabled={isLast}
              aria-label="Next slide"
            >
              →
            </button>
            <button
              className={btnBase}
              style={{ color: 'inherit' }}
              onClick={toggleFullscreen}
              aria-label="Toggle fullscreen"
            >
              {isFullscreen ? '⊡' : '⊞'}
            </button>
          </div>
        )}
      </SlideLayout>
    </MDXProvider>
  );
}
