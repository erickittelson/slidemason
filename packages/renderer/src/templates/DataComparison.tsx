import { Headline, FeatureMatrix } from '@slidemason/components';

interface DataComparisonProps {
  headline: string;
  features: string[];
  products: Array<{ name: string; values: Array<boolean | string> }>;
}

export function DataComparison({ headline, features, products }: DataComparisonProps) {
  return (
    <div className="flex flex-col h-full" style={{ gap: 'clamp(1.5rem, 3vh, 3rem)' }}>
      <Headline>{headline}</Headline>
      <div className="flex-1 flex items-start">
        <FeatureMatrix features={features} products={products} className="w-full" />
      </div>
    </div>
  );
}
