# Studio UI Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the studio from a passive slide viewer into an interactive workspace with clickable navigation, collapsible sidebar (dev mode), viewer features (web mode), and clean print output (PDF mode).

**Architecture:** Three build modes (dev/web/PDF) detected via `import.meta.env.DEV` and `?print` URL param. Dev mode adds a Vite middleware plugin for filesystem API (`/__api/*`) and a React sidebar for file uploads, brief form, theme/font pickers, and asset management. Web mode adds floating UI (theme picker, thumbnails, ToC, fullscreen). PDF mode strips all chrome.

**Tech Stack:** React 19, Vite 7, Tailwind v4, busboy (multipart parsing), Google Fonts (dynamic `<link>` injection), lucide-react (icons), existing `@slidemason/themes` + `@slidemason/renderer` packages.

---

### Task 1: Clickable Navigation Buttons

Replace the static `← →` text in SlideRenderer with actual clickable buttons. Add fullscreen toggle. Hide all nav in PDF mode.

**Files:**
- Modify: `packages/renderer/src/SlideRenderer.tsx`
- Test: `packages/renderer/src/__tests__/SlideRenderer.test.tsx`

**Step 1: Write the failing test**

Create `packages/renderer/src/__tests__/SlideRenderer.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SlideRenderer } from '../SlideRenderer';
import { DeckProvider } from '../DeckProvider';

function renderWithDeck(slides: React.ReactNode[], slideCount?: number) {
  return render(
    <DeckProvider slideCount={slideCount ?? slides.length}>
      <SlideRenderer slides={slides} />
    </DeckProvider>
  );
}

describe('SlideRenderer navigation', () => {
  it('renders prev and next buttons', () => {
    renderWithDeck([<div key="1">Slide 1</div>, <div key="2">Slide 2</div>]);
    expect(screen.getByLabelText('Previous slide')).toBeInTheDocument();
    expect(screen.getByLabelText('Next slide')).toBeInTheDocument();
  });

  it('renders slide counter', () => {
    renderWithDeck([<div key="1">S1</div>, <div key="2">S2</div>]);
    expect(screen.getByText('1 / 2')).toBeInTheDocument();
  });

  it('clicking next advances the slide', () => {
    renderWithDeck([<div key="1">Slide 1</div>, <div key="2">Slide 2</div>]);
    fireEvent.click(screen.getByLabelText('Next slide'));
    expect(screen.getByText('2 / 2')).toBeInTheDocument();
  });

  it('clicking prev goes back', () => {
    renderWithDeck([<div key="1">Slide 1</div>, <div key="2">Slide 2</div>]);
    fireEvent.click(screen.getByLabelText('Next slide'));
    fireEvent.click(screen.getByLabelText('Previous slide'));
    expect(screen.getByText('1 / 2')).toBeInTheDocument();
  });

  it('renders fullscreen button', () => {
    renderWithDeck([<div key="1">S1</div>]);
    expect(screen.getByLabelText('Toggle fullscreen')).toBeInTheDocument();
  });

  it('hides nav in print mode', () => {
    // Set ?print on URL
    Object.defineProperty(window, 'location', {
      value: { search: '?print' },
      writable: true,
    });
    renderWithDeck([<div key="1">S1</div>]);
    expect(screen.queryByLabelText('Previous slide')).not.toBeInTheDocument();
    // Clean up
    Object.defineProperty(window, 'location', {
      value: { search: '' },
      writable: true,
    });
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd /Users/erickittelson/qvl-code/slidemason && pnpm vitest run packages/renderer/src/__tests__/SlideRenderer.test.tsx`
Expected: FAIL — no `aria-label` buttons exist yet.

**Step 3: Implement clickable navigation**

Replace the static nav overlay in `packages/renderer/src/SlideRenderer.tsx`:

```tsx
import { type ReactNode } from 'react';
import { MDXProvider } from '@mdx-js/react';
import * as components from '@slidemason/components';
import { SlideLayout } from './SlideLayout';
import { useDeck } from './DeckProvider';

interface SlideRendererProps {
  slides: ReactNode[];
}

function isPrintMode() {
  return typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('print');
}

export function SlideRenderer({ slides }: SlideRendererProps) {
  const { currentSlide, slideCount, theme, next, prev } = useDeck();

  const handleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  return (
    <MDXProvider components={components}>
      <SlideLayout theme={theme}>
        {slides[currentSlide]}
        {!isPrintMode() && (
          <div
            className="absolute bottom-8 right-10 flex items-center gap-3 text-base"
            style={{ color: 'var(--sm-muted)', opacity: 0.6 }}
          >
            <button
              aria-label="Previous slide"
              onClick={prev}
              className="p-1 rounded hover:opacity-100 transition-opacity cursor-pointer"
              style={{ opacity: currentSlide === 0 ? 0.3 : 0.7 }}
              disabled={currentSlide === 0}
            >
              ←
            </button>
            <span style={{ fontSize: '0.875rem', minWidth: '3rem', textAlign: 'center' }}>
              {currentSlide + 1} / {slideCount}
            </span>
            <button
              aria-label="Next slide"
              onClick={next}
              className="p-1 rounded hover:opacity-100 transition-opacity cursor-pointer"
              style={{ opacity: currentSlide === slideCount - 1 ? 0.3 : 0.7 }}
              disabled={currentSlide === slideCount - 1}
            >
              →
            </button>
            <button
              aria-label="Toggle fullscreen"
              onClick={handleFullscreen}
              className="p-1 rounded hover:opacity-100 transition-opacity cursor-pointer ml-2"
              style={{ opacity: 0.7 }}
            >
              ⛶
            </button>
          </div>
        )}
      </SlideLayout>
    </MDXProvider>
  );
}
```

