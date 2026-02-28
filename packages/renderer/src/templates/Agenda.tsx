import { Headline, NumberedSteps } from '@slidemason/components';

interface AgendaProps {
  headline: string;
  items: string[];
}

export function Agenda({ headline, items }: AgendaProps) {
  return (
    <div className="flex flex-col h-full gap-10">
      <Headline>{headline}</Headline>
      <div className="flex-1 flex items-start">
        <NumberedSteps steps={items} className="text-xl" />
      </div>
    </div>
  );
}
