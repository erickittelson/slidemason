# Slide Primitives & Editor Toolbar — Design

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ship a `@slidemason/primitives` package of atom components + an inline editor toolbar so AI-generated decks use ~63% fewer tokens and users can edit text, colors, order, and delete elements without touching code.

**Architecture:** New `packages/primitives/` workspace package exporting atom components (`Card`, `Heading`, `StatBox`, etc.) and a `<Slide>` wrapper with auto-stagger animation context. Editor toolbar lives in `packages/renderer/` and uses the existing `/__api/decks/:slug/slides/edit` endpoint.

**Tech Stack:** React, Framer Motion, CSS variables (`var(--sm-*)`), Vite plugin API

---

## Section 1: Slide Primitives (`@slidemason/primitives`)

### Package: `packages/primitives/`

New workspace package. Exports atom components that absorb sizing, spacing, animation, and theming.

### `<Slide>` Wrapper

Replaces raw `<div>` slide roots. Provides:
- Responsive padding via layout preset
- Overflow hidden, flex-1
- Animation context (React context providing auto-incrementing stagger index to children)
- Optional background effects (`bg="mesh"`)

```tsx
<Slide layout="center" bg="mesh">
  {children}
</Slide>
```

Layouts:
- `center` — flex-col, items-center, justify-center, text-center
- `split` — two children side-by-side, 35%/65%
- `grid` — CSS grid, auto-columns based on child count
- `statement` — centered with extra breathing room

### Atom Components

| Component | Props | Absorbs |
|---|---|---|
| `<Card>` | `children, glass?, pad?("sm"\|"md"\|"lg")` | Glass bg, border, radius, responsive padding, auto stagger |
| `<Heading>` | `children, size?("md"\|"lg"\|"hero")` | clamp() font sizing, theme color, weight, line-height |
| `<Text>` | `children, muted?, size?("xs"\|"sm"\|"md")` | clamp() font sizing, theme color |
| `<Badge>` | `children` | Glass bg, uppercase, letter-spacing, small padding/font |
| `<StatBox>` | `icon?, value, label, color?` | Icon circle + big number + label, all styled |
| `<IconCircle>` | `icon, size?("sm"\|"md"\|"lg"), active?` | Responsive circle, border, centered icon |
| `<GhostNumber>` | `n` | Absolute 12rem, 5% opacity |
| `<GradientText>` | `children, size?` | Full gradient clip setup |
| `<Divider>` | `width?` | Gradient line, responsive width |
| `<Step>` | `n, children, active?` | Numbered circle + text |
| `<Pipeline>` | `items: {icon, label, sub}[]` | Horizontal pipeline with connector line |

### Auto-Animation

Every primitive auto-animates via `<Slide>` context:
- `<Slide>` provides a React context with a counter ref
- Each primitive calls `useStaggerIndex()` to get its position
- Wraps in `<motion.div>` with `delay: 0.15 * index`
- AI never writes animation props

### Concrete Before/After

**Before (current slide 5, ~70 lines, ~500 tokens):**
```tsx
<div key="s5" className="flex flex-1 flex-col items-center justify-center"
  style={{ padding: 'clamp(2rem, 4vw, 4rem)' }}>
  <motion.h2 {...fade} className="font-bold text-center"
    style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', color: 'var(--sm-text)' }}>
    How Detection Works
  </motion.h2>
  <motion.p {...stagger(1)} className="text-center"
    style={{ fontSize: 'clamp(0.85rem, 1.4vw, 1.1rem)', color: 'var(--sm-muted)', ... }}>
    Ship hardware -> provision -> learn -> alert
  </motion.p>
  {/* ...30 more lines of icon circles, connectors, labels... */}
</div>
```

**After (~10 lines, ~35 tokens):**
```tsx
<Slide layout="center">
  <Heading size="lg">How Detection Works</Heading>
  <Text muted>Ship hardware -> provision -> learn -> alert</Text>
  <Pipeline items={[
    { icon: Wifi, label: 'Sniffers', sub: 'Wi-Fi + BLE capture' },
    { icon: Layers, label: 'Gateway', sub: 'Aggregates & forwards' },
    { icon: Zap, label: 'EMQX', sub: 'MQTT routing' },
    { icon: Eye, label: 'Watcher', sub: 'Real-time analysis' },
    { icon: BellRing, label: 'Alert', sub: 'Push to phone' },
  ]} />
</Slide>
```

### Projected Savings

| Metric | Current | With Primitives |
|---|---|---|
| Lines per 15-slide deck | 489 | ~180 |
| Tokens to generate | ~8,000 | ~2,200 |
| `clamp()` calls | 125 | 0 |
| Inline `style={{}}` | 139 | ~15 (rare overrides) |
| Animation boilerplate | 38 lines | 0 |

---

## Section 2: Editor Toolbar

### Interaction Model

Click any direct child of `<Slide>` to select it. A floating toolbar appears above:

```
  [A] [color dots] [up] [down] [x]
```

| Button | Action | API type |
|---|---|---|
| **A** | contentEditable, save on blur | `type: 'text'` |
| **Colors** | 4-5 theme swatches, click to apply | `type: 'color'` |
| **up/down** | Swap with sibling | `type: 'reorder'` |
| **x** | Remove element | `type: 'delete'` |

### Selection Mechanics

- Click direct child of `<Slide>` -> select (blue outline + toolbar)
- Click outside / Escape -> deselect
- Single selection only
- Toolbar positioned via `getBoundingClientRect()`, clamped to viewport

### Save Flow

1. Every action auto-saves immediately via `POST /__api/decks/:slug/slides/edit`
2. `recentApiEdits` suppresses HMR reload (existing mechanism)
3. "Saved" pill flashes bottom-center for 1.5s
4. On failure: "Save failed" in red, element reverts

### File Locations

| Concern | File |
|---|---|
| `<EditorToolbar>` | `packages/renderer/src/EditorToolbar.tsx` |
| Selection + save logic | `packages/renderer/src/useSlideEditor.ts` |
| Save indicator | `packages/renderer/src/SaveIndicator.tsx` |
| API reorder/delete | `apps/studio/vite-plugin-studio-api.ts` |

### API Extensions

Two new `type` values on existing `handleEditSlides`:

- `type: 'reorder'` — `{ direction: 'up' | 'down', elementText }` — swap sibling JSX nodes
- `type: 'delete'` — `{ elementText }` — remove JSX node containing that text

---

## CLAUDE.md Update

After implementation, update `CLAUDE.md` to teach AI agents to use primitives instead of raw JSX. Replace inline style examples with primitive imports.
