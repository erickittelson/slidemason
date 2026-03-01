import { useState, useEffect, useCallback, ReactNode } from 'react';
import { DeckProvider, SlideRenderer } from '@slidemason/renderer';
import { getMode } from './lib/mode';
import defaultSlides from './slides';
import { applyFonts } from './lib/fonts';

/* ── Dynamic deck slide loading via Vite glob ── */
const deckModules = import.meta.glob<{ default: ReactNode[] }>(
  '../../../decks/*/slides.tsx',
  { eager: true },
);

function getDeckSlides(slug: string | null): ReactNode[] {
  if (!slug) return defaultSlides;
  for (const [path, mod] of Object.entries(deckModules)) {
    if (path.includes(`/decks/${slug}/slides.tsx`)) {
      return mod.default;
    }
  }
  return defaultSlides;
}
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
import { DeckGallery } from './components/DeckGallery';
import { useFiles } from './hooks/useFiles';
import { useBrief } from './hooks/useBrief';
import { useAssets } from './hooks/useAssets';
import { useDecks } from './hooks/useDecks';

function getHashSlug(): string | null {
  const hash = window.location.hash.replace(/^#\/?/, '');
  return hash || null;
}

export function App() {
  const mode = getMode();
  const [activeDeck, setActiveDeck] = useState<string | null>(getHashSlug);
  const [theme, setTheme] = useState('midnight');
  const [headingFont, setHeadingFont] = useState('Inter');
  const [bodyFont, setBodyFont] = useState('Inter');
  const [showNextSteps, setShowNextSteps] = useState(false);
  const [openStep, setOpenStep] = useState(1); // which step is expanded (1-5, 0=none)
  const [stepError, setStepError] = useState('');

  // Resolve slides for the active deck (or fallback to default)
  const slides = getDeckSlides(activeDeck);

  // Listen for hash changes
  useEffect(() => {
    const onHashChange = () => setActiveDeck(getHashSlug());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const openDeck = useCallback((slug: string) => {
    window.location.hash = slug;
    setActiveDeck(slug);
  }, []);

  const closeDeck = useCallback(() => {
    window.location.hash = '';
    setActiveDeck(null);
  }, []);

  // Validation for mandatory fields per step
  const validateStep = (step: number): string | null => {
    if (step === 1 && files.length === 0) {
      return 'Upload at least one source file before continuing.';
    }
    if (step === 2) {
      const missing: string[] = [];
      if (!brief.audience) missing.push('Audience');
      if (!brief.goal) missing.push('Goal');
      if (missing.length > 0) {
        return `${missing.join(' and ')} ${missing.length === 1 ? 'is' : 'are'} required.`;
      }
    }
    return null;
  };

  const handleNext = (fromStep: number) => {
    const error = validateStep(fromStep);
    if (error) {
      setStepError(error);
      return;
    }
    setStepError('');
    setOpenStep(fromStep + 1);
  };

  // Deck gallery hook
  const { decks, loading: decksLoading, create: createDeck, remove: deleteDeck } = useDecks();

  // Hooks for dev mode — pass activeDeck as slug
  const { files, upload: uploadFiles, remove: removeFile } = useFiles(activeDeck);
  const { brief, setBrief, save: saveBrief } = useBrief(activeDeck);
  const { assets, upload: uploadAssets, remove: removeAsset } = useAssets(activeDeck);

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

  const handleCreateDeck = async (name: string) => {
    const slug = await createDeck(name);
    openDeck(slug);
  };


  // PDF mode: just slides, no chrome
  if (mode === 'pdf') {
    return (
      <DeckProvider slideCount={slides.length} theme={theme}>
        <SlideRenderer slides={slides} />
      </DeckProvider>
    );
  }

  // Dev mode: gallery or sidebar + viewer
  if (mode === 'dev') {
    // No active deck → show gallery
    if (activeDeck === null) {
      return (
        <DeckGallery
          decks={decks}
          loading={decksLoading}
          onOpen={openDeck}
          onCreate={handleCreateDeck}
          onDelete={deleteDeck}
        />
      );
    }

    // Active deck → sidebar + viewer
    return (
      <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
        <Sidebar>
          <div style={{ padding: '0 0 8px', borderBottom: '1px solid rgba(63,63,70,0.3)', marginBottom: '8px' }}>
            <button
              onClick={closeDeck}
              style={{
                background: 'none', border: 'none', color: '#a1a1aa',
                cursor: 'pointer', fontSize: '0.8rem', padding: '4px 0',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}
            >
              &#x2190; All Decks
            </button>
          </div>

          <CollapsibleSection
            step={1} title="Source Files"
            open={openStep === 1} done={files.length > 0}
            onToggle={() => { setStepError(''); setOpenStep(openStep === 1 ? 0 : 1); }}
            onNext={() => handleNext(1)}
            error={openStep === 1 ? stepError : undefined}
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
            done={!!(brief.audience && brief.goal)}
            onToggle={() => { setStepError(''); setOpenStep(openStep === 2 ? 0 : 2); }}
            onNext={() => handleNext(2)}
            error={openStep === 2 ? stepError : undefined}
          >
            <BriefForm brief={brief} onChange={setBrief} />
          </CollapsibleSection>

          <CollapsibleSection
            step={3} title="Theme"
            open={openStep === 3} done={theme !== 'midnight'}
            onToggle={() => { setStepError(''); setOpenStep(openStep === 3 ? 0 : 3); }}
            onNext={() => handleNext(3)}
          >
            <ThemePicker activeTheme={theme} onSelectTheme={handleThemeChange} />
          </CollapsibleSection>

          <CollapsibleSection
            step={4} title="Fonts"
            open={openStep === 4}
            done={headingFont !== 'Inter' || bodyFont !== 'Inter'}
            onToggle={() => { setStepError(''); setOpenStep(openStep === 4 ? 0 : 4); }}
            onNext={() => handleNext(4)}
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
            onToggle={() => { setStepError(''); setOpenStep(openStep === 5 ? 0 : 5); }}
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
            <SlideRenderer slides={slides} fullWidth={false} editable deckSlug={activeDeck} />
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
