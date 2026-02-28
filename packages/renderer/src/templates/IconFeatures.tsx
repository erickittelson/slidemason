import { Headline, FeatureGrid } from '@slidemason/components';

interface IconFeaturesProps {
  headline: string;
  features: Array<{ icon: string; title: string; description: string }>;
  columns?: 2 | 3;
}

export function IconFeatures({ headline, features, columns }: IconFeaturesProps) {
  return (
    <div className="flex flex-1 flex-col" style={{ gap: 'clamp(1.5rem, 3vh, 3rem)' }}>
      <Headline>{headline}</Headline>
      <div className="flex-1 flex flex-col justify-center">
        <FeatureGrid features={features} columns={columns} />
      </div>
    </div>
  );
}
