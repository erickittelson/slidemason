import { Headline, SWOTGrid } from '@slidemason/components';

interface SWOTAnalysisProps {
  headline: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export function SWOTAnalysis({ headline, strengths, weaknesses, opportunities, threats }: SWOTAnalysisProps) {
  return (
    <div className="flex flex-col h-full" style={{ gap: 'clamp(1.5rem, 3vh, 3rem)' }}>
      <Headline>{headline}</Headline>
      <div className="flex-1 flex items-center justify-center">
        <SWOTGrid
          strengths={strengths}
          weaknesses={weaknesses}
          opportunities={opportunities}
          threats={threats}
        />
      </div>
    </div>
  );
}
