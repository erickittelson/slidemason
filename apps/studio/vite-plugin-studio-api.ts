/**
 * Vite dev-server middleware plugin for Slidemason Studio.
 *
 * Exposes a small REST-ish API under `/__api/` so the browser-based
 * Studio UI can read/write project files without a separate backend.
 *
 * All file operations are scoped to decks under `MONO_ROOT/decks/:slug/`.
 */

import { resolve, basename, extname } from 'node:path';
import {
  readdir,
  readFile,
  writeFile,
  unlink,
  mkdir,
  stat,
  rm,
} from 'node:fs/promises';
import type { Plugin, ViteDevServer } from 'vite';
import type { IncomingMessage, ServerResponse } from 'node:http';
import Busboy from 'busboy';

/* ------------------------------------------------------------------ */
/*  Path helpers – all relative to the monorepo root                   */
/* ------------------------------------------------------------------ */

const MONO_ROOT = resolve(import.meta.dirname, '../..');
const DECKS_DIR = resolve(MONO_ROOT, 'decks');

/** Return all relevant paths for a given deck slug. */
function deckPaths(slug: string) {
  const root = resolve(DECKS_DIR, slug);
  const data = resolve(root, 'data');
  const assets = resolve(root, 'data/assets');
  const generated = resolve(root, 'generated');
  const brief = resolve(root, 'generated/brief.json');
  const slides = resolve(root, 'slides.tsx');
  return { root, data, assets, generated, brief, slides };
}

/** Convert a human-readable name into a URL-safe slug. */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/* ------------------------------------------------------------------ */
/*  Utilities                                                          */
/* ------------------------------------------------------------------ */

/** Strip path components and replace unsafe chars. */
function sanitize(raw: string): string {
  const base = basename(raw);
  return base.replace(/[^a-zA-Z0-9._-]/g, '_');
}

