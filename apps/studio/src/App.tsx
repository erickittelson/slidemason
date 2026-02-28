import { DeckProvider, SlideRenderer } from '@slidemason/renderer';
import {
  Headline,
  Subheadline,
  NumberedSteps,
  BulletGroup,
  FooterMark,
} from '@slidemason/components';

const slides = [
  // Slide 1: Welcome
  <div key="s1" className="flex flex-col items-center justify-center h-full text-center gap-8">
    <Headline>Welcome to Slidemason</Headline>
    <Subheadline>
      Local-first presentations, built with your coding agent
    </Subheadline>
    <p className="text-xl text-[var(--sm-muted)] mt-4">
      Use arrow keys to navigate →
    </p>
  </div>,

  // Slide 2: How it works
  <div key="s2" className="flex flex-col justify-center h-full gap-10">
    <Headline>How It Works</Headline>
    <NumberedSteps
      steps={[
        'Drop source material (PDFs, notes, URLs) into the /data folder',
        'Run "pnpm ingest" to extract and structure your content',
        'Your coding agent uses the prompt files to build slides',
        'Preview here in the studio, then export to PDF',
      ]}
    />
  </div>,

  // Slide 3: Quick start
  <div key="s3" className="flex flex-col justify-center h-full gap-10">
    <Headline>Quick Start</Headline>
    <BulletGroup
      items={[
        'Copy your source files into data/',
        'Run: pnpm ingest',
        'Give your agent the prompt from prompts/02-outline.md',
        'Agent generates slides → preview updates live',
        'Run: pnpm export to get a PDF',
      ]}
    />
    <FooterMark text="See README.md for the full guide" />
  </div>,

  // Slide 4: What's inside
  <div key="s4" className="flex flex-col justify-center h-full gap-10">
    <Headline>What's Inside</Headline>
    <div className="grid grid-cols-2 gap-x-16 gap-y-6 text-2xl text-[var(--sm-text)]">
      <div><span className="font-bold text-[var(--sm-primary)]">16</span> slide components</div>
      <div><span className="font-bold text-[var(--sm-primary)]">12</span> ready-made templates</div>
      <div><span className="font-bold text-[var(--sm-primary)]">3</span> built-in themes</div>
      <div><span className="font-bold text-[var(--sm-primary)]">9</span> agent prompt files</div>
      <div><span className="font-bold text-[var(--sm-primary)]">PDF</span> export via CLI</div>
      <div><span className="font-bold text-[var(--sm-primary)]">0</span> cloud dependencies</div>
    </div>
    <p className="text-xl text-[var(--sm-muted)] mt-4">
      Start building → drop files in /data and run pnpm ingest
    </p>
  </div>,
];

export function App() {
  return (
    <DeckProvider slideCount={slides.length} theme="slate">
      <SlideRenderer slides={slides} />
    </DeckProvider>
  );
}
