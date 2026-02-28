import { Headline, RadarChart } from '@slidemason/components';

interface RadarComparisonProps {
  headline: string;
  axes: Array<{ label: string; value: number; max?: number }>;
}

export function RadarComparison({ headline, axes }: RadarComparisonProps) {
  return (
    <div className="flex flex-col h-full" style={{ gap: 'clamp(1.5rem, 3vh, 3rem)' }}>
      <Headline>{headline}</Headline>
      <div className="flex-1 flex items-center justify-center">
        <RadarChart axes={axes} />
      </div>
    </div>
  );
}
