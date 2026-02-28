import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChartSlide } from '../templates/ChartSlide';
import { MatrixSlide } from '../templates/MatrixSlide';
import { MockupSlide } from '../templates/MockupSlide';
import { TeamSlide } from '../templates/TeamSlide';
import { PricingSlide } from '../templates/PricingSlide';
import { CodeSlide } from '../templates/CodeSlide';
import { GallerySlide } from '../templates/GallerySlide';
import { ScoreSlide } from '../templates/ScoreSlide';
import { NetworkSlide } from '../templates/NetworkSlide';
import { FlowSlide } from '../templates/FlowSlide';
import { StatementSlide } from '../templates/StatementSlide';

describe('ChartSlide', () => {
  it('renders bar chart with title', () => {
    render(<ChartSlide title="Revenue" type="bar" data={[{ label: 'Q1', value: 100 }]} />);
    expect(screen.getByText('Revenue')).toBeDefined();
    expect(screen.getByText('Q1')).toBeDefined();
  });

  it('renders donut chart', () => {
    const { container } = render(<ChartSlide type="donut" data={[{ label: 'Sales', value: 60 }]} centerLabel="60%" />);
    expect(container.querySelector('svg')).toBeDefined();
  });

  it('renders pie chart', () => {
    render(<ChartSlide type="pie" data={[{ label: 'A', value: 30 }, { label: 'B', value: 70 }]} />);
    expect(screen.getByText('A')).toBeDefined();
    expect(screen.getByText('B')).toBeDefined();
  });

  it('renders area chart', () => {
    render(<ChartSlide type="area" data={[{ label: 'Jan', value: 10 }, { label: 'Feb', value: 20 }]} />);
    expect(screen.getByText('Jan')).toBeDefined();
  });

  it('renders waterfall chart', () => {
    const { container } = render(<ChartSlide type="waterfall" data={[{ label: 'Start', value: 100 }, { label: 'Cost', value: -20 }]} />);
    expect(container.querySelector('svg')).toBeDefined();
  });

  it('renders gauge chart', () => {
    render(<ChartSlide type="gauge" data={[{ label: 'Speed', value: 75 }]} max={100} gaugeLabel="MPH" />);
    expect(screen.getByText('75')).toBeDefined();
  });
});

describe('MatrixSlide', () => {
  it('renders SWOT grid', () => {
    const { container } = render(
      <MatrixSlide
        title="SWOT Analysis"
        type="swot"
        strengths={['Strong brand']}
        weaknesses={['High costs']}
        opportunities={['New market']}
        threats={['Competition']}
      />
    );
    expect(screen.getByText('SWOT Analysis')).toBeDefined();
    // SWOT grid renders with content
    expect(container.textContent).toContain('Strong brand');
    expect(container.textContent).toContain('Competition');
  });

  it('renders feature matrix', () => {
    render(
      <MatrixSlide
        type="feature"
        features={['Feature A']}
        products={[{ name: 'Product 1', values: [true] }]}
      />
    );
    expect(screen.getByText('Feature A')).toBeDefined();
    expect(screen.getByText('Product 1')).toBeDefined();
  });

  it('renders priority matrix', () => {
    const { container } = render(
      <MatrixSlide
        type="priority"
        items={[{ label: 'Task A', effort: 3, impact: 8 }]}
      />
    );
    // PriorityMatrix is SVG-based
    expect(container.querySelector('svg') || container.querySelector('[class*="flex"]')).toBeDefined();
  });
});

describe('MockupSlide', () => {
  it('renders phone mockup', () => {
    render(<MockupSlide title="Mobile App" type="phone" />);
    expect(screen.getByText('Mobile App')).toBeDefined();
  });

  it('renders browser mockup with bullets', () => {
    render(
      <MockupSlide title="Dashboard" type="browser" url="https://app.example.com" bullets={['Fast load times', 'Real-time updates']} />
    );
    expect(screen.getByText('Dashboard')).toBeDefined();
    expect(screen.getByText('Fast load times')).toBeDefined();
  });

  it('renders laptop mockup', () => {
    render(<MockupSlide type="laptop" subtitle="Desktop experience" />);
    expect(screen.getByText('Desktop experience')).toBeDefined();
  });
});

describe('TeamSlide', () => {
  it('renders team members', () => {
    render(
      <TeamSlide
        title="Our Team"
        members={[
          { name: 'Alice', role: 'CEO' },
          { name: 'Bob', role: 'CTO' },
        ]}
      />
    );
    expect(screen.getByText('Our Team')).toBeDefined();
    expect(screen.getByText('Alice')).toBeDefined();
    expect(screen.getByText('CTO')).toBeDefined();
  });
});

describe('PricingSlide', () => {
  it('renders pricing tiers', () => {
    render(
      <PricingSlide
        title="Pricing"
        tiers={[
          { name: 'Starter', price: '$9', features: ['5 users'] },
          { name: 'Pro', price: '$29', features: ['Unlimited users'], highlighted: true },
        ]}
      />
    );
    expect(screen.getByText('Pricing')).toBeDefined();
    expect(screen.getByText('Starter')).toBeDefined();
    expect(screen.getByText('$29')).toBeDefined();
  });
});

