import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import {
  IconCard,
  FeatureGrid,
  PricingTable,
  TeamGrid,
  TestimonialCard,
  MetricCard,
  ImageCard,
  LogoGrid,
  StackedCards,
  NumberedCards,
  GlassCard,
  ActionCard,
  InfoCard,
  ProfileCard,
} from '../cards';

// --- IconCard ---
describe('IconCard', () => {
  it('renders title and description', () => {
    render(<IconCard icon="Star" title="Features" description="Some description" />);
    expect(screen.getByText('Features')).toBeTruthy();
    expect(screen.getByText('Some description')).toBeTruthy();
  });

  it('applies className and style', () => {
    const { container } = render(
      <IconCard icon="Star" title="T" description="D" className="custom" style={{ color: 'red' }} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('custom');
    expect(el.style.color).toBe('red');
  });

  it('applies animation class', () => {
    const { container } = render(<IconCard icon="Star" title="T" description="D" animate />);
    expect(container.innerHTML).toContain('sm-fade-up');
  });
});

// --- FeatureGrid ---
describe('FeatureGrid', () => {
  const features = [
    { icon: 'Star', title: 'F1', description: 'D1' },
    { icon: 'Heart', title: 'F2', description: 'D2' },
  ];

  it('renders all features', () => {
    render(<FeatureGrid features={features} />);
    expect(screen.getByText('F1')).toBeTruthy();
    expect(screen.getByText('F2')).toBeTruthy();
  });

  it('applies className and style', () => {
    const { container } = render(
      <FeatureGrid features={features} className="grid-cls" style={{ gap: '2rem' }} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('grid-cls');
    expect(el.style.gap).toBe('2rem');
  });

  it('defaults to 3 columns', () => {
    const { container } = render(<FeatureGrid features={features} />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.gridTemplateColumns).toBe('repeat(3, 1fr)');
  });
});

// --- PricingTable ---
describe('PricingTable', () => {
  const tiers = [
    { name: 'Free', price: '$0', features: ['Feature A'] },
    { name: 'Pro', price: '$10', period: 'mo', features: ['Feature B'], highlighted: true },
  ];

  it('renders tier names and prices', () => {
    render(<PricingTable tiers={tiers} />);
    expect(screen.getByText('Free')).toBeTruthy();
    expect(screen.getByText('Pro')).toBeTruthy();
    expect(screen.getByText('$0')).toBeTruthy();
  });

  it('shows Popular badge for highlighted tier', () => {
    render(<PricingTable tiers={tiers} />);
    expect(screen.getByText('Popular')).toBeTruthy();
  });

  it('applies className and style', () => {
    const { container } = render(
      <PricingTable tiers={tiers} className="price" style={{ margin: '1rem' }} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('price');
    expect(el.style.margin).toBe('1rem');
  });
});

// --- TeamGrid ---
describe('TeamGrid', () => {
  const members = [
    { name: 'Jane Doe', role: 'CEO' },
    { name: 'Bob Smith', role: 'CTO', avatar: 'bob.jpg' },
  ];

  it('renders member names and roles', () => {
    render(<TeamGrid members={members} />);
    expect(screen.getByText('Jane Doe')).toBeTruthy();
    expect(screen.getByText('CEO')).toBeTruthy();
  });

  it('shows initials when no avatar', () => {
    render(<TeamGrid members={members} />);
    expect(screen.getByText('JD')).toBeTruthy();
  });

  it('applies className and style', () => {
    const { container } = render(
      <TeamGrid members={members} className="team" style={{ padding: '1rem' }} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('team');
    expect(el.style.padding).toBe('1rem');
  });
});

// --- TestimonialCard ---
describe('TestimonialCard', () => {
  it('renders quote and name', () => {
    render(<TestimonialCard quote="Great product" name="Alice" />);
    expect(screen.getByText('Great product')).toBeTruthy();
    expect(screen.getByText('Alice')).toBeTruthy();
  });

  it('renders title and company', () => {
    render(<TestimonialCard quote="Nice" name="Bob" title="CEO" company="Acme" />);
    expect(screen.getByText('CEO, Acme')).toBeTruthy();
  });

  it('applies className and style', () => {
    const { container } = render(
      <TestimonialCard quote="Q" name="N" className="test" style={{ color: 'blue' }} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('test');
    expect(el.style.color).toBe('blue');
  });
});

// --- MetricCard ---
describe('MetricCard', () => {
  it('renders value and label', () => {
    render(<MetricCard value="42%" label="Conversion" />);
    expect(screen.getByText('42%')).toBeTruthy();
    expect(screen.getByText('Conversion')).toBeTruthy();
  });

  it('renders trend badge', () => {
    const { container } = render(
      <MetricCard value="100" label="Users" trend={{ direction: 'up', value: '12%' }} />
    );
    expect(container.innerHTML).toContain('12%');
  });

  it('applies className and style', () => {
    const { container } = render(
      <MetricCard value="5" label="L" className="metric" style={{ width: '200px' }} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('metric');
    expect(el.style.width).toBe('200px');
  });
});

// --- ImageCard ---
describe('ImageCard', () => {
  it('renders title and image', () => {
    render(<ImageCard src="img.jpg" alt="photo" title="My Image" />);
    expect(screen.getByText('My Image')).toBeTruthy();
    expect(screen.getByAltText('photo')).toBeTruthy();
  });

  it('renders optional description', () => {
    render(<ImageCard src="img.jpg" alt="photo" title="T" description="Desc text" />);
    expect(screen.getByText('Desc text')).toBeTruthy();
  });

  it('applies className and style', () => {
    const { container } = render(
      <ImageCard src="img.jpg" alt="a" title="T" className="img-card" style={{ maxWidth: '300px' }} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('img-card');
    expect(el.style.maxWidth).toBe('300px');
  });
});

// --- LogoGrid ---
describe('LogoGrid', () => {
  const logos = [
    { src: 'logo1.png', alt: 'Logo 1' },
    { src: 'logo2.png', alt: 'Logo 2' },
  ];

  it('renders all logos', () => {
    render(<LogoGrid logos={logos} />);
    expect(screen.getByAltText('Logo 1')).toBeTruthy();
    expect(screen.getByAltText('Logo 2')).toBeTruthy();
  });

  it('applies grayscale filter', () => {
    render(<LogoGrid logos={logos} />);
    const img = screen.getByAltText('Logo 1') as HTMLImageElement;
    expect(img.style.filter).toBe('grayscale(1)');
  });

  it('applies className and style', () => {
    const { container } = render(
      <LogoGrid logos={logos} className="logos" style={{ gap: '3rem' }} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('logos');
    expect(el.style.gap).toBe('3rem');
  });
});

// --- StackedCards ---
describe('StackedCards', () => {
  const cards = [
    { title: 'Card 1', content: 'Content 1' },
    { title: 'Card 2', content: 'Content 2' },
  ];

  it('renders all cards', () => {
    render(<StackedCards cards={cards} />);
    expect(screen.getByText('Card 1')).toBeTruthy();
    expect(screen.getByText('Card 2')).toBeTruthy();
  });

  it('applies className and style', () => {
    const { container } = render(
      <StackedCards cards={cards} className="stacked" style={{ width: '400px' }} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('stacked');
    expect(el.style.width).toBe('400px');
  });

  it('applies animation classes when animate is stagger', () => {
    const { container } = render(<StackedCards cards={cards} animate="stagger" />);
    expect(container.innerHTML).toContain('sm-fade-up');
    expect(container.innerHTML).toContain('sm-stagger-1');
  });
});

// --- NumberedCards ---
describe('NumberedCards', () => {
  const items = [
    { title: 'Step 1', description: 'Do this' },
    { title: 'Step 2', description: 'Then this' },
  ];

  it('renders items with numbers', () => {
    render(<NumberedCards items={items} />);
    expect(screen.getByText('Step 1')).toBeTruthy();
    expect(screen.getByText('01')).toBeTruthy();
    expect(screen.getByText('02')).toBeTruthy();
  });

  it('applies className and style', () => {
    const { container } = render(
      <NumberedCards items={items} className="numbered" style={{ gap: '2rem' }} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('numbered');
    expect(el.style.gap).toBe('2rem');
  });

  it('applies animation class', () => {
    const { container } = render(<NumberedCards items={items} animate />);
    expect(container.innerHTML).toContain('sm-fade-up');
  });
});

// --- GlassCard ---
describe('GlassCard', () => {
  it('renders children', () => {
    render(<GlassCard>Glass content</GlassCard>);
    expect(screen.getByText('Glass content')).toBeTruthy();
  });

  it('applies backdrop-filter blur', () => {
    const { container } = render(<GlassCard>Content</GlassCard>);
    const el = container.firstChild as HTMLElement;
    expect(el.style.backdropFilter).toBe('blur(16px)');
  });

  it('applies className and style', () => {
    const { container } = render(
      <GlassCard className="glass" style={{ padding: '2rem' }}>C</GlassCard>
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('glass');
    expect(el.style.padding).toBe('2rem');
  });
});

// --- ActionCard ---
describe('ActionCard', () => {
  it('renders title, description, and action button', () => {
    render(<ActionCard icon="Star" title="Act" description="Do something" action="Click me" />);
    expect(screen.getByText('Act')).toBeTruthy();
    expect(screen.getByText('Do something')).toBeTruthy();
    expect(screen.getByText('Click me')).toBeTruthy();
  });

  it('applies className and style', () => {
    const { container } = render(
      <ActionCard icon="Star" title="T" description="D" action="A" className="action" style={{ margin: '1rem' }} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('action');
    expect(el.style.margin).toBe('1rem');
  });

  it('applies animation class', () => {
    const { container } = render(
      <ActionCard icon="Star" title="T" description="D" action="A" animate />
    );
    expect(container.innerHTML).toContain('sm-fade-up');
  });
});

// --- InfoCard ---
describe('InfoCard', () => {
  it('renders title and content', () => {
    render(<InfoCard title="Info" content="Details here" />);
    expect(screen.getByText('Info')).toBeTruthy();
    expect(screen.getByText('Details here')).toBeTruthy();
  });

  it('uses accent color for left border', () => {
    const { container } = render(<InfoCard title="T" content="C" accent="#ff0000" />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.borderLeft).toContain('solid');
    expect(el.style.borderLeft).toContain('4px');
  });

  it('applies className and style', () => {
    const { container } = render(
      <InfoCard title="T" content="C" className="info" style={{ width: '300px' }} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('info');
    expect(el.style.width).toBe('300px');
  });
});

// --- ProfileCard ---
describe('ProfileCard', () => {
  it('renders name and title', () => {
    render(<ProfileCard name="Jane Doe" title="CEO" />);
    expect(screen.getByText('Jane Doe')).toBeTruthy();
    expect(screen.getByText('CEO')).toBeTruthy();
  });

  it('shows initials when no avatar', () => {
    render(<ProfileCard name="Jane Doe" title="CEO" />);
    expect(screen.getByText('JD')).toBeTruthy();
  });

  it('renders social links', () => {
    render(
      <ProfileCard
        name="Jane"
        title="Dev"
        social={[{ platform: 'Twitter', url: 'https://twitter.com/jane' }]}
      />
    );
    expect(screen.getByText('Twitter')).toBeTruthy();
  });

  it('applies className and style', () => {
    const { container } = render(
      <ProfileCard name="N" title="T" className="profile" style={{ maxWidth: '400px' }} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('profile');
    expect(el.style.maxWidth).toBe('400px');
  });
});