**Step 4: Run tests to verify they pass**

Run: `cd /Users/erickittelson/qvl-code/slidemason && pnpm vitest run packages/renderer/src/__tests__/SlideRenderer.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add packages/renderer/src/SlideRenderer.tsx packages/renderer/src/__tests__/SlideRenderer.test.tsx
git commit -m "feat(renderer): make navigation arrows clickable with fullscreen toggle"
```

---

### Task 2: Mode Detection Utility

Create a shared mode detection utility so all components can check dev/web/PDF mode consistently.

**Files:**
- Create: `apps/studio/src/lib/mode.ts`
- Test: `apps/studio/src/lib/__tests__/mode.test.ts`

**Step 1: Write the failing test**

```ts
import { describe, it, expect, vi } from 'vitest';
import { getMode } from '../mode';

describe('getMode', () => {
  it('returns "pdf" when ?print is in URL', () => {
    Object.defineProperty(window, 'location', {
      value: { search: '?print' }, writable: true,
    });
    expect(getMode()).toBe('pdf');
  });

  it('returns "dev" when import.meta.env.DEV is true', () => {
    Object.defineProperty(window, 'location', {
      value: { search: '' }, writable: true,
    });
    // Vite sets import.meta.env.DEV in dev mode
    expect(getMode()).toBe('dev'); // test runs in dev
  });

  it('returns "web" in production without ?print', () => {
    Object.defineProperty(window, 'location', {
      value: { search: '' }, writable: true,
    });
    // We'll test this by mocking — but since vitest runs in dev mode,
    // we verify the function signature returns the union type
    const mode = getMode();
    expect(['dev', 'web', 'pdf']).toContain(mode);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd /Users/erickittelson/qvl-code/slidemason && pnpm vitest run apps/studio/src/lib/__tests__/mode.test.ts`
Expected: FAIL — module doesn't exist.

**Step 3: Implement mode detection**

Create `apps/studio/src/lib/mode.ts`:

```ts
export type StudioMode = 'dev' | 'web' | 'pdf';

export function getMode(): StudioMode {
  if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('print')) {
    return 'pdf';
  }
  if (import.meta.env.DEV) {
    return 'dev';
  }
  return 'web';
}
```

**Step 4: Run tests to verify they pass**

Run: `cd /Users/erickittelson/qvl-code/slidemason && pnpm vitest run apps/studio/src/lib/__tests__/mode.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add apps/studio/src/lib/mode.ts apps/studio/src/lib/__tests__/mode.test.ts
git commit -m "feat(studio): add mode detection utility (dev/web/pdf)"
```

---

### Task 3: Vite Dev Server API Plugin

Create a Vite plugin that adds `/__api/*` middleware routes for file management, brief CRUD, and asset uploads. Only active in dev mode.

**Files:**
- Create: `apps/studio/vite-plugin-studio-api.ts`
- Modify: `apps/studio/vite.config.ts` (register plugin)
- Modify: `apps/studio/package.json` (add `busboy` dependency)
- Test: Manual testing via `curl` after `pnpm dev` (integration test)

**Step 1: Install busboy**

```bash
cd /Users/erickittelson/qvl-code/slidemason
pnpm add -D busboy @types/busboy --filter @slidemason/studio
```

**Step 2: Create the plugin**

Create `apps/studio/vite-plugin-studio-api.ts`:

