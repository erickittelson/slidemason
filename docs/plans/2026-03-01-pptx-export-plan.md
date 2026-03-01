# PPTX Export Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Export any Slidemason deck as a native, editable PowerPoint file via a button in the Studio sidebar.

**Architecture:** Instrument primitives with `data-pptx-*` attributes. Playwright renders slides in `?print&pptx` mode, extracts tagged element bounding boxes and text. A PptxBuilder maps extracted data + theme hex colors to `pptxgenjs` API calls. Server endpoint returns `.pptx` download.

**Tech Stack:** pptxgenjs, Playwright (already installed), React, TypeScript

---

## Task 1: Add `data-pptx-*` Attributes to All Primitives

Instrument every primitive with a `data-pptx-type` attribute on its root element so the Playwright extractor can identify what each DOM element represents.

**Files:**
- Modify: `packages/primitives/src/Slide.tsx`
- Modify: `packages/primitives/src/Heading.tsx`
- Modify: `packages/primitives/src/Text.tsx`
- Modify: `packages/primitives/src/Badge.tsx`
- Modify: `packages/primitives/src/Card.tsx`
- Modify: `packages/primitives/src/GradientText.tsx`
- Modify: `packages/primitives/src/GhostNumber.tsx`
- Modify: `packages/primitives/src/Divider.tsx`
- Modify: `packages/primitives/src/IconCircle.tsx`
- Modify: `packages/primitives/src/StatBox.tsx`
- Modify: `packages/primitives/src/Step.tsx`
- Modify: `packages/primitives/src/Pipeline.tsx`
- Modify: `packages/primitives/src/Grid.tsx`
- Modify: `packages/primitives/src/Split.tsx`
- Modify: `packages/primitives/src/Stack.tsx`
- Modify: `packages/primitives/src/Row.tsx`
- Modify: `packages/primitives/src/Spacer.tsx`
- Modify: `packages/primitives/src/ColorBar.tsx`

**Changes per component — add `data-pptx-*` to the root element:**

**Slide.tsx** — on the root `<div>`:
```tsx
data-pptx-type="slide"
data-pptx-layout={layout}
data-pptx-bg={bg}
```

**Heading.tsx** — on the `<Tag>`:
```tsx
data-pptx-type="heading"
data-pptx-size={size}
```

**Text.tsx** — on the `<p>`:
```tsx
data-pptx-type="text"
{...(muted ? { 'data-pptx-muted': '' } : {})}
```

**Badge.tsx** — on the root `<div>`:
```tsx
data-pptx-type="badge"
```

**Card.tsx** — on the root `<div>`:
```tsx
data-pptx-type="card"
```

**GradientText.tsx** — on the `<Tag>`:
```tsx
data-pptx-type="gradient-text"
data-pptx-size={size}
```

**GhostNumber.tsx** — on the root `<div>`:
```tsx
data-pptx-type="ghost"
```

**Divider.tsx** — on the root `<div>`:
```tsx
data-pptx-type="divider"
```

**IconCircle.tsx** — on the outer `<div>`:
```tsx
data-pptx-type="icon"
```

**StatBox.tsx** — on the root `<div>`:
```tsx
data-pptx-type="statbox"
data-pptx-value={value}
data-pptx-label={label}
```

**Step.tsx** — on the root `<div>`:
```tsx
data-pptx-type="step"
data-pptx-n={n}
{...(active ? { 'data-pptx-active': '' } : {})}
```

**Pipeline.tsx** — on the root `<div>`:
```tsx
data-pptx-type="pipeline"
```

**Grid.tsx** — on the root `<div>`:
```tsx
data-pptx-type="grid"
```

**Split.tsx** — on the root `<div>`:
```tsx
data-pptx-type="split"
```

**Stack.tsx** — on the root `<div>`:
```tsx
data-pptx-type="stack"
```

**Row.tsx** — on the root `<div>`:
```tsx
data-pptx-type="row"
```

