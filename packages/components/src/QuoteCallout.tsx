export interface QuoteCalloutProps {
  quote: string;
  attribution?: string;
  className?: string;
}

export function QuoteCallout({ quote, attribution, className = '' }: QuoteCalloutProps) {
  return (
    <blockquote
      className={`border-l-4 border-[var(--sm-primary)] pl-6 ${className}`.trim()}
    >
      <p className="text-xl italic text-[var(--sm-text)]">&ldquo;{quote}&rdquo;</p>
      {attribution && (
        <footer className="mt-3 text-sm text-[var(--sm-muted)]">&mdash; {attribution}</footer>
      )}
    </blockquote>
  );
}
