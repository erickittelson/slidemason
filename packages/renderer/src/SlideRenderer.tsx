import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import * as components from '@slidemason/components';
import { SlideLayout } from './SlideLayout';
import { useDeck } from './DeckProvider';

const slideTransition = {
  duration: 0.7,
  ease: [0.22, 1, 0.36, 1] as const,
};

interface SlideRendererProps {
  slides: ReactNode[];
  fullWidth?: boolean;
}

export function SlideRenderer({ slides, fullWidth = true }: SlideRendererProps) {
  const { currentSlide, slideCount, goTo, next, prev, theme } = useDeck();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const slideRef = useRef<HTMLDivElement>(null);
  const [screenshotDone, setScreenshotDone] = useState(false);

  const isPrintMode =
    typeof window !== 'undefined' &&
    window.location.search.includes('print');

  const captureScreenshot = useCallback(async () => {
    if (!slideRef.current) return;
    try {
      const canvas = await html2canvas(slideRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });
      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((b) => resolve(b!), 'image/png')
      );
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      setScreenshotDone(true);
      setTimeout(() => setScreenshotDone(false), 1500);
    } catch (err) {
      console.error('Screenshot failed:', err);
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const handleChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  const isFirst = currentSlide === 0;
  const isLast = currentSlide === slideCount - 1;
  const progress = slideCount > 1 ? (currentSlide / (slideCount - 1)) * 100 : 0;

  return (
    <MDXProvider components={components}>
      <div
        ref={slideRef}
        data-theme={theme}
        className={`relative ${fullWidth ? 'w-screen h-screen' : 'w-full h-full'} overflow-hidden`}
        style={{ backgroundColor: 'var(--sm-bg)' }}
      >
        {/* Animated slide content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.98 }}
            transition={slideTransition}
            className="w-full h-full"
          >
            <SlideLayout theme={theme} fullWidth={false}>
              {slides[currentSlide]}
            </SlideLayout>
          </motion.div>
        </AnimatePresence>

        {!isPrintMode && (
          <>
            {/* Slide counter — top left */}
            <div
              className="absolute top-6 left-8 font-mono text-xs tracking-widest"
              style={{ color: 'var(--sm-muted)', opacity: 0.4 }}
            >
              {String(currentSlide + 1).padStart(2, '0')} / {String(slideCount).padStart(2, '0')}
            </div>

            {/* Dot minimap — left side, desktop only */}
            <div
              className="absolute left-4 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-2"
              style={{ opacity: 0.4 }}
            >
              {Array.from({ length: slideCount }, (_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className="w-2 h-2 rounded-full border-none cursor-pointer transition-all duration-300 p-0"
                  style={{
                    backgroundColor: i === currentSlide ? 'var(--sm-primary)' : 'var(--sm-muted)',
                    transform: i === currentSlide ? 'scale(1.4)' : 'scale(1)',
                    opacity: i === currentSlide ? 1 : 0.4,
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Nav buttons — bottom right, glassmorphic pill */}
            <div
              className="absolute bottom-6 right-8 flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md"
              style={{
                backgroundColor: 'var(--sm-glass-bg)',
                border: '1px solid var(--sm-border)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}
            >
              <button
                onClick={prev}
                disabled={isFirst}
                className="cursor-pointer border-none bg-transparent p-1 text-sm leading-none transition-opacity duration-150"
                style={{ color: 'var(--sm-muted)', opacity: isFirst ? 0.3 : 1 }}
                aria-label="Previous slide"
              >
                ←
              </button>
              <span
                className="font-mono text-xs"
                style={{ color: 'var(--sm-muted)', opacity: 0.6 }}
              >
                {currentSlide + 1} / {slideCount}
              </span>
              <button
                onClick={next}
                disabled={isLast}
                className="cursor-pointer border-none bg-transparent p-1 text-sm leading-none transition-opacity duration-150"
                style={{ color: 'var(--sm-muted)', opacity: isLast ? 0.3 : 1 }}
                aria-label="Next slide"
              >
                →
              </button>
              <button
                onClick={toggleFullscreen}
                className="cursor-pointer border-none bg-transparent p-1 text-sm leading-none"
                style={{ color: 'var(--sm-muted)' }}
                aria-label="Toggle fullscreen"
              >
                {isFullscreen ? '⊡' : '⊞'}
              </button>
              <button
                onClick={captureScreenshot}
                className="cursor-pointer border-none bg-transparent p-1 text-sm leading-none transition-opacity duration-150"
                style={{ color: screenshotDone ? 'var(--sm-primary)' : 'var(--sm-muted)' }}
                aria-label="Copy slide screenshot to clipboard"
              >
                {screenshotDone ? '✓' : '📷'}
              </button>
            </div>

            {/* Progress bar — bottom edge */}
            <div
              className="absolute bottom-0 left-0 right-0"
              style={{ height: '2px', backgroundColor: 'var(--sm-border)' }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${progress}%`,
                  background: 'linear-gradient(to right, var(--sm-primary), var(--sm-accent))',
                  transition: 'width 500ms ease-out',
                }}
              />
            </div>
          </>
        )}
      </div>
    </MDXProvider>
  );
}
