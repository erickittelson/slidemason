# PPTX Export — Design Document

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:writing-plans to create the implementation plan.

**Goal:** Export any Slidemason deck as a native, editable PowerPoint file (.pptx) where text, shapes, and colors are real PowerPoint elements — not screenshots.

**Philosophy:** The web version is the cinematic experience (glass, gradients, animations, interactions). The PPTX export is a clean translation — a well-designed PowerPoint deck that matches the content and theme colors, with fully editable text and shapes. It's meant for both editing and sharing.

---

## Architecture

The export uses a **data-attribute instrumented DOM extraction** approach:

1. Each primitive gets `data-pptx-*` attributes on its root element
2. Playwright renders slides in a special `?print&pptx` mode
3. A DOM extractor queries all tagged elements, capturing bounding boxes, text content, and metadata
4. A `PptxBuilder` maps the extracted data to `pptxgenjs` API calls
5. Theme colors come from `getTheme(name)` — real hex values, no CSS variable resolution needed

**Why data attributes?** Because a `<div>` with glass styling could be a Card, Badge, or custom JSX. The `data-pptx-type` attribute removes all ambiguity — the serializer knows exactly what it's looking at.

**Flow:**
```
User clicks "Export PPTX" in sidebar
  → Studio hits GET /__api/decks/{slug}/export/pptx
  → Server reads brief for theme name
  → Server calls getTheme(name) for hex colors
  → Playwright opens http://localhost:{port}/?print&pptx#{slug}
  → For each slide: extract [data-pptx-type] elements with bounding boxes
  → PptxBuilder generates .pptx via pptxgenjs
  → Browser downloads .pptx file
```

---

## Primitive Instrumentation

Each primitive adds a `data-pptx-type` attribute to its root element. Minimal change — one attribute per component.

| Primitive | `data-pptx-type` | Extra attributes |
|---|---|---|
| `Slide` | `slide` | `data-pptx-layout`, `data-pptx-bg` |
| `Heading` | `heading` | `data-pptx-size` (md/lg/hero) |
| `Text` | `text` | `data-pptx-muted` if muted |
| `Badge` | `badge` | — |
| `Card` | `card` | — |
| `GradientText` | `gradient-text` | `data-pptx-size` |
| `StatBox` | `statbox` | `data-pptx-value`, `data-pptx-label` |
| `GhostNumber` | `ghost` | Skipped in PPTX (decorative) |
| `Divider` | `divider` | — |
| `IconCircle` | `icon` | Rendered as colored circle |
| `Pipeline` | `pipeline` | Rendered as connected shapes |
| `Step` | `step` | `data-pptx-n`, `data-pptx-active` |
| `ColorBar` | `colorbar` | — |

**Layout atoms** (Grid, Split, Stack, Row, Spacer): tagged for position reference. Their children's bounding boxes determine layout in PPTX.

**Animation/interaction wrappers** (Animate, Stagger, CountUp, TypeWriter, ClickReveal, Tabs, etc.): tagged as `passthrough`. In `?pptx` mode they render their final/visible state immediately — no motion, no hidden content.

---

## PPTX Rendering Rules

### Text → Native text boxes (fully editable)

| Source | PPTX font size | Style |
|---|---|---|
| `Heading` hero | 44pt | Bold, heading font |
| `Heading` lg | 28pt | Bold, heading font |
| `Heading` md | 20pt | Bold, heading font |
| `Text` md | 14pt | Normal, body font |
| `Text` sm | 12pt | Normal, body font |
| `Text` xs | 10pt | Normal, body font |
| `Badge` | 9pt | Uppercase, letter-spaced, body font |
| `GradientText` | Same as Heading sizes | Bold, solid primary color (gradient → solid fallback) |

### Containers → Rounded rectangles

- `Card` → rounded rect, surface fill, border color
- `StatBox` → rounded rect with centered value (large) + label (small)
- `ColorBar` → thin rect on card edge

### Decorative → Simplified or skipped

- `GhostNumber` → skipped (visual noise in PPTX)
- `Divider` → thin line, primary color
- `IconCircle` → colored circle shape (no Lucide glyph)
- Inline Lucide icons → skipped (text carries meaning)

### Layout → Absolute positioning from bounding boxes

Playwright's `getBoundingClientRect()` gives pixel positions. Normalize to PPTX slide dimensions (10" × 5.625" at 16:9). Elements placed at computed x/y/w/h. Layout atoms don't need direct translation — their effect is captured in child positions.

### Slide backgrounds

- `bg="none"` → solid fill, theme background color
- `bg="mesh"` → solid fill, theme background color (mesh can't translate)

### Interactive → Static snapshot

- `ClickReveal` → rendered revealed
- `Tabs` → first tab rendered
- `Tooltip` → skip tooltip, render trigger
- `Flipcard` → render front face
- `Accordion` → all sections expanded
- `CountUp` → render final number
- `TypeWriter` → render full text

---

## Export Flow & Studio Integration

### API endpoint

```
GET /__api/decks/{slug}/export/pptx
```

Added to `vite-plugin-studio-api.ts`. Returns `.pptx` buffer with `Content-Disposition: attachment` header.

### PPTX print mode

When URL contains `?pptx` (in addition to `?print`):
- Animation components render final state immediately (no delays, no motion)
- Interactive components render default visible state
- Small addition to existing print mode detection

### Studio UI

"Export PPTX" button in sidebar. Click → loading state → file download.

### File structure

```
packages/export/src/
  pdf.ts          (existing)
  static.ts       (existing)
  pptx.ts         (new)
  index.ts        (add pptx export)
```

New dependency: `pptxgenjs` in `packages/export/package.json`.

---

## What the output looks like

A 15-slide SaberAlert deck exported to PPTX would have:
- Black background (noir theme) on every slide
- All headings, body text, badges as editable text boxes in the correct fonts/sizes
- Cards as rounded rectangles with dark surface fill and subtle borders
- StatBox values as large centered text in colored rectangles
- Pipeline as a row of circles connected by lines
- Step lists as numbered items with circle markers
- Theme colors (gold primary, stone secondary, amber accent) applied throughout
- No glass blur, no mesh gradients, no animations — clean, professional PowerPoint

The recipient can open in PowerPoint or Google Slides, edit any text, change colors, move elements, add their own slides.
