import { Headline, PricingTable } from '@slidemason/components';
import type { PricingTier } from '@slidemason/components';

interface PricingOverviewProps {
  headline: string;
  tiers: PricingTier[];
}

export function PricingOverview({ headline, tiers }: PricingOverviewProps) {
  return (
    <div className="flex flex-col h-full" style={{ gap: 'clamp(1.5rem, 3vh, 3rem)' }}>
      <Headline>{headline}</Headline>
      <div className="flex-1 flex items-center justify-center">
        <PricingTable tiers={tiers} />
      </div>
    </div>
  );
}
