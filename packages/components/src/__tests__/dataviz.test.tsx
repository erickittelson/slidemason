import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import {
  BarChart,
  StackedBar,
  DonutChart,
  ProgressBar,
  ProgressRing,
  GaugeChart,
  Sparkline,
  HeatmapGrid,
  WaterfallChart,
  BulletChart,
  AreaChart,
  ScatterPlot,
  PieChart,
  HarveyBall,
} from '../dataviz';

afterEach(() => cleanup());

describe('BarChart', () => {
  it('renders bars with labels', () => {
    const { container } = render(
      <BarChart bars={[{ label: 'A', value: 10 }, { label: 'B', value: 20 }]} />
    );
    expect(container.querySelector('svg')).toBeDefined();
    expect(container.textContent).toContain('A');
    expect(container.textContent).toContain('B');
  });

  it('applies className', () => {
    const { container } = render(
      <BarChart bars={[{ label: 'X', value: 5 }]} className="test-cls" />
    );
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('test-cls');
  });
});

describe('StackedBar', () => {
  it('renders stacked segments', () => {
    const { container } = render(
      <StackedBar bars={[{ label: 'Row1', segments: [{ value: 10 }, { value: 20 }] }]} />
    );
    expect(container.querySelector('svg')).toBeDefined();
    expect(container.textContent).toContain('Row1');
  });

  it('applies className', () => {
    const { container } = render(
      <StackedBar bars={[{ label: 'R', segments: [{ value: 5 }] }]} className="test-cls" />
    );
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('test-cls');
  });
});

describe('DonutChart', () => {
  it('renders segments and center label', () => {
    const { container } = render(
      <DonutChart segments={[{ label: 'A', value: 30 }, { label: 'B', value: 70 }]} centerLabel="100" />
    );
    expect(container.querySelector('svg')).toBeDefined();
    expect(container.textContent).toContain('100');
  });

  it('applies className', () => {
    const { container } = render(
      <DonutChart segments={[{ label: 'X', value: 50 }]} className="test-cls" />
    );
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('test-cls');
  });
});

describe('ProgressBar', () => {
  it('renders with value and label', () => {
    const { container } = render(
      <ProgressBar value={75} label="Loading" showPercent />
    );
    expect(container.textContent).toContain('Loading');
    expect(container.textContent).toContain('75%');
  });

  it('applies className', () => {
    const { container } = render(
      <ProgressBar value={50} className="test-cls" />
    );
    expect(container.firstElementChild?.getAttribute('class')).toContain('test-cls');
  });
});

describe('ProgressRing', () => {
  it('renders ring with label', () => {
    const { container } = render(
      <ProgressRing value={60} label="60%" />
    );
    expect(container.querySelector('svg')).toBeDefined();
    expect(container.textContent).toContain('60%');
  });

  it('applies className', () => {
    const { container } = render(
      <ProgressRing value={50} className="test-cls" />
    );
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('test-cls');
  });
});

describe('GaugeChart', () => {
  it('renders gauge with value', () => {
    const { container } = render(
      <GaugeChart value={75} label="Speed" />
    );
    expect(container.querySelector('svg')).toBeDefined();
    expect(container.textContent).toContain('75');
    expect(container.textContent).toContain('Speed');
  });

  it('applies className', () => {
    const { container } = render(
      <GaugeChart value={50} className="test-cls" />
    );
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('test-cls');
  });
});

describe('Sparkline', () => {
  it('renders polyline from data', () => {
    const { container } = render(
      <Sparkline data={[1, 3, 2, 5, 4]} />
    );
    expect(container.querySelector('svg')).toBeDefined();
    expect(container.querySelector('polyline')).toBeDefined();
  });

  it('applies className', () => {
    const { container } = render(
      <Sparkline data={[1, 2, 3]} className="test-cls" />
    );
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('test-cls');
  });
});

describe('HeatmapGrid', () => {
  it('renders grid with row labels', () => {
    const { container } = render(
      <HeatmapGrid rows={[{ label: 'Mon', cells: [1, 2, 3] }]} columnLabels={['A', 'B', 'C']} />
    );
    expect(container.textContent).toContain('Mon');
    expect(container.textContent).toContain('A');
  });

  it('applies className', () => {
    const { container } = render(
      <HeatmapGrid rows={[{ label: 'X', cells: [1] }]} className="test-cls" />
    );
    expect(container.firstElementChild?.getAttribute('class')).toContain('test-cls');
  });
});

describe('WaterfallChart', () => {
  it('renders waterfall bars', () => {
    const { container } = render(
      <WaterfallChart items={[{ label: 'Rev', value: 100 }, { label: 'Cost', value: -30 }]} />
    );
    expect(container.querySelector('svg')).toBeDefined();
    expect(container.textContent).toContain('Rev');
    expect(container.textContent).toContain('Cost');
  });

  it('applies className', () => {
    const { container } = render(
      <WaterfallChart items={[{ label: 'A', value: 10 }]} className="test-cls" />
    );
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('test-cls');
  });
});

describe('BulletChart', () => {
  it('renders bullet with target marker', () => {
    const { container } = render(
      <BulletChart value={75} target={90} ranges={[50, 75, 100]} label="Sales" />
    );
    expect(container.querySelector('svg')).toBeDefined();
    expect(container.textContent).toContain('Sales');
  });

  it('applies className', () => {
    const { container } = render(
      <BulletChart value={50} target={80} ranges={[30, 60, 100]} className="test-cls" />
    );
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('test-cls');
  });
});

describe('AreaChart', () => {
  it('renders line and fill', () => {
    const { container } = render(
      <AreaChart data={[{ label: 'Jan', value: 10 }, { label: 'Feb', value: 20 }]} />
    );
    expect(container.querySelector('svg')).toBeDefined();
    expect(container.querySelector('polyline')).toBeDefined();
    expect(container.querySelector('polygon')).toBeDefined();
    expect(container.textContent).toContain('Jan');
  });

  it('applies className', () => {
    const { container } = render(
      <AreaChart data={[{ label: 'A', value: 5 }]} className="test-cls" />
    );
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('test-cls');
  });
});

describe('ScatterPlot', () => {
  it('renders points on axes', () => {
    const { container } = render(
      <ScatterPlot points={[{ x: 1, y: 2, label: 'P1' }, { x: 3, y: 4 }]} xLabel="X" yLabel="Y" />
    );
    expect(container.querySelector('svg')).toBeDefined();
    expect(container.querySelectorAll('circle').length).toBe(2);
    expect(container.textContent).toContain('P1');
  });

  it('applies className', () => {
    const { container } = render(
      <ScatterPlot points={[{ x: 0, y: 0 }]} className="test-cls" />
    );
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('test-cls');
  });
});

describe('PieChart', () => {
  it('renders slices with labels', () => {
    const { container } = render(
      <PieChart slices={[{ label: 'A', value: 40 }, { label: 'B', value: 60 }]} />
    );
    expect(container.querySelector('svg')).toBeDefined();
    expect(container.textContent).toContain('A');
    expect(container.textContent).toContain('B');
  });

  it('applies className', () => {
    const { container } = render(
      <PieChart slices={[{ label: 'X', value: 100 }]} className="test-cls" />
    );
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('test-cls');
  });
});

describe('HarveyBall', () => {
  it('renders with value fill', () => {
    const { container } = render(<HarveyBall value={75} />);
    expect(container.querySelector('svg')).toBeDefined();
    expect(container.querySelector('path')).toBeDefined();
  });

  it('applies className', () => {
    const { container } = render(<HarveyBall value={50} className="test-cls" />);
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('test-cls');
  });
});
