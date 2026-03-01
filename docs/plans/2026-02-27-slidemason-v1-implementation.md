# Slidemason V1 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a local-first, open-source presentation builder that turns source material into polished decks via agentic coding workflows.

**Architecture:** pnpm monorepo with 6 packages (cli, core, renderer, components, themes, export) + 1 app (studio). Agent-driven content generation via prompt files. React 19 + Vite + MDX slide renderer. Playwright-based PDF export. CSS custom properties for theming.

**Tech Stack:** React 19, Vite, TypeScript, Tailwind CSS v4, MDX (@mdx-js/rollup), citty (CLI), Zod (schemas), Playwright (export), Vitest (testing), pnpm workspaces

---

## Phase 1: Project Scaffolding & Monorepo Setup

### Task 1: Initialize Git Repo and GitHub Remote

**Files:**
- Create: `slidemason/.gitignore`
- Create: `slidemason/LICENSE`
- Create: `slidemason/README.md`

**Step 1: Initialize local git repo**

```bash
cd /Users/erickittelson/qvl-code/slidemason
git init
```

**Step 2: Create .gitignore**

```gitignore
node_modules/
dist/
.turbo/
*.tsbuildinfo
.DS_Store
generated/
!generated/.gitkeep
data/*
!data/.gitkeep
!data/example/
.env
.env.*
```

**Step 3: Create LICENSE (MIT)**

Standard MIT license with `Eric Kittelson` and year `2026`.

**Step 4: Create README.md**

Minimal README with project name, one-line description, and "Under construction" note.

**Step 5: Create GitHub repo and push**

```bash
gh repo create erickittelson/slidemason --public --source=. --description "Local-first, open-source presentation builder powered by agentic coding workflows"
git add .
git commit -m "chore: initialize slidemason repo"
git push -u origin main
```

---

### Task 2: Configure pnpm Monorepo

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `tsconfig.json`
- Create: `tsconfig.base.json`

**Step 1: Create root package.json**

```json
{
  "name": "slidemason",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "description": "Local-first, open-source presentation builder powered by agentic coding workflows",
  "author": "Eric Kittelson",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/erickittelson/slidemason.git"
  },
  "engines": {
    "node": ">=22",
    "pnpm": ">=10"
  },
  "scripts": {
    "dev": "pnpm --filter @slidemason/studio dev",
    "build": "pnpm -r build",
    "test": "vitest run",
    "lint": "eslint .",
    "typecheck": "tsc --build"
  }
}
```

**Step 2: Create pnpm-workspace.yaml**

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

**Step 3: Create tsconfig.base.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "dist",
    "rootDir": "src"
  }
}
```

**Step 4: Create tsconfig.json (project references)**

```json
{
  "files": [],
  "references": [
    { "path": "packages/core" },
    { "path": "packages/components" },
    { "path": "packages/themes" },
    { "path": "packages/renderer" },
    { "path": "packages/cli" },
    { "path": "packages/export" },
    { "path": "apps/studio" }
  ]
}
```

**Step 5: Install root dev dependencies**

```bash
pnpm add -Dw typescript vitest eslint @eslint/js typescript-eslint
```

**Step 6: Commit**

```bash
git add .
git commit -m "chore: configure pnpm monorepo with TypeScript"
```

---

### Task 3: Scaffold All Package Directories

**Files:**
- Create: `packages/core/package.json`, `packages/core/tsconfig.json`, `packages/core/src/index.ts`
- Create: `packages/components/package.json`, `packages/components/tsconfig.json`, `packages/components/src/index.ts`
- Create: `packages/themes/package.json`, `packages/themes/tsconfig.json`, `packages/themes/src/index.ts`
- Create: `packages/renderer/package.json`, `packages/renderer/tsconfig.json`, `packages/renderer/src/index.ts`
- Create: `packages/cli/package.json`, `packages/cli/tsconfig.json`, `packages/cli/src/index.ts`
- Create: `packages/export/package.json`, `packages/export/tsconfig.json`, `packages/export/src/index.ts`
- Create: `apps/studio/package.json`, `apps/studio/tsconfig.json`, `apps/studio/index.html`, `apps/studio/src/main.tsx`

**Step 1: Create each package with minimal package.json**

Each package follows this pattern (example for core):

```json
{
  "name": "@slidemason/core",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "dependencies": {},
  "devDependencies": {
    "typescript": "catalog:"
  }
}
```

Package names:
- `@slidemason/core`
- `@slidemason/components`
- `@slidemason/themes`
- `@slidemason/renderer`
- `@slidemason/cli` (bin: `slidemason`)
- `@slidemason/export`
- `@slidemason/studio` (apps/studio — Vite app, not published)

**Step 2: Create each package's tsconfig.json**

Each extends `../../tsconfig.base.json` and references its dependencies.

**Step 3: Create placeholder src/index.ts in each**

```typescript
export {};
```

**Step 4: Create scaffold directories**

```bash
mkdir -p data generated prompts examples scripts
touch data/.gitkeep generated/.gitkeep
```

**Step 5: Run pnpm install to link workspaces**

```bash
pnpm install
```

**Step 6: Verify build**

```bash
pnpm build
```

**Step 7: Commit**

```bash
git add .
git commit -m "chore: scaffold all monorepo packages"
```

---

## Phase 2: Core Package — Schemas & Ingestion

### Task 4: Define Zod Schemas for Brief and Outline

**Files:**
- Create: `packages/core/src/schemas/brief.ts`
- Create: `packages/core/src/schemas/outline.ts`
- Create: `packages/core/src/schemas/manifest.ts`
- Create: `packages/core/src/schemas/deck-config.ts`
- Create: `packages/core/src/schemas/index.ts`
- Modify: `packages/core/src/index.ts`
- Test: `packages/core/src/__tests__/schemas.test.ts`

**Step 1: Install zod in core**

```bash
pnpm --filter @slidemason/core add zod
```

**Step 2: Write the failing test**

```typescript
// packages/core/src/__tests__/schemas.test.ts
import { describe, it, expect } from 'vitest';
import { BriefSchema, OutlineSchema, ManifestSchema } from '../schemas';

