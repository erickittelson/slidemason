# Custom JSX Slides — Architecture Redesign

## Goal

Replace the rigid 26-template system with AI-designed custom JSX per slide. Each slide is a unique, cinematic React component using Tailwind, Framer Motion, Lucide icons, and theme CSS variables. No shared component library.

## What Stays

- **Studio app** (`apps/studio/`) — Sidebar workflow (file upload, brief, theme/font pickers, assets), deck gallery, screenshot button, all hooks
- **Renderer** (`packages/renderer/`) — SlideRenderer, DeckProvider, Framer Motion transitions, nav pill
- **Themes** (`packages/themes/`) — 12 CSS themes with 31 variables each
- **Deck filesystem** (`decks/`) — Multi-deck structure with `data/`, `generated/brief.json`, `slides.tsx` per deck

## What Gets Deleted

- **`packages/components/`** — All 26 slide templates, 116 primitives, tests, types, build config. The entire package.
- **`@slidemason/components`** — Import path ceases to exist. Removed from workspace, resolve plugin, and all references.

## What Changes

### CLAUDE.md — Complete Rewrite

Replaces template decision table with opinionated design principles:

1. Every slide is bespoke — no two use the same layout
2. Cinematic typography — text-6xl to text-8xl headlines, generous whitespace
3. Glass cards for grouped content — `var(--sm-glass-bg)` + backdrop-blur
4. Gradient text for impact — `var(--sm-primary)` to `var(--sm-secondary)`, used sparingly
5. Staggered Framer Motion animations — increasing delay per element
6. Icons as visual anchors — Lucide at 32-48px, theme-tinted
7. Theme variables only — never hardcode colors
8. Ghost numbers on section dividers — text-[12rem] at 5-10% opacity
9. No bullet lists ever — icon card grids or vertical stacks with icons
10. Responsive clamp() sizing — scales from sidebar to fullscreen

Includes: theme variable reference table, animation recipes, layout pattern examples.

### slides.tsx Format

```tsx
import { motion } from 'framer-motion';
import { Radio, Brain, Bell } from 'lucide-react';

const slides = [
  <div key="s1" className="flex flex-1 ...">
    <motion.h1 ...>Title</motion.h1>
  </div>,
];

export default slides;
```

Each slide is a raw `<div>` with custom Tailwind + Framer Motion + theme vars. No template imports.

### Build Flow

"Build Deck" button opens NextStepsModal with updated prompt for the user's AI coding tool. The AI reads brief + source files, writes custom JSX to `slides.tsx`, Vite hot-reloads.

### Vite Config

- Remove `@slidemason/components` from monorepo resolve plugin
- Add `framer-motion` and `lucide-react` resolution for deck files outside app root
- Remove `packages/components` from pnpm workspace

## Deck Design Quality Bar

The reference standard is the Deck-Builder app at `/Users/erickittelson/Downloads/Deck-Builder`:
- Pure dark canvas with gradient typography
- Large cinematic text (8xl)
- Staggered entrance animations with custom cubic-bezier easing
- Glass cards with semi-transparent backgrounds
- Ghost numbers on section slides
- Color-coded data elements
- Each slide feels hand-designed, not generated

## Implementation Order

1. Delete `packages/components/`
2. Update workspace config
3. Update vite.config.ts resolve plugin
4. Rewrite CLAUDE.md with new design principles
5. Update NextStepsModal prompt
6. Rewrite default `apps/studio/src/slides.tsx` placeholder
7. Rebuild `decks/saberalert/slides.tsx` as custom JSX (proving ground)
8. Verify build + type-check
