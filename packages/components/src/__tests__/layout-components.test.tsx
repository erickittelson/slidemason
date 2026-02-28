import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

afterEach(() => cleanup());
import {
  Headline,
  Subheadline,
  BulletGroup,
  NumberedSteps,
  TwoColumn,
  ThreeCard,
  SectionLabel,
} from '../index';

describe('Headline', () => {
  it('renders an h1 with children', () => {
    render(<Headline>Hello World</Headline>);
    const el = screen.getByRole('heading', { level: 1 });
    expect(el).toBeDefined();
    expect(el.textContent).toBe('Hello World');
  });

  it('applies custom className', () => {
    render(<Headline className="extra">Test</Headline>);
    const el = screen.getByRole('heading', { level: 1 });
    expect(el.className).toContain('extra');
  });
});

describe('Subheadline', () => {
  it('renders an h2 with children', () => {
    render(<Subheadline>Sub Title</Subheadline>);
    const el = screen.getByRole('heading', { level: 2 });
    expect(el).toBeDefined();
    expect(el.textContent).toBe('Sub Title');
  });

  it('applies custom className', () => {
    render(<Subheadline className="extra">Test</Subheadline>);
    const el = screen.getByRole('heading', { level: 2 });
    expect(el.className).toContain('extra');
  });
});

describe('BulletGroup', () => {
  it('renders a ul with li items', () => {
    render(<BulletGroup items={['One', 'Two', 'Three']} />);
    const el = screen.getByRole('list');
    expect(el.tagName).toBe('UL');
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
    expect(items[0].textContent).toBe('One');
    expect(items[2].textContent).toBe('Three');
  });
});

describe('NumberedSteps', () => {
  it('renders an ol with li items', () => {
    render(<NumberedSteps steps={['First', 'Second']} />);
    const el = screen.getByRole('list');
    expect(el.tagName).toBe('OL');
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(items[0].textContent).toContain('First');
  });
});

describe('TwoColumn', () => {
  it('renders left and right content', () => {
    render(
      <TwoColumn
        left={<div data-testid="left">Left</div>}
        right={<div data-testid="right">Right</div>}
      />
    );
    expect(screen.getByTestId('left').textContent).toBe('Left');
    expect(screen.getByTestId('right').textContent).toBe('Right');
  });
});

describe('ThreeCard', () => {
  it('renders 3 cards with titles and content', () => {
    const cards = [
      { title: 'Card 1', content: 'Content 1' },
      { title: 'Card 2', content: 'Content 2' },
      { title: 'Card 3', content: 'Content 3' },
    ];
    render(<ThreeCard cards={cards} />);
    expect(screen.getByText('Card 1')).toBeDefined();
    expect(screen.getByText('Content 2')).toBeDefined();
    expect(screen.getByText('Card 3')).toBeDefined();
  });
});

describe('SectionLabel', () => {
  it('renders label text', () => {
    render(<SectionLabel label="Section A" />);
    expect(screen.getByText('Section A')).toBeDefined();
  });
});