```ts
import type { Plugin } from 'vite';
import { promises as fs } from 'node:fs';
import { join, resolve, basename, extname } from 'node:path';
import { createWriteStream } from 'node:fs';
import Busboy from 'busboy';
import type { IncomingMessage, ServerResponse } from 'node:http';

const DATA_DIR = resolve(process.cwd(), 'data');
const ASSETS_DIR = resolve(process.cwd(), 'data/assets');
const GENERATED_DIR = resolve(process.cwd(), 'generated');
const BRIEF_PATH = join(GENERATED_DIR, 'brief.json');

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

function sendJson(res: ServerResponse, data: unknown, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function sendError(res: ServerResponse, msg: string, status = 400) {
  sendJson(res, { error: msg }, status);
}

function parseMultipart(req: IncomingMessage, destDir: string): Promise<{ filename: string; path: string }[]> {
  return new Promise((resolve, reject) => {
    const files: { filename: string; path: string }[] = [];
    const busboy = Busboy({ headers: req.headers });

    busboy.on('file', (_fieldname, file, info) => {
      const safe = basename(info.filename).replace(/[^a-zA-Z0-9._-]/g, '_');
      const dest = join(destDir, safe);
      const ws = createWriteStream(dest);
      file.pipe(ws);
      ws.on('close', () => files.push({ filename: safe, path: dest }));
    });

    busboy.on('finish', () => resolve(files));
    busboy.on('error', reject);
    req.pipe(busboy);
  });
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

export function studioApiPlugin(): Plugin {
  return {
    name: 'vite-plugin-studio-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? '';
        const method = req.method ?? 'GET';

        // Only handle /__api/* routes
        if (!url.startsWith('/__api/')) return next();

        try {
          // GET /__api/files — list data/ files
          if (url === '/__api/files' && method === 'GET') {
            await ensureDir(DATA_DIR);
            const entries = await fs.readdir(DATA_DIR, { withFileTypes: true });
            const files = entries
              .filter(e => e.isFile())
              .map(e => ({ name: e.name, ext: extname(e.name) }));
            return sendJson(res, { files });
          }

          // POST /__api/files — upload to data/
          if (url === '/__api/files' && method === 'POST') {
            await ensureDir(DATA_DIR);
            const uploaded = await parseMultipart(req, DATA_DIR);
            return sendJson(res, { uploaded }, 201);
          }

          // DELETE /__api/files/:name
          if (url.startsWith('/__api/files/') && method === 'DELETE') {
            const name = decodeURIComponent(url.slice('/__api/files/'.length));
            const filePath = join(DATA_DIR, basename(name));
            await fs.unlink(filePath);
            return sendJson(res, { deleted: name });
          }

          // GET /__api/brief
          if (url === '/__api/brief' && method === 'GET') {
            try {
              const data = await fs.readFile(BRIEF_PATH, 'utf-8');
              return sendJson(res, JSON.parse(data));
            } catch {
              return sendJson(res, {});
            }
          }

          // POST /__api/brief
          if (url === '/__api/brief' && method === 'POST') {
            await ensureDir(GENERATED_DIR);
            const body = await readBody(req);
            const parsed = JSON.parse(body);
            await fs.writeFile(BRIEF_PATH, JSON.stringify(parsed, null, 2));
            return sendJson(res, { saved: true }, 201);
          }

          // GET /__api/assets
          if (url === '/__api/assets' && method === 'GET') {
            await ensureDir(ASSETS_DIR);
            const entries = await fs.readdir(ASSETS_DIR, { withFileTypes: true });
            const files = entries
              .filter(e => e.isFile())
              .map(e => ({ name: e.name, ext: extname(e.name) }));
            return sendJson(res, { files });
          }

          // POST /__api/assets — upload to data/assets/
          if (url === '/__api/assets' && method === 'POST') {
            await ensureDir(ASSETS_DIR);
            const uploaded = await parseMultipart(req, ASSETS_DIR);
            return sendJson(res, { uploaded }, 201);
          }

          // DELETE /__api/assets/:name
          if (url.startsWith('/__api/assets/') && method === 'DELETE') {
            const name = decodeURIComponent(url.slice('/__api/assets/'.length));
            const filePath = join(ASSETS_DIR, basename(name));
            await fs.unlink(filePath);
            return sendJson(res, { deleted: name });
          }

          // GET /__api/status — project state
          if (url === '/__api/status' && method === 'GET') {
            await ensureDir(DATA_DIR);
            await ensureDir(GENERATED_DIR);
            const dataFiles = await fs.readdir(DATA_DIR, { withFileTypes: true });
            const hasFiles = dataFiles.some(e => e.isFile());
            let hasBrief = false;
            try { await fs.access(BRIEF_PATH); hasBrief = true; } catch {}
            let hasDeck = false;
            try {
              const genFiles = await fs.readdir(GENERATED_DIR);
              hasDeck = genFiles.some(f => f.endsWith('.mdx') || f === 'outline.json');
            } catch {}
            return sendJson(res, { hasFiles, hasBrief, hasDeck });
          }

          // Unknown /__api route
          return sendError(res, 'Not found', 404);
        } catch (err) {
          console.error('Studio API error:', err);
          return sendError(res, 'Internal server error', 500);
        }
      });
    },
  };
}
```

**Step 3: Register plugin in vite.config.ts**

Add `studioApiPlugin()` to the plugins array in `apps/studio/vite.config.ts`:

