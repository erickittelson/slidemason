# Cinematic Deck Builder Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Port Deck-Builder's cinematic quality into Slidemason — opinionated slide templates, Framer Motion transitions, cinematic viewer chrome, and a comprehensive CLAUDE.md for AI agents.

**Architecture:** Create a `templates/` layer in `@slidemason/components` that wraps existing primitives into 15 typed, opinionated slide templates. Add `framer-motion` to `@slidemason/renderer` for slide-to-slide transitions via `AnimatePresence`. Upgrade `SlideRenderer` with glassmorphic nav, progress bar, and slide counter. Write a comprehensive `CLAUDE.md` modeled after the old Deck-Builder's `copilot-instructions.md`.

**Tech Stack:** React 19, TypeScript, Framer Motion, Tailwind CSS, Vitest, pnpm workspaces

---

## Task 1: Add framer-motion to renderer package

**Files:**
- Modify: `packages/renderer/package.json`

**Step 1: Install framer-motion**

```bash
cd /Users/erickittelson/qvl-code/slidemason
pnpm --filter @slidemason/renderer add framer-motion
```

**Step 2: Verify installation**

```bash
pnpm --filter @slidemason/renderer exec -- node -e "require('framer-motion')" 2>&1 || echo "ESM module, checking package.json..."
grep framer-motion packages/renderer/package.json
```

Expected: `framer-motion` appears in dependencies.

**Step 3: Commit**

```bash
git add packages/renderer/package.json pnpm-lock.yaml
git commit -m "chore(renderer): add framer-motion dependency"
```

---

## Task 2: Create template types

All 15 slide templates need typed prop interfaces. This is the contract that constrains the AI to valid output.

**Files:**
- Create: `packages/components/src/templates/types.ts`

**Step 1: Write template type definitions**

```ts
// packages/components/src/templates/types.ts
import type { CSSProperties } from 'react';

/* ── Shared types ─────────────────────────────────────────── */

export type AccentColor = 'blue' | 'emerald' | 'purple' | 'amber' | 'rose';

export type GradientName =
  | 'blue-purple'
  | 'emerald-blue'
  | 'amber-rose'
  | 'purple-rose';

export interface SlideItem {
  label: string;
  description?: string;
  icon?: string; // Lucide icon name (PascalCase)
}

export interface MetricItem {
  value: string;
  label: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: AccentColor;
}

export interface TimelineItem {
  phase: string;
  title: string;
  description: string;
  status?: 'completed' | 'in-progress' | 'upcoming';
}

export interface ComparisonItem {
  label: string;
  before: string;
  after: string;
}

export interface ColumnItem {
  title: string;
  description: string;
  items?: string[];
  icon?: string;
  color?: AccentColor;
}

export interface QuoteData {
  text: string;
  attribution?: string;
  role?: string;
}

export interface ActionItem {
  action: string;
  owner?: string;
  date?: string;
  status?: 'todo' | 'in-progress' | 'done';
}

/* ── Template props ───────────────────────────────────────── */

export interface TitleSlideProps {
  title: string;
  subtitle?: string;
  badge?: string;
  gradient?: GradientName;
}

export interface AgendaSlideProps {
  title?: string;
  items: SlideItem[];
}

export interface SectionDividerSlideProps {
  number?: string;
  title: string;
  subtitle?: string;
  gradient?: GradientName;
}

export interface ContentSlideProps {
  title: string;
  subtitle?: string;
  bullets?: string[];
  layout?: 'single' | 'two-column';
  /** When layout is 'two-column', the right column content */
  rightBullets?: string[];
}

export interface ContentMediaSlideProps {
  title: string;
  subtitle?: string;
  bodyText?: string;
  bullets?: string[];
  mediaPosition?: 'left' | 'right';
  visual?: 'icon-grid' | 'diagram' | 'checklist';
  visualItems?: SlideItem[];
}

export interface MetricsSlideProps {
  title?: string;
  subtitle?: string;
  metrics: MetricItem[];
}

export interface FeatureSlideProps {
  title?: string;
  subtitle?: string;
  features: SlideItem[];
  columns?: 2 | 3;
}

export interface TimelineSlideProps {
  title?: string;
  subtitle?: string;
  items: TimelineItem[];
  variant?: 'vertical' | 'horizontal';
}

export interface ComparisonSlideProps {
  title?: string;
  beforeLabel?: string;
  afterLabel?: string;
  variant?: 'before-after' | 'pros-cons';
  items?: ComparisonItem[];
  pros?: string[];
  cons?: string[];
}

export interface ProcessSlideProps {
  title?: string;
  subtitle?: string;
  steps: SlideItem[];
}

export interface QuoteSlideProps {
  quote: QuoteData;
  theme?: AccentColor;
}

export interface DiagramSlideProps {
  title?: string;
  subtitle?: string;
  type: 'flywheel' | 'funnel' | 'cycle' | 'pyramid';
  segments: Array<{ label: string; value?: number }>;
}

export interface TableSlideProps {
  title?: string;
  subtitle?: string;
  steps: ActionItem[];
}

export interface FullBleedSlideProps {
  title: string;
  subtitle?: string;
  gradient?: AccentColor | 'dark';
}

export interface ConclusionSlideProps {
  variant?: 'thankyou' | 'qa' | 'contact';
  title?: string;
  subtitle?: string;
  callToAction?: string;
  contactInfo?: {
    email?: string;
    website?: string;
    social?: string;
  };
  items?: SlideItem[];
}
```

