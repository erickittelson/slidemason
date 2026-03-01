# Custom JSX Slides Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove the template component library and shift to AI-designed custom JSX slides, where each slide is a bespoke React component using Tailwind, Framer Motion, Lucide icons, and theme CSS variables.

**Architecture:** Delete `packages/components/` entirely. Strip template re-exports from `packages/renderer/`. Keep the renderer engine (SlideRenderer, DeckProvider, transitions), themes, studio app, and deck filesystem. Rewrite CLAUDE.md as the AI's design bible for writing custom slides.

**Tech Stack:** React 19, Vite, Tailwind CSS v4, Framer Motion, Lucide React, CSS custom properties (theme system)

---

### Task 1: Delete packages/components

**Files:**
- Delete: `packages/components/` (entire directory)

**Step 1: Delete the package**

```bash
rm -rf packages/components
```

**Step 2: Remove from workspace dependencies**

The workspace config at `pnpm-workspace.yaml` uses a glob `packages/*` so it auto-discovers. Removing the directory is sufficient. But we need to remove it from any package.json that depends on it.

Check: `packages/renderer/package.json` — if it lists `@slidemason/components` as a dependency, remove that entry.

**Step 3: Verify workspace**

Run: `pnpm install`
Expected: Clean install, no errors about missing `@slidemason/components`

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: remove packages/components template library"
```

---

### Task 2: Clean up packages/renderer

The renderer has two references to the old system:
1. `import * as components from '@slidemason/components'` in SlideRenderer.tsx (used for MDX)
2. 41 template files in `src/templates/` that re-export old components
3. Template re-exports from `src/index.ts`
4. Template tests in `src/__tests__/`

**Files:**
- Delete: `packages/renderer/src/templates/` (entire directory)
- Delete: `packages/renderer/src/__tests__/templates.test.tsx`
- Delete: `packages/renderer/src/__tests__/new-templates.test.tsx`
- Modify: `packages/renderer/src/SlideRenderer.tsx` — remove `@slidemason/components` import and MDXProvider usage
- Modify: `packages/renderer/src/index.ts` — remove template re-exports
- Modify: `packages/renderer/package.json` — remove `@slidemason/components` from dependencies if present

**Step 1: Delete templates directory and tests**

```bash
rm -rf packages/renderer/src/templates
rm -f packages/renderer/src/__tests__/templates.test.tsx
rm -f packages/renderer/src/__tests__/new-templates.test.tsx
```

**Step 2: Edit SlideRenderer.tsx**

Remove the line:
```tsx
import * as components from '@slidemason/components';
```

Find the `<MDXProvider components={components}>` wrapper and either remove MDXProvider entirely or pass an empty object. Since we're removing MDX slide support (slides are now TSX), remove the MDXProvider wrapper:

Before:
```tsx
<MDXProvider components={components}>
  {/* slide content */}
</MDXProvider>
```

After:
```tsx
{/* slide content — no MDXProvider needed */}
```

**Step 3: Edit index.ts**

Remove the large block of template re-exports (the `} from './templates';` import and all the type/component exports from templates).

Keep: `SlideRenderer`, `SlideLayout`, `DeckProvider`, `useDeck`, and any transition/animation exports.

**Step 4: Remove @slidemason/components dependency**

In `packages/renderer/package.json`, remove `"@slidemason/components"` from dependencies if it exists.

**Step 5: Type-check**

Run: `npx tsc --noEmit`
Expected: Clean (may need to fix remaining references)

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: strip template system from renderer, keep engine"
```

---

### Task 3: Update vite.config.ts

**Files:**
- Modify: `apps/studio/vite.config.ts`

**Step 1: Edit the monorepo resolve plugin**

In the `pkgMap` object inside `monorepoResolvePlugin()`:

Remove:
```ts
'@slidemason/components': resolve(MONO_ROOT, 'packages/components/src/index.ts'),
'@slidemason/components/motion.css': resolve(MONO_ROOT, 'packages/components/src/motion.css'),
```

Keep:
```ts
'@slidemason/renderer': resolve(MONO_ROOT, 'packages/renderer/src/index.ts'),
'framer-motion': resolve(MONO_ROOT, 'node_modules/framer-motion'),
'lucide-react': resolve(MONO_ROOT, 'node_modules/lucide-react'),
```

Also add `react` and `react-dom` to the map so deck files can import them:
```ts
'react': resolve(MONO_ROOT, 'node_modules/react'),
'react-dom': resolve(MONO_ROOT, 'node_modules/react-dom'),
'react/jsx-runtime': resolve(MONO_ROOT, 'node_modules/react/jsx-runtime'),
```

**Step 2: Verify dev server starts**

Run: `pnpm dev`
Expected: Starts without errors

**Step 3: Commit**

```bash
git add apps/studio/vite.config.ts
git commit -m "feat: update vite resolve for custom JSX slides"
```

