import { type ReactNode } from 'react';
import { MDXProvider } from '@mdx-js/react';
import * as components from '@slidemason/components';
import { SlideLayout } from './SlideLayout';
import { useDeck } from './DeckProvider';

interface SlideRendererProps {
  slides: ReactNode[];
}

export function SlideRenderer({ slides }: SlideRendererProps) {
  const { currentSlide, slideCount, theme } = useDeck();

  return (
    <MDXProvider components={components}>
      <SlideLayout theme={theme}>
        {slides[currentSlide]}
        <div
          className="absolute bottom-8 right-10 flex items-center gap-3 text-base"
          style={{ color: 'var(--sm-muted)', opacity: 0.5 }}
        >
          <span>{currentSlide + 1} / {slideCount}</span>
          <span className="text-sm">← →</span>
        </div>
      </SlideLayout>
    </MDXProvider>
  );
}
