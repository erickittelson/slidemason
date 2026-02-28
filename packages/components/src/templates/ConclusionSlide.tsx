import type { ConclusionSlideProps } from './types';
import { EndSlide } from '../navigation/EndSlide';

export function ConclusionSlide({
  variant = 'thankyou', title, subtitle, callToAction, contactInfo, items,
}: ConclusionSlideProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <EndSlide
        variant={variant}
        message={subtitle ?? callToAction}
        contactInfo={contactInfo}
        animate
      />
      {items && items.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-6 justify-center">
          {items.map((item, i) => (
            <span
              key={i}
              className={`sm-fade-up sm-stagger-${i + 1}`}
              style={{
                display: 'inline-block', padding: '0.4rem 1rem', borderRadius: '999px',
                fontSize: 'clamp(0.7rem, 1.1vw, 0.85rem)', fontWeight: 600,
                backgroundColor: 'var(--sm-surface)', border: '1px solid var(--sm-border)',
                color: 'var(--sm-muted)',
              }}
            >
              {item.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
