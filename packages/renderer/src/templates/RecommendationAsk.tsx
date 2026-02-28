import { Headline, Subheadline, BulletGroup } from '@slidemason/components';

interface RecommendationAskProps {
  headline: string;
  recommendation: string;
  supportingPoints?: string[];
}

export function RecommendationAsk({ headline, recommendation, supportingPoints }: RecommendationAskProps) {
  return (
    <div className="flex flex-col h-full gap-10">
      <Headline>{headline}</Headline>
      <div className="flex-1 flex flex-col gap-8">
        <div className="rounded-lg border border-[var(--sm-border)] bg-[var(--sm-surface)] p-8">
          <Subheadline>{recommendation}</Subheadline>
        </div>
        {supportingPoints && supportingPoints.length > 0 && (
          <BulletGroup items={supportingPoints} className="text-lg" />
        )}
      </div>
    </div>
  );
}
