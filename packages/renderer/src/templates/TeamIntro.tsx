import { Headline, TeamGrid } from '@slidemason/components';

interface TeamIntroProps {
  headline: string;
  members: Array<{ name: string; role: string; avatar?: string }>;
}

export function TeamIntro({ headline, members }: TeamIntroProps) {
  return (
    <div className="flex flex-col h-full" style={{ gap: 'clamp(1.5rem, 3vh, 3rem)' }}>
      <Headline>{headline}</Headline>
      <div className="flex-1 flex items-center">
        <TeamGrid members={members} className="w-full" />
      </div>
    </div>
  );
}
