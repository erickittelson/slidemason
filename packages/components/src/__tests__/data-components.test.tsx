import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

afterEach(() => cleanup());
import {
  StatCard,
  StatGrid,
  QuoteCallout,
  ImagePanel,
  KPIStrip,
  TimelineRow,
  ComparisonMatrix,
  FooterMark,
  PresenterNotes,
} from '../index';

describe('StatCard', () => {
  it('renders value and label', () => {
    render(<StatCard value="42%" label="Conversion" />);
    expect(screen.getByText('42%')).toBeDefined();
    expect(screen.getByText('Conversion')).toBeDefined();
  });
});

describe('StatGrid', () => {
  it('renders multiple stat cards', () => {
    const stats = [
      { value: '100', label: 'Users' },
      { value: '$5M', label: 'Revenue' },
    ];
    render(<StatGrid stats={stats} />);
    expect(screen.getByText('100')).toBeDefined();
    expect(screen.getByText('$5M')).toBeDefined();
    expect(screen.getByText('Users')).toBeDefined();
    expect(screen.getByText('Revenue')).toBeDefined();
  });
});

describe('QuoteCallout', () => {
  it('renders a blockquote with quote text', () => {
    render(<QuoteCallout quote="To be or not to be" />);
    const bq = document.querySelector('blockquote');
    expect(bq).toBeDefined();
    expect(screen.getByText(/To be or not to be/)).toBeDefined();
  });

  it('renders attribution when provided', () => {
    render(<QuoteCallout quote="Hello" attribution="Shakespeare" />);
    expect(screen.getByText(/Shakespeare/)).toBeDefined();
  });
});

describe('ImagePanel', () => {
  it('renders an image with alt text', () => {
    render(<ImagePanel src="/photo.jpg" alt="A photo" />);
    const img = screen.getByRole('img');
    expect(img).toBeDefined();
    expect(img.getAttribute('alt')).toBe('A photo');
    expect(img.getAttribute('src')).toBe('/photo.jpg');
  });

  it('renders caption when provided', () => {
    render(<ImagePanel src="/photo.jpg" alt="A photo" caption="Nice pic" />);
    expect(screen.getByText('Nice pic')).toBeDefined();
  });
});

describe('KPIStrip', () => {
  it('renders a row of KPI metrics', () => {
    const kpis = [
      { value: '99.9%', label: 'Uptime' },
      { value: '<50ms', label: 'Latency' },
    ];
    render(<KPIStrip kpis={kpis} />);
    expect(screen.getByText('99.9%')).toBeDefined();
    expect(screen.getByText('Uptime')).toBeDefined();
    expect(screen.getByText('<50ms')).toBeDefined();
  });
});

describe('TimelineRow', () => {
  it('renders date and title', () => {
    render(<TimelineRow date="2024-01" title="Launch" />);
    expect(screen.getByText('2024-01')).toBeDefined();
    expect(screen.getByText('Launch')).toBeDefined();
  });

  it('renders description when provided', () => {
    render(<TimelineRow date="2024-01" title="Launch" description="We launched" />);
    expect(screen.getByText('We launched')).toBeDefined();
  });
});

describe('ComparisonMatrix', () => {
  it('renders headers and rows', () => {
    render(
      <ComparisonMatrix
        headers={['Us', 'Them']}
        rows={[
          { label: 'Speed', values: ['Fast', 'Slow'] },
          { label: 'Price', values: ['$10', '$50'] },
        ]}
      />
    );
    expect(screen.getByText('Us')).toBeDefined();
    expect(screen.getByText('Them')).toBeDefined();
    expect(screen.getByText('Speed')).toBeDefined();
    expect(screen.getByText('Fast')).toBeDefined();
    expect(screen.getByText('$50')).toBeDefined();
  });
});

describe('FooterMark', () => {
  it('renders text', () => {
    render(<FooterMark text="Slidemason v1" />);
    expect(screen.getByText('Slidemason v1')).toBeDefined();
  });
});

describe('PresenterNotes', () => {
  it('renders children with a data attribute', () => {
    render(<PresenterNotes>Talk about this slide</PresenterNotes>);
    expect(screen.getByText('Talk about this slide')).toBeDefined();
  });

  it('is marked as presenter notes', () => {
    const { container } = render(<PresenterNotes>Notes here</PresenterNotes>);
    const el = container.firstElementChild;
    expect(el?.getAttribute('data-presenter-notes')).toBe('true');
  });
});