**Spacer.tsx** — on the root `<div>`:
```tsx
data-pptx-type="spacer"
```

**ColorBar.tsx** — on the root `<div>`:
```tsx
data-pptx-type="colorbar"
```

**Step: Verify build**

Run: `npx tsc --noEmit`
Expected: clean, no errors

**Step: Commit**

```bash
git add packages/primitives/src/
git commit -m "feat: add data-pptx-* attributes to all primitives for PPTX export"
```

---

## Task 2: Add `data-pptx-*` Attributes to Animation & Interaction Primitives

These components wrap children. In PPTX mode they should be transparent (passthrough). Mark them so the extractor knows to skip the wrapper and just extract children.

**Files:**
- Modify: `packages/primitives/src/Animate.tsx`
- Modify: `packages/primitives/src/CountUp.tsx`
- Modify: `packages/primitives/src/TypeWriter.tsx`
- Modify: `packages/primitives/src/Stagger.tsx`
- Modify: `packages/primitives/src/ProgressReveal.tsx`
- Modify: `packages/primitives/src/Tooltip.tsx`
- Modify: `packages/primitives/src/HoverCard.tsx`
- Modify: `packages/primitives/src/HoverHighlight.tsx`
- Modify: `packages/primitives/src/ClickReveal.tsx`
- Modify: `packages/primitives/src/Tabs.tsx`
- Modify: `packages/primitives/src/Accordion.tsx`
- Modify: `packages/primitives/src/Flipcard.tsx`
- Modify: `packages/primitives/src/BeforeAfter.tsx`
- Modify: `packages/primitives/src/Sortable.tsx`
- Modify: `packages/primitives/src/Spotlight.tsx`

**Changes:**

**Animate.tsx** — add to the `motion.div` (both branches):
```tsx
data-pptx-type="passthrough"
```

**CountUp.tsx** — add to the `<span>`:
```tsx
data-pptx-type="text"
data-pptx-countup-final={`${prefix}${to.toFixed(decimals)}${suffix}`}
```
This lets the extractor grab the final value without waiting for animation.

**TypeWriter.tsx** — add to the root:
```tsx
data-pptx-type="text"
data-pptx-typewriter-final={text}
```

**Stagger.tsx** — add to the outer `<div>`:
```tsx
data-pptx-type="passthrough"
```

**ProgressReveal.tsx** — add to the root `<div>`:
```tsx
data-pptx-type="progress"
data-pptx-value={value}
data-pptx-label={label || ''}
```

**ClickReveal.tsx** — The component has two render paths (revealed/hidden). Add `data-pptx-type="passthrough"` to the revealed `<div>`. Also add `data-pptx-reveal-content` to the hidden state wrapper so the PPTX mode CSS can force it visible.

**Tabs.tsx** — add to the root `<div>`:
```tsx
data-pptx-type="tabs"
```

**Accordion.tsx** — add to the root:
```tsx
data-pptx-type="passthrough"
```

**Flipcard.tsx** — add to the root:
```tsx
data-pptx-type="passthrough"
```

**BeforeAfter.tsx** — add to the root:
```tsx
data-pptx-type="passthrough"
```

**Sortable.tsx** — add to the root:
```tsx
data-pptx-type="passthrough"
```

**Spotlight.tsx** — add to the root:
```tsx
data-pptx-type="passthrough"
```

**HoverCard.tsx** — add to the root:
```tsx
data-pptx-type="passthrough"
```

**HoverHighlight.tsx** — add to the root:
```tsx
data-pptx-type="passthrough"
```

**Tooltip.tsx** — add to the root:
```tsx
data-pptx-type="passthrough"
```

**Step: Verify build**

Run: `npx tsc --noEmit`
Expected: clean

**Step: Commit**

```bash
git add packages/primitives/src/
git commit -m "feat: add data-pptx-* attributes to animation and interaction primitives"
```

---

## Task 3: Add PPTX Print Mode (Render Final States)