**Step 2: Verify types compile**

```bash
cd /Users/erickittelson/qvl-code/slidemason
npx tsc --noEmit --project packages/components/tsconfig.json
```

Expected: No errors.

**Step 3: Commit**

```bash
git add packages/components/src/templates/types.ts
git commit -m "feat(components): add typed interfaces for slide templates"
```

---

## Task 3: Create TitleSlide template

The hero slide — gradient text, badge, subtitle. This is the most impactful slide and sets the visual tone.

**Files:**
- Create: `packages/components/src/templates/TitleSlide.tsx`
- Create: `packages/components/src/templates/gradients.ts` (shared gradient map)
- Test: `packages/components/src/__tests__/templates.test.tsx`

**Step 1: Create the gradient map (shared across templates)**

```ts
// packages/components/src/templates/gradients.ts

/** Tailwind gradient classes keyed by gradient name */
export const gradientMap: Record<string, string> = {
  'blue-purple': 'from-blue-400 via-purple-500 to-blue-600',
  'emerald-blue': 'from-emerald-400 via-teal-500 to-blue-600',
  'amber-rose': 'from-amber-400 via-orange-500 to-rose-600',
  'purple-rose': 'from-purple-400 via-pink-500 to-rose-600',
};

/** Tailwind color classes keyed by accent color name */
export const accentColorMap: Record<string, { text: string; bg: string; border: string; gradient: string }> = {
  blue:    { text: 'text-blue-400',    bg: 'bg-blue-500/20',    border: 'border-blue-500/30',    gradient: 'from-blue-400 to-blue-600' },
  emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', gradient: 'from-emerald-400 to-emerald-600' },
  purple:  { text: 'text-purple-400',  bg: 'bg-purple-500/20',  border: 'border-purple-500/30',  gradient: 'from-purple-400 to-purple-600' },
  amber:   { text: 'text-amber-400',   bg: 'bg-amber-500/20',   border: 'border-amber-500/30',   gradient: 'from-amber-400 to-amber-600' },
  rose:    { text: 'text-rose-400',    bg: 'bg-rose-500/20',    border: 'border-rose-500/30',    gradient: 'from-rose-400 to-rose-600' },
};
```

**Step 2: Write the failing test**