describe('BriefSchema', () => {
  it('validates a valid brief', () => {
    const brief = {
      title: 'Q2 Strategy Review',
      audience: 'executive leadership',
      goal: 'align on strategy and resource allocation',
      tone: 'clear, executive, persuasive',
      themes: ['growth', 'efficiency'],
      sources: [{ file: 'notes.md', type: 'markdown', summary: 'Meeting notes' }],
      constraints: ['15 slides max'],
    };
    expect(BriefSchema.parse(brief)).toEqual(brief);
  });

  it('rejects a brief missing required fields', () => {
    expect(() => BriefSchema.parse({})).toThrow();
  });
});

describe('OutlineSchema', () => {
  it('validates a valid outline', () => {
    const outline = {
      theme: 'slate',
      slides: [
        {
          id: 's1',
          type: 'title-hero',
          intent: 'open strongly',
          headline: 'Q2 Strategy Review',
          subheadline: 'Priorities and tradeoffs',
          components: [],
          notesSeed: 'Open with the shift in priorities',
        },
      ],
    };
    expect(OutlineSchema.parse(outline)).toBeDefined();
  });
});

describe('ManifestSchema', () => {
  it('validates a valid manifest', () => {
    const manifest = {
      generatedAt: '2026-02-27T00:00:00Z',
      dataDir: './data',
      files: [
        {
          path: 'data/notes.md',
          name: 'notes.md',
          type: 'markdown',
          size: 1234,
          modifiedAt: '2026-02-27T00:00:00Z',
        },
      ],
    };
    expect(ManifestSchema.parse(manifest)).toBeDefined();
  });
});
```

**Step 3: Run test to verify it fails**

```bash
pnpm vitest run packages/core/src/__tests__/schemas.test.ts
```

Expected: FAIL — modules don't exist yet.

**Step 4: Implement schemas**

```typescript
// packages/core/src/schemas/brief.ts
import { z } from 'zod';

export const BriefSourceSchema = z.object({
  file: z.string(),
  type: z.string(),
  summary: z.string(),
});

export const BriefSchema = z.object({
  title: z.string().min(1),
  audience: z.string().min(1),
  goal: z.string().min(1),
  tone: z.string().min(1),
  themes: z.array(z.string()),
  sources: z.array(BriefSourceSchema),
  constraints: z.array(z.string()).default([]),
});

export type Brief = z.infer<typeof BriefSchema>;
```

```typescript
// packages/core/src/schemas/outline.ts
import { z } from 'zod';

const SlideTypes = z.enum([
  'title-hero', 'agenda', 'section-divider', 'two-column-argument',
  'quote-insight', 'stat-grid', 'image-caption', 'comparison-table',
  'timeline', 'roadmap', 'recommendation-ask', 'appendix',
]);

export const SlideEntrySchema = z.object({
  id: z.string().min(1),
  type: SlideTypes,
  intent: z.string().min(1),
  headline: z.string().min(1),
  subheadline: z.string().optional(),
  components: z.array(z.string()).default([]),
  copyPoints: z.array(z.string()).optional(),
  notesSeed: z.string().optional(),
  visual: z.string().optional(),
});

