import { Headline, ComparisonMatrix } from '@slidemason/components';

interface ComparisonTableSlideProps {
  headline: string;
  headers: [string, string];
  rows: Array<{ label: string; values: [string, string] }>;
}

export function ComparisonTableSlide({ headline, headers, rows }: ComparisonTableSlideProps) {
  return (
    <div className="flex flex-col h-full gap-10">
      <Headline>{headline}</Headline>
      <div className="flex-1 flex items-start">
        <ComparisonMatrix headers={headers} rows={rows} className="text-lg" />
      </div>
    </div>
  );
}