When `?pptx` is in the URL, animation components should render their final state immediately (no motion), and interactive components should render their visible/revealed state.

**Files:**
- Modify: `apps/studio/src/lib/mode.ts`
- Modify: `packages/primitives/src/Animate.tsx`
- Modify: `packages/primitives/src/CountUp.tsx`
- Modify: `packages/primitives/src/TypeWriter.tsx`
- Modify: `packages/primitives/src/Stagger.tsx`
- Modify: `packages/primitives/src/ProgressReveal.tsx`
- Modify: `packages/primitives/src/ClickReveal.tsx`

**mode.ts** — add a helper to detect pptx mode:

```tsx
export function isPptxMode(): boolean {
  return typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('pptx');
}
```

**Primitives** need to import this and short-circuit animation/interaction when true:

**Animate.tsx** — when `isPptxMode()`, render a plain `<div>` with the same className/style but no motion:
```tsx
import { isPptxMode } from '@slidemason/studio/lib/mode';
// At top of component:
if (isPptxMode()) {
  return <div className={className} style={style} data-pptx-type="passthrough">{children}</div>;
}
```

Wait — primitives can't import from studio. We need a different approach.

**Better approach:** Use a CSS media query or URL detection inside each primitive. Since primitives run in the browser, they can check `window.location.search` directly.

Create a shared utility in primitives:

**Create: `packages/primitives/src/pptxMode.ts`**
```tsx
export function isPptxMode(): boolean {
  return typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('pptx');
}
```

Then each animation/interaction primitive imports from `./pptxMode` and short-circuits:

**Animate.tsx** — add at top of component function:
```tsx
import { isPptxMode } from './pptxMode';
// ...
if (isPptxMode()) {
  return <div className={className} style={style} data-pptx-type="passthrough">{children}</div>;
}
```

**CountUp.tsx** — render final value immediately:
```tsx
import { isPptxMode } from './pptxMode';
// ...
if (isPptxMode()) {
  return <span ref={ref} className={className} style={style} data-pptx-type="text">{prefix}{to.toFixed(decimals)}{suffix}</span>;
}
```

**TypeWriter.tsx** — render full text immediately:
```tsx
import { isPptxMode } from './pptxMode';
// ... at top of component:
if (isPptxMode()) {
  return <span className={className} style={style} data-pptx-type="text">{text}</span>;
}
```

**Stagger.tsx** — render children without motion wrappers:
```tsx
import { isPptxMode } from './pptxMode';
// ...
if (isPptxMode()) {
  return <div className={className} style={style} data-pptx-type="passthrough">{children}</div>;
}
```

**ProgressReveal.tsx** — render bar at full width immediately:
```tsx
import { isPptxMode } from './pptxMode';
// ...
if (isPptxMode()) {
  return (
    <div ref={ref} className={className} style={style} data-pptx-type="progress" data-pptx-value={value} data-pptx-label={label || ''}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 'clamp(0.7rem, 0.9vw, 0.85rem)' }}>
          <span style={{ color: 'var(--sm-text)' }}>{label}</span>
          <span style={{ color: 'var(--sm-muted)' }}>{value}%</span>
        </div>
      )}
      <div style={{ width: '100%', height, borderRadius: height / 2, background: 'var(--sm-surface)', overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', borderRadius: height / 2, background: color }} />
      </div>
    </div>
  );
}
```

**ClickReveal.tsx** — always render revealed state:
```tsx
import { isPptxMode } from './pptxMode';
// ... at top of component:
if (isPptxMode()) {
  return <div className={className} style={style} data-pptx-type="passthrough">{children}</div>;
}
```

**Step: Export `isPptxMode` from primitives index (not needed — internal only)**

**Step: Verify build**

Run: `npx tsc --noEmit`
Expected: clean

**Step: Commit**

```bash
git add packages/primitives/src/
git commit -m "feat: add PPTX print mode — animation/interaction primitives render final state"
```