export const OutlineSchema = z.object({
  theme: z.string().default('slate'),
  slides: z.array(SlideEntrySchema).min(1),
});

export type Outline = z.infer<typeof OutlineSchema>;
export type SlideEntry = z.infer<typeof SlideEntrySchema>;
```

```typescript
// packages/core/src/schemas/manifest.ts
import { z } from 'zod';

const FileTypes = z.enum([
  'markdown', 'text', 'json', 'csv', 'image',
]);

export const ManifestFileSchema = z.object({
  path: z.string(),
  name: z.string(),
  type: FileTypes,
  size: z.number(),
  modifiedAt: z.string(),
});

export const ManifestSchema = z.object({
  generatedAt: z.string(),
  dataDir: z.string(),
  files: z.array(ManifestFileSchema),
});

export type Manifest = z.infer<typeof ManifestSchema>;
```

```typescript
// packages/core/src/schemas/deck-config.ts
import { z } from 'zod';

export const DeckConfigSchema = z.object({
  title: z.string(),
  theme: z.string().default('slate'),
  slides: z.array(z.string()),
});

export type DeckConfig = z.infer<typeof DeckConfigSchema>;
```

```typescript
// packages/core/src/schemas/index.ts
export * from './brief';
export * from './outline';
export * from './manifest';
export * from './deck-config';
```

```typescript
// packages/core/src/index.ts
export * from './schemas';
```

**Step 5: Run tests to verify they pass**

```bash
pnpm vitest run packages/core/src/__tests__/schemas.test.ts
```

Expected: PASS

**Step 6: Commit**

```bash
git add .
git commit -m "feat(core): add Zod schemas for brief, outline, manifest, and deck config"
```

---

### Task 5: Build Ingestion Logic

**Files:**
- Create: `packages/core/src/ingest.ts`
- Test: `packages/core/src/__tests__/ingest.test.ts`

**Step 1: Write the failing test**

```typescript
// packages/core/src/__tests__/ingest.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { ingest } from '../ingest';

const TEST_DATA_DIR = join(import.meta.dirname, '__fixtures__/data');

describe('ingest', () => {
  beforeEach(() => {
    mkdirSync(TEST_DATA_DIR, { recursive: true });
  });

  afterEach(() => {
    rmSync(TEST_DATA_DIR, { recursive: true, force: true });
  });

  it('discovers markdown files', async () => {
    writeFileSync(join(TEST_DATA_DIR, 'notes.md'), '# Notes\nSome content');
    const manifest = await ingest(TEST_DATA_DIR);
    expect(manifest.files).toHaveLength(1);
    expect(manifest.files[0].type).toBe('markdown');
    expect(manifest.files[0].name).toBe('notes.md');
  });

  it('discovers files recursively', async () => {
    mkdirSync(join(TEST_DATA_DIR, 'sub'), { recursive: true });
    writeFileSync(join(TEST_DATA_DIR, 'top.md'), '# Top');
    writeFileSync(join(TEST_DATA_DIR, 'sub/nested.txt'), 'nested');
    const manifest = await ingest(TEST_DATA_DIR);
    expect(manifest.files).toHaveLength(2);
  });

  it('categorizes file types correctly', async () => {
    writeFileSync(join(TEST_DATA_DIR, 'doc.md'), '# Doc');
    writeFileSync(join(TEST_DATA_DIR, 'data.csv'), 'a,b\n1,2');
    writeFileSync(join(TEST_DATA_DIR, 'config.json'), '{}');
    writeFileSync(join(TEST_DATA_DIR, 'note.txt'), 'note');
    const manifest = await ingest(TEST_DATA_DIR);
    const types = manifest.files.map(f => f.type).sort();
    expect(types).toEqual(['csv', 'json', 'markdown', 'text']);
  });

  it('ignores unsupported file types', async () => {
    writeFileSync(join(TEST_DATA_DIR, 'notes.md'), '# Notes');
    writeFileSync(join(TEST_DATA_DIR, 'binary.exe'), 'binary');
    const manifest = await ingest(TEST_DATA_DIR);
    expect(manifest.files).toHaveLength(1);
  });

  it('returns empty files array for empty directory', async () => {
    const manifest = await ingest(TEST_DATA_DIR);
    expect(manifest.files).toEqual([]);
  });
});
```

**Step 2: Run test to verify it fails**

```bash
pnpm vitest run packages/core/src/__tests__/ingest.test.ts
```

**Step 3: Implement ingest**

```typescript
// packages/core/src/ingest.ts
import { readdir, stat } from 'node:fs/promises';
import { join, extname, relative } from 'node:path';
import type { Manifest } from './schemas/manifest';

