import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  IconFeatures,
  DataDashboard,
  ProcessOverview,
  FunnelBreakdown,
  CycleExplainer,
  FlywheelSlide,
  SWOTAnalysis,
  ProsConsSlide,
  BeforeAfterSlide,
  VersusMatchup,
  TeamIntro,
  TestimonialSpotlight,
  PricingOverview,
  ScreenshotDemo,
  ImageStory,
  DataComparison,
  NumbersImpact,
  QuadrantAnalysis,
  OrgStructure,
  FlowDecision,
  GapBridge,
  RadarComparison,
  HeatmapView,
  ScoreCardSlide,
  NextStepsAction,
  ContactEnd,
  ChapterOpener,
  LogoShowcase,
} from '../templates';

describe('IconFeatures', () => {
  it('renders headline and features', () => {
    render(<IconFeatures headline="Features" features={[{ icon: 'Star', title: 'Fast', description: 'Very fast' }]} />);
    expect(screen.getByText('Features')).toBeDefined();
    expect(screen.getByText('Fast')).toBeDefined();
  });
});

describe('DataDashboard', () => {
  it('renders headline and stats', () => {
    render(<DataDashboard headline="Dashboard" stats={[{ value: '99%', label: 'Uptime' }]} />);
    expect(screen.getByText('Dashboard')).toBeDefined();
    expect(screen.getByText('99%')).toBeDefined();
  });
});

describe('ProcessOverview', () => {
  it('renders headline and steps', () => {
    render(<ProcessOverview headline="Process" steps={[{ label: 'Step 1' }, { label: 'Step 2' }]} />);
    expect(screen.getByText('Process')).toBeDefined();
    expect(screen.getByText('Step 1')).toBeDefined();
  });
});

describe('FunnelBreakdown', () => {
  it('renders headline and stages', () => {
    render(<FunnelBreakdown headline="Funnel" stages={[{ label: 'Awareness' }, { label: 'Interest' }]} />);
    expect(screen.getByText('Funnel')).toBeDefined();
  });
});

describe('CycleExplainer', () => {
  it('renders headline and stages', () => {
    render(<CycleExplainer headline="Cycle" stages={[{ label: 'Plan' }, { label: 'Do' }, { label: 'Check' }]} />);
    expect(screen.getByText('Cycle')).toBeDefined();
  });
});

describe('FlywheelSlide', () => {
  it('renders headline and segments', () => {
    render(<FlywheelSlide headline="Flywheel" segments={[{ label: 'Attract' }, { label: 'Engage' }, { label: 'Delight' }]} />);
    expect(screen.getByText('Flywheel')).toBeDefined();
  });
});

describe('SWOTAnalysis', () => {
  it('renders headline and quadrants', () => {
    render(
      <SWOTAnalysis
        headline="SWOT"
        strengths={['Strong brand']}
        weaknesses={['Small team']}
        opportunities={['New market']}
        threats={['Competition']}
      />
    );
    expect(screen.getByText('SWOT')).toBeDefined();
    expect(screen.getByText(/Strong brand/)).toBeDefined();
  });
});

describe('ProsConsSlide', () => {
  it('renders headline, pros, and cons', () => {
    render(<ProsConsSlide headline="Analysis" pros={['Fast']} cons={['Expensive']} />);
    expect(screen.getByText('Analysis')).toBeDefined();
    expect(screen.getByText('Fast')).toBeDefined();
    expect(screen.getByText('Expensive')).toBeDefined();
  });
});

describe('BeforeAfterSlide', () => {
  it('renders headline and before/after', () => {
    render(
      <BeforeAfterSlide
        headline="Transformation"
        before={{ title: 'Before', items: ['Slow'] }}
        after={{ title: 'After', items: ['Fast'] }}
      />
    );
    expect(screen.getByText('Transformation')).toBeDefined();
    expect(screen.getByText('Slow')).toBeDefined();
    expect(screen.getByText('Fast')).toBeDefined();
  });
});

describe('VersusMatchup', () => {
  it('renders left and right labels', () => {
    render(<VersusMatchup left={{ label: 'Option A' }} right={{ label: 'Option B' }} />);
    expect(screen.getByText('Option A')).toBeDefined();
    expect(screen.getByText('Option B')).toBeDefined();
  });
});

describe('TeamIntro', () => {
  it('renders headline and team members', () => {
    render(<TeamIntro headline="Our Team" members={[{ name: 'Alice', role: 'CEO' }]} />);
    expect(screen.getByText('Our Team')).toBeDefined();
    expect(screen.getByText('Alice')).toBeDefined();
  });
});

describe('TestimonialSpotlight', () => {
  it('renders quote and name', () => {
    render(<TestimonialSpotlight quote="Great product!" name="John Doe" />);
    expect(screen.getByText(/Great product!/)).toBeDefined();
    expect(screen.getByText('John Doe')).toBeDefined();
  });
});

describe('PricingOverview', () => {
  it('renders headline and tiers', () => {
    render(
      <PricingOverview
        headline="Pricing"
        tiers={[{ name: 'Basic', price: '$9', features: ['Feature 1'] }]}
      />
    );
    expect(screen.getByText('Pricing')).toBeDefined();
    expect(screen.getByText('Basic')).toBeDefined();
  });
});

