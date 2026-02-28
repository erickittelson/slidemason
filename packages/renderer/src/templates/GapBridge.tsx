import { Headline, GapAnalysis } from '@slidemason/components';

interface GapBridgeProps {
  headline: string;
  current: { label: string; value: string };
  desired: { label: string; value: string };
  gap: string;
}

export function GapBridge({ headline, current, desired, gap }: GapBridgeProps) {
  return (
    <div className="flex flex-col h-full" style={{ gap: 'clamp(1.5rem, 3vh, 3rem)' }}>
      <Headline>{headline}</Headline>
      <div className="flex-1 flex items-center justify-center">
        <GapAnalysis current={current} desired={desired} gap={gap} />
      </div>
    </div>
  );
}