const EXT_TYPE_MAP: Record<string, string> = {
  '.md': 'markdown',
  '.txt': 'text',
  '.json': 'json',
  '.csv': 'csv',
  '.png': 'image',
  '.jpg': 'image',
  '.jpeg': 'image',
  '.webp': 'image',
};

async function walkDir(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const paths: string[] = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      paths.push(...(await walkDir(fullPath)));
    } else {
      paths.push(fullPath);
    }
  }
  return paths;
}

export async function ingest(dataDir: string): Promise<Manifest> {
  const allFiles = await walkDir(dataDir);
  const files = [];

  for (const filePath of allFiles) {
    const ext = extname(filePath).toLowerCase();
    const type = EXT_TYPE_MAP[ext];
    if (!type) continue;

    const fileStat = await stat(filePath);
    files.push({
      path: relative(process.cwd(), filePath),
      name: filePath.split('/').pop()!,
      type: type as 'markdown' | 'text' | 'json' | 'csv' | 'image',
      size: fileStat.size,
      modifiedAt: fileStat.mtime.toISOString(),
    });
  }

  return {
    generatedAt: new Date().toISOString(),
    dataDir,
    files,
  };
}
```

Update `packages/core/src/index.ts`:

```typescript
export * from './schemas';
export { ingest } from './ingest';
```

**Step 4: Run tests**

```bash
pnpm vitest run packages/core/src/__tests__/ingest.test.ts
```

Expected: PASS

**Step 5: Commit**

```bash
git add .
git commit -m "feat(core): add file ingestion with type categorization"
```

---

### Task 6: Add Schema Validation Utility

**Files:**
- Create: `packages/core/src/validate.ts`
- Test: `packages/core/src/__tests__/validate.test.ts`

**Step 1: Write the failing test**

```typescript
// packages/core/src/__tests__/validate.test.ts
import { describe, it, expect } from 'vitest';
import { validateBrief, validateOutline } from '../validate';

describe('validateBrief', () => {
  it('returns success for valid brief', () => {
    const result = validateBrief({
      title: 'Test',
      audience: 'team',
      goal: 'inform',
      tone: 'casual',
      themes: [],
      sources: [],
    });
    expect(result.success).toBe(true);
  });

  it('returns errors for invalid brief', () => {
    const result = validateBrief({});
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.length).toBeGreaterThan(0);
    }
  });
});

describe('validateOutline', () => {
  it('returns success for valid outline', () => {
    const result = validateOutline({
      theme: 'slate',
      slides: [{ id: 's1', type: 'title-hero', intent: 'open', headline: 'Title' }],
    });
    expect(result.success).toBe(true);
  });

  it('returns errors for empty slides', () => {
    const result = validateOutline({ slides: [] });
    expect(result.success).toBe(false);
  });
});
```

**Step 2: Run test to verify it fails**

**Step 3: Implement validate**

```typescript
// packages/core/src/validate.ts
import { BriefSchema } from './schemas/brief';
import { OutlineSchema } from './schemas/outline';

type ValidationResult =
  | { success: true; data: unknown }
  | { success: false; errors: string[] };

export function validateBrief(data: unknown): ValidationResult {
  const result = BriefSchema.safeParse(data);
  if (result.success) return { success: true, data: result.data };
  return {
    success: false,
    errors: result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`),
  };
}

export function validateOutline(data: unknown): ValidationResult {
  const result = OutlineSchema.safeParse(data);
  if (result.success) return { success: true, data: result.data };
  return {
    success: false,
    errors: result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`),
  };
}
```

Update `packages/core/src/index.ts` to export validate.

**Step 4: Run tests, verify pass**

**Step 5: Commit**

```bash
git add .
git commit -m "feat(core): add brief and outline validation utilities"
```

---

## Phase 3: Theme System

### Task 7: Build Theme Token System

**Files:**
- Create: `packages/themes/src/types.ts`
- Create: `packages/themes/src/slate.ts`
- Create: `packages/themes/src/canvas.ts`
- Create: `packages/themes/src/signal.ts`
- Create: `packages/themes/src/slate.css`
- Create: `packages/themes/src/canvas.css`
- Create: `packages/themes/src/signal.css`
- Create: `packages/themes/src/index.ts`
- Test: `packages/themes/src/__tests__/themes.test.ts`

**Step 1: Write the failing test**

```typescript
// packages/themes/src/__tests__/themes.test.ts
import { describe, it, expect } from 'vitest';
import { themes, getTheme } from '../index';

