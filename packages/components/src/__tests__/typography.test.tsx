import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import {
  HeroText,
  GradientText,
  TypewriterText,
  StatCallout,
  PullQuote,
  CodeBlock,
  HighlightBox,
  Annotation,
  BigNumber,
  Label,
  BlockQuoteStack,
  TextReveal,
} from '../typography';

// --- HeroText ---
describe('HeroText', () => {
  it('renders children in an h1', () => {
    render(<HeroText>Hello World</HeroText>);
    const el = screen.getByText('Hello World');
    expect(el.tagName).toBe('H1');
  });

  it('applies className and style', () => {
    const { container } = render(
      <HeroText className="custom" style={{ color: 'red' }}>Test</HeroText>
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('custom');
    expect(el.style.color).toBe('red');
  });

  it('applies gradient styles when gradient prop is true', () => {
    const { container } = render(<HeroText gradient>Gradient</HeroText>);
    const el = container.firstChild as HTMLElement;
    expect(el.style.backgroundClip).toBe('text');
    expect(el.style.color).toBe('transparent');
  });

  it('applies text shadow when shadow prop is true', () => {
    const { container } = render(<HeroText shadow>Shadow</HeroText>);
    const el = container.firstChild as HTMLElement;
    expect(el.style.textShadow).toBe('0 4px 24px rgba(0,0,0,0.3)');
  });

  it('applies animation class when animate is true', () => {
    const { container } = render(<HeroText animate>Animated</HeroText>);
    expect(container.innerHTML).toContain('sm-fade-up');
  });
});

// --- GradientText ---
describe('GradientText', () => {
  it('renders children in a span', () => {
    render(<GradientText>Colorful</GradientText>);
    const el = screen.getByText('Colorful');
    expect(el.tagName).toBe('SPAN');
  });

  it('applies gradient inline styles', () => {
    const { container } = render(<GradientText>Test</GradientText>);
    const el = container.firstChild as HTMLElement;
    expect(el.style.backgroundClip).toBe('text');
    expect(el.style.color).toBe('transparent');
  });

  it('accepts custom from/to/direction', () => {
    const { container } = render(
      <GradientText from="#ff0000" to="#0000ff" direction="to bottom">Custom</GradientText>
    );
    const el = container.firstChild as HTMLElement;
    // jsdom normalizes hex to rgb in computed style
    const bg = el.style.background || el.getAttribute('style') || '';
    expect(bg).toContain('rgb(255, 0, 0)');
    expect(bg).toContain('rgb(0, 0, 255)');
  });

  it('applies className', () => {
    const { container } = render(
      <GradientText className="custom">Test</GradientText>
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('custom');
  });
});

// --- TypewriterText ---
describe('TypewriterText', () => {
  it('renders text', () => {
    render(<TypewriterText text="Hello" />);
    expect(screen.getByText('Hello')).toBeTruthy();
  });

  it('has overflow hidden and white-space nowrap styles', () => {
    render(<TypewriterText text="Typewriter" />);
    const el = screen.getByText('Typewriter');
    expect(el.style.overflow).toBe('hidden');
    expect(el.style.whiteSpace).toBe('nowrap');
  });

  it('applies className', () => {
    render(<TypewriterText text="Classy" className="my-class" />);
    const el = screen.getByText('Classy');
    expect(el.className).toContain('my-class');
  });
});

// --- StatCallout ---
describe('StatCallout', () => {
  it('renders value and label', () => {
    render(<StatCallout value="42%" label="Growth Rate" />);
    expect(screen.getByText('42%')).toBeTruthy();
    expect(screen.getByText('Growth Rate')).toBeTruthy();
  });

  it('renders trend badge when trend provided', () => {
    render(
      <StatCallout value="100" label="Sales" trend={{ direction: 'up', value: '+12%' }} />
    );
    expect(screen.getByText('+12%')).toBeTruthy();
    expect(screen.getByText('\u2191')).toBeTruthy();
  });

  it('shows down arrow for down trend', () => {
    render(
      <StatCallout value="50" label="Churn" trend={{ direction: 'down', value: '-5%' }} />
    );
    expect(screen.getByText('\u2193')).toBeTruthy();
  });

  it('applies animation class when animate is true', () => {
    const { container } = render(<StatCallout value="1" label="test" animate />);
    expect(container.innerHTML).toContain('sm-fade-up');
  });
});

// --- PullQuote ---
describe('PullQuote', () => {
  it('renders quote text', () => {
    render(<PullQuote quote="To be or not to be" />);
    expect(screen.getByText('To be or not to be')).toBeTruthy();
  });

  it('renders attribution when provided', () => {
    render(<PullQuote quote="Quote" attribution="Shakespeare" />);
    expect(screen.getByText(/Shakespeare/)).toBeTruthy();
  });

  it('renders decorative quotation mark', () => {
    const { container } = render(<PullQuote quote="Test" />);
    expect(container.innerHTML).toContain('\u201C');
  });

  it('applies className', () => {
    const { container } = render(
      <PullQuote quote="Test" className="custom" />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('custom');
  });
});

// --- CodeBlock ---
describe('CodeBlock', () => {
  it('renders code content', () => {
    render(<CodeBlock code="const x = 1;" />);
    expect(screen.getByText('const x = 1;')).toBeTruthy();
  });

  it('displays language badge when provided', () => {
    render(<CodeBlock code="let a = 1" language="TypeScript" />);
    expect(screen.getByText('TypeScript')).toBeTruthy();
  });

  it('renders line numbers for multi-line code', () => {
    const { container } = render(<CodeBlock code={"line1\nline2\nline3"} />);
    // Check that 3 line number spans exist
    const lineNums = container.querySelectorAll('.select-none');
    expect(lineNums.length).toBe(3);
    expect(lineNums[0].textContent).toBe('1');
    expect(lineNums[1].textContent).toBe('2');
    expect(lineNums[2].textContent).toBe('3');
  });

  it('applies animation class when animate is true', () => {
    const { container } = render(<CodeBlock code="x" animate />);
    expect(container.innerHTML).toContain('sm-fade-in');
  });
});

// --- HighlightBox ---
describe('HighlightBox', () => {
  it('renders children', () => {
    render(<HighlightBox>Important info</HighlightBox>);
    expect(screen.getByText('Important info')).toBeTruthy();
  });

  it('renders with default info variant', () => {
    const { container } = render(<HighlightBox>Test</HighlightBox>);
    const el = container.firstChild as HTMLElement;
    expect(el.style.borderLeft).toContain('var(--sm-primary)');
  });

  it('applies className', () => {
    const { container } = render(
      <HighlightBox className="custom">Test</HighlightBox>
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('custom');
  });

  it('applies animation class when animate is true', () => {
    const { container } = render(<HighlightBox animate>Test</HighlightBox>);
    expect(container.innerHTML).toContain('sm-fade-in');
  });
});

// --- Annotation ---
describe('Annotation', () => {
  it('renders text', () => {
    render(<Annotation text="Note here" />);
    expect(screen.getByText('Note here')).toBeTruthy();
  });

  it('applies className and style', () => {
    const { container } = render(
      <Annotation text="Test" className="custom" style={{ color: 'blue' }} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('custom');
    expect(el.style.color).toBe('blue');
  });

  it('applies animation class when animate is true', () => {
    const { container } = render(<Annotation text="Test" animate />);
    expect(container.innerHTML).toContain('sm-fade-in');
  });
});

// --- BigNumber ---
describe('BigNumber', () => {
  it('renders value', () => {
    render(<BigNumber value={42} />);
    expect(screen.getByText('42')).toBeTruthy();
  });

  it('renders prefix and suffix', () => {
    const { container } = render(<BigNumber value={99} prefix="$" suffix="M" />);
    expect(container.firstChild?.textContent).toBe('$99M');
  });

  it('applies className and style', () => {
    const { container } = render(
      <BigNumber value={7777} className="custom" style={{ color: 'red' }} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('custom');
    expect(el.style.color).toBe('red');
  });

  it('applies animation class when animate is true', () => {
    const { container } = render(<BigNumber value={1} animate />);
    expect(container.innerHTML).toContain('sm-scale-in');
  });
});

// --- Label ---
describe('Label', () => {
  it('renders text', () => {
    render(<Label text="New" />);
    expect(screen.getByText('New')).toBeTruthy();
  });

  it('renders with filled variant by default', () => {
    const { container } = render(<Label text="Tag" />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.backgroundColor).toBeTruthy();
  });

  it('renders with outline variant', () => {
    const { container } = render(<Label text="Tag" variant="outline" />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.border).toContain('solid');
    expect(el.style.backgroundColor).toBe('transparent');
  });

  it('applies custom color', () => {
    const { container } = render(<Label text="Tag" color="red" />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.backgroundColor).toBe('red');
  });

  it('applies animation class when animate is true', () => {
    const { container } = render(<Label text="Tag" animate />);
    expect(container.innerHTML).toContain('sm-fade-in');
  });
});

// --- BlockQuoteStack ---
describe('BlockQuoteStack', () => {
  const quotes = [
    { text: 'First quote', author: 'Author A' },
    { text: 'Second quote', author: 'Author B' },
  ];

  it('renders all quotes', () => {
    render(<BlockQuoteStack quotes={quotes} />);
    expect(screen.getByText('First quote')).toBeTruthy();
    expect(screen.getByText('Second quote')).toBeTruthy();
  });

  it('renders authors', () => {
    const { container } = render(<BlockQuoteStack quotes={quotes} />);
    const footers = container.querySelectorAll('footer');
    expect(footers.length).toBe(2);
    expect(footers[0].textContent).toContain('Author A');
    expect(footers[1].textContent).toContain('Author B');
  });

  it('applies className', () => {
    const { container } = render(
      <BlockQuoteStack quotes={quotes} className="custom" />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('custom');
  });

  it('applies animation class when animate is true', () => {
    const { container } = render(<BlockQuoteStack quotes={quotes} animate />);
    expect(container.innerHTML).toContain('sm-fade-up');
  });
});

// --- TextReveal ---
describe('TextReveal', () => {
  const lines = ['Line one', 'Line two', 'Line three'];

  it('renders all lines', () => {
    render(<TextReveal lines={lines} />);
    expect(screen.getByText('Line one')).toBeTruthy();
    expect(screen.getByText('Line two')).toBeTruthy();
    expect(screen.getByText('Line three')).toBeTruthy();
  });

  it('applies stagger animation classes when animate is true', () => {
    const { container } = render(<TextReveal lines={lines} animate />);
    expect(container.innerHTML).toContain('sm-fade-up');
    expect(container.innerHTML).toContain('sm-stagger-1');
    expect(container.innerHTML).toContain('sm-stagger-2');
    expect(container.innerHTML).toContain('sm-stagger-3');
  });

  it('applies className and style', () => {
    const { container } = render(
      <TextReveal lines={lines} className="custom" style={{ color: 'red' }} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('custom');
    expect(el.style.color).toBe('red');
  });
});