/** Collect the entire request body into a Buffer. */
function collectBody(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (c: Buffer) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

/** Send a JSON response. */
function json(res: ServerResponse, data: unknown, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

/** Simple MIME lookup by extension. */
function mimeForExt(ext: string): string {
  const map: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.pdf': 'application/pdf',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.json': 'application/json',
    '.txt': 'text/plain',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.html': 'text/html',
    '.md': 'text/markdown',
    '.mdx': 'text/markdown',
  };
  return map[ext.toLowerCase()] ?? 'application/octet-stream';
}

/** Parse a multipart upload and return { filename, data } for the first file field. */
function parseMultipart(
  req: IncomingMessage,
): Promise<{ filename: string; data: Buffer }> {
  return new Promise((resolve, reject) => {
    const bb = Busboy({ headers: req.headers });
    let resolved = false;

    bb.on('file', (_fieldname, stream, info) => {
      const chunks: Buffer[] = [];
      stream.on('data', (c: Buffer) => chunks.push(c));
      stream.on('end', () => {
        if (!resolved) {
          resolved = true;
          resolve({ filename: info.filename, data: Buffer.concat(chunks) });
        }
      });
    });

    bb.on('error', reject);
    bb.on('close', () => {
      if (!resolved) reject(new Error('No file field found in multipart body'));
    });

    req.pipe(bb);
  });
}

/** Ensure a directory exists. */
async function ensureDir(dir: string) {
  await mkdir(dir, { recursive: true });
}

/** Check if a path exists. */
async function exists(p: string): Promise<boolean> {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ */
/*  Deck-level handlers                                                */
/* ------------------------------------------------------------------ */

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
    if (await exists(paths.brief)) {
      try {
        const raw = await readFile(paths.brief, 'utf-8');
        const data = JSON.parse(raw);
        if (data.title) title = data.title;
        if (data.theme) theme = data.theme;
      } catch {
        // ignore parse errors
      }
    }

    let slideCount = 0;
    if (await exists(paths.slides)) {
      try {
        const content = await readFile(paths.slides, 'utf-8');
        const matches = content.match(/key="/g);
        slideCount = matches ? matches.length : 0;
      } catch {
        // ignore read errors
      }
    }

    let lastModified: string | null = null;
    try {
      const s = await stat(paths.root);
      lastModified = s.mtime.toISOString();
    } catch {
      // ignore
    }

    decks.push({ slug, title, theme, slideCount, lastModified });
  }

  json(res, decks);
}

async function handleCreateDeck(req: IncomingMessage, res: ServerResponse) {
  const body = await collectBody(req);
  const { name } = JSON.parse(body.toString('utf-8'));
  if (!name || typeof name !== 'string') {
    json(res, { error: 'name is required' }, 400);
    return;
  }

  const slug = slugify(name);
  if (!slug) {
    json(res, { error: 'invalid name' }, 400);
    return;
  }

  const paths = deckPaths(slug);
  await ensureDir(paths.data);
  await ensureDir(paths.assets);
  await ensureDir(paths.generated);

  // Default brief
  const defaultBrief = {
    title: name,
    theme: 'midnight',
    fonts: { heading: 'Inter', body: 'Inter' },
  };
  await writeFile(paths.brief, JSON.stringify(defaultBrief, null, 2), 'utf-8');

  // Placeholder slides.tsx
  const placeholderSlides = `import { TitleSlide } from '@slidemason/components';

const slides = [
  <TitleSlide key="title" title="${name.replace(/"/g, '\\"')}" subtitle="" gradient="blue-purple" />,
];

export default slides;
`;
  await writeFile(paths.slides, placeholderSlides, 'utf-8');

  json(res, { slug, title: name }, 201);
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

/* ------------------------------------------------------------------ */
/*  Deck-scoped file handlers                                          */
/* ------------------------------------------------------------------ */

async function handleListFiles(slug: string, res: ServerResponse) {
  const paths = deckPaths(slug);
  await ensureDir(paths.data);
  const entries = await readdir(paths.data, { withFileTypes: true });
  const files = entries
    .filter((e) => e.isFile() && !e.name.startsWith('.'))
    .map((e) => e.name);
  json(res, { files });
}

async function handleUploadFile(slug: string, req: IncomingMessage, res: ServerResponse) {
  const paths = deckPaths(slug);
  await ensureDir(paths.data);
  const { filename, data } = await parseMultipart(req);
  const safe = sanitize(filename);
  await writeFile(resolve(paths.data, safe), data);
  json(res, { filename: safe }, 201);
}

async function handleDeleteFile(slug: string, name: string, res: ServerResponse) {
  const paths = deckPaths(slug);
  const safe = sanitize(name);
  const target = resolve(paths.data, safe);
  if (!(await exists(target))) {
    json(res, { error: 'not found' }, 404);
    return;
  }
  await unlink(target);
  json(res, { deleted: safe });
}

async function handleGetBrief(slug: string, res: ServerResponse) {
  const paths = deckPaths(slug);
  if (!(await exists(paths.brief))) {
    json(res, { error: 'brief.json not found' }, 404);
    return;
  }
  const content = await readFile(paths.brief, 'utf-8');
  json(res, JSON.parse(content));
}

async function handlePostBrief(slug: string, req: IncomingMessage, res: ServerResponse) {
  const paths = deckPaths(slug);
  await ensureDir(paths.generated);
  const body = await collectBody(req);
  // Validate that it's valid JSON before writing
  const parsed = JSON.parse(body.toString('utf-8'));
  await writeFile(paths.brief, JSON.stringify(parsed, null, 2), 'utf-8');
  json(res, { ok: true });
}

async function handleListAssets(slug: string, res: ServerResponse) {
  const paths = deckPaths(slug);
  await ensureDir(paths.assets);
  const entries = await readdir(paths.assets, { withFileTypes: true });
  const files = entries
    .filter((e) => e.isFile())
    .map((e) => e.name);
  json(res, { assets: files });
}

async function handleUploadAsset(slug: string, req: IncomingMessage, res: ServerResponse) {
  const paths = deckPaths(slug);
  await ensureDir(paths.assets);
  const { filename, data } = await parseMultipart(req);
  const safe = sanitize(filename);
  await writeFile(resolve(paths.assets, safe), data);
  json(res, { filename: safe }, 201);
}

async function handleDeleteAsset(slug: string, name: string, res: ServerResponse) {
  const paths = deckPaths(slug);
  const safe = sanitize(name);
  const target = resolve(paths.assets, safe);
  if (!(await exists(target))) {
    json(res, { error: 'not found' }, 404);
    return;
  }
  await unlink(target);
  json(res, { deleted: safe });
}

async function handleGetAsset(slug: string, name: string, res: ServerResponse) {
  const paths = deckPaths(slug);
  const safe = sanitize(name);
  const target = resolve(paths.assets, safe);
  if (!(await exists(target))) {
    json(res, { error: 'not found' }, 404);
    return;
  }
  const data = await readFile(target);
  const ext = extname(safe);
  res.writeHead(200, { 'Content-Type': mimeForExt(ext) });
  res.end(data);
}

async function handleStatus(slug: string, res: ServerResponse) {
  const paths = deckPaths(slug);

  const hasData = await exists(paths.data);
  let hasFiles = false;
  if (hasData) {
    const entries = await readdir(paths.data, { withFileTypes: true });
    // Ignore hidden files (.gitkeep, .DS_Store, etc.)
    hasFiles = entries.some((e) => e.isFile() && !e.name.startsWith('.'));
  }

  // Brief counts as "filled in" only if it has a non-empty title
  let hasBrief = false;
  if (await exists(paths.brief)) {
    try {
      const raw = await readFile(paths.brief, 'utf-8');
      const data = JSON.parse(raw);
      hasBrief = typeof data.title === 'string' && data.title.trim().length > 0;
    } catch {
      hasBrief = false;
    }
  }

  // A "deck" exists if slides.tsx exists and has content
  const hasDeck = await exists(paths.slides);

  json(res, { hasFiles, hasBrief, hasDeck });
}

async function handleGetSlides(slug: string, res: ServerResponse) {
  const paths = deckPaths(slug);
  if (!(await exists(paths.slides))) {
    json(res, { error: 'slides.tsx not found' }, 404);
    return;
  }
  const content = await readFile(paths.slides, 'utf-8');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(content);
}

/* ------------------------------------------------------------------ */
/*  Plugin                                                             */
/* ------------------------------------------------------------------ */

export function studioApiPlugin(): Plugin {
  return {
    name: 'studio-api',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? '';
        const method = req.method ?? 'GET';

        // Only handle /__api/ routes
        if (!url.startsWith('/__api/')) {
          next();
          return;
        }

        try {
          // /__api/decks — list all decks or create a new one
          if (url === '/__api/decks') {
            if (method === 'GET') {
              await handleListDecks(res);
              return;
            }
            if (method === 'POST') {
              await handleCreateDeck(req, res);
              return;
            }
          }

          // Deck-scoped routes: /__api/decks/:slug/...
          const deckMatch = url.match(/^\/__api\/decks\/([^/]+)(\/.*)?$/);
          if (deckMatch) {
            const slug = decodeURIComponent(deckMatch[1]);
            const rest = deckMatch[2] ?? '';

            // DELETE /__api/decks/:slug
            if (!rest && method === 'DELETE') {
              await handleDeleteDeck(slug, res);
              return;
            }

            // /__api/decks/:slug/files
            if (rest === '/files') {
              if (method === 'GET') {
                await handleListFiles(slug, res);
                return;
              }
              if (method === 'POST') {
                await handleUploadFile(slug, req, res);
                return;
              }
            }

            // /__api/decks/:slug/files/:name
            const filesMatch = rest.match(/^\/files\/(.+)$/);
            if (filesMatch && method === 'DELETE') {
              await handleDeleteFile(slug, decodeURIComponent(filesMatch[1]), res);
              return;
            }

            // /__api/decks/:slug/brief
            if (rest === '/brief') {
              if (method === 'GET') {
                await handleGetBrief(slug, res);
                return;
              }
              if (method === 'POST') {
                await handlePostBrief(slug, req, res);
                return;
              }
            }

            // /__api/decks/:slug/assets
            if (rest === '/assets') {
              if (method === 'GET') {
                await handleListAssets(slug, res);
                return;
              }
              if (method === 'POST') {
                await handleUploadAsset(slug, req, res);
                return;
              }
            }

            // /__api/decks/:slug/assets/:name
            const assetsMatch = rest.match(/^\/assets\/(.+)$/);
            if (assetsMatch) {
              const name = decodeURIComponent(assetsMatch[1]);
              if (method === 'GET') {
                await handleGetAsset(slug, name, res);
                return;
              }
              if (method === 'DELETE') {
                await handleDeleteAsset(slug, name, res);
                return;
              }
            }

            // /__api/decks/:slug/status
            if (rest === '/status' && method === 'GET') {
              await handleStatus(slug, res);
              return;
            }

            // /__api/decks/:slug/slides
            if (rest === '/slides' && method === 'GET') {
              await handleGetSlides(slug, res);
              return;
            }
          }

          // Unknown /__api route
          json(res, { error: 'not found' }, 404);
        } catch (err: unknown) {
          const message =
            err instanceof Error ? err.message : 'Internal server error';
          json(res, { error: message }, 500);
        }
      });
    },
  };
}