describe('themes', () => {
  it('exports three themes', () => {
    expect(Object.keys(themes)).toHaveLength(3);
    expect(themes).toHaveProperty('slate');
    expect(themes).toHaveProperty('canvas');
    expect(themes).toHaveProperty('signal');
  });

  it('each theme has required token categories', () => {
    for (const theme of Object.values(themes)) {
      expect(theme).toHaveProperty('name');
      expect(theme).toHaveProperty('colors');
      expect(theme).toHaveProperty('typography');
      expect(theme).toHaveProperty('spacing');
      expect(theme).toHaveProperty('radius');
      expect(theme).toHaveProperty('shadow');
      expect(theme.colors).toHaveProperty('background');
      expect(theme.colors).toHaveProperty('text');
      expect(theme.colors).toHaveProperty('primary');
      expect(theme.colors).toHaveProperty('accent');
    }
  });

  it('getTheme returns a theme by name', () => {
    expect(getTheme('slate').name).toBe('slate');
  });

  it('getTheme throws for unknown theme', () => {
    expect(() => getTheme('nonexistent')).toThrow();
  });
});
```

**Step 2: Run test to verify it fails**

**Step 3: Implement theme types and three themes**

Define `ThemeConfig` type with: name, colors (background, surface, text, muted, primary, secondary, accent, border), typography (headingFont, bodyFont, monoFont), spacing (slide padding, element gap), radius, shadow levels.

Each theme (slate, canvas, signal) provides concrete values. Each also has a companion `.css` file that sets CSS custom properties:

```css
/* packages/themes/src/slate.css */
[data-theme="slate"] {
  --sm-bg: #0f172a;
  --sm-surface: #1e293b;
  --sm-text: #f8fafc;
  --sm-muted: #94a3b8;
  --sm-primary: #3b82f6;
  --sm-secondary: #8b5cf6;
  --sm-accent: #06b6d4;
  --sm-border: #334155;
  --sm-heading-font: 'Inter', system-ui, sans-serif;
  --sm-body-font: 'Inter', system-ui, sans-serif;
  --sm-radius: 0.5rem;
}
```

**Step 4: Run tests, verify pass**

**Step 5: Commit**

```bash
git add .
git commit -m "feat(themes): add slate, canvas, and signal theme packs"
```

---

## Phase 4: Slide Components

### Task 8: Build Core Layout Components

**Files:**
- Create: `packages/components/src/Headline.tsx`
- Create: `packages/components/src/Subheadline.tsx`
- Create: `packages/components/src/BulletGroup.tsx`
- Create: `packages/components/src/NumberedSteps.tsx`
- Create: `packages/components/src/TwoColumn.tsx`
- Create: `packages/components/src/ThreeCard.tsx`
- Create: `packages/components/src/SectionLabel.tsx`
- Create: `packages/components/src/index.ts`
- Test: `packages/components/src/__tests__/components.test.tsx`

**Step 1: Install React dependencies**

```bash
pnpm --filter @slidemason/components add react react-dom
pnpm --filter @slidemason/components add -D @types/react @types/react-dom @testing-library/react @testing-library/jest-dom jsdom
```

**Step 2: Write the failing test**

Test that each component renders without errors and produces expected HTML structure. Use `@testing-library/react` with `render()`.

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Headline, Subheadline, BulletGroup, NumberedSteps, TwoColumn, SectionLabel } from '../index';

describe('Headline', () => {
  it('renders text in an h1', () => {
    render(<Headline>Test Headline</Headline>);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test Headline');
  });
});

describe('BulletGroup', () => {
  it('renders a list of items', () => {
    render(<BulletGroup items={['One', 'Two', 'Three']} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });
});

// Similar tests for each component
```

**Step 3: Run test to verify it fails**

**Step 4: Implement components**

Each component is a simple React functional component using Tailwind classes that reference CSS custom properties (theme tokens). Components use `var(--sm-*)` for colors so they're theme-aware.

Example:

```tsx
// packages/components/src/Headline.tsx
import type { ReactNode } from 'react';

interface HeadlineProps {
  children: ReactNode;
  className?: string;
}

export function Headline({ children, className = '' }: HeadlineProps) {
  return (
    <h1 className={`text-5xl font-bold tracking-tight text-[var(--sm-text)] ${className}`}>
      {children}
    </h1>
  );
}
```

**Step 5: Run tests, verify pass**

**Step 6: Commit**

```bash
git add .
git commit -m "feat(components): add core layout components"
```

---

### Task 9: Build Data Display Components

