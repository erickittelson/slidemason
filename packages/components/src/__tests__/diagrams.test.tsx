import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import {
  Flywheel,
  CycleDiagram,
  FunnelChart,
  PyramidChart,
  VennDiagram,
  OrgChart,
  MindMap,
  Flowchart,
  MatrixQuadrant,
  RadarChart,
  ConcentricCircles,
  SankeyFlow,
  TreeMap,
  HubSpoke,
  BridgeDiagram,
  LoopDiagram,
} from '../diagrams';

afterEach(() => cleanup());

describe('Flywheel', () => {
  it('renders SVG with segment labels', () => {
    const { container } = render(
      <Flywheel segments={[{ label: 'A' }, { label: 'B' }, { label: 'C' }]} />
    );
    expect(container.querySelector('svg')).toBeDefined();
    expect(container.textContent).toContain('A');
    expect(container.textContent).toContain('B');
  });

  it('applies className', () => {
    const { container } = render(
      <Flywheel segments={[{ label: 'X' }]} className="test-cls" />
    );
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('test-cls');
  });
});

describe('CycleDiagram', () => {
  it('renders SVG with stage labels', () => {
    const { container } = render(
      <CycleDiagram stages={[{ label: 'Plan' }, { label: 'Do' }, { label: 'Check' }]} />
    );
    expect(container.querySelector('svg')).toBeDefined();
    expect(container.textContent).toContain('Plan');
  });

  it('applies className', () => {
    const { container } = render(
      <CycleDiagram stages={[{ label: 'A' }]} className="cycle-cls" />
    );
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('cycle-cls');
  });
});

describe('FunnelChart', () => {
  it('renders SVG with stage labels', () => {
    const { container } = render(
      <FunnelChart stages={[{ label: 'Leads', value: 1000 }, { label: 'Sales', value: 100 }]} />
    );
    expect(container.querySelector('svg')).toBeDefined();
    expect(container.textContent).toContain('Leads');
    expect(container.textContent).toContain('Sales');
  });

  it('applies className', () => {
    const { container } = render(
      <FunnelChart stages={[{ label: 'A' }]} className="funnel-cls" />
    );
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('funnel-cls');
  });
});

describe('PyramidChart', () => {
  it('renders SVG with layer labels', () => {
    const { container } = render(
      <PyramidChart layers={[{ label: 'Top' }, { label: 'Mid' }, { label: 'Base' }]} />
    );
    expect(container.querySelector('svg')).toBeDefined();
    expect(container.textContent).toContain('Top');
    expect(container.textContent).toContain('Base');
  });

  it('applies className', () => {
    const { container } = render(
      <PyramidChart layers={[{ label: 'A' }]} className="pyr-cls" />
    );
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('pyr-cls');
  });
});

describe('VennDiagram', () => {
  it('renders SVG with set labels and intersection', () => {
    const { container } = render(
      <VennDiagram sets={[{ label: 'A' }, { label: 'B' }]} intersection="A∩B" />
    );
    expect(container.querySelector('svg')).toBeDefined();
    expect(container.textContent).toContain('A');
    expect(container.textContent).toContain('A∩B');
  });

  it('applies className', () => {
    const { container } = render(
      <VennDiagram sets={[{ label: 'X' }]} className="venn-cls" />
    );
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('venn-cls');
  });
});

describe('OrgChart', () => {
  it('renders SVG with node labels', () => {
    const { container } = render(
      <OrgChart
        nodes={[
          { id: '1', label: 'CEO' },
          { id: '2', label: 'CTO', parentId: '1' },
        ]}
      />
    );
    expect(container.querySelector('svg')).toBeDefined();
    expect(container.textContent).toContain('CEO');
    expect(container.textContent).toContain('CTO');
  });

  it('applies className', () => {
    const { container } = render(
      <OrgChart nodes={[{ id: '1', label: 'Root' }]} className="org-cls" />
    );
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('org-cls');
  });
});

describe('MindMap', () => {
  it('renders SVG with center and branch labels', () => {
    const { container } = render(
      <MindMap center="Core" branches={[{ label: 'Branch1' }, { label: 'Branch2' }]} />
    );
    expect(container.querySelector('svg')).toBeDefined();
    expect(container.textContent).toContain('Core');
    expect(container.textContent).toContain('Branch1');
  });

  it('applies className', () => {
    const { container } = render(
      <MindMap center="X" branches={[{ label: 'Y' }]} className="mind-cls" />
    );
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('mind-cls');
  });
});

describe('Flowchart', () => {
  it('renders SVG with node labels', () => {
    const { container } = render(
      <Flowchart
        nodes={[
          { id: 's', label: 'Start', type: 'start' },
          { id: 'p', label: 'Process', type: 'process' },
        ]}
        edges={[{ from: 's', to: 'p' }]}
      />
    );
    expect(container.querySelector('svg')).toBeDefined();
    expect(container.textContent).toContain('Start');
    expect(container.textContent).toContain('Process');
  });

  it('applies className', () => {
    const { container } = render(
      <Flowchart
        nodes={[{ id: '1', label: 'A', type: 'process' }]}
        edges={[]}
        className="flow-cls"
      />
    );
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('flow-cls');
  });
});

