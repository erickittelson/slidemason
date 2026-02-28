import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import {
  ProsCons,
  BeforeAfter,
  VersusSlide,
  FeatureMatrix,
  HarveyBallMatrix,
  SWOTGrid,
  ScoreCard,
  TrafficLight,
  RatingStars,
  GapAnalysis,
  PriorityMatrix,
  CompetitorMap,
} from '../comparison';

afterEach(() => cleanup());

describe('ProsCons', () => {
  it('renders pros and cons items', () => {
    const { container } = render(<ProsCons pros={['Fast', 'Cheap']} cons={['Complex']} />);
    expect(container.textContent).toContain('Fast');
    expect(container.textContent).toContain('Cheap');
    expect(container.textContent).toContain('Complex');
    expect(container.textContent).toContain('Pros');
    expect(container.textContent).toContain('Cons');
  });

  it('applies className', () => {
    const { container } = render(<ProsCons pros={['A']} cons={['B']} className="test-cls" />);
    expect(container.firstElementChild?.getAttribute('class')).toContain('test-cls');
  });
});

describe('BeforeAfter', () => {
  it('renders before and after sections', () => {
    const { container } = render(
      <BeforeAfter
        before={{ title: 'Old', items: ['Slow'] }}
        after={{ title: 'New', items: ['Fast'] }}
      />
    );
    expect(container.textContent).toContain('Old');
    expect(container.textContent).toContain('Slow');
    expect(container.textContent).toContain('New');
    expect(container.textContent).toContain('Fast');
  });

  it('applies className', () => {
    const { container } = render(
      <BeforeAfter before={{ title: 'A', items: [] }} after={{ title: 'B', items: [] }} className="test-cls" />
    );
    expect(container.firstElementChild?.getAttribute('class')).toContain('test-cls');
  });
});

describe('VersusSlide', () => {
  it('renders left and right labels with VS', () => {
    const { container } = render(
      <VersusSlide left={{ label: 'React', points: ['JSX'] }} right={{ label: 'Vue', points: ['SFC'] }} />
    );
    expect(container.textContent).toContain('React');
    expect(container.textContent).toContain('Vue');
    expect(container.textContent).toContain('VS');
  });

  it('applies className', () => {
    const { container } = render(
      <VersusSlide left={{ label: 'A' }} right={{ label: 'B' }} className="test-cls" />
    );
    expect(container.firstElementChild?.getAttribute('class')).toContain('test-cls');
  });
});

describe('FeatureMatrix', () => {
  it('renders features and products', () => {
    const { container } = render(
      <FeatureMatrix
        features={['SSR', 'TypeScript']}
        products={[{ name: 'Next.js', values: [true, true] }, { name: 'CRA', values: [false, 'Partial'] }]}
      />
    );
    expect(container.textContent).toContain('SSR');
    expect(container.textContent).toContain('Next.js');
    expect(container.textContent).toContain('Partial');
  });

  it('applies className', () => {
    const { container } = render(
      <FeatureMatrix features={['A']} products={[{ name: 'P', values: [true] }]} className="test-cls" />
    );
    expect(container.querySelector('table')?.getAttribute('class')).toContain('test-cls');
  });
});

describe('HarveyBallMatrix', () => {
  it('renders criteria and options with harvey balls', () => {
    const { container } = render(
      <HarveyBallMatrix
        criteria={['Speed', 'Cost']}
        options={[{ name: 'A', scores: [75, 50] }, { name: 'B', scores: [25, 100] }]}
      />
    );
    expect(container.textContent).toContain('Speed');
    expect(container.textContent).toContain('A');
    expect(container.querySelectorAll('svg').length).toBeGreaterThan(0);
  });

  it('applies className', () => {
    const { container } = render(
      <HarveyBallMatrix criteria={['X']} options={[{ name: 'Y', scores: [50] }]} className="test-cls" />
    );
    expect(container.querySelector('table')?.getAttribute('class')).toContain('test-cls');
  });
});

describe('SWOTGrid', () => {
  it('renders all four quadrants', () => {
    const { container } = render(
      <SWOTGrid strengths={['Strong brand']} weaknesses={['High cost']} opportunities={['New market']} threats={['Competition']} />
    );
    expect(container.textContent).toContain('Strengths');
    expect(container.textContent).toContain('Strong brand');
    expect(container.textContent).toContain('Weaknesses');
    expect(container.textContent).toContain('Threats');
  });

  it('applies className', () => {
    const { container } = render(
      <SWOTGrid strengths={[]} weaknesses={[]} opportunities={[]} threats={[]} className="test-cls" />
    );
    expect(container.firstElementChild?.getAttribute('class')).toContain('test-cls');
  });
});

