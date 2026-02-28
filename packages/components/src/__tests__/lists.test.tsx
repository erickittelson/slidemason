import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import {
  IconList,
  Checklist,
  TimelineVertical,
  TimelineHorizontal,
  ProcessFlow,
  StepCards,
  AccordionList,
  ProgressSteps,
  RankedList,
  BreadcrumbPath,
  MilestoneTracker,
  SwimLanes,
} from '../lists';

// --- IconList ---
describe('IconList', () => {
  const items = [
    { icon: 'Star', text: 'Favorites' },
    { icon: 'Heart', text: 'Likes' },
  ];

  it('renders item text', () => {
    render(<IconList items={items} />);
    expect(screen.getByText('Favorites')).toBeTruthy();
    expect(screen.getByText('Likes')).toBeTruthy();
  });

  it('applies className and style', () => {
    const { container } = render(
      <IconList items={items} className="custom" style={{ color: 'red' }} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('custom');
    expect(el.style.color).toBe('red');
  });

  it('applies animation classes when animate is stagger', () => {
    const { container } = render(<IconList items={items} animate="stagger" />);
    expect(container.innerHTML).toContain('sm-fade-up');
    expect(container.innerHTML).toContain('sm-stagger-1');
  });
});

// --- Checklist ---
describe('Checklist', () => {
  const items = [
    { text: 'Done task', checked: true },
    { text: 'Pending task', checked: false },
  ];

  it('renders item text', () => {
    render(<Checklist items={items} />);
    expect(screen.getByText('Done task')).toBeTruthy();
    expect(screen.getByText('Pending task')).toBeTruthy();
  });

  it('applies className and style', () => {
    const { container } = render(
      <Checklist items={items} className="custom" style={{ gap: '1rem' }} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('custom');
    expect(el.style.gap).toBe('1rem');
  });

  it('applies animation when animate is true', () => {
    const { container } = render(<Checklist items={items} animate />);
    expect(container.innerHTML).toContain('sm-fade-up');
  });
});

// --- TimelineVertical ---
describe('TimelineVertical', () => {
  const events = [
    { date: '2024-01', title: 'Start', description: 'Began project' },
    { date: '2024-06', title: 'Launch' },
  ];

  it('renders events', () => {
    render(<TimelineVertical events={events} />);
    expect(screen.getByText('Start')).toBeTruthy();
    expect(screen.getByText('Launch')).toBeTruthy();
    expect(screen.getByText('2024-01')).toBeTruthy();
  });

  it('renders description when provided', () => {
    render(<TimelineVertical events={events} />);
    expect(screen.getByText('Began project')).toBeTruthy();
  });

  it('applies className and style', () => {
    const { container } = render(
      <TimelineVertical events={events} className="custom" style={{ color: 'blue' }} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('custom');
    expect(el.style.color).toBe('blue');
  });
});

// --- TimelineHorizontal ---
describe('TimelineHorizontal', () => {
  const milestones = [
    { label: 'Phase 1', active: true },
    { label: 'Phase 2', date: 'Q2' },
  ];

  it('renders milestones', () => {
    render(<TimelineHorizontal milestones={milestones} />);
    expect(screen.getByText('Phase 1')).toBeTruthy();
    expect(screen.getByText('Phase 2')).toBeTruthy();
  });

  it('renders date when provided', () => {
    render(<TimelineHorizontal milestones={milestones} />);
    expect(screen.getByText('Q2')).toBeTruthy();
  });

  it('applies animation when animate is true', () => {
    const { container } = render(<TimelineHorizontal milestones={milestones} animate />);
    expect(container.innerHTML).toContain('sm-fade-up');
  });
});

// --- ProcessFlow ---
describe('ProcessFlow', () => {
  const steps = [
    { label: 'Input' },
    { label: 'Process', icon: 'Cog' },
    { label: 'Output' },
  ];

  it('renders step labels', () => {
    render(<ProcessFlow steps={steps} />);
    expect(screen.getByText('Input')).toBeTruthy();
    expect(screen.getByText('Process')).toBeTruthy();
    expect(screen.getByText('Output')).toBeTruthy();
  });

  it('renders arrow separators between steps', () => {
    const { container } = render(<ProcessFlow steps={steps} />);
    const allText = container.textContent || '';
    // 3 steps = 2 arrow separators
    const arrowCount = (allText.match(/\u2192/g) || []).length;
    expect(arrowCount).toBe(2);
  });

  it('applies className and style', () => {
    const { container } = render(
      <ProcessFlow steps={steps} className="custom" style={{ padding: '1rem' }} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('custom');
    expect(el.style.padding).toBe('1rem');
  });
});

// --- StepCards ---
describe('StepCards', () => {
  const steps = [
    { number: 1, title: 'Plan', description: 'Make a plan' },
    { number: 2, title: 'Build', description: 'Build it' },
  ];

  it('renders step titles and descriptions', () => {
    render(<StepCards steps={steps} />);
    expect(screen.getByText('Plan')).toBeTruthy();
    expect(screen.getByText('Make a plan')).toBeTruthy();
  });

  it('formats numbers with leading zeros', () => {
    render(<StepCards steps={steps} />);
    expect(screen.getByText('01')).toBeTruthy();
    expect(screen.getByText('02')).toBeTruthy();
  });

  it('applies animation when animate is stagger', () => {
    const { container } = render(<StepCards steps={steps} animate="stagger" />);
    expect(container.innerHTML).toContain('sm-stagger-1');
    expect(container.innerHTML).toContain('sm-stagger-2');
  });
});

// --- AccordionList ---
describe('AccordionList', () => {
  const items = [
    { title: 'Section A', content: 'Content A', expanded: true },
    { title: 'Section B', content: 'Content B' },
  ];

  it('renders all titles', () => {
    render(<AccordionList items={items} />);
    expect(screen.getByText('Section A')).toBeTruthy();
    expect(screen.getByText('Section B')).toBeTruthy();
  });

  it('shows content only for expanded items', () => {
    render(<AccordionList items={items} />);
    expect(screen.getByText('Content A')).toBeTruthy();
    expect(screen.queryByText('Content B')).toBeNull();
  });

  it('applies className and style', () => {
    const { container } = render(
      <AccordionList items={items} className="custom" style={{ margin: '1rem' }} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('custom');
    expect(el.style.margin).toBe('1rem');
  });
});

// --- ProgressSteps ---
describe('ProgressSteps', () => {
  const steps = ['Step 1', 'Step 2', 'Step 3'];

  it('renders correct number of circles', () => {
    const { container } = render(<ProgressSteps steps={steps} current={1} />);
    // 3 circles with width 28px
    const circles = container.querySelectorAll('[title]');
    expect(circles.length).toBe(3);
  });

  it('applies pulse class to current step', () => {
    const { container } = render(<ProgressSteps steps={steps} current={1} />);
    expect(container.innerHTML).toContain('sm-pulse');
  });

  it('applies className and style', () => {
    const { container } = render(
      <ProgressSteps steps={steps} current={0} className="custom" style={{ width: '100%' }} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('custom');
    expect(el.style.width).toBe('100%');
  });
});

// --- RankedList ---
describe('RankedList', () => {
  const items = [
    { label: 'Alpha', value: 100 },
    { label: 'Beta', value: 50 },
  ];

  it('renders labels', () => {
    render(<RankedList items={items} />);
    expect(screen.getByText('Alpha')).toBeTruthy();
    expect(screen.getByText('Beta')).toBeTruthy();
  });

  it('renders rank numbers', () => {
    render(<RankedList items={items} />);
    expect(screen.getByText('1')).toBeTruthy();
    expect(screen.getByText('2')).toBeTruthy();
  });

  it('applies animation when animate is true', () => {
    const { container } = render(<RankedList items={items} animate />);
    expect(container.innerHTML).toContain('sm-fade-up');
  });
});

// --- BreadcrumbPath ---
describe('BreadcrumbPath', () => {
  const steps = ['Home', 'Products', 'Detail'];

  it('renders all steps', () => {
    render(<BreadcrumbPath steps={steps} />);
    expect(screen.getByText('Home')).toBeTruthy();
    expect(screen.getByText('Products')).toBeTruthy();
    expect(screen.getByText('Detail')).toBeTruthy();
  });

  it('defaults to last step as current (bold)', () => {
    render(<BreadcrumbPath steps={steps} />);
    const detail = screen.getByText('Detail');
    expect(detail.style.fontWeight).toBe('700');
  });

  it('applies className and style', () => {
    const { container } = render(
      <BreadcrumbPath steps={steps} className="custom" style={{ padding: '0.5rem' }} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('custom');
    expect(el.style.padding).toBe('0.5rem');
  });
});

// --- MilestoneTracker ---
describe('MilestoneTracker', () => {
  const milestones = [
    { label: 'Design', status: 'completed' as const },
    { label: 'Develop', status: 'current' as const },
    { label: 'Deploy', status: 'upcoming' as const },
  ];

  it('renders all milestone labels', () => {
    render(<MilestoneTracker milestones={milestones} />);
    expect(screen.getByText('Design')).toBeTruthy();
    expect(screen.getByText('Develop')).toBeTruthy();
    expect(screen.getByText('Deploy')).toBeTruthy();
  });

  it('applies pulse class to current milestone', () => {
    const { container } = render(<MilestoneTracker milestones={milestones} />);
    expect(container.innerHTML).toContain('sm-pulse');
  });

  it('applies className and style', () => {
    const { container } = render(
      <MilestoneTracker milestones={milestones} className="custom" style={{ width: '100%' }} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('custom');
    expect(el.style.width).toBe('100%');
  });
});

// --- SwimLanes ---
describe('SwimLanes', () => {
  const lanes = [
    {
      label: 'Backend',
      items: [
        { text: 'API Design', start: 0, end: 30 },
        { text: 'Implementation', start: 30, end: 70 },
      ],
    },
    {
      label: 'Frontend',
      items: [{ text: 'UI Build', start: 20, end: 60 }],
    },
  ];

  it('renders lane labels', () => {
    render(<SwimLanes lanes={lanes} />);
    expect(screen.getByText('Backend')).toBeTruthy();
    expect(screen.getByText('Frontend')).toBeTruthy();
  });

  it('renders items with title attribute', () => {
    const { container } = render(<SwimLanes lanes={lanes} />);
    const apiBlock = container.querySelector('[title="API Design"]');
    expect(apiBlock).toBeTruthy();
  });

  it('applies className and style', () => {
    const { container } = render(
      <SwimLanes lanes={lanes} className="custom" style={{ gap: '1rem' }} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('custom');
    expect(el.style.gap).toBe('1rem');
  });
});