```ts
import { studioApiPlugin } from './vite-plugin-studio-api';

// In plugins array, add:
studioApiPlugin(),
```

**Step 4: Verify it works**

```bash
cd /Users/erickittelson/qvl-code/slidemason && pnpm dev --filter @slidemason/studio &
sleep 3
curl http://localhost:4200/__api/status
curl http://localhost:4200/__api/files
# Should return JSON responses
kill %1
```

**Step 5: Commit**

```bash
git add apps/studio/vite-plugin-studio-api.ts apps/studio/vite.config.ts apps/studio/package.json pnpm-lock.yaml
git commit -m "feat(studio): add Vite dev server API plugin for filesystem operations"
```

---

### Task 4: Studio Layout Shell (Sidebar + Viewer)

Restructure the App component to show a collapsible sidebar in dev mode. The sidebar takes 320px; the slide viewer fills the remaining width. SlideLayout needs to use the remaining width instead of `w-screen`.

**Files:**
- Create: `apps/studio/src/components/Sidebar.tsx`
- Create: `apps/studio/src/components/SidebarToggle.tsx`
- Modify: `apps/studio/src/App.tsx`
- Modify: `packages/renderer/src/SlideLayout.tsx` (accept optional width constraint)
- Modify: `packages/renderer/src/SlideRenderer.tsx` (pass width mode)

**Step 1: Update SlideLayout to accept a `container` mode**

In `packages/renderer/src/SlideLayout.tsx`, add a `fullWidth` prop that defaults to `true`. When `false`, the layout uses `w-full h-full` instead of `w-screen h-screen`:

```tsx
import { type ReactNode } from 'react';

interface SlideLayoutProps {
  children: ReactNode;
  theme?: string;
  fullWidth?: boolean;
}

export function SlideLayout({ children, theme = 'slate', fullWidth = true }: SlideLayoutProps) {
  return (
    <div
      data-theme={theme}
      className={`relative flex flex-col ${fullWidth ? 'w-screen h-screen' : 'w-full h-full'} overflow-hidden`}
      style={{ backgroundColor: 'var(--sm-bg)', padding: 'clamp(2rem, 4vw, 5rem)' }}
    >
      {children}
    </div>
  );
}
```

**Step 2: Create SidebarToggle component**

Create `apps/studio/src/components/SidebarToggle.tsx`:

```tsx
interface SidebarToggleProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function SidebarToggle({ collapsed, onToggle }: SidebarToggleProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      className="p-2 rounded hover:opacity-80 transition-opacity cursor-pointer"
      style={{ color: 'var(--sm-muted, #888)' }}
    >
      {collapsed ? '☰' : '✕'}
    </button>
  );
}
```

**Step 3: Create Sidebar shell**

Create `apps/studio/src/components/Sidebar.tsx`:

```tsx
import { useState } from 'react';
import { SidebarToggle } from './SidebarToggle';

interface SidebarProps {
  children?: React.ReactNode;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function Sidebar({ children, onCollapsedChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    onCollapsedChange?.(next);
  };

  return (
    <aside
      style={{
        width: collapsed ? 48 : 320,
        minWidth: collapsed ? 48 : 320,
        transition: 'width 0.2s ease, min-width 0.2s ease',
        backgroundColor: '#1a1a2e',
        borderRight: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between' }}>
        {!collapsed && <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>Slidemason</span>}
        <SidebarToggle collapsed={collapsed} onToggle={toggle} />
      </div>
      {!collapsed && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px 12px' }}>
          {children}
        </div>
      )}
    </aside>
  );
}
```

**Step 4: Update App.tsx to use sidebar in dev mode**

Rewrite `apps/studio/src/App.tsx` to wrap the deck in a flex layout with the sidebar:

```tsx
import { useState } from 'react';
import { DeckProvider, SlideRenderer } from '@slidemason/renderer';
import { /* all component imports */ } from '@slidemason/components';
import { getMode } from './lib/mode';
import { Sidebar } from './components/Sidebar';

// ... slides array stays the same ...

export function App() {
  const mode = getMode();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (mode === 'pdf') {
    return (
      <DeckProvider slideCount={slides.length} theme="midnight">
        <SlideRenderer slides={slides} />
      </DeckProvider>
    );
  }

  if (mode === 'dev') {
    return (
      <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
        <Sidebar onCollapsedChange={setSidebarCollapsed}>
          {/* Sidebar sections will be added in subsequent tasks */}
          <p style={{ color: '#888', fontSize: '0.85rem' }}>Sidebar sections coming soon...</p>
        </Sidebar>
        <main style={{ flex: 1, overflow: 'hidden' }}>
          <DeckProvider slideCount={slides.length} theme="midnight">
            <SlideRenderer slides={slides} fullWidth={false} />
          </DeckProvider>
        </main>
      </div>
    );
  }

  // Web mode
  return (
    <DeckProvider slideCount={slides.length} theme="midnight">
      <SlideRenderer slides={slides} />
    </DeckProvider>
  );
}
```

