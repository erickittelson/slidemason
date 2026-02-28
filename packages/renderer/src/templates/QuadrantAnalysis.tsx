import { Headline, MatrixQuadrant } from '@slidemason/components';

interface QuadrantAnalysisProps {
  headline: string;
  xAxis: string;
  yAxis: string;
  quadrants: [string, string, string, string];
  items?: Array<{ label: string; x: number; y: number }>;
}

export function QuadrantAnalysis({ headline, xAxis, yAxis, quadrants, items }: QuadrantAnalysisProps) {
  return (
    <div className="flex flex-col h-full" style={{ gap: 'clamp(1.5rem, 3vh, 3rem)' }}>
      <Headline>{headline}</Headline>
      <div className="flex-1 flex items-center justify-center">
        <MatrixQuadrant xAxis={xAxis} yAxis={yAxis} quadrants={quadrants} items={items} />
      </div>
    </div>
  );
}
