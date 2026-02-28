import { Headline, TwoColumn, BulletGroup } from '@slidemason/components';

interface TwoColumnArgumentProps {
  headline: string;
  leftTitle: string;
  leftPoints: string[];
  rightTitle: string;
  rightPoints: string[];
}

export function TwoColumnArgument({
  headline,
  leftTitle,
  leftPoints,
  rightTitle,
  rightPoints,
}: TwoColumnArgumentProps) {
  return (
    <div className="flex flex-col h-full gap-10">
      <Headline>{headline}</Headline>
      <TwoColumn
        className="flex-1"
        left={
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold text-[var(--sm-primary)]">{leftTitle}</h3>
            <BulletGroup items={leftPoints} className="text-lg" />
          </div>
        }
        right={
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold text-[var(--sm-primary)]">{rightTitle}</h3>
            <BulletGroup items={rightPoints} className="text-lg" />
          </div>
        }
      />
    </div>
  );
}