---

### Task 4: Rewrite apps/studio/src/slides.tsx (default placeholder)

**Files:**
- Modify: `apps/studio/src/slides.tsx`

**Step 1: Replace with custom JSX placeholder**

```tsx
import { motion } from 'framer-motion';

const fade = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
};

const slides = [
  <div key="welcome" className="flex flex-1 flex-col items-center justify-center text-center" style={{ padding: 'clamp(2rem, 5vw, 5rem)' }}>
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
      Slidemason
    </motion.h1>
    <motion.p
      {...fade}
      transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{ fontSize: 'clamp(1rem, 2.5vw, 1.5rem)', color: 'var(--sm-muted)', marginTop: 'clamp(0.5rem, 2vh, 1.5rem)' }}
    >
      Select a deck from the gallery to get started
    </motion.p>
  </div>,
];

export default slides;
```

**Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: Clean

**Step 3: Commit**

```bash
git add apps/studio/src/slides.tsx
git commit -m "feat: custom JSX placeholder slide"
```

---

### Task 5: Rewrite CLAUDE.md

This is the most important task. The CLAUDE.md becomes the AI's complete design bible for writing custom slides.

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Rewrite CLAUDE.md**

Full replacement. The new CLAUDE.md must contain:

**Section 1: What This Project Is**
- Brief description of Slidemason
- Monorepo structure table (updated — no `packages/components/`)

**Section 2: How to Generate a Presentation**
- Step 1: Read all source documents in `decks/<slug>/data/`
- Step 2: Read the brief at `decks/<slug>/generated/brief.json`
- Step 3: Plan the narrative arc (same 8-beat framework: Hook, Context, Problem, Vision, Solution, Evidence, Roadmap, Ask)
- Step 4: Design and write slides to `decks/<slug>/slides.tsx`

**Section 3: Slide Format**
- Show the import pattern: `framer-motion`, `lucide-react`
- Show the export pattern: `const slides = [...]; export default slides;`
- Each slide is a `<div key="sN">` with custom Tailwind + Framer Motion

**Section 4: Design Principles (the core)**
1. Every slide is bespoke — no two use the same layout
2. Cinematic typography — text-6xl to text-8xl headlines, generous whitespace
3. Glass cards for grouped content — `var(--sm-glass-bg)` + backdrop-blur + border
4. Gradient text for impact — `var(--sm-primary)` to `var(--sm-secondary)`, sparingly (title + 1-2 key statements)
5. Staggered Framer Motion animations — every element animates in with increasing delay
6. Icons as visual anchors — Lucide at 32-48px, tinted with theme colors
7. Theme variables only — never hardcode colors
8. Ghost numbers on section dividers — text-[12rem] at 5-10% opacity behind title
9. No bullet lists ever — icon card grids or vertical stacks with large icons
10. Responsive clamp() sizing — all text uses clamp() so slides scale
11. Alternate layout density — follow a dense slide with a spacious one
12. Maximum visual variety — never repeat the same layout pattern in consecutive slides

**Section 5: Theme Variable Reference**
Complete table of all 31 CSS variables with descriptions:
```
--sm-bg           Page background
--sm-surface      Card/container background
--sm-text         Primary text color
--sm-muted        Secondary/subtle text
--sm-primary      Brand color (orange in sunset)
--sm-secondary    Accent color (pink in sunset)
--sm-accent       Highlight color (gold in sunset)
--sm-border       Border color
--sm-glass-bg     Glassmorphic background (semi-transparent surface)
--sm-gradient-start/end  Main gradient
--sm-gradient-mesh-1/2/3/4  Mesh gradient colors
--sm-chart-1 through 6    Data visualization colors
--sm-success/warning/danger  Status colors
--sm-shadow-sm/md/lg  Shadow values
--sm-radius       Border radius
--sm-mono-font    Monospace font
```

**Section 6: Animation Recipes**
```tsx
// Fade up (most common)
const fade = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
};

// Scale in (for cards, icons)
const scaleIn = {
  initial: { opacity: 0, scale: 0.85 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

// Stagger children
// Add transition={{ delay: 0.15 * i }} to each child

// Slide from left/right (for split layouts)
const slideLeft = {
  initial: { opacity: 0, x: -40 },
  animate: { opacity: 1, x: 0 },
};
```

**Section 7: Layout Patterns (examples, not templates)**
- **Hero**: centered stack, gradient title, badge above, subtitle below
- **Split**: 50/50 flex, content on one side, visual panel on the other
- **Card Grid**: 2x2 or 3-col grid of glass cards with icons + text
- **Statement**: single large number or quote, centered, with background effect
- **Data Wall**: 3-4 big metric boxes with labels, color-coded
- **Section Break**: ghost number behind title, gradient underline accent
- **Timeline**: vertical or horizontal connected steps with status indicators
- **Comparison**: two columns with contrasting colors (rose vs emerald)