describe('ScreenshotDemo', () => {
  it('renders headline', () => {
    render(<ScreenshotDemo headline="Demo" src="/screenshot.png" />);
    expect(screen.getByText('Demo')).toBeDefined();
  });
});

describe('ImageStory', () => {
  it('renders image and text', () => {
    render(<ImageStory src="/hero.jpg" alt="Hero" text="Our Story" />);
    expect(screen.getByText('Our Story')).toBeDefined();
    expect(screen.getByAltText('Hero')).toBeDefined();
  });
});

describe('DataComparison', () => {
  it('renders headline and matrix', () => {
    render(
      <DataComparison
        headline="Comparison"
        features={['Speed', 'Price']}
        products={[{ name: 'A', values: ['Fast', '$10'] }]}
      />
    );
    expect(screen.getByText('Comparison')).toBeDefined();
    expect(screen.getByText('Speed')).toBeDefined();
  });
});

describe('NumbersImpact', () => {
  it('renders stats', () => {
    render(<NumbersImpact stats={[{ value: '1M', label: 'Users' }, { value: '99%', label: 'Uptime' }]} />);
    expect(screen.getByText('1M')).toBeDefined();
    expect(screen.getByText('Users')).toBeDefined();
  });
});

describe('QuadrantAnalysis', () => {
  it('renders headline and axes', () => {
    render(
      <QuadrantAnalysis
        headline="Priority"
        xAxis="Effort"
        yAxis="Impact"
        quadrants={['Quick Wins', 'Big Bets', 'Low Priority', 'Thankless']}
      />
    );
    expect(screen.getByText('Priority')).toBeDefined();
  });
});

describe('OrgStructure', () => {
  it('renders headline and org chart', () => {
    render(
      <OrgStructure
        headline="Organization"
        nodes={[
          { id: '1', label: 'CEO' },
          { id: '2', label: 'CTO', parentId: '1' },
        ]}
      />
    );
    expect(screen.getByText('Organization')).toBeDefined();
  });
});

describe('FlowDecision', () => {
  it('renders headline and flow', () => {
    render(
      <FlowDecision
        headline="Decision Flow"
        nodes={[
          { id: 's', label: 'Start', type: 'start' },
          { id: 'e', label: 'End', type: 'end' },
        ]}
        edges={[{ from: 's', to: 'e' }]}
      />
    );
    expect(screen.getByText('Decision Flow')).toBeDefined();
  });
});

describe('GapBridge', () => {
  it('renders headline and gap analysis', () => {
    render(
      <GapBridge
        headline="Gap Analysis"
        current={{ label: 'Current', value: '60%' }}
        desired={{ label: 'Target', value: '95%' }}
        gap="35% improvement needed"
      />
    );
    expect(screen.getByText('Gap Analysis')).toBeDefined();
    expect(screen.getByText('60%')).toBeDefined();
  });
});

describe('RadarComparison', () => {
  it('renders headline and radar', () => {
    render(
      <RadarComparison
        headline="Skills"
        axes={[
          { label: 'Speed', value: 8 },
          { label: 'Quality', value: 7 },
          { label: 'Cost', value: 5 },
        ]}
      />
    );
    expect(screen.getByText('Skills')).toBeDefined();
  });
});

describe('HeatmapView', () => {
  it('renders headline and heatmap', () => {
    render(
      <HeatmapView
        headline="Activity"
        rows={[{ label: 'Mon', cells: [1, 5, 3] }]}
        columnLabels={['AM', 'PM', 'Eve']}
      />
    );
    expect(screen.getByText('Activity')).toBeDefined();
    expect(screen.getByText('Mon')).toBeDefined();
  });
});

describe('ScoreCardSlide', () => {
  it('renders headline and criteria', () => {
    render(
      <ScoreCardSlide
        headline="Evaluation"
        criteria={[{ label: 'Quality', weight: 3, score: 4 }]}
      />
    );
    expect(screen.getByText('Evaluation')).toBeDefined();
    expect(screen.getByText('Quality')).toBeDefined();
  });
});

describe('NextStepsAction', () => {
  it('renders headline and steps', () => {
    render(
      <NextStepsAction
        headline="Next Steps"
        steps={[{ action: 'Review proposal', owner: 'Alice', status: 'todo' }]}
      />
    );
    expect(screen.getByText('Next Steps')).toBeDefined();
    expect(screen.getByText('Review proposal')).toBeDefined();
  });
});

describe('ContactEnd', () => {
  it('renders end slide', () => {
    render(<ContactEnd variant="thankyou" message="Thanks for watching" />);
    expect(screen.getByText('Thank You')).toBeDefined();
    expect(screen.getByText('Thanks for watching')).toBeDefined();
  });
});

describe('ChapterOpener', () => {
  it('renders chapter card', () => {
    render(<ChapterOpener number={1} title="Introduction" />);
    expect(screen.getByText('Introduction')).toBeDefined();
  });
});

describe('LogoShowcase', () => {
  it('renders headline and logos', () => {
    render(
      <LogoShowcase
        headline="Our Partners"
        logos={[{ src: '/logo1.png', alt: 'Partner 1' }]}
      />
    );
    expect(screen.getByText('Our Partners')).toBeDefined();
    expect(screen.getByAltText('Partner 1')).toBeDefined();
  });
});
