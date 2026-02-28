# Cinematic Deck Builder — Design Document

## Problem

Slidemason's current deck-building pipeline produces presentations that look stale compared to the old Deck-Builder repo. The root causes:

1. **No slide transitions** — hard-cut array swap between slides (no animation)
2. **Minimal AI prompt** — 3 sentences with no narrative structure, design principles, or component guidance
3. **Free-form JSX composition** — the AI arranges 116 primitives manually, producing inconsistent layouts
4. **No viewer chrome** — minimal nav bar, no progress indicator, no cinematic UI
5. **No typography/design constraints** — the AI gets no rules about visual rhythm, spacing, or gradient usage

The old Deck-Builder solved all of these with: Framer Motion transitions, a comprehensive `copilot-instructions.md`, 12 typed slide templates, glassmorphic presentation chrome, and strict design constraints.

## Solution: Port & Adapt

Take the best architectural decisions from Deck-Builder and port them into Slidemason's monorepo.

---

## 1. Opinionated Slide Templates

Create ~15 high-level slide templates in `packages/components/src/templates/` that wrap existing primitives. The AI fills typed props instead of composing free-form JSX.

### Template Inventory

| Template | Purpose | Wraps |
|---|---|---|
| `TitleSlide` | Opening hero with gradient text | `MeshGradient` + `HeroText` |
| `AgendaSlide` | Numbered agenda items, staggered | Custom numbered list |
| `SectionDividerSlide` | Chapter break with giant ghost number | `SectionHeader` |
| `ContentSlide` | Text + bullets, one or two column | `Headline` + `BulletGroup` + `TwoColumn` |
| `ContentMediaSlide` | Text + visual grid side by side | `TwoColumn` + `IconList`/`FeatureGrid` |
| `MetricsSlide` | 2-4 big stat callouts | `StatCallout` grid |
| `FeatureSlide` | 3-6 feature cards with icons | `FeatureGrid` |
| `TimelineSlide` | Vertical or horizontal timeline | `TimelineVertical`/`MilestoneTracker` |
| `ComparisonSlide` | Before/after or pros/cons | `ProsCons`/`BeforeAfter`/`ComparisonMatrix` |
| `ProcessSlide` | Horizontal step flow | `ProcessFlow` |
| `QuoteSlide` | Centered blockquote with attribution | `TestimonialCard`/`PullQuote` |
| `DiagramSlide` | Flywheel, funnel, cycle, flowchart | Any diagram component |
| `TableSlide` | Action items / next steps grid | `NextStepsGrid` |
| `FullBleedSlide` | Statement slide with gradient bg | `GradientBg` + centered text |
| `ConclusionSlide` | Thank you / Q&A / contact | `EndSlide` + optional contact info |

### Design Principles for Templates

- Each template accepts **typed props only** — no free-form `children`
- Templates apply consistent padding, spacing, and `animate="stagger"` internally
- Color/gradient props use a constrained union type (e.g., `'blue' | 'emerald' | 'purple' | 'amber' | 'rose'`)
- All templates are exported from `@slidemason/components` alongside primitives

### Example Usage

```tsx
<TitleSlide
  title="SaberAlert"
  subtitle="Camera-Free Presence Detection"
  badge="MVP Strategy"
  gradient="emerald-blue"
/>

<MetricsSlide
  title="By the Numbers"
  metrics={[
    { value: "<5s", label: "Alert Latency" },
    { value: "<1%", label: "False Positive Rate" },
    { value: "99.9%", label: "Uptime Target" },
  ]}
/>
```

---

## 2. Framer Motion Slide Transitions

Add `framer-motion` to `packages/renderer` and wrap slides in `AnimatePresence`.

### Transition Spec

```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={currentSlide}
    initial={{ opacity: 0, y: 40, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -40, scale: 0.98 }}
    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
  >
    <SlideLayout theme={theme}>{slides[currentSlide]}</SlideLayout>
  </motion.div>
</AnimatePresence>
```

- Easing `[0.22, 1, 0.36, 1]` — fast-in elastic deceleration (Apple/Vercel motion)
- `y: 40` + `scale: 0.98` + `opacity: 0` — slide lifts onto screen
- Exit: reverse direction (`y: -40`) for directional continuity
- 0.7s duration — slow enough to feel cinematic, fast enough to not drag

### Compatibility

Existing CSS `sm-fade-up` / `sm-stagger-*` animations within slides continue to work — they fire on mount after the Framer Motion entrance completes.

