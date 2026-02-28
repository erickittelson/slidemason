import { DeckProvider, SlideRenderer } from '@slidemason/renderer';
import {
  Headline,
  Subheadline,
  BulletGroup,
  StatGrid,
  QuoteCallout,
} from '@slidemason/components';

const slides = [
  // Slide 1: Title
  <div key="s1" className="flex flex-col items-center justify-center h-full text-center gap-6">
    <Headline>Welcome to Slidemason</Headline>
    <Subheadline>Local-first presentations, powered by your coding agent</Subheadline>
  </div>,

  // Slide 2: Features
  <div key="s2" className="flex flex-col justify-center h-full gap-8">
    <Headline>Key Features</Headline>
    <BulletGroup
      items={[
        'Drop source material into /data',
        'Agent generates structured brief and outline',
        'Beautiful slides from reusable components',
        'Export to PDF or static web',
        'Fully local — no cloud dependency',
      ]}
    />
  </div>,

  // Slide 3: Stats
  <div key="s3" className="flex flex-col justify-center h-full gap-8">
    <Headline>By the Numbers</Headline>
    <StatGrid
      stats={[
        { value: '16', label: 'Components' },
        { value: '12', label: 'Templates' },
        { value: '3', label: 'Themes' },
        { value: '0', label: 'Cloud Dependencies' },
      ]}
    />
  </div>,

  // Slide 4: Quote
  <div key="s4" className="flex flex-col items-center justify-center h-full">
    <QuoteCallout
      quote="The best presentation tool is the one that respects your workflow."
      attribution="Slidemason"
    />
  </div>,
];

export function App() {
  return (
    <DeckProvider slideCount={slides.length} theme="slate">
      <SlideRenderer slides={slides} />
    </DeckProvider>
  );
}
