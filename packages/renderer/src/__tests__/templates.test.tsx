import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  TitleHero,
  Agenda,
  SectionDivider,
  TwoColumnArgument,
  QuoteInsight,
  StatGridSlide,
  ImageCaption,
  ComparisonTableSlide,
  TimelineSlide,
  Roadmap,
  RecommendationAsk,
  Appendix,
} from '../templates';

describe('TitleHero', () => {
  it('renders headline', () => {
    render(<TitleHero headline="Hello World" />);
    expect(screen.getByText('Hello World')).toBeDefined();
  });

  it('renders optional subheadline', () => {
    render(<TitleHero headline="Title" subheadline="Subtitle" />);
    expect(screen.getByText('Subtitle')).toBeDefined();
  });
});

describe('Agenda', () => {
  it('renders headline and items', () => {
    render(<Agenda headline="Agenda" items={['Item 1', 'Item 2']} />);
    expect(screen.getByText('Agenda')).toBeDefined();
    expect(screen.getByText('Item 1')).toBeDefined();
    expect(screen.getByText('Item 2')).toBeDefined();
  });
});

describe('SectionDivider', () => {
  it('renders label', () => {
    render(<SectionDivider label="Section One" />);
    expect(screen.getByText('Section One')).toBeDefined();
  });

  it('renders optional subtitle', () => {
    render(<SectionDivider label="Section" subtitle="Details here" />);
    expect(screen.getByText('Details here')).toBeDefined();
  });
});

describe('TwoColumnArgument', () => {
  it('renders headline and both columns', () => {
    render(
      <TwoColumnArgument
        headline="Comparison"
        leftTitle="Pros"
        leftPoints={['Fast', 'Cheap']}
        rightTitle="Cons"
        rightPoints={['Complex', 'New']}
      />
    );
    expect(screen.getByText('Comparison')).toBeDefined();
    expect(screen.getByText('Pros')).toBeDefined();
    expect(screen.getByText('Cons')).toBeDefined();
    expect(screen.getByText('Fast')).toBeDefined();
    expect(screen.getByText('Complex')).toBeDefined();
  });
});

describe('QuoteInsight', () => {
  it('renders quote text', () => {
    render(<QuoteInsight quote="To be or not to be" />);
    expect(screen.getByText(/To be or not to be/)).toBeDefined();
  });

  it('renders attribution and context', () => {
    render(
      <QuoteInsight
        quote="Test quote"
        attribution="Author"
        context="Some context"
      />
    );
    expect(screen.getByText(/Author/)).toBeDefined();
    expect(screen.getByText('Some context')).toBeDefined();
  });
});

describe('StatGridSlide', () => {
  it('renders headline and stats', () => {
    render(
      <StatGridSlide
        headline="Key Metrics"
        stats={[
          { value: '99%', label: 'Uptime' },
          { value: '1M', label: 'Users' },
        ]}
      />
    );
    expect(screen.getByText('Key Metrics')).toBeDefined();
    expect(screen.getByText('99%')).toBeDefined();
    expect(screen.getByText('Uptime')).toBeDefined();
  });
});

describe('ImageCaption', () => {
  it('renders image with alt text', () => {
    render(<ImageCaption src="/test.png" alt="Test image" />);
    expect(screen.getByAltText('Test image')).toBeDefined();
  });

  it('renders optional headline and caption', () => {
    render(
      <ImageCaption
        headline="Photo"
        src="/test.png"
        alt="Test"
        caption="A caption"
      />
    );
    expect(screen.getByText('Photo')).toBeDefined();
    expect(screen.getByText('A caption')).toBeDefined();
  });
});

describe('ComparisonTableSlide', () => {
  it('renders headline and table data', () => {
    render(
      <ComparisonTableSlide
        headline="Feature Comparison"
        headers={['Option A', 'Option B']}
        rows={[{ label: 'Speed', values: ['Blazing', 'Sluggish'] }]}
      />
    );
    expect(screen.getByText('Feature Comparison')).toBeDefined();
    expect(screen.getByText('Option A')).toBeDefined();
    expect(screen.getByText('Blazing')).toBeDefined();
  });
});

describe('TimelineSlide', () => {
  it('renders headline and events', () => {
    render(
      <TimelineSlide
        headline="Our Journey"
        events={[
          { date: '2024', title: 'Founded', description: 'We started' },
          { date: '2025', title: 'Grew' },
        ]}
      />
    );
    expect(screen.getByText('Our Journey')).toBeDefined();
    expect(screen.getByText('Founded')).toBeDefined();
    expect(screen.getByText('We started')).toBeDefined();
    expect(screen.getByText('Grew')).toBeDefined();
  });
});

describe('Roadmap', () => {
  it('renders headline and phases', () => {
    render(
      <Roadmap headline="2025 Roadmap" phases={['Phase 1', 'Phase 2', 'Phase 3']} />
    );
    expect(screen.getByText('2025 Roadmap')).toBeDefined();
    expect(screen.getByText('Phase 1')).toBeDefined();
    expect(screen.getByText('Phase 3')).toBeDefined();
  });
});

describe('RecommendationAsk', () => {
  it('renders headline and recommendation', () => {
    render(
      <RecommendationAsk
        headline="Our Recommendation"
        recommendation="Go with Option A"
      />
    );
    expect(screen.getByText('Our Recommendation')).toBeDefined();
    expect(screen.getByText('Go with Option A')).toBeDefined();
  });

  it('renders supporting points', () => {
    render(
      <RecommendationAsk
        headline="Ask"
        recommendation="Do this"
        supportingPoints={['Reason 1', 'Reason 2']}
      />
    );
    expect(screen.getByText('Reason 1')).toBeDefined();
    expect(screen.getByText('Reason 2')).toBeDefined();
  });
});

describe('Appendix', () => {
  it('renders headline', () => {
    render(<Appendix headline="Appendix" />);
    expect(screen.getByText('Appendix')).toBeDefined();
  });

  it('renders optional items', () => {
    render(<Appendix headline="Appendix" items={['Note 1', 'Note 2']} />);
    expect(screen.getByText('Note 1')).toBeDefined();
    expect(screen.getByText('Note 2')).toBeDefined();
  });
});
