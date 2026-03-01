# Multi-Deck Gallery + Screenshot Capture Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform Slidemason from a single-deck tool into a multi-deck app with a gallery landing page, deck lifecycle management, and one-click screenshot-to-clipboard.

**Architecture:** Filesystem-based deck storage under a `decks/` directory. Each deck is a self-contained folder with `data/`, `generated/brief.json`, and `slides.tsx`. The Vite API plugin becomes deck-scoped. The studio app gains a gallery view and deck state management. Screenshot capture uses `html2canvas` to copy the current slide to clipboard.

**Tech Stack:** React, Vite, html2canvas, Node.js fs (Vite plugin), Framer Motion

---

### Task 1: Install html2canvas and add screenshot button to nav pill

This is the simplest feature — ship it first.

**Files:**
- Modify: `packages/renderer/package.json` — add `html2canvas` dependency
- Modify: `packages/renderer/src/SlideRenderer.tsx:97-138` — add screenshot button to nav pill

**Step 1: Install html2canvas**

Run: `pnpm --filter @slidemason/renderer add html2canvas`

**Step 2: Add screenshot button and handler to SlideRenderer**

In `packages/renderer/src/SlideRenderer.tsx`, add a new import at the top:

```tsx
import html2canvas from 'html2canvas';
```

Add a `useRef` for the slide container. Change the outer `<div>` (line 46) to include a ref:

```tsx
import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
// ...
const slideRef = useRef<HTMLDivElement>(null);
```

Add the ref to the outer div:
```tsx
<div
  ref={slideRef}
  data-theme={theme}
  className={...}
```

Add the screenshot handler after `toggleFullscreen`:

```tsx
const [screenshotDone, setScreenshotDone] = useState(false);

const captureScreenshot = useCallback(async () => {
  if (!slideRef.current) return;
  try {
    const canvas = await html2canvas(slideRef.current, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
    });
    const blob = await new Promise<Blob>((resolve) =>
      canvas.toBlob((b) => resolve(b!), 'image/png')
    );
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob }),
    ]);
    setScreenshotDone(true);
    setTimeout(() => setScreenshotDone(false), 1500);
  } catch (err) {
    console.error('Screenshot failed:', err);
  }
}, []);
```

Add the button to the nav pill, after the fullscreen button (line 137):

```tsx
<button
  onClick={captureScreenshot}
  className="cursor-pointer border-none bg-transparent p-1 text-sm leading-none transition-opacity duration-150"
  style={{ color: screenshotDone ? 'var(--sm-primary)' : 'var(--sm-muted)' }}
  aria-label="Copy slide screenshot to clipboard"
>
  {screenshotDone ? '✓' : '📷'}
</button>
```

**Step 3: Verify it works**

Run: `pnpm dev` from `apps/studio/`
Expected: Camera button visible in nav pill. Click it → slide copied to clipboard. Button briefly shows checkmark.

**Step 4: Run existing tests**

Run: `pnpm test`
Expected: All tests pass (screenshot is UI-only, no logic to test).

**Step 5: Commit**

```bash
git add packages/renderer/package.json packages/renderer/src/SlideRenderer.tsx pnpm-lock.yaml
git commit -m "feat: add screenshot-to-clipboard button in slide nav pill"
```

---

### Task 2: Create `decks/` directory structure and migrate existing deck

Move the current single-deck files into the new multi-deck layout.

**Files:**
- Create: `decks/saberalert/data/` — move source files here
- Create: `decks/saberalert/generated/` — move brief.json here
- Create: `decks/saberalert/slides.tsx` — move slides here
- Modify: `.gitignore` — add `decks/*/` if needed

**Step 1: Create the directory structure and move files**

```bash
mkdir -p decks/saberalert/data/assets
mkdir -p decks/saberalert/generated

# Move source files
cp data/SaberAlert_MVP.pdf decks/saberalert/data/
cp -r data/assets/* decks/saberalert/data/assets/ 2>/dev/null || true

# Move brief
cp generated/brief.json decks/saberalert/generated/brief.json

# Move slides
cp apps/studio/src/slides.tsx decks/saberalert/slides.tsx
```

