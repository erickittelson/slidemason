import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import {
  GradientBg,
  MeshGradient,
  GeometricPattern,
  BlobShape,
  GridLines,
  WavesDivider,
  CircuitPattern,
  TopographyLines,
  NoisyGradient,
  SpotlightEffect,
} from '../backgrounds';

afterEach(() => cleanup());

describe('GradientBg', () => {
  it('renders children', () => {
    const { container } = render(<GradientBg><p>Hello</p></GradientBg>);
    expect(container.textContent).toContain('Hello');
  });

  it('applies className', () => {
    const { container } = render(<GradientBg className="test-cls"><span>X</span></GradientBg>);
    expect(container.firstElementChild?.getAttribute('class')).toContain('test-cls');
  });
});

describe('MeshGradient', () => {
  it('renders children', () => {
    const { container } = render(<MeshGradient><p>Mesh</p></MeshGradient>);
    expect(container.textContent).toContain('Mesh');
  });

  it('applies className', () => {
    const { container } = render(<MeshGradient className="test-cls"><span>X</span></MeshGradient>);
    expect(container.firstElementChild?.getAttribute('class')).toContain('test-cls');
  });
});

describe('GeometricPattern', () => {
  it('renders children', () => {
    const { container } = render(<GeometricPattern><p>Geo</p></GeometricPattern>);
    expect(container.textContent).toContain('Geo');
  });

  it('applies className', () => {
    const { container } = render(<GeometricPattern className="test-cls"><span>X</span></GeometricPattern>);
    expect(container.firstElementChild?.getAttribute('class')).toContain('test-cls');
  });
});

describe('BlobShape', () => {
  it('renders SVG blob', () => {
    const { container } = render(<BlobShape />);
    expect(container.querySelector('svg')).toBeTruthy();
    expect(container.querySelector('path')).toBeTruthy();
  });

  it('applies className', () => {
    const { container } = render(<BlobShape className="test-cls" />);
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('test-cls');
  });
});

describe('GridLines', () => {
  it('renders children', () => {
    const { container } = render(<GridLines><p>Grid</p></GridLines>);
    expect(container.textContent).toContain('Grid');
  });

  it('applies className', () => {
    const { container } = render(<GridLines className="test-cls"><span>X</span></GridLines>);
    expect(container.firstElementChild?.getAttribute('class')).toContain('test-cls');
  });
});

describe('WavesDivider', () => {
  it('renders SVG wave', () => {
    const { container } = render(<WavesDivider />);
    expect(container.querySelector('svg')).toBeTruthy();
    expect(container.querySelector('path')).toBeTruthy();
  });

  it('applies className', () => {
    const { container } = render(<WavesDivider className="test-cls" />);
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('test-cls');
  });
});

describe('CircuitPattern', () => {
  it('renders children', () => {
    const { container } = render(<CircuitPattern><p>Circuit</p></CircuitPattern>);
    expect(container.textContent).toContain('Circuit');
  });

  it('applies className', () => {
    const { container } = render(<CircuitPattern className="test-cls"><span>X</span></CircuitPattern>);
    expect(container.firstElementChild?.getAttribute('class')).toContain('test-cls');
  });
});

describe('TopographyLines', () => {
  it('renders children', () => {
    const { container } = render(<TopographyLines><p>Topo</p></TopographyLines>);
    expect(container.textContent).toContain('Topo');
  });

  it('applies className', () => {
    const { container } = render(<TopographyLines className="test-cls"><span>X</span></TopographyLines>);
    expect(container.firstElementChild?.getAttribute('class')).toContain('test-cls');
  });
});

describe('NoisyGradient', () => {
  it('renders children', () => {
    const { container } = render(<NoisyGradient><p>Noisy</p></NoisyGradient>);
    expect(container.textContent).toContain('Noisy');
  });

  it('applies className', () => {
    const { container } = render(<NoisyGradient className="test-cls"><span>X</span></NoisyGradient>);
    expect(container.firstElementChild?.getAttribute('class')).toContain('test-cls');
  });
});

describe('SpotlightEffect', () => {
  it('renders children', () => {
    const { container } = render(<SpotlightEffect><p>Spot</p></SpotlightEffect>);
    expect(container.textContent).toContain('Spot');
  });

  it('applies className', () => {
    const { container } = render(<SpotlightEffect className="test-cls"><span>X</span></SpotlightEffect>);
    expect(container.firstElementChild?.getAttribute('class')).toContain('test-cls');
  });
});