```tsx
// packages/components/src/__tests__/templates.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TitleSlide } from '../templates/TitleSlide';

describe('TitleSlide', () => {
  it('renders the title', () => {
    render(<TitleSlide title="Hello World" />);
    expect(screen.getByText('Hello World')).toBeDefined();
  });

  it('renders subtitle when provided', () => {
    render(<TitleSlide title="Hello" subtitle="World" />);
    expect(screen.getByText('World')).toBeDefined();
  });

  it('renders badge when provided', () => {
    render(<TitleSlide title="Hello" badge="MVP" />);
    expect(screen.getByText('MVP')).toBeDefined();
  });
});
```

**Step 3: Run test to verify it fails**

```bash
cd /Users/erickittelson/qvl-code/slidemason
pnpm --filter @slidemason/components exec -- npx vitest run src/__tests__/templates.test.tsx
```

Expected: FAIL — module not found.

**Step 4: Implement TitleSlide**

```tsx
// packages/components/src/templates/TitleSlide.tsx
import type { TitleSlideProps } from './types';
import { gradientMap } from './gradients';

export function TitleSlide({
  title,
  subtitle,
  badge,
  gradient = 'blue-purple',
}: TitleSlideProps) {
  const grad = gradientMap[gradient] ?? gradientMap['blue-purple'];

  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center" style={{ gap: 'clamp(1rem, 2vh, 2rem)' }}>
      {badge && (
        <span className="sm-fade-up inline-block px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-widest uppercase bg-white/5 text-zinc-400 border border-zinc-800">
          {badge}
        </span>
      )}

      <h1
        className={`sm-fade-up sm-stagger-1 sm-ease-cinematic sm-duration-slow font-extrabold tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-r ${grad}`}
        style={{ fontSize: 'clamp(2.5rem, 8vw, 8rem)' }}
      >
        {title}
      </h1>

      {subtitle && (
        <p
          className="sm-fade-up sm-stagger-2 font-light leading-relaxed max-w-2xl"
          style={{ fontSize: 'clamp(1rem, 2.5vw, 1.75rem)', color: 'var(--sm-muted)' }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
```

**Step 5: Run test to verify it passes**

```bash
pnpm --filter @slidemason/components exec -- npx vitest run src/__tests__/templates.test.tsx
```

Expected: PASS.

**Step 6: Commit**

```bash
git add packages/components/src/templates/
git add packages/components/src/__tests__/templates.test.tsx
git commit -m "feat(components): add TitleSlide template with gradient map"
```

---

## Task 4: Create remaining 14 slide templates

Build the remaining templates. Each follows the same pattern: typed props in, themed JSX out, `sm-fade-up` / `sm-stagger-*` animation classes, uses existing primitives where possible.

**Files:**
- Create: `packages/components/src/templates/AgendaSlide.tsx`
- Create: `packages/components/src/templates/SectionDividerSlide.tsx`
- Create: `packages/components/src/templates/ContentSlide.tsx`
- Create: `packages/components/src/templates/ContentMediaSlide.tsx`
- Create: `packages/components/src/templates/MetricsSlide.tsx`
- Create: `packages/components/src/templates/FeatureSlide.tsx`
- Create: `packages/components/src/templates/TimelineSlide.tsx`
- Create: `packages/components/src/templates/ComparisonSlide.tsx`
- Create: `packages/components/src/templates/ProcessSlide.tsx`
- Create: `packages/components/src/templates/QuoteSlide.tsx`
- Create: `packages/components/src/templates/DiagramSlide.tsx`
- Create: `packages/components/src/templates/TableSlide.tsx`
- Create: `packages/components/src/templates/FullBleedSlide.tsx`
- Create: `packages/components/src/templates/ConclusionSlide.tsx`
- Create: `packages/components/src/templates/index.ts` (barrel export)
- Modify: `packages/components/src/index.ts` (add `export * from './templates'`)
- Test: `packages/components/src/__tests__/templates.test.tsx` (add tests for each)

### Implementation Guide for Each Template

