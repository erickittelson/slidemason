import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TitleSlide } from '../templates/TitleSlide';
import { AgendaSlide } from '../templates/AgendaSlide';
import { SectionDividerSlide } from '../templates/SectionDividerSlide';
import { ContentSlide } from '../templates/ContentSlide';
import { ContentMediaSlide } from '../templates/ContentMediaSlide';
import { MetricsSlide } from '../templates/MetricsSlide';
import { FeatureSlide } from '../templates/FeatureSlide';
import { TimelineSlide } from '../templates/TimelineSlide';
import { ComparisonSlide } from '../templates/ComparisonSlide';
import { ProcessSlide } from '../templates/ProcessSlide';
import { QuoteSlide } from '../templates/QuoteSlide';
import { DiagramSlide } from '../templates/DiagramSlide';
import { TableSlide } from '../templates/TableSlide';
import { FullBleedSlide } from '../templates/FullBleedSlide';
import { ConclusionSlide } from '../templates/ConclusionSlide';

describe('TitleSlide', () => {
  it('renders the title', () => {
    render(<TitleSlide title="Hello World" />);
    expect(screen.getByText('Hello World')).toBeDefined();
  });

  it('renders subtitle when provided', () => {
    render(<TitleSlide title="Hello" subtitle="World" />);
    expect(screen.getByText('World')).toBeDefined();
  });

  it('renders badge when provided', () => {
    render(<TitleSlide title="Hello" badge="MVP" />);
    expect(screen.getByText('MVP')).toBeDefined();
  });
});

describe('AgendaSlide', () => {
  it('renders with required props', () => {
    render(<AgendaSlide items={[{ label: 'Introduction' }, { label: 'Overview' }]} />);
    expect(screen.getByText('Agenda')).toBeDefined();
    expect(screen.getByText('Introduction')).toBeDefined();
    expect(screen.getByText('Overview')).toBeDefined();
  });

  it('renders numbered items starting at 01', () => {
    render(<AgendaSlide items={[{ label: 'First' }]} />);
    expect(screen.getByText('01')).toBeDefined();
  });

  it('renders description when provided', () => {
    render(<AgendaSlide items={[{ label: 'Item', description: 'Details here' }]} />);
    expect(screen.getByText('Details here')).toBeDefined();
  });
});

describe('SectionDividerSlide', () => {
  it('renders with required props', () => {
    render(<SectionDividerSlide title="Market Analysis" />);
    expect(screen.getByText('Market Analysis')).toBeDefined();
  });

  it('renders subtitle when provided', () => {
    render(<SectionDividerSlide title="Section" subtitle="Sub info" />);
    expect(screen.getByText('Sub info')).toBeDefined();
  });
});

describe('ContentSlide', () => {
  it('renders with required props', () => {
    render(<ContentSlide title="Key Findings" />);
    expect(screen.getByText('Key Findings')).toBeDefined();
  });

  it('renders subtitle when provided', () => {
    render(<ContentSlide title="Title" subtitle="Subtitle text" />);
    expect(screen.getByText('Subtitle text')).toBeDefined();
  });
});

describe('ContentMediaSlide', () => {
  it('renders with required props', () => {
    render(<ContentMediaSlide title="Platform Capabilities" />);
    expect(screen.getByText('Platform Capabilities')).toBeDefined();
  });

  it('renders subtitle and body text', () => {
    render(<ContentMediaSlide title="Title" subtitle="Sub" bodyText="Body content" />);
    expect(screen.getByText('Sub')).toBeDefined();
    expect(screen.getByText('Body content')).toBeDefined();
  });
});

describe('MetricsSlide', () => {
  it('renders with required props', () => {
    render(<MetricsSlide metrics={[{ value: '$4.2M', label: 'Revenue' }]} />);
    expect(screen.getByText('$4.2M')).toBeDefined();
    expect(screen.getByText('Revenue')).toBeDefined();
  });

  it('renders title when provided', () => {
    render(<MetricsSlide title="Q4 Performance" metrics={[{ value: '23%', label: 'Growth' }]} />);
    expect(screen.getByText('Q4 Performance')).toBeDefined();
  });
});

describe('FeatureSlide', () => {
  it('renders with required props', () => {
    render(<FeatureSlide features={[{ label: 'AI Copilot', description: 'Smart suggestions' }]} />);
    expect(screen.getByText('AI Copilot')).toBeDefined();
    expect(screen.getByText('Smart suggestions')).toBeDefined();
  });

  it('renders title when provided', () => {
    render(<FeatureSlide title="What's New" features={[{ label: 'Feature A' }]} />);
    expect(screen.getByText("What's New")).toBeDefined();
  });
});