describe('MatrixQuadrant', () => {
  it('renders SVG with axis and quadrant labels', () => {
    const { container } = render(
      <MatrixQuadrant
        xAxis="Effort"
        yAxis="Impact"
        quadrants={['Quick Wins', 'Major Projects', 'Fill-ins', 'Thankless']}
      />
    );
    expect(container.querySelector('svg')).toBeDefined();
    expect(container.textContent).toContain('Effort');
    expect(container.textContent).toContain('Quick Wins');
  });

  it('applies className', () => {
    const { container } = render(
      <MatrixQuadrant
        xAxis="X"
        yAxis="Y"
        quadrants={['A', 'B', 'C', 'D']}
        className="matrix-cls"
      />
    );
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('matrix-cls');
  });
});

describe('RadarChart', () => {
  it('renders SVG with axis labels', () => {
    const { container } = render(
      <RadarChart
        axes={[
          { label: 'Speed', value: 80 },
          { label: 'Power', value: 60 },
          { label: 'Range', value: 70 },
        ]}
      />
    );
    expect(container.querySelector('svg')).toBeDefined();
    expect(container.textContent).toContain('Speed');
    expect(container.textContent).toContain('Power');
  });

  it('applies className', () => {
    const { container } = render(
      <RadarChart axes={[{ label: 'A', value: 50 }]} className="radar-cls" />
    );
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('radar-cls');
  });
});

describe('ConcentricCircles', () => {
  it('renders SVG with ring labels', () => {
    const { container } = render(
      <ConcentricCircles rings={[{ label: 'Core' }, { label: 'Middle' }, { label: 'Outer' }]} />
    );
    expect(container.querySelector('svg')).toBeDefined();
    expect(container.textContent).toContain('Core');
    expect(container.textContent).toContain('Outer');
  });

  it('applies className', () => {
    const { container } = render(
      <ConcentricCircles rings={[{ label: 'A' }]} className="cc-cls" />
    );
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('cc-cls');
  });
});

describe('SankeyFlow', () => {
  it('renders SVG with node labels', () => {
    const { container } = render(
      <SankeyFlow
        nodes={[
          { id: 'a', label: 'Source' },
          { id: 'b', label: 'Dest' },
        ]}
        flows={[{ from: 'a', to: 'b', value: 100 }]}
      />
    );
    expect(container.querySelector('svg')).toBeDefined();
    expect(container.textContent).toContain('Source');
    expect(container.textContent).toContain('Dest');
  });

  it('applies className', () => {
    const { container } = render(
      <SankeyFlow
        nodes={[{ id: 'x', label: 'X' }]}
        flows={[]}
        className="sankey-cls"
      />
    );
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('sankey-cls');
  });
});

describe('TreeMap', () => {
  it('renders SVG with item labels', () => {
    const { container } = render(
      <TreeMap items={[{ label: 'Big', value: 70 }, { label: 'Small', value: 30 }]} />
    );
    expect(container.querySelector('svg')).toBeDefined();
    expect(container.textContent).toContain('Big');
    expect(container.textContent).toContain('Small');
  });

  it('applies className', () => {
    const { container } = render(
      <TreeMap items={[{ label: 'A', value: 1 }]} className="tree-cls" />
    );
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('tree-cls');
  });
});

describe('HubSpoke', () => {
  it('renders SVG with center and spoke labels', () => {
    const { container } = render(
      <HubSpoke center="Hub" spokes={[{ label: 'S1' }, { label: 'S2' }]} />
    );
    expect(container.querySelector('svg')).toBeDefined();
    expect(container.textContent).toContain('Hub');
    expect(container.textContent).toContain('S1');
  });

  it('applies className', () => {
    const { container } = render(
      <HubSpoke center="X" spokes={[{ label: 'Y' }]} className="hub-cls" />
    );
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('hub-cls');
  });
});

describe('BridgeDiagram', () => {
  it('renders SVG with start, change, and end labels', () => {
    const { container } = render(
      <BridgeDiagram
        start={{ label: 'Q1', value: 100 }}
        changes={[{ label: 'Growth', value: 50 }, { label: 'Loss', value: -20 }]}
        end={{ label: 'Q2', value: 130 }}
      />
    );
    expect(container.querySelector('svg')).toBeDefined();
    expect(container.textContent).toContain('Q1');
    expect(container.textContent).toContain('Growth');
    expect(container.textContent).toContain('Q2');
  });

  it('applies className', () => {
    const { container } = render(
      <BridgeDiagram
        start={{ label: 'S', value: 10 }}
        changes={[]}
        end={{ label: 'E', value: 10 }}
        className="bridge-cls"
      />
    );
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('bridge-cls');
  });
});

describe('LoopDiagram', () => {
  it('renders SVG with stage labels', () => {
    const { container } = render(
      <LoopDiagram stages={[{ label: 'Step1' }, { label: 'Step2' }, { label: 'Step3' }]} />
    );
    expect(container.querySelector('svg')).toBeDefined();
    expect(container.textContent).toContain('Step1');
    expect(container.textContent).toContain('Step2');
  });

  it('applies className', () => {
    const { container } = render(
      <LoopDiagram stages={[{ label: 'A' }]} className="loop-cls" />
    );
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('loop-cls');
  });
});
