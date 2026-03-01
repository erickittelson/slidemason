# Purposeful Animation & Interaction Design

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the primitives from auto-animated components into pure visual atoms, then add opt-in animation and interaction toolkits that give the AI full creative control for narrative-driven presentations.

**Architecture:** Strip all Framer Motion from existing primitives. Delete StaggerContext. Add new layout atoms (Grid, Split, Stack, Row, Spacer, ColorBar). Add animation toolkit (Animate wrapper, CountUp, TypeWriter, Stagger, ProgressReveal). Add interaction toolkit (Tooltip, HoverCard, HoverHighlight, ClickReveal, Tabs, Accordion, Flipcard, BeforeAfter, Sortable, Spotlight). Rewrite CLAUDE.md to shift AI behavior from "animate everything" to "animate with purpose."

**Tech Stack:** React, Framer Motion, CSS, TypeScript

---

## Section 1: Primitives Overhaul — Strip Animation, Add Layout Atoms

### Strip animation from all existing primitives

Every existing primitive wraps its content in `motion.div` with auto-stagger via `useStagger()`. All of this is removed:

- `<Slide>` — remove `StaggerProvider` wrapper. Keep layout/bg logic.
- `<Heading>` — remove `motion.div`, render plain semantic HTML (`h1`/`h2`/`h3`).
- `<Text>` — remove `motion.div`, render plain `<p>`.
- `<Badge>` — remove `motion.div`, render plain `<span>`.
- `<Card>` — remove `motion.div`, render plain `<div>`.
- `<GradientText>` — remove `motion.div`, render plain heading tag.
- `<GhostNumber>` — already no animation, no change.
- `<Divider>` — remove `motion.div`, render plain `<div>`.
- `<IconCircle>` — remove `motion.div`, render plain `<div>`.
- `<StatBox>` — remove `motion.div`, render plain `<div>`.
- `<Step>` — remove `motion.div`, render plain `<div>`.
- `<Pipeline>` — remove `motion.div` from internal elements, render plain divs.

**Delete entirely:** `StaggerContext.tsx` (the `StaggerProvider` and `useStagger` hook).

Framer Motion is removed as a dependency of `@slidemason/primitives`. It remains available for deck files to import directly.

### New layout atoms

These save the AI from writing repetitive CSS grid/flex boilerplate:

| Component | Props | Purpose |
|---|---|---|
| `<Grid cols={2\|3\|4} gap?>` | `cols`, `gap` (sm/md/lg) | CSS grid shorthand |
| `<Split ratio? reverse?>` | `ratio` ("35/65", "50/50", "40/60"), `reverse` | Two-panel flex layout |
| `<Stack gap? align?>` | `gap` (sm/md/lg), `align` (start/center/end/stretch) | Flex column |
| `<Row gap? align? wrap?>` | `gap`, `align`, `wrap` | Flex row |
| `<Spacer size?>` | `size` (sm/md/lg/xl) | Intentional whitespace |
| `<ColorBar color? position?>` | `color` (theme var), `position` (top/left/bottom/right) | Accent stripe on cards |

All layout atoms accept `style` and `className` for overrides.

---

## Section 2: Animation Toolkit — Opt-In, Narrative-Driven

### `<Animate>` wrapper

General-purpose animation wrapper. The AI wraps any element it wants to animate.

**Props:**
- `effect`: `"fade-up"` | `"fade-down"` | `"fade-left"` | `"fade-right"` | `"scale"` | `"blur-in"` | `"slide-left"` | `"slide-right"`
- `delay`: number (seconds, default 0)
- `duration`: number (seconds, default 0.7)
- `ease`: number[] (default `[0.22, 1, 0.36, 1]`)
- `once`: boolean (animate only on first mount, default true)

```tsx
<Animate effect="fade-up" delay={0.2}>
  <Heading size="hero">The Problem</Heading>
</Animate>
```

### Purpose-built animation primitives

| Component | Props | Purpose |
|---|---|---|
| `<CountUp to prefix? suffix? duration?>` | `to` (number), `prefix`/`suffix` (string), `duration` (seconds) | Animated number counter. For stats that should land with impact. |
| `<TypeWriter text speed?>` | `text` (string), `speed` (ms per char, default 40) | Character-by-character text reveal. For dramatic statements. |
| `<Stagger interval?>` | `interval` (seconds, default 0.15) | Wraps children, staggers their entrance. Opt-in version of the old auto-stagger for when sequential reveal is desired. |
| `<ProgressReveal value label? color?>` | `value` (0-100), `label`, `color` | Animated progress bar that fills on mount. |

