import { useState, useEffect } from 'react';
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
import { getMode } from './lib/mode';
import { applyFonts } from './lib/fonts';
import { Sidebar } from './components/Sidebar';
import { CollapsibleSection } from './components/CollapsibleSection';
import { FileUploadZone } from './components/FileUploadZone';
import { BriefForm } from './components/BriefForm';
import { ThemePicker } from './components/ThemePicker';
import { FontPicker } from './components/FontPicker';
import { AssetLibrary } from './components/AssetLibrary';
import { FloatingThemePicker } from './components/FloatingThemePicker';
import { SlideThumbnails } from './components/SlideThumbnails';
import { TableOfContents } from './components/TableOfContents';
import { NextStepsModal } from './components/NextStepsModal';
import { useFiles } from './hooks/useFiles';
import { useBrief } from './hooks/useBrief';
import { useAssets } from './hooks/useAssets';

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
  const mode = getMode();
  const [theme, setTheme] = useState('midnight');
  const [headingFont, setHeadingFont] = useState('Inter');
  const [bodyFont, setBodyFont] = useState('Inter');
  const [showNextSteps, setShowNextSteps] = useState(false);
  const [openStep, setOpenStep] = useState(1); // which step is expanded (1-5, 0=none)

  // Hooks for dev mode
  const { files, upload: uploadFiles, remove: removeFile } = useFiles();
  const { brief, setBrief, save: saveBrief } = useBrief();
  const { assets, upload: uploadAssets, remove: removeAsset } = useAssets();

  // Apply fonts when they change
  useEffect(() => {
    applyFonts(headingFont, bodyFont);
  }, [headingFont, bodyFont]);

  // Sync theme from brief on load
  useEffect(() => {
    if (brief.theme) setTheme(brief.theme);
    if (brief.fonts?.heading) setHeadingFont(brief.fonts.heading);
    if (brief.fonts?.body) setBodyFont(brief.fonts.body);
  }, [brief.theme, brief.fonts?.heading, brief.fonts?.body]);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    saveBrief({ theme: newTheme });
  };

  const handleHeadingFontChange = (font: string) => {
    setHeadingFont(font);
    saveBrief({ fonts: { heading: font, body: bodyFont } });
  };

  const handleBodyFontChange = (font: string) => {
    setBodyFont(font);
    saveBrief({ fonts: { heading: headingFont, body: font } });
  };

  const handleFontPairing = (heading: string, body: string) => {
    setHeadingFont(heading);
    setBodyFont(body);
    saveBrief({ fonts: { heading, body } });
  };

  const handleSaveAll = async () => {
    await saveBrief({ theme, fonts: { heading: headingFont, body: bodyFont } });
    setShowNextSteps(true);
  };


  // PDF mode: just slides, no chrome
  if (mode === 'pdf') {
    return (
      <DeckProvider slideCount={slides.length} theme={theme}>
        <SlideRenderer slides={slides} />
      </DeckProvider>
    );
  }

  // Dev mode: sidebar + viewer
  if (mode === 'dev') {
    return (
      <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
        <Sidebar>
          <CollapsibleSection
            step={1} title="Source Files"
            open={openStep === 1} done={files.length > 0}
            onToggle={() => setOpenStep(openStep === 1 ? 0 : 1)}
            onNext={() => setOpenStep(2)}
          >
            <FileUploadZone
              files={files}
              onUpload={uploadFiles}
              onRemove={removeFile}
            />
          </CollapsibleSection>

          <CollapsibleSection
            step={2} title="Brief"
            open={openStep === 2}
            done={!!(brief.audience || brief.goal || brief.title)}
            onToggle={() => setOpenStep(openStep === 2 ? 0 : 2)}
            onNext={() => setOpenStep(3)}
          >
            <BriefForm brief={brief} onChange={setBrief} />
          </CollapsibleSection>

          <CollapsibleSection
            step={3} title="Theme"
            open={openStep === 3} done={theme !== 'midnight'}
            onToggle={() => setOpenStep(openStep === 3 ? 0 : 3)}
            onNext={() => setOpenStep(4)}
          >
            <ThemePicker activeTheme={theme} onSelectTheme={handleThemeChange} />
          </CollapsibleSection>

          <CollapsibleSection
            step={4} title="Fonts"
            open={openStep === 4}
            done={headingFont !== 'Inter' || bodyFont !== 'Inter'}
            onToggle={() => setOpenStep(openStep === 4 ? 0 : 4)}
            onNext={() => setOpenStep(5)}
          >
            <FontPicker
              headingFont={headingFont}
              bodyFont={bodyFont}
              onChangeHeading={handleHeadingFontChange}
              onChangeBody={handleBodyFontChange}
              onChangePairing={handleFontPairing}
            />
          </CollapsibleSection>

          <CollapsibleSection
            step={5} title="Assets"
            open={openStep === 5} done={assets.length > 0}
            onToggle={() => setOpenStep(openStep === 5 ? 0 : 5)}
          >
            <AssetLibrary
              assets={assets}
              onUpload={uploadAssets}
              onRemove={removeAsset}
            />
          </CollapsibleSection>

          <div style={{ padding: '12px 0' }}>
            <button
              onClick={handleSaveAll}
              style={{
                width: '100%', padding: '12px', fontSize: '0.85rem', fontWeight: 600,
                backgroundColor: 'rgba(139,92,246,0.3)', color: '#c4b5fd',
                border: '1px solid rgba(139,92,246,0.4)',
                borderRadius: '8px', cursor: 'pointer',
              }}
            >
              Build Deck
            </button>
          </div>
        </Sidebar>

        {showNextSteps && <NextStepsModal onClose={() => setShowNextSteps(false)} />}
        <main style={{ flex: 1, overflow: 'hidden' }}>
          <DeckProvider slideCount={slides.length} theme={theme}>
            <SlideRenderer slides={slides} fullWidth={false} />
          </DeckProvider>
        </main>
      </div>
    );
  }

  // Web mode: full-width viewer with floating UI
  return (
    <DeckProvider slideCount={slides.length} theme={theme}>
      <SlideRenderer slides={slides} />
      <FloatingThemePicker activeTheme={theme} onSelectTheme={setTheme} />
      <SlideThumbnails />
      <TableOfContents />
    </DeckProvider>
  );
}
