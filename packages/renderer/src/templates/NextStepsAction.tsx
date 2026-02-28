import { Headline, NextStepsGrid } from '@slidemason/components';

interface NextStepsActionProps {
  headline: string;
  steps: Array<{
    action: string;
    owner?: string;
    date?: string;
    status?: 'todo' | 'in-progress' | 'done';
  }>;
}

export function NextStepsAction({ headline, steps }: NextStepsActionProps) {
  return (
    <div className="flex flex-col h-full" style={{ gap: 'clamp(1.5rem, 3vh, 3rem)' }}>
      <Headline>{headline}</Headline>
      <div className="flex-1 flex items-start">
        <NextStepsGrid steps={steps} className="w-full" />
      </div>
    </div>
  );
}