**Files:**
- Create: `packages/components/src/StatCard.tsx`
- Create: `packages/components/src/StatGrid.tsx`
- Create: `packages/components/src/QuoteCallout.tsx`
- Create: `packages/components/src/ImagePanel.tsx`
- Create: `packages/components/src/KPIStrip.tsx`
- Create: `packages/components/src/TimelineRow.tsx`
- Create: `packages/components/src/ComparisonMatrix.tsx`
- Create: `packages/components/src/FooterMark.tsx`
- Create: `packages/components/src/PresenterNotes.tsx`
- Test: `packages/components/src/__tests__/data-components.test.tsx`

Same pattern as Task 8: write failing tests, implement, verify, commit.

```bash
git commit -m "feat(components): add data display components"
```

---

## Phase 5: Slide Renderer

### Task 10: Set Up Vite + React + MDX Renderer

**Files:**
- Create: `packages/renderer/src/SlideRenderer.tsx`
- Create: `packages/renderer/src/SlideLayout.tsx`
- Create: `packages/renderer/src/DeckProvider.tsx`
- Create: `packages/renderer/src/useNavigation.ts`
- Create: `packages/renderer/vite.config.ts`
- Modify: `packages/renderer/package.json`

**Step 1: Install renderer dependencies**

```bash
pnpm --filter @slidemason/renderer add react react-dom @mdx-js/react
pnpm --filter @slidemason/renderer add -D @vitejs/plugin-react @mdx-js/rollup vite @types/react @types/react-dom
pnpm --filter @slidemason/renderer add @slidemason/components @slidemason/themes
```

**Step 2: Create vite.config.ts for renderer**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';

export default defineConfig({
  plugins: [
    mdx({ providerImportSource: '@mdx-js/react' }),
    react(),
  ],
});
```

**Step 3: Implement SlideLayout**

A full-viewport 16:9 container that scales to fit the window:

```tsx
export function SlideLayout({ children, theme = 'slate' }: SlideLayoutProps) {
  return (
    <div data-theme={theme} className="w-screen h-screen flex items-center justify-center bg-[var(--sm-bg)]">
      <div className="w-[1920px] h-[1080px] origin-center scale-[var(--sm-scale)] p-16 flex flex-col">
        {children}
      </div>
    </div>
  );
}
```

**Step 4: Implement DeckProvider**

Context provider that loads `deck.config.json`, provides slide list, current slide index, and navigation functions.

**Step 5: Implement useNavigation hook**

Keyboard listeners (ArrowLeft, ArrowRight, Space) and URL sync.

**Step 6: Implement SlideRenderer**

Dynamically imports MDX files based on current slide, wraps in SlideLayout with MDX provider that injects all @slidemason/components.

**Step 7: Test with a hardcoded MDX slide**

**Step 8: Commit**

```bash
git commit -m "feat(renderer): add slide renderer with MDX, navigation, and 16:9 scaling"
```

---

### Task 11: Build Slide Templates

**Files:**
- Create: `packages/renderer/src/templates/TitleHero.tsx`
- Create: `packages/renderer/src/templates/Agenda.tsx`
- Create: `packages/renderer/src/templates/SectionDivider.tsx`
- Create: `packages/renderer/src/templates/TwoColumnArgument.tsx`
- Create: `packages/renderer/src/templates/QuoteInsight.tsx`
- Create: `packages/renderer/src/templates/StatGridSlide.tsx`
- Create: `packages/renderer/src/templates/ImageCaption.tsx`
- Create: `packages/renderer/src/templates/ComparisonTableSlide.tsx`
- Create: `packages/renderer/src/templates/TimelineSlide.tsx`
- Create: `packages/renderer/src/templates/Roadmap.tsx`
- Create: `packages/renderer/src/templates/RecommendationAsk.tsx`
- Create: `packages/renderer/src/templates/Appendix.tsx`
- Create: `packages/renderer/src/templates/index.ts`

**Step 1: Implement each template**

Each template is a React component that composes @slidemason/components into a structured layout. Templates accept props matching the outline schema fields.

Example TitleHero:

```tsx
import { Headline, Subheadline } from '@slidemason/components';

interface TitleHeroProps {
  headline: string;
  subheadline?: string;
}

export function TitleHero({ headline, subheadline }: TitleHeroProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center gap-6">
      <Headline>{headline}</Headline>
      {subheadline && <Subheadline>{subheadline}</Subheadline>}
    </div>
  );
}
```

**Step 2: Write tests for each template rendering**

**Step 3: Commit**

```bash
git commit -m "feat(renderer): add 12 slide templates"
```

---

## Phase 6: Studio App (Local Preview)

### Task 12: Set Up Studio Vite App

**Files:**
- Modify: `apps/studio/index.html`
- Modify: `apps/studio/src/main.tsx`
- Create: `apps/studio/src/App.tsx`
- Create: `apps/studio/vite.config.ts`
- Create: `apps/studio/src/styles.css`

**Step 1: Install studio dependencies**

```bash
pnpm --filter @slidemason/studio add react react-dom @slidemason/renderer @slidemason/components @slidemason/themes @mdx-js/react
pnpm --filter @slidemason/studio add -D vite @vitejs/plugin-react @mdx-js/rollup tailwindcss @tailwindcss/vite @types/react @types/react-dom
```

**Step 2: Create vite.config.ts**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    mdx({ providerImportSource: '@mdx-js/react' }),
    react(),
    tailwindcss(),
  ],
  server: {
    port: 4200,
  },
});
```

