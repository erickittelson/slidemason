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

/**
 * Tracks file paths recently edited via the studio API.
 * The HMR handler in vite.config.ts checks this to avoid
 * triggering a full reload when the edit came from inline editing
 * (the DOM already has the updated content).
 */
export const recentApiEdits = new Set<string>();

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
  const placeholderSlides = `import { motion } from 'framer-motion';

const fade = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
};

const slides = [
  <div key="s1" className="flex flex-1 flex-col items-center justify-center text-center" style={{ padding: 'clamp(2rem, 5vw, 5rem)' }}>
    <motion.h1
      {...fade}
      className="font-extrabold"
      style={{
        fontSize: 'clamp(3rem, 8vw, 6rem)',
        background: 'linear-gradient(135deg, var(--sm-primary), var(--sm-secondary))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        lineHeight: 1.1,
      }}
    >
      New Deck
    </motion.h1>
  </div>,
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

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function handleEditSlides(slug: string, req: IncomingMessage, res: ServerResponse) {
  const paths = deckPaths(slug);
  if (!(await exists(paths.slides))) {
    json(res, { error: 'slides.tsx not found' }, 404);
    return;
  }

  const body = await collectBody(req);
  const { type, oldText, newText, oldValue, newValue, context, direction, elementText } = JSON.parse(
    body.toString('utf-8'),
  );

  let content = await readFile(paths.slides, 'utf-8');

  if (type === 'text' && oldText && newText) {
    // Whitespace-flexible replacement: convert old text to a regex that
    // matches regardless of whitespace differences between source and DOM
    const words = oldText.split(/\s+/).filter(Boolean);
    if (words.length > 0) {
      const pattern = words.map((w: string) => escapeRegex(w)).join('\\s+');
      const regex = new RegExp(pattern);
      if (regex.test(content)) {
        content = content.replace(regex, newText);
      } else {
        // Fallback: exact match
        content = content.replace(oldText, newText);
      }
    }
  } else if (type === 'color' && oldValue && newValue) {
    if (context) {
      // Find the context text to scope the replacement
      const contextWords = context.split(/\s+/).filter(Boolean).slice(0, 5);
      if (contextWords.length > 0) {
        const contextPattern = contextWords.map((w: string) => escapeRegex(w)).join('\\s+');
        const contextMatch = content.match(new RegExp(contextPattern));
        if (contextMatch && contextMatch.index != null) {
          // Replace oldValue with newValue only near the context
          const start = Math.max(0, contextMatch.index - 300);
          const end = Math.min(content.length, contextMatch.index + contextMatch[0].length + 300);
          const section = content.substring(start, end);
          const newSection = section.replace(oldValue, newValue);
          content = content.substring(0, start) + newSection + content.substring(end);
        }
      }
    } else {
      // No context — replace first occurrence globally
      content = content.replace(oldValue, newValue);
    }
  } else if (type === 'reorder' && elementText && direction) {
    // Find lines containing the element text, then swap with adjacent sibling
    const words = elementText.split(/\s+/).filter(Boolean).slice(0, 8);
    if (words.length > 0) {
      const pattern = words.map((w: string) => escapeRegex(w)).join('\\s+');
      const match = content.match(new RegExp(pattern));
      if (match && match.index != null) {
        // Find enclosing JSX element by walking lines
        const lines = content.split('\n');
        const matchLineNum = content.substring(0, match.index).split('\n').length - 1;

        // Walk up to find element start (opening tag line)
        let startLine = matchLineNum;
        for (let l = matchLineNum; l >= 0; l--) {
          const trimmed = lines[l].trim();
          if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.startsWith('{/*')) {
            startLine = l;
            break;
          }
        }

        // Walk down to find element end (look for matching depth)
        let endLine = matchLineNum;
        let depth = 0;
        for (let l = startLine; l < lines.length; l++) {
          const line = lines[l];
          // Count opening and closing tags
          const opens = (line.match(/<[A-Za-z]/g) || []).length;
          const closes = (line.match(/<\//g) || []).length;
          const selfCloses = (line.match(/\/>/g) || []).length;
          depth += opens - closes - selfCloses;
          if (depth <= 0 && l > startLine) {
            endLine = l;
            break;
          }
          if (l === lines.length - 1) endLine = l;
        }

        // We'll do a simple line-block swap
        const elementLines = lines.slice(startLine, endLine + 1);

        if (direction === 'up' && startLine > 0) {
          // Find previous sibling element
          let prevEnd = startLine - 1;
          while (prevEnd >= 0 && lines[prevEnd].trim() === '') prevEnd--;
          if (prevEnd >= 0) {
            let prevStart = prevEnd;
            for (let l = prevEnd; l >= 0; l--) {
              const trimmed = lines[l].trim();
              if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.startsWith('{/*')) {
                prevStart = l;
                break;
              }
            }
            const prevLines = lines.slice(prevStart, prevEnd + 1);
            const newLines = [
              ...lines.slice(0, prevStart),
              ...elementLines,
              ...prevLines,
              ...lines.slice(endLine + 1),
            ];
            content = newLines.join('\n');
          }
        } else if (direction === 'down' && endLine < lines.length - 1) {
          // Find next sibling element
          let nextStart = endLine + 1;
          while (nextStart < lines.length && lines[nextStart].trim() === '') nextStart++;
          if (nextStart < lines.length) {
            let nextEnd = nextStart;
            let d = 0;
            for (let l = nextStart; l < lines.length; l++) {
              const line = lines[l];
              const o = (line.match(/<[A-Za-z]/g) || []).length;
              const c = (line.match(/<\//g) || []).length;
              const sc = (line.match(/\/>/g) || []).length;
              d += o - c - sc;
              if (d <= 0 && l > nextStart) { nextEnd = l; break; }
              if (l === lines.length - 1) nextEnd = l;
            }
            const nextLines = lines.slice(nextStart, nextEnd + 1);
            const newLines = [
              ...lines.slice(0, startLine),
              ...nextLines,
              ...elementLines,
              ...lines.slice(nextEnd + 1),
            ];
            content = newLines.join('\n');
          }
        }
      }
    }
  } else if (type === 'delete' && elementText) {
    const words = elementText.split(/\s+/).filter(Boolean).slice(0, 8);
    if (words.length > 0) {
      const pattern = words.map((w: string) => escapeRegex(w)).join('\\s+');
      const match = content.match(new RegExp(pattern));
      if (match && match.index != null) {
        const lines = content.split('\n');
        const matchLineNum = content.substring(0, match.index).split('\n').length - 1;

        // Walk up to find element start
        let startLine = matchLineNum;
        for (let l = matchLineNum; l >= 0; l--) {
          const trimmed = lines[l].trim();
          if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.startsWith('{/*')) {
            startLine = l;
            break;
          }
        }

        // Walk down to find element end
        let endLine = matchLineNum;
        let depth = 0;
        for (let l = startLine; l < lines.length; l++) {
          const line = lines[l];
          const opens = (line.match(/<[A-Za-z]/g) || []).length;
          const closes = (line.match(/<\//g) || []).length;
          const selfCloses = (line.match(/\/>/g) || []).length;
          depth += opens - closes - selfCloses;
          if (depth <= 0 && l > startLine) {
            endLine = l;
            break;
          }
          if (l === lines.length - 1) endLine = l;
        }

        // Remove the element lines (and trailing blank lines)
        let removeEnd = endLine + 1;
        while (removeEnd < lines.length && lines[removeEnd].trim() === '') removeEnd++;

        lines.splice(startLine, removeEnd - startLine);
        content = lines.join('\n');
      }
    }
  }

  // Mark as API edit so HMR handler skips the full reload
  recentApiEdits.add(paths.slides);
  setTimeout(() => recentApiEdits.delete(paths.slides), 2000);

  await writeFile(paths.slides, content, 'utf-8');
  json(res, { ok: true });
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
            if (rest === '/slides') {
              if (method === 'GET') {
                await handleGetSlides(slug, res);
                return;
              }
            }

            // /__api/decks/:slug/slides/edit
            if (rest === '/slides/edit' && method === 'POST') {
              await handleEditSlides(slug, req, res);
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