### Escape hatch

The AI can import `framer-motion` directly in deck files and build custom animations. The toolkit covers common cases; raw Framer Motion covers everything else.

---

## Section 3: Interaction Toolkit — Presenter-Driven

Interactive elements the AI uses when an interaction would help the presenter make a point. Not required on every slide.

### Tier 1: Hover-based (CSS/no state)

| Component | Props | Purpose |
|---|---|---|
| `<Tooltip content>` | `content` (string or ReactNode) | Shows tooltip on hover. For supporting data that shouldn't clutter the slide. |
| `<HoverCard>` | `children`, `hoverContent` | Card that reveals additional content on hover. |
| `<HoverHighlight>` | Wraps a group of children | Dims siblings on hover, spotlighting the hovered item. |

### Tier 2: Click-driven (simple state)

| Component | Props | Purpose |
|---|---|---|
| `<ClickReveal>` | `children` | Hidden until presenter clicks. For building arguments piece by piece. |
| `<Tabs items>` | `items: {label, content}[]` | Tabbed panels. For multiple related views on one slide. |
| `<Accordion items>` | `items: {title, content}[]` | Expandable sections. For detailed breakdowns. |
| `<Flipcard front back>` | `front`, `back` (ReactNode) | Click to flip. For before/after, problem/solution pairs. |

### Tier 3: Rich interactions

| Component | Props | Purpose |
|---|---|---|
| `<BeforeAfter before after>` | `before`, `after` (ReactNode) | Slider/toggle between two states. For transformation stories. |
| `<Sortable items>` | `items: {id, content}[]` | Draggable reorderable list. For prioritization exercises. |
| `<Spotlight items>` | `items: {content, highlight}[]` | Click through a sequence, dimming non-active items. For walking through processes. |

### Escape hatch

The AI can use `useState`, `useEffect`, any React pattern directly in deck files to build custom interactions (timers, calculators, simulations, etc.).

---

## Section 4: CLAUDE.md Rewrite

### Philosophy shift

**Old:** "Staggered entrance animations. Every element uses Framer Motion with increasing delay. Creates a cinematic reveal effect."

**New:** "Nothing animates by default. Animation is a narrative tool. Use it to direct attention, build tension, or land a point. A slide with zero animation is often stronger than one where everything moves."

### New sections to add

**Deck Planning (before writing JSX):**
- Plan the entire deck's rhythm before writing code
- Map which slides are static, which animate, which are interactive
- Animation budget: ~3-5 animated moments per 15-slide deck, each with a reason
- Interaction budget: ~1-3 interactive slides per deck

**Animation guidance:**
- Use `<Animate>` wrapper for entrance effects
- Use `<CountUp>` when a stat should land with impact
- Use `<Stagger>` when sequential reveal serves the narrative
- Use `<TypeWriter>` for dramatic one-liners
- Import `framer-motion` directly for custom effects
- Never animate without narrative purpose

**Interaction guidance:**
- Interactive elements serve the presenter's flow
- Use `<ClickReveal>` to let the presenter build an argument
- Use `<Tooltip>` to hide detail until needed
- Use `<Tabs>` when one slide has multiple angles
- Use `useState`/`useEffect` freely for custom interactions
- Most slides won't need interaction — use it when a point is better explored than shown

### Design principles changes

**Remove:**
- Rule 5: "Staggered entrance animations" (now opt-in, not default)
- Rule 9: "No bullet lists ever" (sometimes a clean list is the best design)

**Add:**
- "Animation with purpose — every animation should have a narrative reason"
- "Interaction with intent — interactive elements serve the presenter's flow"

**Keep all other rules:** layout variety, glass cards, gradient text sparingly, ghost numbers, theme variables, responsive clamp(), icon anchors, etc.

### Import rules change

**Old:** "Import only from `@slidemason/primitives` and `lucide-react`. Do NOT import `framer-motion` directly."

**New:** "Import from `@slidemason/primitives`, `lucide-react`, and `framer-motion`. Use React hooks (`useState`, `useEffect`, etc.) freely in deck files when building custom interactions."

---

## Migration

The existing `decks/saberalert-mvp/slides.tsx` will need a rewrite to use the new system. This is expected — it was built on the old auto-stagger model. The rewrite is a good test case for the new primitives.