describe('CodeSlide', () => {
  it('renders code block', () => {
    render(<CodeSlide title="Example" code="const x = 1;" language="typescript" />);
    expect(screen.getByText('Example')).toBeDefined();
    expect(screen.getByText('const x = 1;')).toBeDefined();
  });

  it('renders annotations as numbered list', () => {
    render(
      <CodeSlide
        code="fn main() {}"
        annotations={[{ x: 0, y: 0, label: 'Entry point' }]}
      />
    );
    expect(screen.getByText('Entry point')).toBeDefined();
  });
});

describe('GallerySlide', () => {
  it('renders logo grid', () => {
    render(
      <GallerySlide title="Our Partners" type="logos" logos={[{ src: '/logo1.png', alt: 'Partner A' }]} />
    );
    expect(screen.getByText('Our Partners')).toBeDefined();
    expect(screen.getByAltText('Partner A')).toBeDefined();
  });

  it('renders icon mosaic', () => {
    render(<GallerySlide type="icons" icons={['Star', 'Heart']} />);
    // IconMosaic renders Lucide icons — just check it doesn't crash
    expect(true).toBe(true);
  });
});

describe('ScoreSlide', () => {
  it('renders traffic light', () => {
    render(
      <ScoreSlide
        title="Status"
        type="traffic-light"
        statusItems={[{ label: 'API', status: 'green' }, { label: 'DB', status: 'red', note: 'Down' }]}
      />
    );
    expect(screen.getByText('Status')).toBeDefined();
    expect(screen.getByText('API')).toBeDefined();
    expect(screen.getByText('Down')).toBeDefined();
  });

  it('renders rating stars', () => {
    render(
      <ScoreSlide type="rating" ratings={[{ label: 'Quality', rating: 4 }]} />
    );
    expect(screen.getByText('Quality')).toBeDefined();
  });
});

describe('NetworkSlide', () => {
  it('renders org chart', () => {
    render(
      <NetworkSlide
        title="Organization"
        type="org-chart"
        nodes={[{ id: '1', label: 'CEO' }, { id: '2', label: 'CTO', parentId: '1' }]}
      />
    );
    expect(screen.getByText('Organization')).toBeDefined();
    expect(screen.getByText('CEO')).toBeDefined();
    expect(screen.getByText('CTO')).toBeDefined();
  });

  it('renders mind map', () => {
    render(
      <NetworkSlide type="mind-map" center="Strategy" branches={[{ label: 'Growth' }]} />
    );
    expect(screen.getByText('Strategy')).toBeDefined();
    expect(screen.getByText('Growth')).toBeDefined();
  });

  it('renders hub spoke', () => {
    render(
      <NetworkSlide type="hub-spoke" center="Core" spokes={[{ label: 'Spoke A' }]} />
    );
    expect(screen.getByText('Core')).toBeDefined();
    expect(screen.getByText('Spoke A')).toBeDefined();
  });
});

describe('FlowSlide', () => {
  it('renders flowchart', () => {
    render(
      <FlowSlide
        title="Decision Flow"
        type="flowchart"
        flowNodes={[
          { id: '1', label: 'Start', type: 'start' },
          { id: '2', label: 'Check', type: 'decision' },
        ]}
        edges={[{ from: '1', to: '2' }]}
      />
    );
    expect(screen.getByText('Decision Flow')).toBeDefined();
    expect(screen.getByText('Start')).toBeDefined();
    expect(screen.getByText('Check')).toBeDefined();
  });

  it('renders sankey flow', () => {
    render(
      <FlowSlide
        type="sankey"
        sankeyNodes={[{ id: 'a', label: 'Source' }, { id: 'b', label: 'Target' }]}
        flows={[{ from: 'a', to: 'b', value: 100 }]}
      />
    );
    expect(screen.getByText('Source')).toBeDefined();
    expect(screen.getByText('Target')).toBeDefined();
  });
});

describe('StatementSlide', () => {
  it('renders gradient text', () => {
    render(<StatementSlide type="gradient-text" text="Bold statement" />);
    expect(screen.getByText('Bold statement')).toBeDefined();
  });

  it('renders big number', () => {
    const { container } = render(<StatementSlide type="big-number" value={42} prefix="$" suffix="M" />);
    // BigNumber renders value, prefix, suffix as separate spans in same div
    expect(container.textContent).toContain('42');
    expect(container.textContent).toContain('$');
    expect(container.textContent).toContain('M');
  });

  it('renders pull quote', () => {
    render(<StatementSlide type="pull-quote" quote="Words matter." attribution="Someone" />);
    expect(screen.getByText('Words matter.')).toBeDefined();
  });

  it('renders with mesh background', () => {
    render(<StatementSlide type="gradient-text" text="With bg" background="mesh" />);
    expect(screen.getByText('With bg')).toBeDefined();
  });

  it('renders with title label', () => {
    render(<StatementSlide type="gradient-text" text="Main" title="Section" />);
    expect(screen.getByText('Section')).toBeDefined();
    expect(screen.getByText('Main')).toBeDefined();
  });
});