**Section 8: Critical Rules**
1. NEVER modify `packages/renderer/` or `packages/themes/`
2. ALL content goes in `decks/<slug>/slides.tsx`
3. Import from `framer-motion` and `lucide-react` only
4. Every slide needs a unique `key` prop
5. Use only theme CSS variables for colors — never hardcode hex values
6. Icon names are PascalCase Lucide icons
7. Read ALL files in `decks/<slug>/data/` before generating

**Step 2: Verify nothing references old template system**

Run: `grep -r "@slidemason/components" CLAUDE.md`
Expected: No results

**Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "feat: rewrite CLAUDE.md for custom JSX slide design"
```

---

### Task 6: Update NextStepsModal prompt

**Files:**
- Modify: `apps/studio/src/components/NextStepsModal.tsx`

**Step 1: Update the PROMPT_TEXT constant**

Change from:
```ts
const PROMPT_TEXT = `Read the brief at generated/brief.json and the source files in data/. Follow the instructions in CLAUDE.md to build the deck.`;
```

To:
```ts
const PROMPT_TEXT = `Read the brief at generated/brief.json and the source files in data/. Follow the design principles in CLAUDE.md to create cinematic, custom-designed slides. Each slide should be unique — bespoke layouts with Tailwind, Framer Motion animations, and Lucide icons. No templates.`;
```

**Step 2: Commit**

```bash
git add apps/studio/src/components/NextStepsModal.tsx
git commit -m "feat: update NextStepsModal prompt for custom JSX approach"
```

---

### Task 7: Clean up stale references

**Files:**
- Modify: `apps/studio/vite-plugin-studio-api.ts` — if it references `@slidemason/components`, remove
- Delete: `examples/` directory (references old template system)
- Delete: `prompts/` directory (references old template system)
- Modify: `README.md` — remove/update references to `@slidemason/components`

**Step 1: Check and fix vite-plugin-studio-api.ts**

The plugin generates placeholder `slides.tsx` content when creating a new deck. Update the placeholder to use custom JSX instead of template imports.

Find the placeholder slides template (around line 222) and replace with:

```ts
const placeholderSlides = `import { motion } from 'framer-motion';

const slides = [
  <div key="s1" className="flex flex-1 flex-col items-center justify-center text-center" style={{ padding: 'clamp(2rem, 5vw, 5rem)' }}>
    <motion.h1
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
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
```

**Step 2: Delete stale directories**

```bash
rm -rf examples
rm -rf prompts
```

**Step 3: Type-check and build**

Run: `npx tsc --noEmit && pnpm build`
Expected: Both clean

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: clean up stale template references"
```

---

### Task 8: Rebuild SaberAlert deck as custom JSX

This is the proving ground — rewrite `decks/saberalert/slides.tsx` as fully custom JSX following the new CLAUDE.md principles.

**Files:**
- Modify: `decks/saberalert/slides.tsx`

**Step 1: Read the source material**

Read `decks/saberalert/data/SaberAlert_MVP.pdf` and `decks/saberalert/generated/brief.json`.

Brief says: sunset theme, Cormorant Garamond / Raleway fonts, 15 slides, infographic style, strategic focus.

**Step 2: Write 15 custom slides**

Each slide must be unique bespoke JSX. Follow the CLAUDE.md design principles. Use:
- `framer-motion` for all animations
- `lucide-react` for icons
- Theme CSS variables (`var(--sm-*)`) for all colors
- Tailwind classes for layout
- `clamp()` for responsive sizing
- Glass cards, gradient text, ghost numbers, staggered animations

The narrative arc from the source material:
1. Hero title (gradient text, badge)
2. North Star metric (big "~5s" with description)
3. What SaberAlert Is (4 icon cards in grid)
4. MVP lifecycle (split layout with checklist visual)
5. Detection pipeline (horizontal connected steps)
6. Section break: Platform (ghost number "01")
7. Architecture overview (hub-spoke as custom SVG or icon layout)
8. Data flow (custom designed, NOT a flowchart template)
9. Section break: Roadmap (ghost number "02")
10. Gate sequence (horizontal timeline with status dots)
11. Gates 0-1 detail (split layout, icons left)
12. Gates 2-3 detail (split layout, icons right)
13. Success metrics (4 big number cards)
14. Workstream status (color-coded status rows)
15. Closing CTA

**Step 3: Verify it compiles and renders**

Run: `npx tsc --noEmit && pnpm dev`
Open: `http://localhost:4200/#saberalert`
Expected: 15 cinematic slides with sunset theme

**Step 4: Commit**

```bash
git add decks/saberalert/slides.tsx
git commit -m "feat: SaberAlert deck as custom JSX — first deck in new style"
```