**General rules for ALL templates:**
- Accept only typed props (no `children` prop, no free-form ReactNode)
- Use `sm-fade-up` on the main wrapper, `sm-stagger-N` on list items
- Use `sm-ease-cinematic` on hero/display text for the premium feel
- All text sizes use `clamp()` for responsive scaling
- Use `var(--sm-*)` CSS variables for theme colors (NOT hardcoded colors)
- However, for accent gradients on text, use Tailwind classes from `gradients.ts`
- Use existing primitives internally where they fit (e.g., `FeatureGrid`, `ProcessFlow`, `StatCallout`)

**AgendaSlide:** Numbered list of items staggered in. Each item is a row: large number (01, 02...) in primary color + label + description. No existing primitive to reuse — build from scratch.

**SectionDividerSlide:** Full-slide centered layout. Giant translucent number watermark (20rem, opacity 0.05, `var(--sm-primary)`) positioned absolute behind. Title + subtitle centered on top. Use the existing `SectionHeader` component internally.

**ContentSlide:** Headline + BulletGroup. When `layout='two-column'`, wrap in TwoColumn with left bullets and right bullets. Use existing `Headline`, `BulletGroup`, `TwoColumn`.

**ContentMediaSlide:** Two-column layout — text on one side (headline + subtitle + bullets), visual on the other (icon grid or checklist). Use `TwoColumn`, `Headline`, `BulletGroup`, `IconList`/`FeatureGrid`/`Checklist`. The `mediaPosition` prop controls which side text is on.

**MetricsSlide:** 2-4 StatCallout cards in a responsive grid. Use existing `StatCallout` but wrap each in a glassmorphic card (`bg-[var(--sm-surface)] border border-[var(--sm-border)] rounded-2xl`). Gradient text on the value.

**FeatureSlide:** Headline + FeatureGrid. Directly wraps existing primitives.

**TimelineSlide:** Headline + either `TimelineVertical` or `MilestoneTracker` based on `variant` prop.

**ComparisonSlide:** Headline + either `ProsCons` (variant='pros-cons') or `BeforeAfter` (variant='before-after'). Fall back to `ComparisonMatrix` if `items` are provided.

**ProcessSlide:** Headline + ProcessFlow. Direct wrapper.

**QuoteSlide:** Centered `TestimonialCard` or `PullQuote`, themed. Add decorative open-quote character (`text-8xl opacity-10`).

**DiagramSlide:** Headline + the appropriate diagram component based on `type`: `Flywheel`, `FunnelChart`, `CycleDiagram`, or `PyramidChart`.

**TableSlide:** Headline + `NextStepsGrid`.

**FullBleedSlide:** `GradientBg` wrapper filling the slide, centered title + subtitle in large display text. For 'dark' gradient, use `var(--sm-bg)` to `transparent` radial.

**ConclusionSlide:** Centered layout with the `EndSlide` component. Add optional recap badges (pills) and CTA button.

### Tests

For each template, write at minimum:
- Renders required props (title/items/etc.)
- Renders optional props when provided
- Does not crash with minimal props

**Step 1: Write tests for all 14 templates (add to existing test file)**

Each test block follows this pattern:
```tsx
describe('TemplateName', () => {
  it('renders with required props', () => {
    render(<TemplateName requiredProp="value" />);
    expect(screen.getByText('value')).toBeDefined();
  });
});
```

**Step 2: Run tests — all should fail**

```bash
pnpm --filter @slidemason/components exec -- npx vitest run src/__tests__/templates.test.tsx
```

**Step 3: Implement all 14 templates**

Follow the implementation guide above for each.

**Step 4: Create barrel export**

