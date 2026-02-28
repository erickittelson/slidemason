import { Headline, NumberedSteps } from '@slidemason/components';

interface RoadmapProps {
  headline: string;
  phases: string[];
}

export function Roadmap({ headline, phases }: RoadmapProps) {
  return (
    <div className="flex flex-col h-full gap-10">
      <Headline>{headline}</Headline>
      <div className="flex-1 flex items-start">
        <NumberedSteps steps={phases} className="text-xl" />
      </div>
    </div>
  );
}