**Step 5: Pass `fullWidth` through SlideRenderer to SlideLayout**

Update `packages/renderer/src/SlideRenderer.tsx` to accept and forward a `fullWidth` prop:

```tsx
interface SlideRendererProps {
  slides: ReactNode[];
  fullWidth?: boolean;
}

export function SlideRenderer({ slides, fullWidth = true }: SlideRendererProps) {
  // ... use fullWidth in <SlideLayout fullWidth={fullWidth}>
}
```

**Step 6: Run all existing tests to make sure nothing breaks**

Run: `cd /Users/erickittelson/qvl-code/slidemason && pnpm vitest run`
Expected: All tests pass.

**Step 7: Commit**

```bash
git add packages/renderer/src/SlideLayout.tsx packages/renderer/src/SlideRenderer.tsx apps/studio/src/App.tsx apps/studio/src/components/Sidebar.tsx apps/studio/src/components/SidebarToggle.tsx apps/studio/src/lib/mode.ts
git commit -m "feat(studio): add collapsible sidebar layout shell with dev/web/pdf mode switching"
```

---

### Task 5: Quick Start Guide Section

Add a contextual "next step" panel to the sidebar that reads project status from `/__api/status` and guides the user.

**Files:**
- Create: `apps/studio/src/components/QuickStartGuide.tsx`
- Create: `apps/studio/src/hooks/useProjectStatus.ts`
- Modify: `apps/studio/src/components/Sidebar.tsx` (add QuickStartGuide)

**Step 1: Create useProjectStatus hook**

Create `apps/studio/src/hooks/useProjectStatus.ts`:

```ts
import { useState, useEffect } from 'react';

interface ProjectStatus {
  hasFiles: boolean;
  hasBrief: boolean;
  hasDeck: boolean;
}

export function useProjectStatus() {
  const [status, setStatus] = useState<ProjectStatus | null>(null);

  const refresh = async () => {
    try {
      const res = await fetch('/__api/status');
      const data = await res.json();
      setStatus(data);
    } catch {
      setStatus(null);
    }
  };

  useEffect(() => { refresh(); }, []);

  return { status, refresh };
}
```

**Step 2: Create QuickStartGuide component**

Create `apps/studio/src/components/QuickStartGuide.tsx`:

```tsx
interface QuickStartGuideProps {
  status: { hasFiles: boolean; hasBrief: boolean; hasDeck: boolean } | null;
}

export function QuickStartGuide({ status }: QuickStartGuideProps) {
  if (!status) return <p style={{ color: '#888', fontSize: '0.8rem' }}>Loading status...</p>;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  let step: { title: string; description: string; command?: string };

  if (!status.hasFiles) {
    step = {
      title: '1. Add source files',
      description: 'Drop files below to get started. PDFs, docs, markdown — anything your presentation is based on.',
    };
  } else if (!status.hasBrief) {
    step = {
      title: '2. Fill in the brief',
      description: 'Tell us about your presentation: title, audience, tone, and goals.',
    };
  } else if (!status.hasDeck) {
    step = {
      title: '3. Generate your deck',
      description: 'Tell your coding agent to build the outline:',
      command: 'read prompts/build-outline.md',
    };
  } else {
    step = {
      title: '✓ Deck ready!',
      description: 'Your presentation is built. Navigate slides to preview, or export to PDF.',
    };
  }

  return (
    <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.05)', marginBottom: '16px' }}>
      <h3 style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '4px' }}>{step.title}</h3>
      <p style={{ color: '#aaa', fontSize: '0.8rem', lineHeight: 1.4 }}>{step.description}</p>
      {step.command && (
        <button
          onClick={() => copyToClipboard(step.command!)}
          style={{
            marginTop: '8px', padding: '6px 10px', fontSize: '0.75rem',
            backgroundColor: 'rgba(139,92,246,0.2)', color: '#c4b5fd',
            border: '1px solid rgba(139,92,246,0.3)', borderRadius: '4px', cursor: 'pointer',
            fontFamily: 'monospace',
          }}
        >
          📋 {step.command}
        </button>
      )}
    </div>
  );
}
```

**Step 3: Wire into Sidebar**

Import `QuickStartGuide` and `useProjectStatus` into Sidebar, render as first child section.

**Step 4: Commit**

```bash
git add apps/studio/src/components/QuickStartGuide.tsx apps/studio/src/hooks/useProjectStatus.ts apps/studio/src/components/Sidebar.tsx
git commit -m "feat(studio): add quick start guide with project status detection"
```

---

### Task 6: File Upload Zone

Add drag-and-drop file upload section to the sidebar. Lists current `data/` files with delete buttons.

