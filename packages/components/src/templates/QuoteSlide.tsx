import type { QuoteSlideProps } from './types';
import { TestimonialCard } from '../cards/TestimonialCard';

export function QuoteSlide({ quote }: QuoteSlideProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="sm-fade-up sm-ease-cinematic" style={{ position: 'relative', maxWidth: 'min(90%, 700px)', width: '100%' }}>
        <span
          aria-hidden="true"
          style={{
            position: 'absolute', top: '-2rem', left: '-1rem',
            fontSize: '8rem', lineHeight: 1, opacity: 0.08,
            color: 'var(--sm-primary)', fontFamily: 'Georgia, serif',
            userSelect: 'none', pointerEvents: 'none',
          }}
        >
          {'\u201C'}
        </span>
        <TestimonialCard
          quote={quote.text}
          name={quote.attribution ?? ''}
          title={quote.role}
          animate
        />
      </div>
    </div>
  );
}