---

## Task 4: Install pptxgenjs and Create PptxBuilder

The core export engine. Extracts slide data from Playwright DOM, maps to pptxgenjs API calls.

**Files:**
- Modify: `packages/export/package.json` (add pptxgenjs dependency)
- Create: `packages/export/src/pptx.ts`
- Modify: `packages/export/src/index.ts`

**Step 1: Install pptxgenjs**

Run: `cd packages/export && pnpm add pptxgenjs`

**Step 2: Create `packages/export/src/pptx.ts`**

```typescript
import { chromium } from 'playwright';
import PptxGenJS from 'pptxgenjs';
import { getTheme, type ThemeConfig } from '@slidemason/themes';

/* ── Types ── */

interface ExtractedElement {
  type: string;           // data-pptx-type value
  text: string;           // innerText
  x: number;              // percentage of slide width (0-100)
  y: number;              // percentage of slide height (0-100)
  w: number;              // percentage width
  h: number;              // percentage height
  attrs: Record<string, string>; // all data-pptx-* attributes
}

interface ExtractedSlide {
  layout: string;
  bg: string;
  elements: ExtractedElement[];
}

interface ExportPptxOptions {
  url: string;
  slug: string;
  themeName: string;
  slideCount: number;
}

/* ── Helpers ── */

/** Convert hex color (#rrggbb) to pptxgenjs format (RRGGBB without #) */
function hex(color: string): string {
  return color.replace('#', '');
}

/** Convert percentage position to inches (10" wide slide) */
function pctToInchesX(pct: number): number {
  return (pct / 100) * 10;
}

/** Convert percentage position to inches (5.625" tall slide at 16:9) */
function pctToInchesY(pct: number): number {
  return (pct / 100) * 5.625;
}

/* ── Font size mapping ── */

const HEADING_SIZES: Record<string, number> = {
  hero: 44,
  lg: 28,
  md: 20,
};

const TEXT_SIZES: Record<string, number> = {
  md: 14,
  sm: 12,
  xs: 10,
};

/* ── Extraction ── */

async function extractSlide(page: import('playwright').Page): Promise<ExtractedSlide> {
  return page.evaluate(() => {
    const slideEl = document.querySelector('[data-pptx-type="slide"]');
    const layout = slideEl?.getAttribute('data-pptx-layout') || 'free';
    const bg = slideEl?.getAttribute('data-pptx-bg') || 'none';

    const slideRect = slideEl?.getBoundingClientRect() || { left: 0, top: 0, width: 1920, height: 1080 };

    const elements: ExtractedElement[] = [];
    const tagged = document.querySelectorAll('[data-pptx-type]');

    for (const el of tagged) {
      const type = el.getAttribute('data-pptx-type') || '';

      // Skip the slide wrapper itself, passthrough wrappers, spacers, and ghosts
      if (['slide', 'passthrough', 'spacer', 'ghost', 'grid', 'split', 'stack', 'row'].includes(type)) continue;

      const rect = el.getBoundingClientRect();

      // Collect all data-pptx-* attributes
      const attrs: Record<string, string> = {};
      for (const attr of el.attributes) {
        if (attr.name.startsWith('data-pptx-')) {
          attrs[attr.name.replace('data-pptx-', '')] = attr.value;
        }
      }

      elements.push({
        type,
        text: (el as HTMLElement).innerText || '',
        x: ((rect.left - slideRect.left) / slideRect.width) * 100,
        y: ((rect.top - slideRect.top) / slideRect.height) * 100,
        w: (rect.width / slideRect.width) * 100,
        h: (rect.height / slideRect.height) * 100,
        attrs,
      });
    }

    return { layout, bg, elements };
  });
}

/* ── PPTX Generation ── */

function addElementToSlide(
  slide: PptxGenJS.Slide,
  el: ExtractedElement,
  theme: ThemeConfig,
) {
  const x = pctToInchesX(el.x);
  const y = pctToInchesY(el.y);
  const w = pctToInchesX(el.w);
  const h = pctToInchesY(el.h);

  switch (el.type) {
    case 'heading': {
      const size = HEADING_SIZES[el.attrs.size || 'lg'] || 28;
      slide.addText(el.text, {
        x, y, w, h,
        fontSize: size,
        fontFace: theme.typography.headingFont.split(',')[0].replace(/'/g, '').trim(),
        color: hex(theme.colors.text),
        bold: true,
        valign: 'middle',
        wrap: true,
      });
      break;
    }

    case 'gradient-text': {
      const size = HEADING_SIZES[el.attrs.size || 'hero'] || 44;
      slide.addText(el.text, {
        x, y, w, h,
        fontSize: size,
        fontFace: theme.typography.headingFont.split(',')[0].replace(/'/g, '').trim(),
        color: hex(theme.colors.primary), // gradient → solid primary fallback
        bold: true,
        valign: 'middle',
        wrap: true,
      });
      break;
    }

    case 'text': {
      const isMuted = 'muted' in el.attrs;
      slide.addText(el.text, {
        x, y, w, h,
        fontSize: TEXT_SIZES[el.attrs.size || 'md'] || 14,
        fontFace: theme.typography.bodyFont.split(',')[0].replace(/'/g, '').trim(),
        color: hex(isMuted ? theme.colors.muted : theme.colors.text),
        valign: 'top',
        wrap: true,
      });
      break;
    }

    case 'badge': {
      slide.addText(el.text.toUpperCase(), {
        x, y, w, h,
        fontSize: 9,
        fontFace: theme.typography.bodyFont.split(',')[0].replace(/'/g, '').trim(),
        color: hex(theme.colors.muted),
        fill: { color: hex(theme.colors.surface) },
        line: { color: hex(theme.colors.border), width: 0.5 },
        rectRadius: 0.1,
        valign: 'middle',
        align: 'center',
      });
      break;
    }

    case 'card': {
      // Render card as rounded rectangle background, then its text content on top
      slide.addShape('roundRect' as PptxGenJS.ShapeType, {
        x, y, w, h,
        fill: { color: hex(theme.colors.surface) },
        line: { color: hex(theme.colors.border), width: 0.5 },
        rectRadius: 0.15,
      });
      // Text inside the card is extracted as separate elements with their own positions
      break;
    }

    case 'statbox': {
      // Background shape
      slide.addShape('roundRect' as PptxGenJS.ShapeType, {
        x, y, w, h,
        fill: { color: hex(theme.colors.surface) },
        line: { color: hex(theme.colors.border), width: 0.5 },
        rectRadius: 0.15,
      });
      // Value text (large, centered, top portion)
      const val = el.attrs.value || el.text;
      slide.addText(val, {
        x, y: y + h * 0.15, w, h: h * 0.5,
        fontSize: 28,
        fontFace: theme.typography.headingFont.split(',')[0].replace(/'/g, '').trim(),
        color: hex(theme.colors.text),
        bold: true,
        align: 'center',
        valign: 'middle',
      });
      // Label text (small, centered, bottom portion)
      if (el.attrs.label) {
        slide.addText(el.attrs.label.toUpperCase(), {
          x, y: y + h * 0.65, w, h: h * 0.25,
          fontSize: 9,
          fontFace: theme.typography.bodyFont.split(',')[0].replace(/'/g, '').trim(),
          color: hex(theme.colors.muted),
          align: 'center',
          valign: 'top',
        });
      }
      break;
    }

    case 'divider': {
      slide.addShape('line' as PptxGenJS.ShapeType, {
        x, y: y + h / 2, w, h: 0,
        line: { color: hex(theme.colors.primary), width: 1.5 },
      });
      break;
    }

    case 'icon': {
      // Render as colored circle (no icon glyph — PowerPoint doesn't have Lucide)
      slide.addShape('ellipse' as PptxGenJS.ShapeType, {
        x, y, w: Math.min(w, h), h: Math.min(w, h),
        fill: { color: hex(theme.colors.surface) },
        line: { color: hex(theme.colors.border), width: 0.75 },
      });
      break;
    }

    case 'step': {
      // Circle with number + text beside it
      const circleSize = 0.3;
      const isActive = 'active' in el.attrs;
      slide.addShape('ellipse' as PptxGenJS.ShapeType, {
        x, y, w: circleSize, h: circleSize,
        fill: { color: hex(isActive ? theme.colors.primary : theme.colors.surface) },
        line: { color: hex(isActive ? theme.colors.primary : theme.colors.border), width: 0.75 },
      });
      slide.addText(el.attrs.n || '', {
        x, y, w: circleSize, h: circleSize,
        fontSize: 9,
        color: hex(isActive ? theme.colors.background : theme.colors.muted),
        bold: true,
        align: 'center',
        valign: 'middle',
      });
      // Step text
      slide.addText(el.text, {
        x: x + circleSize + 0.1, y, w: w - circleSize - 0.1, h,
        fontSize: 12,
        fontFace: theme.typography.bodyFont.split(',')[0].replace(/'/g, '').trim(),
        color: hex(theme.colors.text),
        bold: isActive,
        valign: 'middle',
        wrap: true,
      });
      break;
    }

    case 'colorbar': {
      // Thin accent rectangle — already positioned by bounding box
      slide.addShape('rect' as PptxGenJS.ShapeType, {
        x, y, w, h,
        fill: { color: hex(theme.colors.primary) },
      });
      break;
    }

    case 'progress': {
      // Progress bar label + bar
      if (el.attrs.label) {
        slide.addText(`${el.attrs.label}  ${el.attrs.value || ''}%`, {
          x, y, w, h: h * 0.4,
          fontSize: 10,
          fontFace: theme.typography.bodyFont.split(',')[0].replace(/'/g, '').trim(),
          color: hex(theme.colors.text),
        });
      }
      // Background track
      const barY = y + h * 0.6;
      const barH = 0.08;
      slide.addShape('roundRect' as PptxGenJS.ShapeType, {
        x, y: barY, w, h: barH,
        fill: { color: hex(theme.colors.surface) },
        rectRadius: 0.04,
      });
      // Filled portion
      const pct = parseInt(el.attrs.value || '0', 10);
      slide.addShape('roundRect' as PptxGenJS.ShapeType, {
        x, y: barY, w: w * (pct / 100), h: barH,
        fill: { color: hex(theme.colors.primary) },
        rectRadius: 0.04,
      });
      break;
    }

    case 'pipeline': {
      // Pipeline is complex — render as a horizontal line with text labels
      // The individual icon circles and labels are extracted as child elements
      // Just render the connecting line
      slide.addShape('line' as PptxGenJS.ShapeType, {
        x: x + w * 0.1, y: y + h * 0.35, w: w * 0.8, h: 0,
        line: { color: hex(theme.colors.primary), width: 1 },
      });
      break;
    }

    case 'tabs': {
      // Tabs container — children are extracted separately
      // Just render a subtle background
      break;
    }

    default:
      // Unknown type — skip
      break;
  }
}

/* ── Main export function ── */

export async function exportPptx({
  url,
  slug,
  themeName,
  slideCount,
}: ExportPptxOptions): Promise<Buffer> {
  const theme = getTheme(themeName);
  const pptx = new PptxGenJS();

  // Set slide dimensions to 16:9
  pptx.defineLayout({ name: 'CUSTOM', width: 10, height: 5.625 });
  pptx.layout = 'CUSTOM';

  // Set PPTX metadata
  pptx.title = slug;
  pptx.author = 'Slidemason';

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  for (let i = 0; i < slideCount; i++) {
    // Navigate to each slide in pptx print mode
    await page.goto(`${url}?print&pptx&slide=${i}#${slug}`, {
      waitUntil: 'networkidle',
    });
    // Wait a moment for any remaining renders
    await page.waitForTimeout(500);

    const extracted = await extractSlide(page);

    // Create PPTX slide with theme background
    const slide = pptx.addSlide();
    slide.background = { color: hex(theme.colors.background) };

    // Add each extracted element
    for (const el of extracted.elements) {
      addElementToSlide(slide, el, theme);
    }
  }

  await browser.close();

  // Generate PPTX as buffer
  const output = await pptx.write({ outputType: 'nodebuffer' });
  return output as Buffer;
}
```

**Step 3: Update `packages/export/src/index.ts`**

```typescript
export { exportPdf } from './pdf.js';
export { exportStatic } from './static.js';
export { exportPptx } from './pptx.js';
```

**Step 4: Add @slidemason/themes as dependency of @slidemason/export**

Run: `cd packages/export && pnpm add @slidemason/themes`

**Step: Verify build**

Run: `cd packages/export && npx tsc --noEmit`
Expected: clean

**Step: Commit**

```bash
git add packages/export/
git commit -m "feat: add PptxBuilder — extracts DOM elements and generates native PPTX"
```

---

## Task 5: Add slide= Query Parameter Support to SlideRenderer

The PPTX export needs to navigate to individual slides via `?slide=N`. The existing renderer uses keyboard/click navigation — we need to also read from the URL.

**Files:**
- Modify: `packages/renderer/src/SlideRenderer.tsx`

Check if `?slide=N` is already supported. Looking at the PDF export, it uses `?slide=${i}`. Check how the renderer handles this.

**Changes:**

In `SlideRenderer.tsx`, at the top of the component, add:

```tsx
// If ?slide=N is in URL, jump to that slide on mount
useEffect(() => {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  const slideParam = params.get('slide');
  if (slideParam !== null) {
    const idx = parseInt(slideParam, 10);
    if (!isNaN(idx) && idx >= 0 && idx < slideCount) {
      goTo(idx);
    }
  }
}, [slideCount, goTo]);
```

Check if this already exists. If it does, skip this task.

**Step: Verify build**

Run: `npx tsc --noEmit`
Expected: clean

**Step: Commit**

```bash
git add packages/renderer/
git commit -m "feat: support ?slide=N query parameter for direct slide navigation"
```

---

## Task 6: Add PPTX Export API Endpoint

Wire the export into the Studio's Vite dev server API.

**Files:**
- Modify: `apps/studio/vite-plugin-studio-api.ts`

**Changes:**

Add a handler function:

```typescript
async function handleExportPptx(slug: string, req: IncomingMessage, res: ServerResponse, server: ViteDevServer) {
  const paths = deckPaths(slug);
  if (!(await exists(paths.brief))) {
    json(res, { error: 'brief not found' }, 404);
    return;
  }

  // Read brief for theme + slide count
  const briefRaw = await readFile(paths.brief, 'utf-8');
  const briefData = JSON.parse(briefRaw);
  const themeName = briefData.theme || 'midnight';

  // Count slides
  let slideCount = 0;
  if (await exists(paths.slides)) {
    const content = await readFile(paths.slides, 'utf-8');
    const matches = content.match(/key="/g);
    slideCount = matches ? matches.length : 0;
  }

  if (slideCount === 0) {
    json(res, { error: 'no slides found' }, 400);
    return;
  }

  // Get the dev server URL
  const address = server.httpServer?.address();
  const port = typeof address === 'object' && address ? address.port : 4200;
  const baseUrl = `http://localhost:${port}`;

  // Dynamic import to avoid loading playwright at startup
  const { exportPptx } = await import('@slidemason/export');

  const buffer = await exportPptx({
    url: baseUrl,
    slug,
    themeName,
    slideCount,
  });

  res.writeHead(200, {
    'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'Content-Disposition': `attachment; filename="${slug}.pptx"`,
    'Content-Length': buffer.length,
  });
  res.end(buffer);
}
```

Then add the route in the middleware, inside the `deckMatch` block (after the `/slides` route):

```typescript
// /__api/decks/:slug/export/pptx
if (rest === '/export/pptx' && method === 'GET') {
  await handleExportPptx(slug, req, res, server);
  return;
}
```

Note: the `handleExportPptx` function needs access to the `server` object. Update the middleware to pass it:

The `configureServer` callback already has `server` in scope, so the handler can be called with it.

**Step: Add @slidemason/export as devDependency of studio**

Run: `cd apps/studio && pnpm add -D @slidemason/export`

**Step: Verify build**

Run: `npx tsc --noEmit`
Expected: clean

**Step: Commit**

```bash
git add apps/studio/
git commit -m "feat: add GET /__api/decks/:slug/export/pptx endpoint"
```

---

## Task 7: Add Export PPTX Button to Studio Sidebar

Add a download button below the "Build Deck" button in the sidebar.

**Files:**
- Modify: `apps/studio/src/App.tsx`

**Changes:**

After the "Build Deck" button (around line 300), add an "Export PPTX" button:

```tsx
{slides.length > 1 && (
  <div style={{ padding: '4px 0 12px' }}>
    <button
      onClick={async () => {
        if (!activeDeck) return;
        setExportingPptx(true);
        try {
          const res = await fetch(`/__api/decks/${encodeURIComponent(activeDeck)}/export/pptx`);
          if (!res.ok) throw new Error('Export failed');
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${activeDeck}.pptx`;
          a.click();
          URL.revokeObjectURL(url);
        } catch (err) {
          console.error('PPTX export failed:', err);
        } finally {
          setExportingPptx(false);
        }
      }}
      disabled={exportingPptx}
      style={{
        width: '100%', padding: '10px', fontSize: '0.8rem', fontWeight: 600,
        backgroundColor: exportingPptx ? 'rgba(100,100,100,0.3)' : 'rgba(59,130,246,0.2)',
        color: exportingPptx ? '#888' : '#93c5fd',
        border: '1px solid rgba(59,130,246,0.3)',
        borderRadius: '8px', cursor: exportingPptx ? 'default' : 'pointer',
      }}
    >
      {exportingPptx ? 'Exporting...' : 'Export PPTX'}
    </button>
  </div>
)}
```

Add the state variable near the top of App():
```tsx
const [exportingPptx, setExportingPptx] = useState(false);
```

**Step: Verify build**

Run: `npx tsc --noEmit`
Expected: clean

**Step: Commit**

```bash
git add apps/studio/src/App.tsx
git commit -m "feat: add Export PPTX button to studio sidebar"
```

---

## Task 8: End-to-End Test

Manually verify the full export flow works.

**Steps:**

1. Start dev server: `pnpm --filter @slidemason/studio dev`
2. Open `http://localhost:4200/#saberalert-mvp`
3. Verify slides render normally (no visual regression from data attributes)
4. Open `http://localhost:4200/?print&pptx#saberalert-mvp` — verify:
   - No animations (everything rendered in final state)
   - ClickReveal shows revealed content
   - CountUp shows final number
5. Click "Export PPTX" button in sidebar
6. Wait for download (may take 20-30s for 15 slides — Playwright renders each)
7. Open the `.pptx` in PowerPoint or Google Slides
8. Verify:
   - All 15 slides present
   - Background is black (noir theme)
   - Text is editable (click any heading or body text)
   - Cards are rounded rectangles
   - Theme colors are correct (gold primary, stone secondary)
   - Layout positions roughly match the web version

**If issues found:** Fix and re-test. Common issues:
- Text cut off → adjust wrap settings or font size mapping
- Elements overlapping → bounding box extraction may need padding
- Missing text → check that the element's `innerText` captured correctly

**Step: Commit any fixes**

```bash
git add .
git commit -m "fix: PPTX export adjustments from end-to-end testing"
```