```ts
// packages/components/src/templates/index.ts
export { TitleSlide } from './TitleSlide';
export { AgendaSlide } from './AgendaSlide';
export { SectionDividerSlide } from './SectionDividerSlide';
export { ContentSlide } from './ContentSlide';
export { ContentMediaSlide } from './ContentMediaSlide';
export { MetricsSlide } from './MetricsSlide';
export { FeatureSlide } from './FeatureSlide';
export { TimelineSlide } from './TimelineSlide';
export { ComparisonSlide } from './ComparisonSlide';
export { ProcessSlide } from './ProcessSlide';
export { QuoteSlide } from './QuoteSlide';
export { DiagramSlide } from './DiagramSlide';
export { TableSlide } from './TableSlide';
export { FullBleedSlide } from './FullBleedSlide';
export { ConclusionSlide } from './ConclusionSlide';

// Re-export types for consumers
export type * from './types';
```

**Step 5: Add to main barrel export**

Add to `packages/components/src/index.ts`:
```ts
// Slide Templates
export * from './templates';
```

**Step 6: Run tests — all should pass**

```bash
pnpm --filter @slidemason/components exec -- npx vitest run src/__tests__/templates.test.tsx
```

**Step 7: Type-check the whole project**

```bash
npx tsc --noEmit --project packages/components/tsconfig.json
```

**Step 8: Commit**

```bash
git add packages/components/src/templates/ packages/components/src/__tests__/templates.test.tsx packages/components/src/index.ts
git commit -m "feat(components): add 14 remaining slide templates with tests"
```

---

## Task 5: Add Framer Motion transitions to SlideRenderer

Replace the hard-cut slide swap with cinematic `AnimatePresence` transitions.

**Files:**
- Modify: `packages/renderer/src/SlideRenderer.tsx`

**Step 1: Write the failing test**

```tsx
// Add to packages/renderer/src/__tests__/transitions.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DeckProvider } from '../DeckProvider';
import { SlideRenderer } from '../SlideRenderer';

describe('SlideRenderer transitions', () => {
  it('wraps slides in a motion.div with key', () => {
    const slides = [<div key="a">Slide A</div>, <div key="b">Slide B</div>];
    const { container } = render(
      <DeckProvider slideCount={2} theme="slate">
        <SlideRenderer slides={slides} />
      </DeckProvider>
    );
    // motion.div renders as a div — check the slide content renders
    expect(screen.getByText('Slide A')).toBeDefined();
  });
});
```

**Step 2: Run to verify it passes with current code (baseline)**

```bash
pnpm --filter @slidemason/renderer exec -- npx vitest run src/__tests__/transitions.test.tsx
```

**Step 3: Modify SlideRenderer to add AnimatePresence**

Replace the current render of `{slides[currentSlide]}` in `SlideRenderer.tsx`:

