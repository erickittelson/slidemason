import { Headline, ProcessFlow } from '@slidemason/components';

interface ProcessOverviewProps {
  headline: string;
  steps: Array<{ label: string; icon?: string }>;
}

export function ProcessOverview({ headline, steps }: ProcessOverviewProps) {
  return (
    <div className="flex flex-col h-full" style={{ gap: 'clamp(1.5rem, 3vh, 3rem)' }}>
      <Headline>{headline}</Headline>
      <div className="flex-1 flex items-center justify-center">
        <ProcessFlow steps={steps} />
      </div>
    </div>
  );
}
