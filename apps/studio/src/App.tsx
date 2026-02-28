import { DeckProvider, SlideRenderer } from '@slidemason/renderer';
import {
  Headline,
  Subheadline,
  NumberedSteps,
  BulletGroup,
  FooterMark,
} from '@slidemason/components';

const slides = [
  // Slide 1: Welcome — centered hero
  <div key="s1" className="flex flex-1 flex-col items-center justify-center text-center gap-10">
    <Headline className="text-8xl">Welcome to Slidemason</Headline>
    <Subheadline className="text-4xl">
      Local-first presentations, built with your coding agent
    </Subheadline>
    <p className="text-2xl text-[var(--sm-muted)] mt-8">
      Use arrow keys to navigate →
    </p>
  </div>,

  // Slide 2: How it works — heading top, steps fill the rest
  <div key="s2" className="flex flex-1 flex-col gap-12">
    <Headline>How It Works</Headline>
    <div className="flex-1 flex flex-col justify-center">
      <NumberedSteps
        steps={[
          'Drop source material (PDFs, notes, URLs) into the /data folder',
          'Run "pnpm ingest" to extract and structure your content',
          'Your coding agent uses the prompt files to build slides',
          'Preview here in the studio, then export to PDF',
        ]}
      />
    </div>
  </div>,

  // Slide 3: Quick start — heading top, bullets fill the rest
  <div key="s3" className="flex flex-1 flex-col gap-12">
    <Headline>Quick Start</Headline>
    <div className="flex-1 flex flex-col justify-center">
      <BulletGroup
        items={[
          'Copy your source files into data/',
          'Run: pnpm ingest',
          'Give your agent the prompt from prompts/02-outline.md',
          'Agent generates slides — preview updates live',
          'Run: pnpm export to get a PDF',
        ]}
      />
    </div>
    <FooterMark text="See README.md for the full guide" />
  </div>,

  // Slide 4: What's inside — 2-column grid filling the space
  <div key="s4" className="flex flex-1 flex-col gap-12">
    <Headline>What's Inside</Headline>
    <div className="flex-1 grid grid-cols-2 gap-x-20 gap-y-10 content-center text-3xl text-[var(--sm-text)]">
      <div><span className="text-5xl font-bold text-[var(--sm-primary)]">16</span> <span className="ml-2">slide components</span></div>
      <div><span className="text-5xl font-bold text-[var(--sm-primary)]">12</span> <span className="ml-2">ready-made templates</span></div>
      <div><span className="text-5xl font-bold text-[var(--sm-primary)]">3</span> <span className="ml-2">built-in themes</span></div>
      <div><span className="text-5xl font-bold text-[var(--sm-primary)]">9</span> <span className="ml-2">agent prompt files</span></div>
      <div><span className="text-5xl font-bold text-[var(--sm-primary)]">PDF</span> <span className="ml-2">export via CLI</span></div>
      <div><span className="text-5xl font-bold text-[var(--sm-primary)]">0</span> <span className="ml-2">cloud dependencies</span></div>
    </div>
    <p className="text-2xl text-[var(--sm-muted)]">
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
