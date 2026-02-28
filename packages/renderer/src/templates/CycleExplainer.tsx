import { Headline, CycleDiagram, BulletGroup } from '@slidemason/components';

interface CycleExplainerProps {
  headline: string;
  stages: Array<{ label: string }>;
  bullets?: string[];
}

export function CycleExplainer({ headline, stages, bullets }: CycleExplainerProps) {
  return (
    <div className="flex flex-col h-full" style={{ gap: 'clamp(1.5rem, 3vh, 3rem)' }}>
      <Headline>{headline}</Headline>
      <div className="flex-1 flex items-center justify-center">
        <CycleDiagram stages={stages} />
      </div>
      {bullets && (
        <BulletGroup items={bullets} />
      )}
    </div>
  );
}
