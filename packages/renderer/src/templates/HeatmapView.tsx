import { Headline, HeatmapGrid } from '@slidemason/components';

interface HeatmapViewProps {
  headline: string;
  rows: Array<{ label: string; cells: number[] }>;
  columnLabels?: string[];
}

export function HeatmapView({ headline, rows, columnLabels }: HeatmapViewProps) {
  return (
    <div className="flex flex-col h-full" style={{ gap: 'clamp(1.5rem, 3vh, 3rem)' }}>
      <Headline>{headline}</Headline>
      <div className="flex-1 flex items-center justify-center">
        <HeatmapGrid rows={rows} columnLabels={columnLabels} />
      </div>
    </div>
  );
}
