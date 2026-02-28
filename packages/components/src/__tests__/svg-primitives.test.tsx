import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import {
  Arrow,
  Connector,
  CircleNode,
  BoxNode,
  ArcSegment,
  Ring,
  FunnelTrapezoid,
  PyramidLayer,
} from '../svg';

afterEach(() => cleanup());

function renderSvg(children: React.ReactNode) {
  return render(<svg>{children}</svg>);
}

describe('Arrow', () => {
  it('renders a line and arrowhead polygon', () => {
    const { container } = renderSvg(
      <Arrow x1={0} y1={0} x2={100} y2={0} />
    );
    const line = container.querySelector('line');
    expect(line).toBeDefined();
    expect(line?.getAttribute('stroke')).toBe('var(--sm-primary)');

    const polygon = container.querySelector('polygon');
    expect(polygon).toBeDefined();
    expect(polygon?.getAttribute('fill')).toBe('var(--sm-primary)');
  });

  it('applies custom color and className', () => {
    const { container } = renderSvg(
      <Arrow x1={0} y1={0} x2={50} y2={50} color="red" className="custom" />
    );
    const g = container.querySelector('g');
    expect(g?.getAttribute('class')).toContain('custom');
    expect(container.querySelector('line')?.getAttribute('stroke')).toBe('red');
  });

  it('sets draw animation attributes when animate is true', () => {
    const { container } = renderSvg(
      <Arrow x1={0} y1={0} x2={100} y2={0} animate />
    );
    const g = container.querySelector('g');
    expect(g?.getAttribute('class')).toContain('sm-draw');
    const line = container.querySelector('line');
    expect(line?.getAttribute('stroke-dasharray')).toBeTruthy();
  });
});

describe('Connector', () => {
  it('renders a curved path', () => {
    const { container } = renderSvg(
      <Connector x1={0} y1={0} x2={100} y2={100} />
    );
    const path = container.querySelector('path');
    expect(path).toBeDefined();
    expect(path?.getAttribute('d')).toContain('Q');
    expect(path?.getAttribute('stroke')).toBe('var(--sm-primary)');
    expect(path?.getAttribute('fill')).toBe('none');
  });

  it('applies animate class when animate is true', () => {
    const { container } = renderSvg(
      <Connector x1={0} y1={0} x2={100} y2={0} animate />
    );
    const path = container.querySelector('path');
    expect(path?.getAttribute('class')).toContain('sm-draw');
  });
});

describe('CircleNode', () => {
  it('renders a circle', () => {
    const { container } = renderSvg(<CircleNode cx={50} cy={50} />);
    const circle = container.querySelector('circle');
    expect(circle).toBeDefined();
    expect(circle?.getAttribute('stroke')).toBe('var(--sm-primary)');
  });

  it('renders a label when provided', () => {
    const { container } = renderSvg(
      <CircleNode cx={50} cy={50} label="Node A" />
    );
    const text = container.querySelector('text');
    expect(text).toBeDefined();
    expect(text?.textContent).toBe('Node A');
  });

  it('does not render text when label is omitted', () => {
    const { container } = renderSvg(<CircleNode cx={50} cy={50} />);
    expect(container.querySelector('text')).toBeNull();
  });
});

describe('BoxNode', () => {
  it('renders a rounded rect', () => {
    const { container } = renderSvg(<BoxNode x={10} y={10} />);
    const rect = container.querySelector('rect');
    expect(rect).toBeDefined();
    expect(rect?.getAttribute('rx')).toBe('8');
    expect(rect?.getAttribute('stroke')).toBe('var(--sm-primary)');
  });

  it('renders a label centered in the box', () => {
    const { container } = renderSvg(
      <BoxNode x={0} y={0} width={100} height={40} label="Box" />
    );
    const text = container.querySelector('text');
    expect(text?.textContent).toBe('Box');
    expect(text?.getAttribute('x')).toBe('50');
    expect(text?.getAttribute('y')).toBe('20');
  });
});

describe('ArcSegment', () => {
  it('renders an arc path', () => {
    const { container } = renderSvg(
      <ArcSegment cx={100} cy={100} radius={50} startAngle={0} endAngle={90} />
    );
    const path = container.querySelector('path');
    expect(path).toBeDefined();
    expect(path?.getAttribute('d')).toContain('A');
    expect(path?.getAttribute('stroke')).toBe('var(--sm-primary)');
    expect(path?.getAttribute('fill')).toBe('none');
  });

  it('sets sm-draw class when animate is true', () => {
    const { container } = renderSvg(
      <ArcSegment cx={0} cy={0} radius={40} startAngle={0} endAngle={180} animate />
    );
    const path = container.querySelector('path');
    expect(path?.getAttribute('class')).toContain('sm-draw');
  });
});

describe('Ring', () => {
  it('renders two circles (track and fill)', () => {
    const { container } = renderSvg(<Ring cx={50} cy={50} />);
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBe(2);
  });

  it('uses theme-aware colors', () => {
    const { container } = renderSvg(<Ring cx={50} cy={50} />);
    const circles = container.querySelectorAll('circle');
    // Track circle
    expect(circles[0]?.getAttribute('stroke')).toBe('var(--sm-muted, #e5e7eb)');
    // Fill circle
    expect(circles[1]?.getAttribute('stroke')).toBe('var(--sm-primary)');
  });

  it('respects fillPercent for stroke-dasharray', () => {
    const { container } = renderSvg(
      <Ring cx={50} cy={50} radius={40} fillPercent={50} />
    );
    const fillCircle = container.querySelectorAll('circle')[1];
    const dasharray = fillCircle?.getAttribute('stroke-dasharray');
    expect(dasharray).toBeTruthy();
    // 50% of circumference = pi * 40
    const circumference = 2 * Math.PI * 40;
    const expected = circumference / 2;
    expect(dasharray).toContain(expected.toString());
  });
});

describe('FunnelTrapezoid', () => {
  it('renders a polygon trapezoid', () => {
    const { container } = renderSvg(
      <FunnelTrapezoid x={100} y={0} topWidth={200} bottomWidth={150} height={50} />
    );
    const polygon = container.querySelector('polygon');
    expect(polygon).toBeDefined();
    expect(polygon?.getAttribute('fill')).toBe('var(--sm-primary)');
  });

  it('renders a label when provided', () => {
    const { container } = renderSvg(
      <FunnelTrapezoid
        x={100}
        y={0}
        topWidth={200}
        bottomWidth={100}
        height={40}
        label="Stage 1"
      />
    );
    const text = container.querySelector('text');
    expect(text?.textContent).toBe('Stage 1');
  });
});

describe('PyramidLayer', () => {
  it('renders a polygon for the layer', () => {
    const { container } = renderSvg(
      <PyramidLayer cx={100} cy={100} level={0} totalLevels={3} />
    );
    const polygon = container.querySelector('polygon');
    expect(polygon).toBeDefined();
    expect(polygon?.getAttribute('fill')).toBe('var(--sm-primary)');
  });

  it('renders a label when provided', () => {
    const { container } = renderSvg(
      <PyramidLayer cx={100} cy={100} level={1} totalLevels={3} label="Middle" />
    );
    const text = container.querySelector('text');
    expect(text?.textContent).toBe('Middle');
  });

  it('applies animate class when animate is true', () => {
    const { container } = renderSvg(
      <PyramidLayer cx={100} cy={100} level={0} totalLevels={3} animate />
    );
    const g = container.querySelector('g');
    expect(g?.getAttribute('class')).toContain('sm-fade-in');
  });
});
