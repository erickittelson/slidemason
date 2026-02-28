import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import {
  AgendaNav,
  SectionHeader,
  ChapterCard,
  BreadcrumbBar,
  ProgressIndicator,
  TableOfContents,
  EndSlide,
  TitleCard,
} from '../navigation';

afterEach(() => cleanup());

describe('AgendaNav', () => {
  it('renders items', () => {
    const { container } = render(
      <AgendaNav items={[{ label: 'Intro' }, { label: 'Main', active: true }]} />
    );
    expect(container.textContent).toContain('Intro');
    expect(container.textContent).toContain('Main');
  });

  it('applies className', () => {
    const { container } = render(
      <AgendaNav items={[{ label: 'A' }]} className="test-cls" />
    );
    expect(container.firstElementChild?.getAttribute('class')).toContain('test-cls');
  });
});

describe('SectionHeader', () => {
  it('renders title', () => {
    const { container } = render(<SectionHeader title="Overview" />);
    expect(container.textContent).toContain('Overview');
  });

  it('applies className', () => {
    const { container } = render(<SectionHeader title="T" className="test-cls" />);
    expect(container.firstElementChild?.getAttribute('class')).toContain('test-cls');
  });
});

describe('ChapterCard', () => {
  it('renders number and title', () => {
    const { container } = render(<ChapterCard number={1} title="Getting Started" />);
    expect(container.textContent).toContain('1');
    expect(container.textContent).toContain('Getting Started');
  });

  it('applies className', () => {
    const { container } = render(<ChapterCard number={1} title="T" className="test-cls" />);
    expect(container.firstElementChild?.getAttribute('class')).toContain('test-cls');
  });
});

describe('BreadcrumbBar', () => {
  it('renders items with separators', () => {
    const { container } = render(<BreadcrumbBar items={['Home', 'Docs', 'API']} />);
    expect(container.textContent).toContain('Home');
    expect(container.textContent).toContain('Docs');
    expect(container.textContent).toContain('API');
  });

  it('applies className', () => {
    const { container } = render(<BreadcrumbBar items={['A']} className="test-cls" />);
    expect(container.firstElementChild?.getAttribute('class')).toContain('test-cls');
  });
});

describe('ProgressIndicator', () => {
  it('renders with current and total', () => {
    const { container } = render(<ProgressIndicator current={3} total={10} />);
    const bar = container.firstElementChild;
    expect(bar).toBeTruthy();
    expect(bar?.getAttribute('role')).toBe('progressbar');
  });

  it('applies className', () => {
    const { container } = render(
      <ProgressIndicator current={1} total={5} className="test-cls" />
    );
    expect(container.firstElementChild?.getAttribute('class')).toContain('test-cls');
  });
});

describe('TableOfContents', () => {
  it('renders items with titles', () => {
    const { container } = render(
      <TableOfContents items={[{ title: 'Intro', page: 1 }, { title: 'Body', page: 5 }]} />
    );
    expect(container.textContent).toContain('Intro');
    expect(container.textContent).toContain('Body');
  });

  it('applies className', () => {
    const { container } = render(
      <TableOfContents items={[{ title: 'A' }]} className="test-cls" />
    );
    expect(container.firstElementChild?.getAttribute('class')).toContain('test-cls');
  });
});

describe('EndSlide', () => {
  it('renders variant heading', () => {
    const { container } = render(<EndSlide variant="thankyou" />);
    expect(container.textContent).toContain('Thank You');
  });

  it('applies className', () => {
    const { container } = render(<EndSlide variant="qa" className="test-cls" />);
    expect(container.firstElementChild?.getAttribute('class')).toContain('test-cls');
  });
});

describe('TitleCard', () => {
  it('renders title', () => {
    const { container } = render(<TitleCard title="Welcome" />);
    expect(container.textContent).toContain('Welcome');
  });

  it('applies className', () => {
    const { container } = render(<TitleCard title="T" className="test-cls" />);
    expect(container.firstElementChild?.getAttribute('class')).toContain('test-cls');
  });
});
