import { QuoteCallout } from '@slidemason/components';

interface QuoteInsightProps {
  quote: string;
  attribution?: string;
  context?: string;
}

export function QuoteInsight({ quote, attribution, context }: QuoteInsightProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-16">
      <QuoteCallout
        quote={quote}
        attribution={attribution}
        className="text-3xl max-w-4xl"
      />
      {context && (
        <p className="text-base text-[var(--sm-muted)] text-center max-w-2xl">
          {context}
        </p>
      )}
    </div>
  );
}
