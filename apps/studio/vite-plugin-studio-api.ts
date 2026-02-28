/**
 * Vite dev-server middleware plugin for Slidemason Studio.
 *
 * Exposes a small REST-ish API under `/__api/` so the browser-based
 * Studio UI can read/write project files without a separate backend.
 */

import { resolve, basename, extname } from 'node:path';
import {
  readdir,
  readFile,
  writeFile,
  unlink,
  mkdir,
  stat,
} from 'node:fs/promises';
import type { Plugin, ViteDevServer } from 'vite';
import type { IncomingMessage, ServerResponse } from 'node:http';
import Busboy from 'busboy';

/* ------------------------------------------------------------------ */
/*  Path helpers – all relative to the monorepo root                   */
/* ------------------------------------------------------------------ */

const MONO_ROOT = resolve(import.meta.dirname, '../..');
const DATA_DIR = resolve(MONO_ROOT, 'data');
const ASSETS_DIR = resolve(MONO_ROOT, 'data/assets');
const GENERATED_DIR = resolve(MONO_ROOT, 'generated');
const BRIEF_PATH = resolve(GENERATED_DIR, 'brief.json');

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
/*  Route handlers                                                     */
/* ------------------------------------------------------------------ */

async function handleListFiles(res: ServerResponse) {
  await ensureDir(DATA_DIR);
  const entries = await readdir(DATA_DIR, { withFileTypes: true });
  const files = entries
    .filter((e) => e.isFile())
    .map((e) => e.name);
  json(res, { files });
}

async function handleUploadFile(req: IncomingMessage, res: ServerResponse) {
  await ensureDir(DATA_DIR);
  const { filename, data } = await parseMultipart(req);
  const safe = sanitize(filename);
  await writeFile(resolve(DATA_DIR, safe), data);
  json(res, { filename: safe }, 201);
}

async function handleDeleteFile(name: string, res: ServerResponse) {
  const safe = sanitize(name);
  const target = resolve(DATA_DIR, safe);
  if (!(await exists(target))) {
    json(res, { error: 'not found' }, 404);
    return;
  }
  await unlink(target);
  json(res, { deleted: safe });
}

async function handleGetBrief(res: ServerResponse) {
  if (!(await exists(BRIEF_PATH))) {
    json(res, { error: 'brief.json not found' }, 404);
    return;
  }
  const content = await readFile(BRIEF_PATH, 'utf-8');
  json(res, JSON.parse(content));
}

async function handlePostBrief(req: IncomingMessage, res: ServerResponse) {
  await ensureDir(GENERATED_DIR);
  const body = await collectBody(req);
  // Validate that it's valid JSON before writing
  const parsed = JSON.parse(body.toString('utf-8'));
  await writeFile(BRIEF_PATH, JSON.stringify(parsed, null, 2), 'utf-8');
  json(res, { ok: true });
}

async function handleListAssets(res: ServerResponse) {
  await ensureDir(ASSETS_DIR);
  const entries = await readdir(ASSETS_DIR, { withFileTypes: true });
  const files = entries
    .filter((e) => e.isFile())
    .map((e) => e.name);
  json(res, { assets: files });
}

async function handleUploadAsset(req: IncomingMessage, res: ServerResponse) {
  await ensureDir(ASSETS_DIR);
  const { filename, data } = await parseMultipart(req);
  const safe = sanitize(filename);
  await writeFile(resolve(ASSETS_DIR, safe), data);
  json(res, { filename: safe }, 201);
}

async function handleDeleteAsset(name: string, res: ServerResponse) {
  const safe = sanitize(name);
  const target = resolve(ASSETS_DIR, safe);
  if (!(await exists(target))) {
    json(res, { error: 'not found' }, 404);
    return;
  }
  await unlink(target);
  json(res, { deleted: safe });
}

async function handleGetAsset(name: string, res: ServerResponse) {
  const safe = sanitize(name);
  const target = resolve(ASSETS_DIR, safe);
  if (!(await exists(target))) {
    json(res, { error: 'not found' }, 404);
    return;
  }
  const data = await readFile(target);
  const ext = extname(safe);
  res.writeHead(200, { 'Content-Type': mimeForExt(ext) });
  res.end(data);
}

async function handleStatus(res: ServerResponse) {
  const hasData = await exists(DATA_DIR);
  let hasFiles = false;
  if (hasData) {
    const entries = await readdir(DATA_DIR, { withFileTypes: true });
    hasFiles = entries.some((e) => e.isFile());
  }
  const hasBrief = await exists(BRIEF_PATH);

  // A "deck" exists if there is at least one .mdx file in generated/
  let hasDeck = false;
  if (await exists(GENERATED_DIR)) {
    const genEntries = await readdir(GENERATED_DIR, { withFileTypes: true });
    hasDeck = genEntries.some(
      (e) => e.isFile() && e.name.endsWith('.mdx'),
    );
  }

  json(res, { hasFiles, hasBrief, hasDeck });
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
          // /__api/status
          if (url === '/__api/status' && method === 'GET') {
            await handleStatus(res);
            return;
          }

          // /__api/brief
          if (url === '/__api/brief') {
            if (method === 'GET') {
              await handleGetBrief(res);
              return;
            }
            if (method === 'POST') {
              await handlePostBrief(req, res);
              return;
            }
          }

          // /__api/files
          if (url === '/__api/files') {
            if (method === 'GET') {
              await handleListFiles(res);
              return;
            }
            if (method === 'POST') {
              await handleUploadFile(req, res);
              return;
            }
          }

          // /__api/files/:name
          const filesMatch = url.match(/^\/__api\/files\/(.+)$/);
          if (filesMatch && method === 'DELETE') {
            await handleDeleteFile(decodeURIComponent(filesMatch[1]), res);
            return;
          }

          // /__api/assets (list / upload)
          if (url === '/__api/assets') {
            if (method === 'GET') {
              await handleListAssets(res);
              return;
            }
            if (method === 'POST') {
              await handleUploadAsset(req, res);
              return;
            }
          }

          // /__api/assets/:name
          const assetsMatch = url.match(/^\/__api\/assets\/(.+)$/);
          if (assetsMatch) {
            const name = decodeURIComponent(assetsMatch[1]);
            if (method === 'GET') {
              await handleGetAsset(name, res);
              return;
            }
            if (method === 'DELETE') {
              await handleDeleteAsset(name, res);
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
