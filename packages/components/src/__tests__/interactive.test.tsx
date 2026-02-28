import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import {
  RecommendationBox,
  NextStepsGrid,
  ContactCard,
  QRCode,
  CTAButton,
  PollResults,
  CountdownTimer,
  EmbedFrame,
} from '../interactive';

afterEach(() => cleanup());

describe('RecommendationBox', () => {
  it('renders title and description', () => {
    const { container } = render(
      <RecommendationBox title="Try this" description="It works great" />
    );
    expect(container.textContent).toContain('Try this');
    expect(container.textContent).toContain('It works great');
  });

  it('applies className', () => {
    const { container } = render(
      <RecommendationBox title="T" description="D" className="test-cls" />
    );
    expect(container.firstElementChild?.getAttribute('class')).toContain('test-cls');
  });
});

describe('NextStepsGrid', () => {
  it('renders steps in table', () => {
    const { container } = render(
      <NextStepsGrid steps={[{ action: 'Do it', owner: 'Alice', status: 'todo' }]} />
    );
    expect(container.textContent).toContain('Do it');
    expect(container.textContent).toContain('Alice');
    expect(container.textContent).toContain('To Do');
  });

  it('applies className', () => {
    const { container } = render(
      <NextStepsGrid steps={[{ action: 'A' }]} className="test-cls" />
    );
    expect(container.firstElementChild?.getAttribute('class')).toContain('test-cls');
  });
});

describe('ContactCard', () => {
  it('renders name and email', () => {
    const { container } = render(
      <ContactCard name="Jane Doe" email="jane@test.com" />
    );
    expect(container.textContent).toContain('Jane Doe');
    expect(container.textContent).toContain('jane@test.com');
  });

  it('applies className', () => {
    const { container } = render(
      <ContactCard name="J" className="test-cls" />
    );
    expect(container.firstElementChild?.getAttribute('class')).toContain('test-cls');
  });
});

describe('QRCode', () => {
  it('renders SVG with label', () => {
    const { container } = render(
      <QRCode url="https://example.com" label="Scan me" />
    );
    expect(container.querySelector('svg')).toBeTruthy();
    expect(container.textContent).toContain('Scan me');
  });

  it('applies className', () => {
    const { container } = render(
      <QRCode url="https://example.com" className="test-cls" />
    );
    expect(container.firstElementChild?.getAttribute('class')).toContain('test-cls');
  });
});

describe('CTAButton', () => {
  it('renders text', () => {
    const { container } = render(<CTAButton text="Get Started" />);
    expect(container.textContent).toContain('Get Started');
  });

  it('applies className', () => {
    const { container } = render(<CTAButton text="Go" className="test-cls" />);
    expect(container.firstElementChild?.getAttribute('class')).toContain('test-cls');
  });
});

describe('PollResults', () => {
  it('renders options with percentages', () => {
    const { container } = render(
      <PollResults options={[{ label: 'Yes', value: 75, total: 100 }, { label: 'No', value: 25, total: 100 }]} />
    );
    expect(container.textContent).toContain('Yes');
    expect(container.textContent).toContain('No');
    expect(container.textContent).toContain('75%');
  });

  it('applies className', () => {
    const { container } = render(
      <PollResults options={[{ label: 'A', value: 1 }]} className="test-cls" />
    );
    expect(container.firstElementChild?.getAttribute('class')).toContain('test-cls');
  });
});

describe('CountdownTimer', () => {
  it('renders four time segments', () => {
    const { container } = render(
      <CountdownTimer targetDate="2030-01-01T00:00:00Z" />
    );
    const boxes = container.querySelectorAll('[style]');
    expect(boxes.length).toBeGreaterThanOrEqual(4);
    expect(container.textContent).toContain('Days');
    expect(container.textContent).toContain('Hours');
  });

  it('applies className', () => {
    const { container } = render(
      <CountdownTimer targetDate="2030-01-01T00:00:00Z" className="test-cls" />
    );
    expect(container.firstElementChild?.getAttribute('class')).toContain('test-cls');
  });
});

describe('EmbedFrame', () => {
  it('renders iframe with title bar', () => {
    const { container } = render(
      <EmbedFrame src="https://example.com" title="Demo" />
    );
    expect(container.textContent).toContain('Demo');
    expect(container.querySelector('iframe')).toBeTruthy();
  });

  it('applies className', () => {
    const { container } = render(
      <EmbedFrame src="https://example.com" className="test-cls" />
    );
    expect(container.firstElementChild?.getAttribute('class')).toContain('test-cls');
  });
});