```tsx
// packages/renderer/src/SlideRenderer.tsx
import { type ReactNode, useCallback, useEffect, useState } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { motion, AnimatePresence } from 'framer-motion';
import * as components from '@slidemason/components';
import { SlideLayout } from './SlideLayout';
import { useDeck } from './DeckProvider';

const slideTransition = {
  duration: 0.7,
  ease: [0.22, 1, 0.36, 1] as const,
};

interface SlideRendererProps {
  slides: ReactNode[];
  fullWidth?: boolean;
}

export function SlideRenderer({ slides, fullWidth = true }: SlideRendererProps) {
  const { currentSlide, slideCount, goTo, next, prev, theme } = useDeck();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isPrintMode =
    typeof window !== 'undefined' &&
    window.location.search.includes('print');

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const handleChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  const isFirst = currentSlide === 0;
  const isLast = currentSlide === slideCount - 1;
  const progress = slideCount > 1 ? (currentSlide / (slideCount - 1)) * 100 : 0;

  return (
    <MDXProvider components={components}>
      <div
        data-theme={theme}
        className={`relative ${fullWidth ? 'w-screen h-screen' : 'w-full h-full'} overflow-hidden`}
        style={{ backgroundColor: 'var(--sm-bg)' }}
      >
        {/* Animated slide content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.98 }}
            transition={slideTransition}
            className="w-full h-full"
          >
            <SlideLayout theme={theme} fullWidth={false}>
              {slides[currentSlide]}
            </SlideLayout>
          </motion.div>
        </AnimatePresence>

        {/* Chrome — see Task 6 */}
        {!isPrintMode && (
          <>
            {/* Slide counter — top left */}
            <div
              className="absolute top-6 left-8 font-mono text-xs tracking-widest"
              style={{ color: 'var(--sm-muted)', opacity: 0.4 }}
            >
              {String(currentSlide + 1).padStart(2, '0')} / {String(slideCount).padStart(2, '0')}
            </div>

            {/* Nav buttons — bottom right */}
            <div
              className="absolute bottom-6 right-8 flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md"
              style={{
                backgroundColor: 'rgba(24,24,27,0.8)',
                border: '1px solid rgba(113,113,122,0.3)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}
            >
              <button
                onClick={prev}
                disabled={isFirst}
                className="cursor-pointer border-none bg-transparent p-1 text-sm leading-none transition-opacity duration-150"
                style={{ color: 'var(--sm-muted)', opacity: isFirst ? 0.3 : 1 }}
                aria-label="Previous slide"
              >
                ←
              </button>
              <span
                className="font-mono text-xs"
                style={{ color: 'var(--sm-muted)', opacity: 0.6 }}
              >
                {currentSlide + 1} / {slideCount}
              </span>
              <button
                onClick={next}
                disabled={isLast}
                className="cursor-pointer border-none bg-transparent p-1 text-sm leading-none transition-opacity duration-150"
                style={{ color: 'var(--sm-muted)', opacity: isLast ? 0.3 : 1 }}
                aria-label="Next slide"
              >
                →
              </button>
              <button
                onClick={toggleFullscreen}
                className="cursor-pointer border-none bg-transparent p-1 text-sm leading-none"
                style={{ color: 'var(--sm-muted)' }}
                aria-label="Toggle fullscreen"
              >
                {isFullscreen ? '⊡' : '⊞'}
              </button>
            </div>

            {/* Progress bar — bottom edge */}
            <div
              className="absolute bottom-0 left-0 right-0"
              style={{ height: '2px', backgroundColor: 'var(--sm-border)' }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${progress}%`,
                  background: 'linear-gradient(to right, var(--sm-primary), var(--sm-accent))',
                  transition: 'width 500ms ease-out',
                }}
              />
            </div>
          </>
        )}
      </div>
    </MDXProvider>
  );
}
```

**Key changes from current:**
1. `AnimatePresence mode="wait"` wraps slides — the cinematic transition
2. `motion.div` with `y: ±40, scale: 0.98, opacity` and custom easing `[0.22, 1, 0.36, 1]`
3. `SlideLayout` now renders INSIDE the motion wrapper (not outside)
4. `data-theme` moved to the outer container so chrome picks up theme too
5. `SlideLayout.fullWidth` is now `false` because the outer container handles viewport sizing

**Step 4: Run the test**

```bash
pnpm --filter @slidemason/renderer exec -- npx vitest run src/__tests__/transitions.test.tsx
```

**Step 5: Verify type-check passes**

```bash
npx tsc --noEmit --project packages/renderer/tsconfig.json
```

**Step 6: Commit**

```bash
git add packages/renderer/src/SlideRenderer.tsx packages/renderer/src/__tests__/transitions.test.tsx
git commit -m "feat(renderer): add Framer Motion slide transitions and cinematic chrome"
```

---

## Task 6: Add dot minimap to SlideRenderer

Add a vertical dot minimap on the left side of the slide viewer (desktop only), matching the old Deck-Builder.

**Files:**
- Modify: `packages/renderer/src/SlideRenderer.tsx`

**Step 1: Add dot minimap JSX inside the chrome section**

Add this after the progress bar, inside the `{!isPrintMode && ...}` block:

```tsx
{/* Dot minimap — left side, desktop only */}
<div
  className="absolute left-4 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-2"
  style={{ opacity: 0.4 }}
