import { Headline, TimelineRow } from '@slidemason/components';

interface TimelineSlideProps {
  headline: string;
  events: Array<{ date: string; title: string; description?: string }>;
}

export function TimelineSlide({ headline, events }: TimelineSlideProps) {
  return (
    <div className="flex flex-col h-full gap-10">
      <Headline>{headline}</Headline>
      <div className="flex-1 flex flex-col gap-6">
        {events.map((event, i) => (
          <TimelineRow
            key={i}
            date={event.date}
            title={event.title}
            description={event.description}
            className="text-lg"
          />
        ))}
      </div>
    </div>
  );
}