**Step 3: Create index.html, main.tsx, App.tsx**

App.tsx reads `deck.config.json` from the generated directory, renders the DeckProvider + SlideRenderer.

**Step 4: Create styles.css with Tailwind import and theme CSS**

```css
@import "tailwindcss";
@import "@slidemason/themes/slate.css";
@import "@slidemason/themes/canvas.css";
@import "@slidemason/themes/signal.css";
```

**Step 5: Verify `pnpm dev` starts and shows a blank deck**

**Step 6: Commit**

```bash
git commit -m "feat(studio): add Vite dev preview app with hot reload"
```

---

## Phase 7: CLI

### Task 13: Build CLI with citty

**Files:**
- Create: `packages/cli/src/index.ts`
- Create: `packages/cli/src/commands/init.ts`
- Create: `packages/cli/src/commands/ingest.ts`
- Create: `packages/cli/src/commands/validate.ts`
- Create: `packages/cli/src/commands/dev.ts`
- Create: `packages/cli/src/commands/build.ts`
- Create: `packages/cli/src/commands/export-pdf.ts`
- Create: `packages/cli/src/commands/export-static.ts`
- Create: `packages/cli/src/commands/publish-github.ts`
- Modify: `packages/cli/package.json` (add bin field)

**Step 1: Install CLI dependencies**

```bash
pnpm --filter @slidemason/cli add citty consola @slidemason/core
pnpm --filter @slidemason/cli add -D @slidemason/export
```

**Step 2: Implement main CLI entry**

```typescript
// packages/cli/src/index.ts
#!/usr/bin/env node
import { defineCommand, runMain } from 'citty';
import { initCommand } from './commands/init';
import { ingestCommand } from './commands/ingest';
import { validateCommand } from './commands/validate';
import { devCommand } from './commands/dev';

const main = defineCommand({
  meta: {
    name: 'slidemason',
    version: '0.1.0',
    description: 'Local-first presentation builder',
  },
  subCommands: {
    init: initCommand,
    ingest: ingestCommand,
    validate: validateCommand,
    dev: devCommand,
    build: () => import('./commands/build').then(m => m.buildCommand),
    'export-pdf': () => import('./commands/export-pdf').then(m => m.exportPdfCommand),
    'export-static': () => import('./commands/export-static').then(m => m.exportStaticCommand),
    'publish-github': () => import('./commands/publish-github').then(m => m.publishGithubCommand),
  },
});

runMain(main);
```

**Step 3: Implement each command**

- `init`: Creates data/, generated/, prompts/ dirs, copies default prompts, creates initial config
- `ingest`: Calls `ingest()` from @slidemason/core, writes `generated/manifest.json`
- `validate`: Reads brief.json and outline.json, runs Zod validation, prints errors
- `dev`: Spawns Vite dev server from apps/studio
- `build`: Runs Vite build
- `export-pdf`: Calls @slidemason/export PDF function
- `export-static`: Runs Vite build to dist/
- `publish-github`: Runs gh-pages deploy

**Step 4: Add bin to package.json**

```json
{
  "bin": {
    "slidemason": "./dist/index.js"
  }
}
```

**Step 5: Test CLI locally**

```bash
pnpm --filter @slidemason/cli build
node packages/cli/dist/index.js --help
```

**Step 6: Commit**

```bash
git commit -m "feat(cli): add CLI with init, ingest, validate, dev, build, export, and publish commands"
```

---

## Phase 8: Export

### Task 14: Build PDF Export with Playwright

**Files:**
- Create: `packages/export/src/pdf.ts`
- Create: `packages/export/src/index.ts`
- Test: `packages/export/src/__tests__/pdf.test.ts`

**Step 1: Install export dependencies**

```bash
pnpm --filter @slidemason/export add playwright
```

**Step 2: Implement PDF export**