>
  {Array.from({ length: slideCount }, (_, i) => (
    <button
      key={i}
      onClick={() => goTo(i)}
      className="w-2 h-2 rounded-full border-none cursor-pointer transition-all duration-300 p-0"
      style={{
        backgroundColor: i === currentSlide ? 'var(--sm-primary)' : 'var(--sm-muted)',
        transform: i === currentSlide ? 'scale(1.4)' : 'scale(1)',
        opacity: i === currentSlide ? 1 : 0.4,
      }}
      aria-label={`Go to slide ${i + 1}`}
    />
  ))}
</div>
```

**Step 2: Test manually — navigate between slides, dots should highlight**

```bash
pnpm dev
```

Open in browser, navigate between slides. Verify dots appear on desktop width, active dot is highlighted and scaled.

**Step 3: Commit**

```bash
git add packages/renderer/src/SlideRenderer.tsx
git commit -m "feat(renderer): add dot minimap navigation"
```

---

## Task 7: Update SlideLayout for new rendering model

Since `SlideRenderer` now handles the outer `data-theme` and viewport sizing, `SlideLayout` should focus only on padding and font. The `fullWidth` prop default should change.

**Files:**
- Modify: `packages/renderer/src/SlideLayout.tsx`

**Step 1: Update SlideLayout**

```tsx
// packages/renderer/src/SlideLayout.tsx
import { type ReactNode } from 'react';

interface SlideLayoutProps {
  children: ReactNode;
  theme?: string;
  fullWidth?: boolean;
}

