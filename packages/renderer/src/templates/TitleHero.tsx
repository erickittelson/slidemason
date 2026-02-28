import { Headline, Subheadline } from '@slidemason/components';

interface TitleHeroProps {
  headline: string;
  subheadline?: string;
}

export function TitleHero({ headline, subheadline }: TitleHeroProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center gap-6">
      <Headline>{headline}</Headline>
      {subheadline && <Subheadline>{subheadline}</Subheadline>}
    </div>
  );
}
