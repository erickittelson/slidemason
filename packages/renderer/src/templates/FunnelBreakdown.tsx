import { Headline, FunnelChart, StatCallout } from '@slidemason/components';

interface FunnelBreakdownProps {
  headline: string;
  stages: Array<{ label: string; value?: number }>;
  stat?: { value: string; label: string };
}

export function FunnelBreakdown({ headline, stages, stat }: FunnelBreakdownProps) {
  return (
    <div className="flex flex-col h-full" style={{ gap: 'clamp(1.5rem, 3vh, 3rem)' }}>
      <Headline>{headline}</Headline>
      <div className="flex-1 flex items-center justify-center">
        <FunnelChart stages={stages} />
      </div>
      {stat && (
        <div className="flex justify-center">
          <StatCallout value={stat.value} label={stat.label} />
        </div>
      )}
    </div>
  );
}