Keep the old files for now (we'll remove them after the Vite plugin is updated).

**Step 2: Commit**

```bash
git add decks/
git commit -m "feat: create decks/ directory structure with saberalert deck"
```

---

### Task 3: Rewrite Vite API plugin to be deck-scoped

The plugin needs to support both `/__api/decks` (list/create/delete) and `/__api/decks/:slug/*` (all existing endpoints scoped to a deck).

**Files:**
- Modify: `apps/studio/vite-plugin-studio-api.ts` — complete rewrite

**Step 1: Rewrite the plugin**

Replace the entire contents of `apps/studio/vite-plugin-studio-api.ts`:

```typescript
/**
 * Vite dev-server middleware plugin for Slidemason Studio.
 *
 * All file operations are scoped to decks under `MONO_ROOT/decks/:slug/`.
 * API surface:
 *   GET    /__api/decks                  — list all decks
 *   POST   /__api/decks                  — create a new deck { name: string }
 *   DELETE /__api/decks/:slug            — delete a deck
 *   GET    /__api/decks/:slug/files      — list source files
 *   POST   /__api/decks/:slug/files      — upload source file
 *   DELETE /__api/decks/:slug/files/:name — delete source file
 *   GET    /__api/decks/:slug/brief      — get brief.json
 *   POST   /__api/decks/:slug/brief      — save brief.json
 *   GET    /__api/decks/:slug/assets     — list assets
 *   POST   /__api/decks/:slug/assets     — upload asset
 *   GET    /__api/decks/:slug/assets/:n  — serve asset
 *   DELETE /__api/decks/:slug/assets/:n  — delete asset
 *   GET    /__api/decks/:slug/status     — project status
 *   GET    /__api/decks/:slug/slides     — get slides.tsx content
 */

import { resolve, basename, extname } from 'node:path';
import {
  readdir, readFile, writeFile, unlink, mkdir, stat, rm,
} from 'node:fs/promises';
import type { Plugin, ViteDevServer } from 'vite';
import type { IncomingMessage, ServerResponse } from 'node:http';
import Busboy from 'busboy';

const MONO_ROOT = resolve(import.meta.dirname, '../..');
const DECKS_DIR = resolve(MONO_ROOT, 'decks');

// --- Utilities (keep existing sanitize, collectBody, json, mimeForExt, parseMultipart, ensureDir, exists) ---
// Copy these unchanged from the current file.

/** Resolve paths for a specific deck. */
function deckPaths(slug: string) {
  const root = resolve(DECKS_DIR, slug);
  return {
    root,
    data: resolve(root, 'data'),
    assets: resolve(root, 'data/assets'),
    generated: resolve(root, 'generated'),
    brief: resolve(root, 'generated/brief.json'),
    slides: resolve(root, 'slides.tsx'),
  };
}

/** Slugify a deck name. */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    || 'untitled';
}

// --- Deck-level handlers ---

async function handleListDecks(res: ServerResponse) {
  await ensureDir(DECKS_DIR);
  const entries = await readdir(DECKS_DIR, { withFileTypes: true });
  const decks = [];
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
    const slug = entry.name;
    const paths = deckPaths(slug);
    let title = slug;
    let theme = 'midnight';
    let slideCount = 0;
    let lastModified = '';
    try {
      const briefRaw = await readFile(paths.brief, 'utf-8');
      const brief = JSON.parse(briefRaw);
      if (brief.title) title = brief.title;
      if (brief.theme) theme = brief.theme;
    } catch {}
    try {
      const slidesRaw = await readFile(paths.slides, 'utf-8');
      // Count JSX elements with key= props as a rough slide count
      const matches = slidesRaw.match(/key="/g);
      slideCount = matches ? matches.length : 0;
    } catch {}
    try {
      const s = await stat(paths.root);
      lastModified = s.mtime.toISOString();
    } catch {}
    decks.push({ slug, title, theme, slideCount, lastModified });
  }
  // Sort by most recently modified first
  decks.sort((a, b) => b.lastModified.localeCompare(a.lastModified));
  json(res, { decks });
}

async function handleCreateDeck(req: IncomingMessage, res: ServerResponse) {
  const body = await collectBody(req);
  const { name } = JSON.parse(body.toString('utf-8'));
  if (!name || typeof name !== 'string') {
    json(res, { error: 'name is required' }, 400);
    return;
  }
  const slug = slugify(name);
  const paths = deckPaths(slug);
  await ensureDir(paths.data);
  await ensureDir(paths.assets);
  await ensureDir(paths.generated);
  // Create default brief
  const defaultBrief = {
    title: name,
    subtitle: '',
    presenter: '',
    audience: '',
    goal: '',
    tone: 'professional',
    slideCount: '',
    duration: '',
    dataStyle: '',
    visualStyle: '',
    contentFocus: '',
    extraConstraints: '',
    infoCutoff: '',
    theme: 'midnight',
    fonts: { heading: 'Inter', body: 'Inter' },
  };
  await writeFile(paths.brief, JSON.stringify(defaultBrief, null, 2), 'utf-8');
  // Create empty slides.tsx
  const emptySlidesContent = `import { TitleSlide } from '@slidemason/components';

const slides = [
  <TitleSlide key="s1" title="${name}" subtitle="" gradient="blue-purple" />,
];

export default slides;
`;
  await writeFile(paths.slides, emptySlidesContent, 'utf-8');
  json(res, { slug, name }, 201);
}

async function handleDeleteDeck(slug: string, res: ServerResponse) {
  const paths = deckPaths(slug);
  if (!(await exists(paths.root))) {
    json(res, { error: 'not found' }, 404);
    return;
  }
  await rm(paths.root, { recursive: true, force: true });
  json(res, { deleted: slug });
}

// --- Scoped file handlers (same logic as before but using deck paths) ---

async function handleDeckListFiles(slug: string, res: ServerResponse) {
  const paths = deckPaths(slug);
  await ensureDir(paths.data);
  const entries = await readdir(paths.data, { withFileTypes: true });
  const files = entries.filter(e => e.isFile() && !e.name.startsWith('.')).map(e => e.name);
  json(res, { files });
}

async function handleDeckUploadFile(slug: string, req: IncomingMessage, res: ServerResponse) {
  const paths = deckPaths(slug);
  await ensureDir(paths.data);
  const { filename, data } = await parseMultipart(req);
  const safe = sanitize(filename);
  await writeFile(resolve(paths.data, safe), data);
  json(res, { filename: safe }, 201);
}

async function handleDeckDeleteFile(slug: string, name: string, res: ServerResponse) {
  const paths = deckPaths(slug);
  const safe = sanitize(name);
  const target = resolve(paths.data, safe);
  if (!(await exists(target))) { json(res, { error: 'not found' }, 404); return; }
  await unlink(target);
  json(res, { deleted: safe });
}

async function handleDeckGetBrief(slug: string, res: ServerResponse) {
  const paths = deckPaths(slug);
  if (!(await exists(paths.brief))) { json(res, { error: 'not found' }, 404); return; }
  const content = await readFile(paths.brief, 'utf-8');
  json(res, JSON.parse(content));
}

async function handleDeckPostBrief(slug: string, req: IncomingMessage, res: ServerResponse) {
  const paths = deckPaths(slug);
  await ensureDir(paths.generated);
  const body = await collectBody(req);
  const parsed = JSON.parse(body.toString('utf-8'));
  await writeFile(paths.brief, JSON.stringify(parsed, null, 2), 'utf-8');
  json(res, { ok: true });
}

async function handleDeckListAssets(slug: string, res: ServerResponse) {
  const paths = deckPaths(slug);
  await ensureDir(paths.assets);
  const entries = await readdir(paths.assets, { withFileTypes: true });
  const files = entries.filter(e => e.isFile()).map(e => e.name);
  json(res, { assets: files });
}

async function handleDeckUploadAsset(slug: string, req: IncomingMessage, res: ServerResponse) {
  const paths = deckPaths(slug);
  await ensureDir(paths.assets);
  const { filename, data } = await parseMultipart(req);
  const safe = sanitize(filename);
  await writeFile(resolve(paths.assets, safe), data);
  json(res, { filename: safe }, 201);
}

async function handleDeckGetAsset(slug: string, name: string, res: ServerResponse) {
  const paths = deckPaths(slug);
  const safe = sanitize(name);
  const target = resolve(paths.assets, safe);
  if (!(await exists(target))) { json(res, { error: 'not found' }, 404); return; }
  const data = await readFile(target);
  res.writeHead(200, { 'Content-Type': mimeForExt(extname(safe)) });
  res.end(data);
}

async function handleDeckDeleteAsset(slug: string, name: string, res: ServerResponse) {
  const paths = deckPaths(slug);
  const safe = sanitize(name);
  const target = resolve(paths.assets, safe);
  if (!(await exists(target))) { json(res, { error: 'not found' }, 404); return; }
  await unlink(target);
  json(res, { deleted: safe });
}

async function handleDeckStatus(slug: string, res: ServerResponse) {
  const paths = deckPaths(slug);
  let hasFiles = false;
  if (await exists(paths.data)) {
    const entries = await readdir(paths.data, { withFileTypes: true });
    hasFiles = entries.some(e => e.isFile() && !e.name.startsWith('.'));
  }
  let hasBrief = false;
  if (await exists(paths.brief)) {
    try {
      const raw = await readFile(paths.brief, 'utf-8');
      const data = JSON.parse(raw);
      hasBrief = !!(data.audience && data.goal);
    } catch { hasBrief = false; }
  }
  const hasDeck = await exists(paths.slides);
  json(res, { hasFiles, hasBrief, hasDeck });
}

async function handleDeckGetSlides(slug: string, res: ServerResponse) {
  const paths = deckPaths(slug);
  if (!(await exists(paths.slides))) { json(res, { error: 'not found' }, 404); return; }
  const content = await readFile(paths.slides, 'utf-8');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(content);
}

// --- Plugin ---

export function studioApiPlugin(): Plugin {
  return {
    name: 'studio-api',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? '';
        const method = req.method ?? 'GET';

        if (!url.startsWith('/__api/')) { next(); return; }

        try {
          // /__api/decks — list or create
          if (url === '/__api/decks') {
            if (method === 'GET') { await handleListDecks(res); return; }
            if (method === 'POST') { await handleCreateDeck(req, res); return; }
          }

          // All other routes are /__api/decks/:slug/...
          const deckMatch = url.match(/^\/__api\/decks\/([^/]+)(\/.*)?$/);
          if (!deckMatch) { json(res, { error: 'not found' }, 404); return; }

          const slug = decodeURIComponent(deckMatch[1]);
          const subpath = deckMatch[2] ?? '';

          // DELETE /__api/decks/:slug (no subpath)
          if (!subpath && method === 'DELETE') {
            await handleDeleteDeck(slug, res);
            return;
          }

          // /__api/decks/:slug/files
          if (subpath === '/files') {
            if (method === 'GET') { await handleDeckListFiles(slug, res); return; }
            if (method === 'POST') { await handleDeckUploadFile(slug, req, res); return; }
          }
          const filesMatch = subpath.match(/^\/files\/(.+)$/);
          if (filesMatch && method === 'DELETE') {
            await handleDeckDeleteFile(slug, decodeURIComponent(filesMatch[1]), res);
            return;
          }

          // /__api/decks/:slug/brief
          if (subpath === '/brief') {
            if (method === 'GET') { await handleDeckGetBrief(slug, res); return; }
            if (method === 'POST') { await handleDeckPostBrief(slug, req, res); return; }
          }

          // /__api/decks/:slug/assets
          if (subpath === '/assets') {
            if (method === 'GET') { await handleDeckListAssets(slug, res); return; }
            if (method === 'POST') { await handleDeckUploadAsset(slug, req, res); return; }
          }
          const assetsMatch = subpath.match(/^\/assets\/(.+)$/);
          if (assetsMatch) {
            const name = decodeURIComponent(assetsMatch[1]);
            if (method === 'GET') { await handleDeckGetAsset(slug, name, res); return; }
            if (method === 'DELETE') { await handleDeckDeleteAsset(slug, name, res); return; }
          }

          // /__api/decks/:slug/status
          if (subpath === '/status' && method === 'GET') {
            await handleDeckStatus(slug, res);
            return;
          }

          // /__api/decks/:slug/slides
          if (subpath === '/slides' && method === 'GET') {
            await handleDeckGetSlides(slug, res);
            return;
          }

          json(res, { error: 'not found' }, 404);
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Internal server error';
          json(res, { error: message }, 500);
        }
      });
    },
  };
}
```

Keep the utility functions (`sanitize`, `collectBody`, `json`, `mimeForExt`, `parseMultipart`, `ensureDir`, `exists`) exactly as they are in the current file — just copy them into the new file unchanged.

**Step 2: Verify the plugin compiles**

Run: `pnpm --filter @slidemason/studio build 2>&1 | tail -5`
Expected: Build succeeds (the plugin is server-only, used at dev time).

**Step 3: Commit**

```bash
git add apps/studio/vite-plugin-studio-api.ts
git commit -m "feat: rewrite vite plugin with deck-scoped API endpoints"
```

---

### Task 4: Update hooks to accept a deck slug parameter

All hooks (`useFiles`, `useBrief`, `useAssets`) need to call deck-scoped endpoints.

**Files:**
- Modify: `apps/studio/src/hooks/useFiles.ts`
- Modify: `apps/studio/src/hooks/useBrief.ts`
- Modify: `apps/studio/src/hooks/useAssets.ts`

**Step 1: Update useFiles.ts**

Change the hook signature to accept `slug`:

```tsx
export function useFiles(slug: string | null) {
  const [files, setFiles] = useState<FileEntry[]>([]);

  const refresh = useCallback(async () => {
    if (!slug) { setFiles([]); return; }
    try {
      const res = await fetch(`/__api/decks/${encodeURIComponent(slug)}/files`);
      const data = await res.json();
      const raw: string[] = data.files ?? [];
      setFiles(raw.map(name => ({
        name,
        ext: name.includes('.') ? name.slice(name.lastIndexOf('.')) : '',
      })));
    } catch { setFiles([]); }
  }, [slug]);

  const upload = useCallback(async (fileList: FileList) => {
    if (!slug) return;
    const formData = new FormData();
    for (const file of fileList) formData.append('files', file);
    await fetch(`/__api/decks/${encodeURIComponent(slug)}/files`, { method: 'POST', body: formData });
    await refresh();
  }, [slug, refresh]);

  const remove = useCallback(async (name: string) => {
    if (!slug) return;
    await fetch(`/__api/decks/${encodeURIComponent(slug)}/files/${encodeURIComponent(name)}`, { method: 'DELETE' });
    await refresh();
  }, [slug, refresh]);

  useEffect(() => { refresh(); }, [refresh]);

  return { files, upload, remove, refresh };
}
```

**Step 2: Update useBrief.ts** — same pattern, prefix all URLs with `/__api/decks/${slug}/`

**Step 3: Update useAssets.ts** — same pattern

**Step 4: Commit**

```bash
git add apps/studio/src/hooks/
git commit -m "feat: scope hooks to deck slug for multi-deck support"
```

---

### Task 5: Create the useDecks hook

New hook for listing, creating, and deleting decks.

**Files:**
- Create: `apps/studio/src/hooks/useDecks.ts`

**Step 1: Write the hook**

```tsx
import { useState, useEffect, useCallback } from 'react';

export interface DeckEntry {
  slug: string;
  title: string;
  theme: string;
  slideCount: number;
  lastModified: string;
}

export function useDecks() {
  const [decks, setDecks] = useState<DeckEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/__api/decks');
      const data = await res.json();
      setDecks(data.decks ?? []);
    } catch {
      setDecks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (name: string): Promise<string> => {
    const res = await fetch('/__api/decks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    await refresh();
    return data.slug;
  }, [refresh]);

  const remove = useCallback(async (slug: string) => {
    await fetch(`/__api/decks/${encodeURIComponent(slug)}`, { method: 'DELETE' });
    await refresh();
  }, [refresh]);

  useEffect(() => { refresh(); }, [refresh]);

  return { decks, loading, create, remove, refresh };
}
```

**Step 2: Commit**

```bash
git add apps/studio/src/hooks/useDecks.ts
git commit -m "feat: add useDecks hook for deck listing and lifecycle"
```

---

### Task 6: Build the DeckGallery component

The landing page grid of deck cards.

**Files:**
- Create: `apps/studio/src/components/DeckGallery.tsx`

**Step 1: Write the component**

```tsx
import { useState } from 'react';
import type { DeckEntry } from '../hooks/useDecks';

interface DeckGalleryProps {
  decks: DeckEntry[];
  loading: boolean;
  onOpen: (slug: string) => void;
  onCreate: (name: string) => void;
  onDelete: (slug: string) => void;
}

export function DeckGallery({ decks, loading, onOpen, onCreate, onDelete }: DeckGalleryProps) {
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleCreate = () => {
    if (!newName.trim()) return;
    onCreate(newName.trim());
    setNewName('');
    setShowNew(false);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100vw', height: '100vh', backgroundColor: '#09090b', color: '#71717a' }}>
        Loading…
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#09090b', color: '#fafafa', padding: 'clamp(2rem, 5vw, 4rem)' }}>
      <header style={{ marginBottom: 'clamp(2rem, 4vh, 3rem)' }}>
        <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
          Slidemason
        </h1>
        <p style={{ color: '#71717a', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          {decks.length} deck{decks.length !== 1 ? 's' : ''}
        </p>
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 'clamp(1rem, 2vw, 1.5rem)',
      }}>
        {/* Existing deck cards */}
        {decks.map((deck) => (
          <div
            key={deck.slug}
            onClick={() => onOpen(deck.slug)}
            style={{
              position: 'relative',
              padding: 'clamp(1.25rem, 2vw, 1.75rem)',
              borderRadius: '16px',
              backgroundColor: 'rgba(39,39,42,0.5)',
              border: '1px solid rgba(63,63,70,0.5)',
              cursor: 'pointer',
              transition: 'border-color 0.2s, transform 0.2s',
              minHeight: '160px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(63,63,70,0.5)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* Three-dot menu */}
            <button
              onClick={(e) => { e.stopPropagation(); setConfirmDelete(deck.slug); }}
              style={{
                position: 'absolute', top: '12px', right: '12px',
                background: 'none', border: 'none', color: '#71717a',
                cursor: 'pointer', fontSize: '1.2rem', padding: '4px',
              }}
              aria-label="Delete deck"
            >
              ···
            </button>

            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.25rem' }}>
                {deck.title}
              </h2>
              <p style={{ color: '#71717a', fontSize: '0.8rem', margin: 0 }}>
                {deck.slideCount} slide{deck.slideCount !== 1 ? 's' : ''}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
              <span style={{
                width: '12px', height: '12px', borderRadius: '50%',
                background: 'var(--sm-primary, rgba(139,92,246,0.6))',
                display: 'inline-block',
              }} />
              <span style={{ color: '#52525b', fontSize: '0.75rem' }}>
                {deck.lastModified ? new Date(deck.lastModified).toLocaleDateString() : ''}
              </span>
            </div>

            {/* Delete confirmation */}
            {confirmDelete === deck.slug && (
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: 'absolute', inset: 0, borderRadius: '16px',
                  backgroundColor: 'rgba(9,9,11,0.95)', display: 'flex',
                  flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                }}
              >
                <p style={{ color: '#a1a1aa', fontSize: '0.85rem' }}>Delete "{deck.title}"?</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => { onDelete(deck.slug); setConfirmDelete(null); }}
                    style={{
                      padding: '6px 16px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.4)',
                      backgroundColor: 'rgba(239,68,68,0.15)', color: '#f87171', cursor: 'pointer', fontSize: '0.8rem',
                    }}
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setConfirmDelete(null)}
                    style={{
                      padding: '6px 16px', borderRadius: '8px', border: '1px solid rgba(63,63,70,0.5)',
                      backgroundColor: 'transparent', color: '#a1a1aa', cursor: 'pointer', fontSize: '0.8rem',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* New Deck card */}
        {!showNew ? (
          <div
            onClick={() => setShowNew(true)}
            style={{
              padding: 'clamp(1.25rem, 2vw, 1.75rem)',
              borderRadius: '16px',
              border: '2px dashed rgba(63,63,70,0.5)',
              cursor: 'pointer',
              minHeight: '160px',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: '0.5rem', color: '#52525b',
              transition: 'border-color 0.2s, color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)';
              e.currentTarget.style.color = '#a1a1aa';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(63,63,70,0.5)';
              e.currentTarget.style.color = '#52525b';
            }}
          >
            <span style={{ fontSize: '2rem', lineHeight: 1 }}>+</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>New Deck</span>
          </div>
        ) : (
          <div style={{
            padding: 'clamp(1.25rem, 2vw, 1.75rem)',
            borderRadius: '16px',
            backgroundColor: 'rgba(39,39,42,0.5)',
            border: '1px solid rgba(139,92,246,0.4)',
            minHeight: '160px',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.75rem',
          }}>
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') setShowNew(false); }}
              placeholder="Deck name…"
              style={{
                background: 'rgba(24,24,27,0.8)', border: '1px solid rgba(63,63,70,0.5)',
                borderRadius: '8px', padding: '10px 12px', color: '#fafafa', fontSize: '0.9rem',
                outline: 'none', width: '100%', boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={handleCreate}
                style={{
                  flex: 1, padding: '8px', borderRadius: '8px',
                  backgroundColor: 'rgba(139,92,246,0.3)', color: '#c4b5fd',
                  border: '1px solid rgba(139,92,246,0.4)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                }}
              >
                Create
              </button>
              <button
                onClick={() => { setShowNew(false); setNewName(''); }}
                style={{
                  padding: '8px 12px', borderRadius: '8px',
                  backgroundColor: 'transparent', color: '#71717a',
                  border: '1px solid rgba(63,63,70,0.5)', cursor: 'pointer', fontSize: '0.8rem',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add apps/studio/src/components/DeckGallery.tsx
git commit -m "feat: add DeckGallery component with cards, create, and delete"
```

---

### Task 7: Wire up App.tsx with gallery mode and deck state

This is the integration task — App.tsx gains gallery/editor switching, URL hash routing, and passes deck slug to all hooks.

**Files:**
- Modify: `apps/studio/src/App.tsx`

**Step 1: Rewrite App.tsx**

The key changes:
1. Add `activeDeck` state (synced to `window.location.hash`)
2. When `activeDeck` is null and mode is `dev`, show `DeckGallery`
3. When `activeDeck` is set, show the current editor (sidebar + viewer)
4. Pass `activeDeck` to all hooks
5. The slide import becomes dynamic — for now, keep the static import as fallback and add a TODO for dynamic loading

```tsx
import { useState, useEffect, useCallback } from 'react';
import { DeckProvider, SlideRenderer } from '@slidemason/renderer';
import { getMode } from './lib/mode';
import slides from './slides';
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
import { DeckGallery } from './components/DeckGallery';
import { useFiles } from './hooks/useFiles';
import { useBrief } from './hooks/useBrief';
import { useAssets } from './hooks/useAssets';
import { useDecks } from './hooks/useDecks';

function getHashDeck(): string | null {
  const hash = window.location.hash.slice(1);
  return hash || null;
}

export function App() {
  const mode = getMode();
  const [activeDeck, setActiveDeck] = useState<string | null>(getHashDeck);
  // ... rest of state (theme, headingFont, bodyFont, showNextSteps, openStep, stepError) stays the same

  // Sync hash ↔ activeDeck
  useEffect(() => {
    const handler = () => setActiveDeck(getHashDeck());
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const openDeck = useCallback((slug: string) => {
    window.location.hash = slug;
    setActiveDeck(slug);
  }, []);

  const closeDeck = useCallback(() => {
    window.location.hash = '';
    setActiveDeck(null);
  }, []);

  // Hooks now scoped to active deck
  const { files, upload: uploadFiles, remove: removeFile } = useFiles(activeDeck);
  const { brief, setBrief, save: saveBrief } = useBrief(activeDeck);
  const { assets, upload: uploadAssets, remove: removeAsset } = useAssets(activeDeck);
  const { decks, loading: decksLoading, create: createDeck, remove: deleteDeck } = useDecks();

  // ... validateStep, handleNext, handleThemeChange, etc. stay the same
  // ... useEffect for fonts, theme sync stays the same

  // PDF mode: just slides, no chrome
  if (mode === 'pdf') {
    return (
      <DeckProvider slideCount={slides.length} theme={theme}>
        <SlideRenderer slides={slides} />
      </DeckProvider>
    );
  }

  // Dev mode: gallery or editor
  if (mode === 'dev') {
    // Gallery view when no deck is selected
    if (!activeDeck) {
      return (
        <DeckGallery
          decks={decks}
          loading={decksLoading}
          onOpen={openDeck}
          onCreate={async (name) => {
            const slug = await createDeck(name);
            openDeck(slug);
          }}
          onDelete={deleteDeck}
        />
      );
    }

    // Editor view (existing sidebar + viewer)
    return (
      <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
        <Sidebar>
          {/* Back button at top */}
          <div style={{ padding: '0 0 8px', borderBottom: '1px solid rgba(63,63,70,0.3)', marginBottom: '8px' }}>
            <button
              onClick={closeDeck}
              style={{
                background: 'none', border: 'none', color: '#a1a1aa',
                cursor: 'pointer', fontSize: '0.8rem', padding: '4px 0',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}
            >
              ← All Decks
            </button>
          </div>

          {/* ... rest of CollapsibleSections identical to current code ... */}
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

  // Web mode: unchanged
  return (
    <DeckProvider slideCount={slides.length} theme={theme}>
      <SlideRenderer slides={slides} />
      <FloatingThemePicker activeTheme={theme} onSelectTheme={setTheme} />
      <SlideThumbnails />
      <TableOfContents />
    </DeckProvider>
  );
}
```

Note: The slides are still statically imported from `./slides` for now. Dynamic slide loading is Task 8.

**Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: Clean (hooks now accept `string | null`, components accept the new props).

**Step 3: Manual test**

Run: `pnpm dev` from `apps/studio/`
Expected:
- Landing page shows the gallery with the saberalert deck card + New Deck button
- Clicking saberalert opens the editor with back arrow
- Clicking back arrow returns to gallery
- Creating a new deck creates a folder and opens editor
- URL hash updates (#saberalert, empty for gallery)

**Step 4: Commit**

```bash
git add apps/studio/src/App.tsx apps/studio/src/components/DeckGallery.tsx apps/studio/src/hooks/
git commit -m "feat: wire up gallery mode with deck switching and URL hash routing"
```

---

### Task 8: Clean up old root-level data/generated directories

After confirming multi-deck works, remove the old single-deck files.

**Files:**
- Remove: `data/SaberAlert_MVP.pdf` (already copied to decks/)
- Remove: `data/example/` (seed data, no longer needed)
- Remove: `generated/brief.json` (already copied to decks/)
- Keep: `data/assets/` if it has user content (check first)
- Modify: `apps/studio/src/slides.tsx` — make it a simple placeholder
- Modify: `CLAUDE.md` — update instructions to reference `decks/` structure

**Step 1: Update CLAUDE.md**

Update the "What This Project Is" table to mention `decks/` instead of `data/` and `generated/`. Update the "How to Generate a Presentation" section to reference `decks/<slug>/data/` and `decks/<slug>/generated/brief.json`. Update "Step 4: Write the Slides" to say the file is `decks/<slug>/slides.tsx`.

**Step 2: Make slides.tsx a fallback placeholder**

Replace `apps/studio/src/slides.tsx` with:

```tsx
import { TitleSlide } from '@slidemason/components';

const slides = [
  <TitleSlide key="s1" title="Welcome to Slidemason" subtitle="Select a deck from the gallery to get started" gradient="blue-purple" />,
];

export default slides;
```

**Step 3: Commit**

```bash
git add -A
git commit -m "chore: clean up old single-deck structure, update CLAUDE.md for multi-deck"
```

---

## Summary

| Task | What | Files |
|---|---|---|
| 1 | Screenshot-to-clipboard button | `SlideRenderer.tsx` |
| 2 | Create `decks/` directory structure | `decks/saberalert/` |
| 3 | Rewrite Vite API plugin | `vite-plugin-studio-api.ts` |
| 4 | Scope hooks to deck slug | `useFiles.ts`, `useBrief.ts`, `useAssets.ts` |
| 5 | Create useDecks hook | `useDecks.ts` |
| 6 | Build DeckGallery component | `DeckGallery.tsx` |
| 7 | Wire up App.tsx gallery/editor modes | `App.tsx` |
| 8 | Clean up old files, update CLAUDE.md | Various |
