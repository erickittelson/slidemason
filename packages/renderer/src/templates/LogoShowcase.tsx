import { Headline, LogoGrid } from '@slidemason/components';

interface LogoShowcaseProps {
  headline: string;
  logos: Array<{ src: string; alt: string }>;
}

export function LogoShowcase({ headline, logos }: LogoShowcaseProps) {
  return (
    <div className="flex flex-col h-full" style={{ gap: 'clamp(1.5rem, 3vh, 3rem)' }}>
      <Headline>{headline}</Headline>
      <div className="flex-1 flex items-center justify-center">
        <LogoGrid logos={logos} className="w-full" />
      </div>
    </div>
  );
}
