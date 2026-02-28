import { TestimonialCard } from '@slidemason/components';

interface TestimonialSpotlightProps {
  quote: string;
  name: string;
  title?: string;
  company?: string;
  avatar?: string;
}

export function TestimonialSpotlight({ quote, name, title, company, avatar }: TestimonialSpotlightProps) {
  return (
    <div className="flex flex-col h-full items-center justify-center">
      <TestimonialCard
        quote={quote}
        name={name}
        title={title}
        company={company}
        avatar={avatar}
        style={{ maxWidth: '36rem' }}
      />
    </div>
  );
}
