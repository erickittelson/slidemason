import { Headline, Flywheel } from '@slidemason/components';

interface FlywheelSlideProps {
  headline: string;
  segments: Array<{ label: string }>;
}

export function FlywheelSlide({ headline, segments }: FlywheelSlideProps) {
  return (
    <div className="flex flex-col h-full" style={{ gap: 'clamp(1.5rem, 3vh, 3rem)' }}>
      <Headline>{headline}</Headline>
      <div className="flex-1 flex items-center justify-center">
        <Flywheel segments={segments} />
      </div>
    </div>
  );
}
