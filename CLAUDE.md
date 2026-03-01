# Slidemason — AI Agent Instructions

> These instructions are for **any AI coding agent** (Claude Code, Cursor, GitHub Copilot, Windsurf, etc.)
> working inside this repository. Read this file completely before generating or modifying
> any presentation content.

---

## What This Project Is

Slidemason is a local-first, open-source presentation builder. The monorepo is structured as follows:

| Path | Purpose |
|---|---|
| `packages/renderer/` | Presentation engine with Framer Motion transitions |
| `packages/themes/` | 12 CSS themes with 31 variables each |
| `apps/studio/` | Vite-based studio with sidebar workflow |
| `decks/` | Each deck is a folder (e.g. `decks/my-pitch/`) |
| `decks/<slug>/data/` | Source documents (PDFs, markdown, text, etc.) |
| `decks/<slug>/generated/brief.json` | Brief file produced by the studio |
| `decks/<slug>/slides.tsx` | The deck's slide content |

---

## How to Generate a Presentation

### Step 1: Read All Source Documents

Read **every file** in `decks/<slug>/data/`. Synthesize key themes, metrics, decisions, quotes, and takeaways. Do not skip any file — the user placed it there for a reason.

### Step 2: Read the Brief

Read `decks/<slug>/generated/brief.json` for audience, goal, tone, theme, fonts, and constraints. The brief tells you **who** you are presenting to and **what** the deck should accomplish.

### Step 3: Plan the Narrative Arc

Plan the deck structure **BEFORE** writing any code. Use this framework:

1. **Hook** — Open with something compelling (a bold stat, provocative question, or surprising insight)
2. **Context** — Set the stage (background, current state, why this matters now)
3. **Problem** — Define the pain points (what is broken, what is at stake)
4. **Vision** — Paint the desired future (where we want to be)
5. **Solution** — Present the approach (how we get there)
6. **Evidence** — Support with data and metrics (proof it works or will work)
7. **Roadmap** — Show the path forward (phases, milestones, timeline)
8. **Ask** — Close with a clear call to action (what you need from the audience)

Not every deck needs all eight beats. Adapt based on the source material and the brief's stated goal.

### Step 4: Design and Write the Slides

Edit `decks/<slug>/slides.tsx`. Each slide is **bespoke JSX** — a unique design tailored to its specific content. Import from `@slidemason/primitives` and `lucide-react`. Use primitives for layout, typography, and animation. Use Tailwind classes and theme CSS variables for any custom styling.

```tsx
import {
  Slide, Heading, Text, Badge, Card, GradientText,
  GhostNumber, Divider, IconCircle, StatBox, Step, Pipeline,
} from '@slidemason/primitives';
import { Radio, Brain, Bell, ShieldCheck } from 'lucide-react';

const slides = [
  <Slide key="s1" layout="center" bg="mesh">
    <Badge>Company · Stage · Context</Badge>
    <GradientText size="hero">Product Name</GradientText>
    <Text muted style={{ maxWidth: '28ch' }}>
      Tagline goes here
    </Text>
  </Slide>,
];

export default slides;
```

> **Important:** Do NOT import `framer-motion` in deck files. All animation is built into the primitives via auto-stagger. See the Slide Primitives section below.

---

## Design Principles — FOLLOW THESE

**Think like a cinematic director, not a report writer.** Every slide should feel hand-designed for its content. No two slides should look the same.

