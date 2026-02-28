import type { ComparisonSlideProps } from './types';
import { Headline } from '../Headline';
import { ProsCons } from '../comparison/ProsCons';
import { BeforeAfter } from '../comparison/BeforeAfter';

export function ComparisonSlide({
  title, variant = 'before-after',
  items = [], pros = [], cons = [],
  beforeLabel = 'Before', afterLabel = 'After',
}: ComparisonSlideProps) {
  return (
    <div className="flex flex-1 flex-col">
      {title && <Headline>{title}</Headline>}
      <div className="flex flex-1 items-center">
        {variant === 'pros-cons' ? (
          <ProsCons pros={pros} cons={cons} className="w-full" animate="stagger" />
        ) : (
          <BeforeAfter
            before={{ title: beforeLabel, items: items.map(i => i.before) }}
            after={{ title: afterLabel, items: items.map(i => i.after) }}
            className="w-full"
            animate="stagger"
          />
        )}
      </div>
    </div>
  );
}