**Files:**
- Create: `apps/studio/src/components/FileUploadZone.tsx`
- Create: `apps/studio/src/hooks/useFiles.ts`
- Modify: `apps/studio/src/components/Sidebar.tsx`

**Step 1: Create useFiles hook**

```ts
import { useState, useEffect, useCallback } from 'react';

interface FileEntry {
  name: string;
  ext: string;
}

export function useFiles() {
  const [files, setFiles] = useState<FileEntry[]>([]);

  const refresh = useCallback(async () => {
    const res = await fetch('/__api/files');
    const data = await res.json();
    setFiles(data.files ?? []);
  }, []);

  const upload = useCallback(async (fileList: FileList) => {
    const formData = new FormData();
    for (const file of fileList) {
      formData.append('files', file);
    }
    await fetch('/__api/files', { method: 'POST', body: formData });
    await refresh();
  }, [refresh]);

  const remove = useCallback(async (name: string) => {
    await fetch(`/__api/files/${encodeURIComponent(name)}`, { method: 'DELETE' });
    await refresh();
  }, [refresh]);

  useEffect(() => { refresh(); }, [refresh]);

  return { files, upload, remove, refresh };
}
```

**Step 2: Create FileUploadZone component**

Drag-and-drop area + file list with delete. Use `onDragOver`, `onDrop` for drag-and-drop. Click triggers hidden `<input type="file" multiple>`.

**Step 3: Wire into Sidebar after QuickStartGuide**

**Step 4: Commit**

```bash
git add apps/studio/src/components/FileUploadZone.tsx apps/studio/src/hooks/useFiles.ts apps/studio/src/components/Sidebar.tsx
git commit -m "feat(studio): add drag-and-drop file upload zone to sidebar"
```

---

### Task 7: Brief Form

Add a form to the sidebar for title, audience, goal, tone (dropdown), and constraints (textarea). Reads existing brief on mount, saves on submit.

**Files:**
- Create: `apps/studio/src/components/BriefForm.tsx`
- Create: `apps/studio/src/hooks/useBrief.ts`
- Modify: `apps/studio/src/components/Sidebar.tsx`

**Step 1: Create useBrief hook**

```ts
import { useState, useEffect, useCallback } from 'react';

interface Brief {
  title: string;
  audience: string;
  goal: string;
  tone: string;
  constraints: string;
  fonts?: { heading: string; body: string };
  theme?: string;
}

const DEFAULT_BRIEF: Brief = {
  title: '', audience: '', goal: '', tone: 'professional', constraints: '',
};

export function useBrief() {
  const [brief, setBrief] = useState<Brief>(DEFAULT_BRIEF);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/__api/brief');
      const data = await res.json();
      if (data.title !== undefined) setBrief({ ...DEFAULT_BRIEF, ...data });
    } catch {}
  }, []);

  const save = useCallback(async (updates?: Partial<Brief>) => {
    const toSave = updates ? { ...brief, ...updates } : brief;
    if (updates) setBrief(toSave);
    await fetch('/__api/brief', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toSave),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [brief]);

  useEffect(() => { load(); }, [load]);

  return { brief, setBrief, save, saved };
}
```

**Step 2: Create BriefForm component**

Form with text inputs for title/audience/goal, select dropdown for tone (professional, casual, inspirational, technical), textarea for constraints. "Save Brief" button calls `save()`.

**Step 3: Wire into Sidebar**

**Step 4: Commit**

```bash
git add apps/studio/src/components/BriefForm.tsx apps/studio/src/hooks/useBrief.ts apps/studio/src/components/Sidebar.tsx
git commit -m "feat(studio): add brief form to sidebar with auto-load and save"
```

---

### Task 8: Theme Picker (Sidebar)

Add a grid of 12 theme swatches to the sidebar. Clicking switches the active theme live by updating `data-theme` on the slide layout.

**Files:**
- Create: `apps/studio/src/components/ThemePicker.tsx`
- Modify: `apps/studio/src/App.tsx` (theme state management)
- Modify: `apps/studio/src/hooks/useBrief.ts` (save theme to brief)

**Step 1: Create ThemePicker component**

Uses the 12 theme names from `@slidemason/themes`. Shows a 4×3 grid of swatches. Each swatch previews bg + primary color. Active theme has a ring border.