1. **Every slide is bespoke.** Design a unique layout for each slide's specific content. Never reuse the same layout pattern on consecutive slides.
2. **Cinematic typography.** Headlines at `text-6xl` to `text-8xl`. Generous whitespace. Let content breathe. Use `clamp()` for responsive sizing.
3. **Glass cards for grouped content.** Use `var(--sm-glass-bg)` background + `backdrop-blur-sm` + `1px solid var(--sm-border)` for card containers. Round with `var(--sm-radius)`.
4. **Gradient text for impact moments.** `linear-gradient(135deg, var(--sm-primary), var(--sm-secondary))` with `WebkitBackgroundClip: 'text'`. Use sparingly — title slide and 1-2 key statements only.
5. **Staggered entrance animations.** Every element uses Framer Motion with increasing `delay`. Creates a cinematic reveal effect. Use the easing `[0.22, 1, 0.36, 1]`.
6. **Icons as visual anchors.** Lucide icons at 32-48px, colored with theme variables. Every content slide should have icons to break up text.
7. **Theme variables only — never hardcode colors.** All colors come from `var(--sm-*)` CSS variables. This ensures every theme works.
8. **Ghost numbers on section dividers.** A massive faded number (text-[12rem], opacity 5-10%) positioned behind the section title. Creates depth.
9. **No bullet lists ever.** Present lists as icon card grids (2x2 or 3-col), or as vertical stacks with large icons and descriptions. Each item gets its own visual treatment.
10. **Responsive clamp() sizing.** All text uses `clamp(min, preferred, max)` so slides scale from sidebar preview to fullscreen.
11. **Alternate layout density.** Follow a dense, data-heavy slide with a spacious, breathing slide. Rhythm matters.
12. **Maximum visual variety.** Never repeat the same layout pattern on consecutive slides. Alternate between centered, split, grid, and asymmetric layouts.

---

## Slide Primitives (`@slidemason/primitives`)

When generating slides, **always use primitives** instead of raw `<div>` + inline styles. This dramatically reduces code size and ensures consistent animation and theming.

### Available Primitives

| Component | Purpose | Example |
|---|---|---|
| `<Slide layout bg?>` | Slide wrapper with auto-stagger | `<Slide layout="center" bg="mesh">` |
| `<Heading size?>` | Themed heading | `<Heading size="hero">Title</Heading>` |
| `<Text size? muted?>` | Body paragraph | `<Text muted>Subtitle</Text>` |
| `<Badge>` | Glass pill label | `<Badge>Pre-Seed · Q1 2026</Badge>` |
| `<Card glass? pad?>` | Glass card container | `<Card pad="lg">content</Card>` |
| `<StatBox icon? value label color?>` | Metric display | `<StatBox icon={Wifi} value="200K+" label="Signals" />` |
| `<IconCircle icon size? active? color?>` | Icon in circle | `<IconCircle icon={Brain} size="lg" />` |
| `<GradientText size? as?>` | Gradient-clipped text | `<GradientText size="hero">Title</GradientText>` |
| `<GhostNumber n>` | Faded background number | `<GhostNumber n={3} />` |
| `<Divider width?>` | Gradient horizontal rule | `<Divider />` |
| `<Step n active?>` | Numbered step | `<Step n={1} active>First</Step>` |
| `<Pipeline items>` | Horizontal process flow | `<Pipeline items={[{icon, label, sub}]} />` |

### Slide Layouts

- `center` — centered flex column (hero slides, statements)
- `split` — two-panel 35/65 split
- `grid` — auto-grid based on children
- `statement` — centered with extra breathing room
- `free` — no preset layout (default)

### Size Props

| Component | Sizes |
|---|---|
| `Heading` | `"md"` \| `"lg"` \| `"hero"` |
| `Text` | `"xs"` \| `"sm"` \| `"md"` |
| `GradientText` | `"md"` \| `"lg"` \| `"hero"` \| `"stat"` |
| `Card` pad | `"sm"` \| `"md"` \| `"lg"` |
| `IconCircle` | `"sm"` \| `"md"` \| `"lg"` |

### Rules for Primitives

1. **No `framer-motion` import in deck files** — animation is built into every primitive
2. **No `clamp()` calls for text** — use `size` props instead
3. **No animation boilerplate** — delete `fade`, `stagger`, `scaleIn` helpers
4. **No glass style helper** — `<Card>` does this automatically
5. **`style` prop for overrides only** — most styling is handled by props
6. **Still use `var(--sm-*)` for colors** — primitives use theme vars internally

---

## Theme Variable Reference

All 12 themes define these CSS custom properties. Use them for ALL colors:

