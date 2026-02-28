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
  <div key="s1" className="flex flex-1 flex-col items-center justify-center text-center" style={{ gap: 'clamp(1.5rem, 3vh, 3rem)' }}>
    <Headline className="!tracking-tighter" style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)' }}>Welcome to Slidemason</Headline>
    <Subheadline style={{ fontSize: 'clamp(1.25rem, 2.8vw, 2.5rem)' }}>
      Local-first presentations, built with your coding agent
    </Subheadline>
    <p className="text-[var(--sm-muted)]" style={{ fontSize: 'clamp(1rem, 1.8vw, 1.5rem)', marginTop: 'clamp(1rem, 2vh, 2rem)' }}>
      Use arrow keys to navigate →
    </p>
  </div>,

  // Slide 2: How it works
  <div key="s2" className="flex flex-1 flex-col" style={{ gap: 'clamp(1.5rem, 3vh, 3rem)' }}>
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

  // Slide 3: Quick start
  <div key="s3" className="flex flex-1 flex-col" style={{ gap: 'clamp(1.5rem, 3vh, 3rem)' }}>
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

  // Slide 4: What's inside
  <div key="s4" className="flex flex-1 flex-col" style={{ gap: 'clamp(1.5rem, 3vh, 3rem)' }}>
    <Headline>What's Inside</Headline>
    <div className="flex-1 grid grid-cols-2 content-center text-[var(--sm-text)]" style={{ gap: 'clamp(1rem, 2.5vw, 2.5rem)', fontSize: 'clamp(1rem, 2vw, 1.875rem)' }}>
      <div><span className="font-bold text-[var(--sm-primary)]" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 3rem)' }}>16</span> <span className="ml-1">slide components</span></div>
      <div><span className="font-bold text-[var(--sm-primary)]" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 3rem)' }}>12</span> <span className="ml-1">ready-made templates</span></div>
      <div><span className="font-bold text-[var(--sm-primary)]" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 3rem)' }}>3</span> <span className="ml-1">built-in themes</span></div>
      <div><span className="font-bold text-[var(--sm-primary)]" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 3rem)' }}>9</span> <span className="ml-1">agent prompt files</span></div>
      <div><span className="font-bold text-[var(--sm-primary)]" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 3rem)' }}>PDF</span> <span className="ml-1">export via CLI</span></div>
      <div><span className="font-bold text-[var(--sm-primary)]" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 3rem)' }}>0</span> <span className="ml-1">cloud dependencies</span></div>
    </div>
    <p className="text-[var(--sm-muted)]" style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.25rem)' }}>
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
