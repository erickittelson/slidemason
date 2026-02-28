import { Headline, ScoreCard } from '@slidemason/components';

interface ScoreCardSlideProps {
  headline: string;
  criteria: Array<{ label: string; weight: number; score: number }>;
}

export function ScoreCardSlide({ headline, criteria }: ScoreCardSlideProps) {
  return (
    <div className="flex flex-col h-full" style={{ gap: 'clamp(1.5rem, 3vh, 3rem)' }}>
      <Headline>{headline}</Headline>
      <div className="flex-1 flex items-start">
        <ScoreCard criteria={criteria} className="w-full" />
      </div>
    </div>
  );
}