```tsx
const THEMES = [
  { name: 'slate', bg: '#1e293b', primary: '#3b82f6' },
  { name: 'canvas', bg: '#faf5eb', primary: '#b45309' },
  { name: 'signal', bg: '#0f172a', primary: '#22d3ee' },
  { name: 'noir', bg: '#0a0a0a', primary: '#ffffff' },
  { name: 'dawn', bg: '#fefce8', primary: '#f97316' },
  { name: 'boardroom', bg: '#1c1917', primary: '#a78bfa' },
  { name: 'neon', bg: '#0a0a0a', primary: '#a855f7' },
  { name: 'forest', bg: '#14532d', primary: '#4ade80' },
  { name: 'glacier', bg: '#ecfeff', primary: '#0891b2' },
  { name: 'sunset', bg: '#1c1917', primary: '#fb923c' },
  { name: 'paper', bg: '#fafaf9', primary: '#57534e' },
  { name: 'midnight', bg: '#18181b', primary: '#8b5cf6' },
];
```

**Step 2: Wire theme state**

In App.tsx, lift theme state: `const [theme, setTheme] = useState('midnight')`. Pass `setTheme` to both ThemePicker and DeckProvider. When theme changes, also update brief via `useBrief.save({ theme })`.

**Step 3: Commit**

```bash
git add apps/studio/src/components/ThemePicker.tsx apps/studio/src/App.tsx
git commit -m "feat(studio): add theme picker grid to sidebar with live switching"
```

---

### Task 9: Font Picker

Add heading/body font dropdowns to the sidebar. Load Google Fonts dynamically. Update CSS variables live. Save to brief.

**Files:**
- Create: `apps/studio/src/components/FontPicker.tsx`
- Create: `apps/studio/src/lib/fonts.ts`
- Modify: `apps/studio/src/components/Sidebar.tsx`

**Step 1: Create font loading utility**

`apps/studio/src/lib/fonts.ts`:

```ts
const HEADING_FONTS = ['Inter', 'Playfair Display', 'Space Grotesk', 'Montserrat', 'DM Serif Display'];
const BODY_FONTS = ['Inter', 'Source Serif 4', 'IBM Plex Sans', 'Lora', 'Nunito'];

export { HEADING_FONTS, BODY_FONTS };

const loaded = new Set<string>();

export function loadGoogleFont(fontName: string) {
  if (loaded.has(fontName) || fontName === 'Inter') return; // Inter is already loaded
  loaded.add(fontName);
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;600;700&display=swap`;
  document.head.appendChild(link);
}