export function SlideLayout({ children, theme = 'slate', fullWidth = true }: SlideLayoutProps) {
  return (
    <div
      data-theme={theme}
      className={`relative flex flex-col ${fullWidth ? 'w-screen h-screen' : 'w-full h-full'} overflow-hidden`}
      style={{
        backgroundColor: 'var(--sm-bg)',
        padding: 'clamp(2rem, 4vw, 5rem)',
        fontFamily: 'var(--sm-body-font, inherit)',
      }}
    >
      {children}
    </div>
  );
}
```

No actual code change needed — `SlideLayout` stays the same. The `SlideRenderer` now passes `fullWidth={false}` when rendering inside the motion wrapper. When used directly (PDF mode, non-motion contexts), it still works with `fullWidth={true}`.

**Step 2: Type-check**

```bash
npx tsc --noEmit --project packages/renderer/tsconfig.json
```

**Step 3: Run all renderer tests**

```bash
pnpm --filter @slidemason/renderer exec -- npx vitest run
```

**Step 4: Commit (if any changes were needed)**

```bash
git add packages/renderer/src/SlideLayout.tsx
git commit -m "refactor(renderer): clarify SlideLayout role in new rendering model"
```

---

## Task 8: Write CLAUDE.md

The comprehensive AI instruction file, modeled after the old Deck-Builder's `copilot-instructions.md` but adapted for Slidemason's template system.

**Files:**
- Create: `CLAUDE.md` (project root)
- Create: `.github/copilot-instructions.md` (symlink)

**Step 1: Write CLAUDE.md**

The file should contain:

1. **What This Project Is** — Slidemason overview, monorepo structure
2. **How to Generate a Presentation** — 4-step process:
   - Step 1: Read all files in `data/`
   - Step 2: Read the brief at `generated/brief.json`
   - Step 3: Plan a narrative arc (Hook → Context → Problem → Vision → Solution → Evidence → Roadmap → Ask)
   - Step 4: Write `apps/studio/src/slides.tsx` using slide templates
3. **Template Decision Table** — content type → template mapping (same table as in the design doc)
4. **Slide Template Reference** — every template's TypeScript interface + usage example (copy from `types.ts`, add JSX examples like the old `copilot-instructions.md`)
5. **Design Principles**:
   - Each slide makes ONE point
   - 8-15 slides per deck
   - Alternate text-heavy and visual-heavy slides
   - Use `SectionDividerSlide` between major sections
   - Alternate `mediaPosition: 'left'` / `'right'` on ContentMediaSlide
   - Never use the same slide type twice in a row (except ContentSlide)
   - Use gradient text only on TitleSlide and MetricsSlide
   - FullBleedSlide max 1-2 per deck for impact
6. **Critical Rules**:
   - NEVER modify renderer or engine files
   - ALL content goes in `slides.tsx`
   - Import templates from `@slidemason/components`
   - Every slide needs a unique `key` prop
   - Don't add new dependencies
   - Read ALL files in `data/` before generating
7. **Repo Structure** — key paths and what they contain

The full file should be ~200-300 lines, comprehensive but scannable.

**Step 2: Create symlink**

```bash
mkdir -p .github
ln -sf ../CLAUDE.md .github/copilot-instructions.md
```

**Step 3: Verify symlink works**

```bash
diff CLAUDE.md .github/copilot-instructions.md
```

Expected: no output (files are identical).

**Step 4: Commit**

```bash
git add CLAUDE.md .github/copilot-instructions.md
git commit -m "docs: add comprehensive CLAUDE.md for AI deck generation"
```

---

## Task 9: Update NextStepsModal prompt

The modal's `PROMPT_TEXT` can now be much simpler because `CLAUDE.md` does the heavy lifting.

**Files:**
- Modify: `apps/studio/src/components/NextStepsModal.tsx`

**Step 1: Update the PROMPT_TEXT constant**

Change line 7 of `NextStepsModal.tsx` from the current long prompt to:

```ts
const PROMPT_TEXT = `Read the brief at generated/brief.json and the source files in data/. Follow the instructions in CLAUDE.md to build the deck.`;
```

**Step 2: Verify the app builds**

```bash
npx tsc --noEmit --project apps/studio/tsconfig.json
```

**Step 3: Commit**

```bash
git add apps/studio/src/components/NextStepsModal.tsx
git commit -m "refactor(studio): simplify NextStepsModal prompt — CLAUDE.md handles details"
```

---

## Task 10: Rebuild SaberAlert deck using templates

Replace the current `slides.tsx` (which uses free-form JSX) with template-based slides. This validates that the templates work end-to-end.

**Files:**
- Modify: `apps/studio/src/slides.tsx`

**Step 1: Rewrite slides.tsx using templates**

Replace all content with template-based slides:

```tsx
import {
  TitleSlide,
  SectionDividerSlide,
  ContentMediaSlide,
  MetricsSlide,
  FeatureSlide,
  ProcessSlide,
  TimelineSlide,
  ComparisonSlide,
  TableSlide,
  FullBleedSlide,
  ConclusionSlide,
} from '@slidemason/components';

const slides = [
  <TitleSlide
    key="s1"
    title="SaberAlert"
    subtitle="Camera-Free Presence Detection for Home Security"
    badge="MVP Strategy & Technical Roadmap"
    gradient="emerald-blue"
  />,
  // ... remaining slides using templates
];

export default slides;
```

Map the current 18 free-form slides to the appropriate templates. The content stays the same, only the composition changes from manual JSX to typed template props.

**Step 2: Verify build**

```bash
npx tsc --noEmit --project apps/studio/tsconfig.json
```

**Step 3: Visual check**

```bash
pnpm dev
```

Open in browser, click through all slides. Verify transitions work, chrome appears, content renders correctly.

**Step 4: Commit**

```bash
git add apps/studio/src/slides.tsx
git commit -m "refactor(studio): rebuild SaberAlert deck using slide templates"
```

---

## Task 11: Run full test suite and type-check

Final verification that nothing is broken.

**Files:** None (verification only)

**Step 1: Run all tests**

```bash
pnpm test
```

Expected: All tests pass.

**Step 2: Full type-check**

```bash
pnpm typecheck
```

Expected: No errors.

**Step 3: Build all packages**

```bash
pnpm build
```

Expected: Clean build.

**Step 4: Commit any fixes needed, then push**

```bash
git push origin main
```