describe('ScoreCard', () => {
  it('renders criteria with weighted totals', () => {
    const { container } = render(
      <ScoreCard criteria={[{ label: 'Quality', weight: 0.5, score: 8 }, { label: 'Speed', weight: 0.5, score: 6 }]} />
    );
    expect(container.textContent).toContain('Quality');
    expect(container.textContent).toContain('Speed');
    expect(container.textContent).toContain('Total');
    expect(container.textContent).toContain('7.0');
  });

  it('applies className', () => {
    const { container } = render(
      <ScoreCard criteria={[{ label: 'X', weight: 1, score: 5 }]} className="test-cls" />
    );
    expect(container.querySelector('table')?.getAttribute('class')).toContain('test-cls');
  });
});

describe('TrafficLight', () => {
  it('renders items with status indicators', () => {
    const { container } = render(
      <TrafficLight items={[{ label: 'Budget', status: 'green', note: 'On track' }, { label: 'Timeline', status: 'red' }]} />
    );
    expect(container.textContent).toContain('Budget');
    expect(container.textContent).toContain('On track');
    expect(container.textContent).toContain('Timeline');
  });

  it('applies className', () => {
    const { container } = render(
      <TrafficLight items={[{ label: 'A', status: 'green' }]} className="test-cls" />
    );
    expect(container.firstElementChild?.getAttribute('class')).toContain('test-cls');
  });
});

describe('RatingStars', () => {
  it('renders items with stars', () => {
    const { container } = render(
      <RatingStars items={[{ label: 'Quality', rating: 4 }, { label: 'Speed', rating: 3, max: 5 }]} />
    );
    expect(container.textContent).toContain('Quality');
    expect(container.textContent).toContain('Speed');
    expect(container.querySelectorAll('svg').length).toBe(10);
  });

  it('applies className', () => {
    const { container } = render(
      <RatingStars items={[{ label: 'X', rating: 1 }]} className="test-cls" />
    );
    expect(container.firstElementChild?.getAttribute('class')).toContain('test-cls');
  });
});

describe('GapAnalysis', () => {
  it('renders current, gap, and desired', () => {
    const { container } = render(
      <GapAnalysis current={{ label: 'Now', value: '60%' }} desired={{ label: 'Target', value: '90%' }} gap="+30%" />
    );
    expect(container.textContent).toContain('Now');
    expect(container.textContent).toContain('60%');
    expect(container.textContent).toContain('Target');
    expect(container.textContent).toContain('+30%');
  });

  it('applies className', () => {
    const { container } = render(
      <GapAnalysis current={{ label: 'A', value: '1' }} desired={{ label: 'B', value: '2' }} gap="1" className="test-cls" />
    );
    expect(container.firstElementChild?.getAttribute('class')).toContain('test-cls');
  });
});

describe('PriorityMatrix', () => {
  it('renders items as positioned dots', () => {
    const { container } = render(
      <PriorityMatrix items={[{ label: 'Task A', effort: 20, impact: 80 }, { label: 'Task B', effort: 70, impact: 30 }]} />
    );
    expect(container.textContent).toContain('Quick Wins');
    expect(container.textContent).toContain('Effort');
    expect(container.textContent).toContain('Impact');
  });

  it('applies className', () => {
    const { container } = render(
      <PriorityMatrix items={[{ label: 'X', effort: 50, impact: 50 }]} className="test-cls" />
    );
    expect(container.firstElementChild?.getAttribute('class')).toContain('test-cls');
  });
});

describe('CompetitorMap', () => {
  it('renders items as dots on axes', () => {
    const { container } = render(
      <CompetitorMap
        items={[{ label: 'Us', x: 80, y: 70 }, { label: 'Them', x: 30, y: 40 }]}
        xAxis="Price"
        yAxis="Quality"
      />
    );
    expect(container.querySelector('svg')).toBeDefined();
    expect(container.textContent).toContain('Us');
    expect(container.textContent).toContain('Price');
    expect(container.textContent).toContain('Quality');
  });

  it('applies className', () => {
    const { container } = render(
      <CompetitorMap items={[{ label: 'A', x: 50, y: 50 }]} xAxis="X" yAxis="Y" className="test-cls" />
    );
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('test-cls');
  });
});
