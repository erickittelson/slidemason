import { Headline, BeforeAfter } from '@slidemason/components';

interface BeforeAfterSlideProps {
  headline: string;
  before: { title: string; items: string[] };
  after: { title: string; items: string[] };
}

export function BeforeAfterSlide({ headline, before, after }: BeforeAfterSlideProps) {
  return (
    <div className="flex flex-col h-full" style={{ gap: 'clamp(1.5rem, 3vh, 3rem)' }}>
      <Headline>{headline}</Headline>
      <div className="flex-1 flex items-center">
        <BeforeAfter before={before} after={after} className="w-full" />
      </div>
    </div>
  );
}