```typescript
// packages/export/src/pdf.ts
import { chromium } from 'playwright';

interface ExportPdfOptions {
  url: string;
  outputPath: string;
  slideCount: number;
}

export async function exportPdf({ url, outputPath, slideCount }: ExportPdfOptions): Promise<void> {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  const pages: Buffer[] = [];
  for (let i = 0; i < slideCount; i++) {
    await page.goto(`${url}/slide/${i}`);
    await page.waitForLoadState('networkidle');
    const pdf = await page.pdf({
      width: '1920px',
      height: '1080px',
      printBackground: true,
      pageRanges: '1',
    });
    pages.push(pdf);
  }

  // Merge PDFs (use pdf-lib or similar)
  await browser.close();
}
```

**Step 3: Write basic test**

**Step 4: Commit**

```bash
git commit -m "feat(export): add Playwright-based PDF export"
```

---

## Phase 9: Agent Prompt Files

### Task 15: Write Agent Prompt Files

**Files:**
- Create: `prompts/system.md`
- Create: `prompts/ingest.md`
- Create: `prompts/build-brief.md`
- Create: `prompts/build-outline.md`
- Create: `prompts/build-deck.md`
- Create: `prompts/refine-design.md`
- Create: `prompts/components.md`
- Create: `prompts/templates.md`
- Create: `prompts/themes.md`

**Step 1: Write system.md**

Overview of Slidemason, file structure, conventions, workflow steps.

**Step 2: Write build-brief.md**

Instructions for reading manifest + source files, what brief.json must contain, schema reference, examples of good and bad briefs.

**Step 3: Write build-outline.md**

Instructions for reading brief + sources, slide sequencing principles, template selection guidance, schema reference.

**Step 4: Write build-deck.md**

Instructions for generating MDX files: how to import components, how to use templates, how to apply theme tokens, content density rules (max 5 bullet points, max 30 words per point, etc.).

**Step 5: Write refine-design.md**

Instructions for reviewing generated deck and improving visual hierarchy, consistency, and flow.

**Step 6: Write components.md, templates.md, themes.md**

Reference docs: every component with props and usage examples, every template with when to use it, every theme with preview description.

**Step 7: Commit**

```bash
git add .
git commit -m "feat(prompts): add agent prompt files for full deck generation workflow"
```

---

## Phase 10: Example Deck & Polish

### Task 16: Create Example Data and Generated Deck

**Files:**
- Create: `data/example/prd.md`
- Create: `data/example/notes.md`
- Create: `data/example/metrics.csv`
- Create: `generated/example/brief.json`
- Create: `generated/example/outline.json`
- Create: `generated/example/deck/*.mdx` (8-12 slides)
- Create: `generated/example/deck.config.json`

**Step 1: Create example source material**

A realistic PRD and notes that demonstrate the tool's capability.

**Step 2: Create example brief.json and outline.json**

Hand-crafted to show the expected schema output.

**Step 3: Create example MDX slides**

8-12 slides using different templates and components. This serves as both a demo and a reference for agents.

**Step 4: Verify the example renders with `pnpm dev`**

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add example deck with source data, brief, outline, and slides"
```

---

### Task 17: Write README

**Files:**
- Modify: `README.md`

**Step 1: Write comprehensive README**

Sections: hero banner/description, quick start, features, how it works (with workflow diagram), CLI reference, themes, templates, components, agent workflow guide, contributing, license.

**Step 2: Commit**

```bash
git add .
git commit -m "docs: write comprehensive README"
```

---

### Task 18: Final Integration Test

**Step 1: Run full test suite**

```bash
pnpm test
```

**Step 2: Run full build**

```bash
pnpm build
```

**Step 3: Test end-to-end workflow manually**

```bash
cd /tmp && mkdir test-deck && cd test-deck
npx slidemason init
echo "# Test" > data/test.md
npx slidemason ingest
# Verify generated/manifest.json exists
npx slidemason dev
# Verify preview loads
```

**Step 4: Fix any issues found**

**Step 5: Final commit and push**

```bash
git add .
git commit -m "chore: final integration fixes"
git push
```

---

## Summary

| Phase | Tasks | What it delivers |
|-------|-------|-----------------|
| 1. Scaffolding | 1-3 | Git repo, GitHub remote, monorepo, all packages |
| 2. Core | 4-6 | Zod schemas, file ingestion, validation |
| 3. Themes | 7 | 3 theme packs with CSS custom properties |
| 4. Components | 8-9 | 16 reusable slide components |
| 5. Renderer | 10-11 | MDX slide renderer + 12 templates |
| 6. Studio | 12 | Local preview dev server |
| 7. CLI | 13 | Full CLI with all commands |
| 8. Export | 14 | PDF + static export |
| 9. Prompts | 15 | Agent prompt files |
| 10. Polish | 16-18 | Example deck, README, integration test |