| Variable | Purpose | Sunset Example |
|---|---|---|
| `--sm-bg` | Page background | `#1e1b4b` |
| `--sm-surface` | Card/container background | `#312e81` |
| `--sm-text` | Primary text color | `#fef3c7` |
| `--sm-muted` | Secondary/subtle text | `#a5b4fc` |
| `--sm-primary` | Brand/accent color | `#f97316` |
| `--sm-secondary` | Second accent color | `#ec4899` |
| `--sm-accent` | Highlight color | `#fbbf24` |
| `--sm-border` | Border color | `#3730a3` |
| `--sm-glass-bg` | Glassmorphic background | `rgba(49,46,129,0.7)` |
| `--sm-gradient-start` | Gradient start | `#f97316` |
| `--sm-gradient-end` | Gradient end | `#ec4899` |
| `--sm-gradient-mesh-1/2/3/4` | Mesh gradient colors | (theme-specific) |
| `--sm-chart-1` through `--sm-chart-6` | Data visualization colors | (theme-specific) |
| `--sm-success` | Positive status | `#22c55e` |
| `--sm-warning` | Caution status | `#fbbf24` |
| `--sm-danger` | Negative status | `#ef4444` |
| `--sm-shadow-sm/md/lg` | Shadow values | (theme-specific) |
| `--sm-radius` | Border radius | `0.5rem` |
| `--sm-mono-font` | Monospace font | `JetBrains Mono` |

---

## Animation Recipes

> **Note:** When using `@slidemason/primitives`, you do NOT need these recipes. Animation is built into every primitive via auto-stagger. These are only for reference if you need custom raw JSX elements:

```tsx
// Fade up (most common — use for every text element)
const fade = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
};

// Scale in (for cards, icons, images)
const scaleIn = {
  initial: { opacity: 0, scale: 0.85 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

// Stagger children — add increasing delay
// transition={{ delay: 0.15 * index }}

// Slide from left (for split layouts, left panel)
const slideRight = {
  initial: { opacity: 0, x: -40 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
};

// Slide from right (for split layouts, right panel)
const slideLeft = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
};
```

---

## Layout Patterns

These are **examples to inspire**, not rigid templates. Combine and remix freely.

**Hero** — Centered stack, gradient title, optional badge above, subtitle below. Full breathing room.

**Split** — 50/50 flex layout. Content (text + bullets as icon rows) on one side, visual panel (icon grid, illustration, or decorative element) on the other. Alternate left/right between slides.

**Card Grid** — 2x2 or 3-column grid of glass cards. Each card has an icon (32-48px), a title, and 1-2 lines of description. Stagger the entrance animation.

**Statement** — Single large number or quote, centered, with a decorative background effect (radial gradient, mesh, or geometric pattern using CSS).

**Data Wall** — 3-4 large metric boxes in a row. Each box shows a big number (text-5xl+) with a label below. Color-coded using `--sm-chart-*` variables.

**Section Break** — Ghost number (text-[12rem], 5-10% opacity) positioned absolutely behind the title. Small subtitle below. Creates visual rhythm between sections.

**Timeline** — Horizontal or vertical connected steps. Each step is a glass card with a status indicator (colored dot or icon). Connected by a thin line using `--sm-border`.

**Comparison** — Two columns with contrasting accent colors (e.g., `--sm-danger` for "before" and `--sm-success` for "after"). Each column is a glass card.

---

## Available Themes

The following themes can be specified in the brief. They are applied automatically by the renderer:

`midnight` · `slate` · `canvas` · `signal` · `noir` · `dawn` · `boardroom` · `neon` · `forest` · `glacier` · `sunset` · `paper`

---

## Critical Rules

1. **NEVER modify files in `packages/renderer/`, `packages/primitives/`, or `packages/themes/`** — these are framework internals.
2. **ALL presentation content goes in `decks/<slug>/slides.tsx`** — this is the only file you should create or edit per deck.
3. **Import only from `@slidemason/primitives` and `lucide-react`** — no other external dependencies in deck files. Do NOT import `framer-motion` directly.
4. **Every slide needs a unique `key` prop** — React requires this for arrays.
5. **Do not add new dependencies** — everything you need is already installed.
6. **Read ALL files in `decks/<slug>/data/` before generating** — do not skip any source material.
7. **Use TypeScript** — the project is fully typed.
8. **Icon names are PascalCase Lucide icons** — e.g., `Database`, `Shield`, `Zap`, `BarChart3`, `Globe`.
9. **All colors via `var(--sm-*)` variables** — never hardcode hex values like `#fff` or `#000`.
10. **Use `style={{}}` for theme variables** — Tailwind can't read CSS variables at build time. Use `className` for layout (flex, grid, padding) and `style` for colors and dynamic values.
