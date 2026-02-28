import { Headline, BulletGroup } from '@slidemason/components';

interface AppendixProps {
  headline: string;
  items?: string[];
}

export function Appendix({ headline, items }: AppendixProps) {
  return (
    <div className="flex flex-col h-full gap-10">
      <Headline>{headline}</Headline>
      {items && items.length > 0 && (
        <div className="flex-1">
          <BulletGroup items={items} className="text-lg" />
        </div>
      )}
    </div>
  );
}