describe('TimelineSlide', () => {
  it('renders vertical variant with required props', () => {
    render(
      <TimelineSlide
        items={[{ phase: 'Q1', title: 'Foundation', description: 'Core infra' }]}
      />
    );
    expect(screen.getByText('Foundation')).toBeDefined();
    expect(screen.getByText('Core infra')).toBeDefined();
  });

  it('renders title when provided', () => {
    render(
      <TimelineSlide
        title="Roadmap"
        items={[{ phase: 'Q1', title: 'Phase 1', description: 'Start' }]}
      />
    );
    expect(screen.getByText('Roadmap')).toBeDefined();
  });
});

describe('ComparisonSlide', () => {
  it('renders before-after variant', () => {
    render(
      <ComparisonSlide
        variant="before-after"
        items={[{ label: 'Deploy', before: '2 weeks', after: '15 min' }]}
      />
    );
    expect(screen.getByText('2 weeks')).toBeDefined();
    expect(screen.getByText('15 min')).toBeDefined();
  });

  it('renders pros-cons variant', () => {
    render(
      <ComparisonSlide
        variant="pros-cons"
        pros={['Full control']}
        cons={['Higher cost']}
      />
    );
    expect(screen.getByText('Full control')).toBeDefined();
    expect(screen.getByText('Higher cost')).toBeDefined();
  });
});

describe('ProcessSlide', () => {
  it('renders with required props', () => {
    render(<ProcessSlide steps={[{ label: 'Upload data' }, { label: 'Run analysis' }]} />);
    expect(screen.getByText('Upload data')).toBeDefined();
    expect(screen.getByText('Run analysis')).toBeDefined();
  });

  it('renders title when provided', () => {
    render(<ProcessSlide title="How It Works" steps={[{ label: 'Step 1' }]} />);
    expect(screen.getByText('How It Works')).toBeDefined();
  });
});

describe('QuoteSlide', () => {
  it('renders with required props', () => {
    render(<QuoteSlide quote={{ text: 'This changed everything.' }} />);
    expect(screen.getByText('This changed everything.')).toBeDefined();
  });

  it('renders attribution when provided', () => {
    render(
      <QuoteSlide quote={{ text: 'Great product.', attribution: 'Jane Doe', role: 'CEO' }} />
    );
    expect(screen.getByText('Jane Doe')).toBeDefined();
  });
});

describe('DiagramSlide', () => {
  it('renders flywheel type', () => {
    render(
      <DiagramSlide
        type="flywheel"
        segments={[{ label: 'Acquire' }, { label: 'Retain' }]}
      />
    );
    expect(screen.getByText('Acquire')).toBeDefined();
    expect(screen.getByText('Retain')).toBeDefined();
  });

  it('renders title when provided', () => {
    render(
      <DiagramSlide
        title="Growth Engine"
        type="funnel"
        segments={[{ label: 'Top' }]}
      />
    );
    expect(screen.getByText('Growth Engine')).toBeDefined();
  });
});

describe('TableSlide', () => {
  it('renders with required props', () => {
    render(
      <TableSlide steps={[{ action: 'Finalize contract', owner: 'Legal', date: 'Mar 15' }]} />
    );
    expect(screen.getByText('Finalize contract')).toBeDefined();
    expect(screen.getByText('Legal')).toBeDefined();
  });

  it('renders title when provided', () => {
    render(
      <TableSlide title="Next Steps" steps={[{ action: 'Review' }]} />
    );
    expect(screen.getByText('Next Steps')).toBeDefined();
  });
});

describe('FullBleedSlide', () => {
  it('renders with required props', () => {
    render(<FullBleedSlide title="The future is now." />);
    expect(screen.getByText('The future is now.')).toBeDefined();
  });

  it('renders subtitle when provided', () => {
    render(<FullBleedSlide title="Bold" subtitle="Let's build." />);
    expect(screen.getByText("Let's build.")).toBeDefined();
  });
});

describe('ConclusionSlide', () => {
  it('renders thankyou variant by default', () => {
    render(<ConclusionSlide />);
    expect(screen.getByText('Thank You')).toBeDefined();
  });

  it('renders qa variant', () => {
    render(<ConclusionSlide variant="qa" />);
    expect(screen.getByText('Questions?')).toBeDefined();
  });

  it('renders items when provided', () => {
    render(<ConclusionSlide items={[{ label: 'Tag 1' }, { label: 'Tag 2' }]} />);
    expect(screen.getByText('Tag 1')).toBeDefined();
    expect(screen.getByText('Tag 2')).toBeDefined();
  });
});
