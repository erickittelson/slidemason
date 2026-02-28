import { DeckProvider, SlideRenderer } from '@slidemason/renderer';
import {
  Headline,
  HeroText,
  MeshGradient,
  FeatureGrid,
  ProcessFlow,
  StatCallout,
  Flywheel,
  ProsCons,
  TestimonialCard,
  EndSlide,
  GradientBg,
} from '@slidemason/components';

const slides = [
  // Slide 1: Hero — gradient HeroText on MeshGradient background
  <MeshGradient
    key="s1"
    className="flex flex-1 flex-col items-center justify-center text-center gap-[2vh]"
  >
    <HeroText gradient>Slidemason V2</HeroText>
    <p
      className="text-[var(--sm-muted)]"
      style={{ fontSize: 'clamp(1.1rem, 2.5vw, 2rem)' }}
    >
      116 Components. 12 Themes. Cinematic Presentations.
    </p>
  </MeshGradient>,

  // Slide 2: Features — 6-feature grid with icons
  <div key="s2" className="flex flex-1 flex-col">
    <Headline>Everything You Need</Headline>
    <FeatureGrid
      className="flex-1 content-center py-[2vh]"
      columns={3}
      features={[
        { icon: 'LayoutGrid', title: 'Layout', description: '40 slide templates for any narrative' },
        { icon: 'Palette', title: 'Palette', description: '12 cinematic themes from boardroom to neon' },
        { icon: 'BarChart3', title: 'BarChart3', description: 'Pure SVG data visualization' },
        { icon: 'GitBranch', title: 'Workflow', description: 'Diagrams: flywheels, funnels, flowcharts' },
        { icon: 'Sparkles', title: 'Sparkles', description: 'CSS animations and transitions' },
        { icon: 'Shield', title: 'Shield', description: '100% local — no cloud dependencies' },
      ]}
    />
  </div>,

  // Slide 3: Process — horizontal flow showing the Slidemason workflow
  <div key="s3" className="flex flex-1 flex-col">
    <Headline>How It Works</Headline>
    <div className="flex flex-1 items-center justify-center py-[2vh]">
      <ProcessFlow
        steps={[
          { label: 'Drop files' },
          { label: 'Ingest' },
          { label: 'Agent builds' },
          { label: 'Preview' },
          { label: 'Export PDF' },
        ]}
      />
    </div>
  </div>,

  // Slide 4: Data Dashboard — three stat callouts in a row
  <div key="s4" className="flex flex-1 flex-col">
    <Headline>By the Numbers</Headline>
    <div
      className="flex flex-1 items-center justify-evenly"
      style={{ gap: 'clamp(1rem, 3vw, 3rem)' }}
    >
      <StatCallout value="116" label="Components" />
      <StatCallout value="40" label="Templates" />
      <StatCallout value="12" label="Themes" />
    </div>
  </div>,

  // Slide 5: Flywheel — the content loop
  <div key="s5" className="flex flex-1 flex-col">
    <Headline>The Content Loop</Headline>
    <div className="flex flex-1 items-center justify-center py-[2vh]">
      <Flywheel
        segments={[
          { label: 'Create Content' },
          { label: 'Build Slides' },
          { label: 'Present' },
          { label: 'Iterate' },
          { label: 'Improve' },
        ]}
        style={{ width: 'min(80%, 400px)', height: 'auto' }}
      />
    </div>
  </div>,

  // Slide 6: Pros/Cons — Slidemason vs traditional tools
  <div key="s6" className="flex flex-1 flex-col">
    <Headline>Slidemason vs Traditional Tools</Headline>
    <div className="flex flex-1 items-center py-[2vh]">
      <ProsCons
        pros={[
          'Local-first, no subscriptions',
          'Full creative control',
          'Agent-powered generation',
          'Export to PDF',
        ]}
        cons={[
          'Requires terminal setup',
          'No drag-and-drop (yet)',
          'Text-first workflow',
        ]}
        className="w-full"
      />
    </div>
  </div>,

  // Slide 7: Testimonial — centered card
  <div key="s7" className="flex flex-1 flex-col items-center justify-center">
    <TestimonialCard
      quote="Finally, presentations that look like they were designed by a human, built at machine speed."
      name="Your AI Agent"
      title="Coding Assistant"
      style={{ maxWidth: 'min(90%, 600px)' }}
    />
  </div>,

  // Slide 8: End — thank you with gradient background
  <GradientBg
    key="s8"
    className="flex flex-1 flex-col items-center justify-center"
  >
    <EndSlide
      variant="thankyou"
      message="Start building → drop files in /data and run pnpm ingest"
    />
  </GradientBg>,
];

export function App() {
  return (
    <DeckProvider slideCount={slides.length} theme="midnight">
      <SlideRenderer slides={slides} />
    </DeckProvider>
  );
}
