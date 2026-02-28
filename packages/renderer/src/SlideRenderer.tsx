import { type ReactNode } from 'react';
import { MDXProvider } from '@mdx-js/react';
import * as components from '@slidemason/components';
import { SlideLayout } from './SlideLayout';
import { useDeck } from './DeckProvider';

interface SlideRendererProps {
  slides: ReactNode[];
}

export function SlideRenderer({ slides }: SlideRendererProps) {
  const { currentSlide, theme } = useDeck();

  return (
    <MDXProvider components={components}>
      <SlideLayout theme={theme}>
        {slides[currentSlide]}
      </SlideLayout>
    </MDXProvider>
  );
}