export function applyFonts(heading: string, body: string) {
  loadGoogleFont(heading);
  loadGoogleFont(body);
  document.documentElement.style.setProperty('--sm-heading-font', `'${heading}', system-ui, sans-serif`);
  document.documentElement.style.setProperty('--sm-body-font', `'${body}', system-ui, sans-serif`);
}
```

**Step 2: Create FontPicker component**

Two `<select>` dropdowns — heading font and body font. On change, call `applyFonts()` and save to brief. Show live preview text in each font.

**Step 3: Wire into Sidebar after ThemePicker**

**Step 4: Commit**

```bash
git add apps/studio/src/components/FontPicker.tsx apps/studio/src/lib/fonts.ts apps/studio/src/components/Sidebar.tsx
git commit -m "feat(studio): add font picker with Google Fonts dynamic loading"
```

---

### Task 10: Asset Library

Add logo and image upload section to the sidebar. Uploads to `data/assets/`. Shows thumbnail grid. Delete button per asset.

**Files:**
- Create: `apps/studio/src/components/AssetLibrary.tsx`
- Create: `apps/studio/src/hooks/useAssets.ts`
- Modify: `apps/studio/src/components/Sidebar.tsx`

**Step 1: Create useAssets hook**

Similar to `useFiles` but hits `/__api/assets` endpoints. Add thumbnail URL generation: `/data/assets/${name}` served by Vite's static file serving (configure `public` dir or use `/__api/assets/:name` GET for serving).

**Step 2: Add asset serving route**

Add a `GET /__api/assets/:name` route to the Vite plugin that reads and serves the file with appropriate content-type.

**Step 3: Create AssetLibrary component**

Logo upload (single file, saved as `logo.*`), general image uploads, thumbnail grid, delete buttons.

**Step 4: Wire into Sidebar**

**Step 5: Commit**

```bash
git add apps/studio/src/components/AssetLibrary.tsx apps/studio/src/hooks/useAssets.ts apps/studio/vite-plugin-studio-api.ts apps/studio/src/components/Sidebar.tsx
git commit -m "feat(studio): add asset library with logo and image uploads"
```

---

### Task 11: Web Mode — Floating Theme Picker

Add a small floating theme picker toggle (bottom-left) for web/production builds. Client-side only, no server needed.

**Files:**
- Create: `apps/studio/src/components/FloatingThemePicker.tsx`
- Modify: `apps/studio/src/App.tsx` (render in web mode)

**Step 1: Create FloatingThemePicker**

A small button (bottom-left) that toggles a panel of theme swatches. Same swatch data as sidebar ThemePicker but in a compact popover. Clicking a swatch updates `data-theme` on the slide layout.

**Step 2: Add to App.tsx web mode branch**

In the web mode return, add `<FloatingThemePicker>` alongside the `SlideRenderer`.

**Step 3: Commit**

```bash
git add apps/studio/src/components/FloatingThemePicker.tsx apps/studio/src/App.tsx
git commit -m "feat(studio): add floating theme picker for web mode"
```

---

### Task 12: Web Mode — Slide Thumbnails

Add a bottom strip of mini slide previews in web mode. Click to jump to any slide.

**Files:**
- Create: `apps/studio/src/components/SlideThumbnails.tsx`
- Modify: `apps/studio/src/App.tsx`

**Step 1: Create SlideThumbnails component**

A horizontal scrollable strip at the bottom. Each thumbnail is a small `<div>` showing the slide index and a colored indicator for current slide. Uses `useDeck().goTo()` on click.

**Step 2: Add to App.tsx web mode**

**Step 3: Commit**

```bash
git add apps/studio/src/components/SlideThumbnails.tsx apps/studio/src/App.tsx
git commit -m "feat(studio): add slide thumbnail strip for web mode"
```

---

### Task 13: Web Mode — Table of Contents Overlay

Add a ToC overlay panel that lists slide headlines. Click to jump.

**Files:**
- Create: `apps/studio/src/components/TableOfContents.tsx`
- Modify: `apps/studio/src/App.tsx`

**Step 1: Create TableOfContents component**

A button (top-right or bottom-left) toggles an overlay. Lists slide numbers (and optionally headlines if we can extract them). Click jumps to that slide via `goTo()`.

**Step 2: Add to App.tsx web mode**

**Step 3: Commit**

```bash
git add apps/studio/src/components/TableOfContents.tsx apps/studio/src/App.tsx
git commit -m "feat(studio): add table of contents overlay for web mode"
```

---

### Task 14: Assemble All Sidebar Sections

Wire all sections into the Sidebar in the correct order: QuickStartGuide, FileUploadZone, BriefForm, ThemePicker, FontPicker, AssetLibrary. Ensure proper spacing and scroll behavior.

**Files:**
- Modify: `apps/studio/src/components/Sidebar.tsx`
- Modify: `apps/studio/src/App.tsx` (pass all required props)

**Step 1: Update Sidebar to render all sections**

Import and render in order: QuickStartGuide → FileUploadZone → BriefForm → ThemePicker → FontPicker → AssetLibrary. Each section separated by a subtle divider line.

**Step 2: Update App.tsx to pass status, brief, theme, and file hooks to sidebar**

Lift all hooks to App level and pass them down.

**Step 3: Run all tests**

Run: `cd /Users/erickittelson/qvl-code/slidemason && pnpm vitest run`
Expected: All tests pass.

**Step 4: Commit**

```bash
git add apps/studio/src/components/Sidebar.tsx apps/studio/src/App.tsx
git commit -m "feat(studio): assemble all sidebar sections in correct order"
```

---

### Task 15: Sidebar Styling Polish

Apply consistent styling across all sidebar components: dark theme, proper typography, hover states, focus rings, spacing.

**Files:**
- Modify: `apps/studio/src/styles.css` (add sidebar-specific styles)
- Modify: All sidebar components as needed

**Step 1: Add CSS for sidebar form elements**

Consistent styling for inputs, selects, textareas, buttons in the sidebar: dark backgrounds, muted borders, focus rings.

**Step 2: Verify visual appearance**

Run dev server, check all sections look consistent and scroll properly.

**Step 3: Commit**

```bash
git add apps/studio/src/styles.css apps/studio/src/components/
git commit -m "style(studio): polish sidebar component styling"
```

---

### Task 16: Integration Test & Final Verification

End-to-end verification of all three modes. Fix any issues found.

**Files:**
- All studio files

**Step 1: Run the full test suite**

```bash
cd /Users/erickittelson/qvl-code/slidemason && pnpm vitest run
```

**Step 2: Start dev server and verify dev mode**

```bash
pnpm dev --filter @slidemason/studio
```
- Verify sidebar appears with all sections
- Verify collapse/expand toggle works
- Upload a test file via drag-and-drop
- Fill in brief form and save
- Switch theme via picker
- Switch fonts via picker
- Upload an asset
- Verify clickable nav arrows work
- Verify keyboard nav still works

**Step 3: Build and verify web mode**

```bash
pnpm build --filter @slidemason/studio
pnpm preview --filter @slidemason/studio
```
- Verify no sidebar appears
- Verify floating theme picker works
- Verify slide thumbnails appear
- Verify ToC overlay works
- Verify fullscreen toggle works
- Verify clickable nav arrows work

**Step 4: Verify PDF mode**

Open `localhost:4200?print` — verify no UI chrome, just slides.

**Step 5: Fix any issues found**

**Step 6: Final commit**

```bash
git add -A
git commit -m "feat(studio): complete studio UI with dev sidebar, web viewer, and PDF mode"
```
