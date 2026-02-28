import { Headline, ProsCons } from '@slidemason/components';

interface ProsConsSlideProps {
  headline: string;
  pros: string[];
  cons: string[];
}

export function ProsConsSlide({ headline, pros, cons }: ProsConsSlideProps) {
  return (
    <div className="flex flex-col h-full" style={{ gap: 'clamp(1.5rem, 3vh, 3rem)' }}>
      <Headline>{headline}</Headline>
      <div className="flex-1 flex items-center">
        <ProsCons pros={pros} cons={cons} className="w-full" />
      </div>
    </div>
  );
}
