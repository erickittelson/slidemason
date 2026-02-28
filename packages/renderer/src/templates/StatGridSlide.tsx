import { Headline, StatGrid } from '@slidemason/components';

interface StatGridSlideProps {
  headline: string;
  stats: Array<{ value: string; label: string }>;
}

export function StatGridSlide({ headline, stats }: StatGridSlideProps) {
  return (
    <div className="flex flex-col h-full gap-10">
      <Headline>{headline}</Headline>
      <div className="flex-1 flex items-center">
        <StatGrid stats={stats} className="w-full" />
      </div>
    </div>
  );
}