---

## 3. Cinematic Viewer Chrome

Upgrade `SlideRenderer` with presentation-quality UI chrome.

### Components

- **Glassmorphic pill nav** (bottom-right): `bg-zinc-900/80 backdrop-blur-md border border-zinc-700/60 shadow-2xl` with prev/next arrow buttons
- **Monospace slide counter** (top-left): `01 / 17` in `font-mono text-xs tracking-widest opacity-40`
- **Gradient progress bar** (bottom edge): 1.5px height, full width, gradient from `var(--sm-primary)` to `var(--sm-accent)`, width = `currentSlide / (slideCount - 1) * 100%`, smooth 500ms transition
- **Dot minimap** (left side, desktop only): vertical dots, clickable, active dot highlighted in `--sm-primary`
- **Auto-hide**: all chrome fades to 0 after 3s mouse inactivity, reappears on movement
- **Keyboard shortcuts**: existing arrows/space + new `f` for fullscreen, `Escape` to exit

### Theme Integration

Chrome uses theme CSS variables (`--sm-primary`, `--sm-accent`, `--sm-border`) so it adapts to any theme automatically.

---

## 4. CLAUDE.md / copilot-instructions.md

Write a single comprehensive instruction file that teaches AI agents how to build cinematic decks.

### Structure

```
1. Project Overview — what Slidemason is, repo structure
2. The Deck-Building Process
   a. Read all files in data/
   b. Read the brief at generated/brief.json
   c. Plan a narrative arc BEFORE writing code
   d. Select templates from the decision table
   e. Write slides.tsx
3. Narrative Arc
   - Hook → Context → Problem → Vision → Solution → Evidence → Roadmap → Ask
   - Every slide must follow logically from the previous
   - 8-15 slides per deck
4. Template Decision Table
   - Opening → TitleSlide
   - Agenda → AgendaSlide
   - Chapter break → SectionDividerSlide
   - Key stats → MetricsSlide
   - Feature list → FeatureSlide
   - Timeline/roadmap → TimelineSlide
   - Comparison → ComparisonSlide
   - Process/flow → ProcessSlide
   - Quote/testimonial → QuoteSlide
   - Bold statement → FullBleedSlide
   - Action items → TableSlide
   - Closing → ConclusionSlide
   - Everything else → ContentSlide or ContentMediaSlide
5. Full Template Reference — every template's TypeScript interface + usage example
6. Design Principles
   - One idea per slide
   - Alternate text-heavy and visual-heavy slides
   - Use SectionDividerSlide between major sections
   - Alternate mediaPosition left/right on ContentMediaSlide
   - Never 3 of the same slide type in a row
   - Gradient text only on headlines and metrics
   - All animation handled by templates (never add custom animation)
7. Constraints
   - NEVER modify renderer or engine files
   - ALL content goes in slides.tsx only
   - No new dependencies
   - Use TypeScript
   - Every slide needs a unique key prop
```

### File Location

Single source at `CLAUDE.md` (project root). Symlinked to `.github/copilot-instructions.md` for Cursor/Copilot/Windsurf compatibility.

---

## 5. Updated NextStepsModal Prompt

The modal's copy-paste prompt becomes minimal because the AI reads CLAUDE.md automatically:

```
Read the brief at generated/brief.json and the source files in data/.
Follow the instructions in CLAUDE.md to build the deck.
```

---

## 6. What Stays The Same

- **Studio sidebar** — file upload → brief → theme → fonts → assets → Build Deck (already good)
- **116 primitive components** — templates wrap them; primitives still available for advanced use
- **Theme CSS system** — 12 themes with CSS custom properties
- **Font picker** with recommended pairings
- **PDF export mode**
- **Existing CSS animation classes** — `sm-fade-up`, `sm-stagger-*`, etc.

---

## Scope Summary

| Area | Change |
|---|---|
| `packages/components/src/templates/` | New: 15 slide template components |
| `packages/components/src/index.ts` | Export templates |
| `packages/renderer/` | Add framer-motion, AnimatePresence, cinematic chrome |
| `CLAUDE.md` | New: comprehensive AI instruction file |
| `.github/copilot-instructions.md` | Symlink to CLAUDE.md |
| `apps/studio/src/components/NextStepsModal.tsx` | Update prompt text |
| `lib/types.ts` | New: typed interfaces for all template props |
