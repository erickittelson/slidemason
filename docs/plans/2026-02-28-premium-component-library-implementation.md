# Premium Component Library Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build 116 cinematic presentation components across 10 categories, 40 templates, 12 themes, a CSS animation system, and SVG diagram primitives — transforming Slidemason into a world-class visual presentation builder.

**Architecture:** Category-based React component library using SVG for diagrams/data-viz, Lucide for icons, CSS custom properties for theming, CSS animations for motion. All components are viewport-responsive with `clamp()` sizing, theme-aware via `--sm-*` variables, and accept `className`/`style`/`animate` props.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, Lucide React, pure SVG (no charting library), CSS animations (no JS animation library)

**Important context:**
- All component source is in `packages/components/src/`
- Vite resolves source directly via `"source"` export condition — no build needed during dev
- Tailwind scans workspace packages via `@source` directives in `apps/studio/src/styles.css`
- Every component uses CSS variables (`--sm-*` prefix) for colors — never hardcode colors
- Font sizes should use `clamp()` for viewport responsiveness
- Tests use Vitest + @testing-library/react with jsdom environment
- Run all tests: `pnpm vitest run` from repo root

---

## Phase 1: Infrastructure (Tasks 1-3)

### Task 1: Install Lucide + Create Directory Structure + Animation CSS

**Files:**
- Modify: `packages/components/package.json` (add lucide-react dependency)
- Create: `packages/components/src/motion.css`
- Create: `packages/components/src/svg/index.ts` (empty barrel)
- Create: `packages/components/src/typography/index.ts` (empty barrel)
- Create: `packages/components/src/lists/index.ts` (empty barrel)
- Create: `packages/components/src/cards/index.ts` (empty barrel)
- Create: `packages/components/src/diagrams/index.ts` (empty barrel)
- Create: `packages/components/src/dataviz/index.ts` (empty barrel)
- Create: `packages/components/src/comparison/index.ts` (empty barrel)
- Create: `packages/components/src/media/index.ts` (empty barrel)
- Create: `packages/components/src/backgrounds/index.ts` (empty barrel)
- Create: `packages/components/src/navigation/index.ts` (empty barrel)
- Create: `packages/components/src/interactive/index.ts` (empty barrel)
- Modify: `apps/studio/src/styles.css` (import motion.css)

**Step 1: Install lucide-react**

```bash
cd /Users/erickittelson/qvl-code/slidemason
pnpm --filter @slidemason/components add lucide-react
```

**Step 2: Create category directories with empty barrel exports**

Create each directory under `packages/components/src/` with an `index.ts` that re-exports nothing yet:
- `svg/`, `typography/`, `lists/`, `cards/`, `diagrams/`, `dataviz/`, `comparison/`, `media/`, `backgrounds/`, `navigation/`, `interactive/`

Each `index.ts` is just:
```ts
// Components will be exported here as they are built
```

**Step 3: Create motion.css with the full animation system**

Create `packages/components/src/motion.css` with all animation classes. Key animations:

```css
/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* === Entrance Animations === */
@keyframes sm-fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes sm-fade-up { from { opacity: 0; transform: translateY(2rem); } to { opacity: 1; transform: translateY(0); } }
@keyframes sm-fade-down { from { opacity: 0; transform: translateY(-2rem); } to { opacity: 1; transform: translateY(0); } }
@keyframes sm-fade-left { from { opacity: 0; transform: translateX(2rem); } to { opacity: 1; transform: translateX(0); } }
@keyframes sm-fade-right { from { opacity: 0; transform: translateX(-2rem); } to { opacity: 1; transform: translateX(0); } }
@keyframes sm-scale-in { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
@keyframes sm-scale-up { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
@keyframes sm-blur-in { from { opacity: 0; filter: blur(12px); } to { opacity: 1; filter: blur(0); } }
@keyframes sm-rotate-in { from { opacity: 0; transform: rotate(-5deg) scale(0.95); } to { opacity: 1; transform: rotate(0) scale(1); } }
@keyframes sm-bounce-in { 0% { opacity: 0; transform: scale(0.3); } 50% { transform: scale(1.05); } 70% { transform: scale(0.9); } 100% { opacity: 1; transform: scale(1); } }
@keyframes sm-elastic-in { 0% { opacity: 0; transform: scale(0); } 55% { transform: scale(1.1); } 75% { transform: scale(0.95); } 100% { opacity: 1; transform: scale(1); } }

/* === Emphasis/Looping === */
@keyframes sm-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
@keyframes sm-glow { 0%, 100% { filter: brightness(1); } 50% { filter: brightness(1.3); } }
@keyframes sm-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-0.5rem); } }
@keyframes sm-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }

/* === SVG-specific === */
@keyframes sm-draw { from { stroke-dashoffset: var(--sm-path-length, 1000); } to { stroke-dashoffset: 0; } }
@keyframes sm-fill-in { from { fill-opacity: 0; } to { fill-opacity: 1; } }

/* === 3D & Depth === */
@keyframes sm-flip-in { from { opacity: 0; transform: perspective(600px) rotateY(-90deg); } to { opacity: 1; transform: perspective(600px) rotateY(0); } }

/* === Animation utility classes === */
.sm-fade-in { animation: sm-fade-in 0.5s ease-out both; }
.sm-fade-up { animation: sm-fade-up 0.5s ease-out both; }
.sm-fade-down { animation: sm-fade-down 0.5s ease-out both; }
.sm-fade-left { animation: sm-fade-left 0.5s ease-out both; }
.sm-fade-right { animation: sm-fade-right 0.5s ease-out both; }
.sm-scale-in { animation: sm-scale-in 0.5s ease-out both; }
.sm-scale-up { animation: sm-scale-up 0.5s ease-out both; }
.sm-blur-in { animation: sm-blur-in 0.6s ease-out both; }
.sm-rotate-in { animation: sm-rotate-in 0.5s ease-out both; }
.sm-bounce-in { animation: sm-bounce-in 0.6s ease-out both; }
.sm-elastic-in { animation: sm-elastic-in 0.8s ease-out both; }
.sm-pulse { animation: sm-pulse 2s ease-in-out infinite; }
.sm-glow { animation: sm-glow 2s ease-in-out infinite; }
.sm-float { animation: sm-float 3s ease-in-out infinite; }
.sm-shimmer { animation: sm-shimmer 2s linear infinite; background-size: 200% 100%; }
.sm-draw { animation: sm-draw 1.5s ease-out both; }
.sm-fill-in { animation: sm-fill-in 0.8s ease-out both; }
.sm-flip-in { animation: sm-flip-in 0.6s ease-out both; }

/* === Stagger delays === */
.sm-stagger-1 { animation-delay: 0.1s; }
.sm-stagger-2 { animation-delay: 0.2s; }
.sm-stagger-3 { animation-delay: 0.3s; }
.sm-stagger-4 { animation-delay: 0.4s; }
.sm-stagger-5 { animation-delay: 0.5s; }
.sm-stagger-6 { animation-delay: 0.6s; }
.sm-stagger-7 { animation-delay: 0.7s; }
.sm-stagger-8 { animation-delay: 0.8s; }
.sm-stagger-9 { animation-delay: 0.9s; }
.sm-stagger-10 { animation-delay: 1.0s; }
.sm-stagger-11 { animation-delay: 1.1s; }
.sm-stagger-12 { animation-delay: 1.2s; }

/* === Duration overrides === */
.sm-duration-fast { animation-duration: 0.2s; }
.sm-duration-normal { animation-duration: 0.5s; }
.sm-duration-slow { animation-duration: 1s; }
.sm-duration-cinematic { animation-duration: 2s; }

/* === Easing overrides === */
.sm-ease-out { animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }
.sm-ease-spring { animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1); }
.sm-ease-cinematic { animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1); }

/* === Slide transitions === */
.sm-transition-fade { transition: opacity 0.5s ease; }
.sm-transition-slide { transition: transform 0.5s ease; }
.sm-transition-zoom { transition: transform 0.5s ease, opacity 0.5s ease; }
.sm-transition-blur { transition: filter 0.5s ease, opacity 0.5s ease; }
```

**Step 4: Import motion.css in studio styles**

Add to `apps/studio/src/styles.css`:
```css
@import "@slidemason/components/motion.css";
```

Note: This requires adding a `"./motion.css"` export to `packages/components/package.json`:
```json
"exports": {
  ".": { "source": "./src/index.ts", "import": "./dist/index.js", "types": "./dist/index.d.ts" },
  "./motion.css": "./src/motion.css"
}
```

Also add `@source "../../../packages/components/src/motion.css";` to styles.css.

**Step 5: Commit**
```bash
git add -A && git commit -m "feat: add animation system, Lucide icons, category directory structure"
```

---

### Task 2: SVG Diagram Primitives

**Files:**
- Create: `packages/components/src/svg/Arrow.tsx`
- Create: `packages/components/src/svg/Connector.tsx`
- Create: `packages/components/src/svg/CircleNode.tsx`
- Create: `packages/components/src/svg/BoxNode.tsx`
- Create: `packages/components/src/svg/ArcSegment.tsx`
- Create: `packages/components/src/svg/Ring.tsx`
- Create: `packages/components/src/svg/FunnelTrapezoid.tsx`
- Create: `packages/components/src/svg/PyramidLayer.tsx`
- Create: `packages/components/src/svg/index.ts`
- Create: `packages/components/src/__tests__/svg-primitives.test.tsx`

**Pattern for SVG primitives:**
Each is a small SVG element that uses `currentColor` or CSS variables. Example `Arrow.tsx`:

```tsx
import type { CSSProperties } from 'react';

export interface ArrowProps {
  x1: number; y1: number;
  x2: number; y2: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
  style?: CSSProperties;
  animate?: boolean;
}

export function Arrow({ x1, y1, x2, y2, color = 'var(--sm-primary)', strokeWidth = 2, className = '', style, animate }: ArrowProps) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  const length = Math.sqrt(dx * dx + dy * dy);
  const headSize = 8;

  return (
    <g className={`${animate ? 'sm-draw' : ''} ${className}`.trim()} style={style}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={animate ? length : undefined}
        style={animate ? { '--sm-path-length': length } as CSSProperties : undefined} />
      <polygon
        points={`0,-${headSize / 2} ${headSize},0 0,${headSize / 2}`}
        fill={color}
        transform={`translate(${x2},${y2}) rotate(${angle})`}
      />
    </g>
  );
}
```

Implement all 8 SVG primitives following this pattern:
- **Arrow**: Line with arrowhead, optional draw animation
- **Connector**: Curved bezier path between two points
- **CircleNode**: Circle with centered text label
- **BoxNode**: Rounded rectangle with centered text label
- **ArcSegment**: Arc path for use in cycles/flywheels (takes startAngle, endAngle, radius)
- **Ring**: Full circle ring with optional fill percentage (for donut charts)
- **FunnelTrapezoid**: Trapezoid shape for funnel layers (takes topWidth, bottomWidth, height)
- **PyramidLayer**: Triangle segment for pyramid charts (takes level, totalLevels, label)

**Tests:** Render each primitive, verify SVG elements exist, verify theme-aware colors are used.

**Commit:**
```bash
git add -A && git commit -m "feat: add SVG diagram primitives (Arrow, Ring, CircleNode, etc.)"
```

---

### Task 3: Theme Expansion (3 existing + 9 new = 12 themes)

**Files:**
- Modify: `packages/themes/src/slate.css` (add new variables)
- Modify: `packages/themes/src/canvas.css` (add new variables)
- Modify: `packages/themes/src/signal.css` (add new variables)
- Create: `packages/themes/src/noir.css`
- Create: `packages/themes/src/dawn.css`
- Create: `packages/themes/src/boardroom.css`
- Create: `packages/themes/src/neon.css`
- Create: `packages/themes/src/forest.css`
- Create: `packages/themes/src/glacier.css`
- Create: `packages/themes/src/sunset.css`
- Create: `packages/themes/src/paper.css`
- Create: `packages/themes/src/midnight.css`
- Modify: `packages/themes/src/index.ts` (export theme names)
- Modify: `packages/themes/package.json` (add CSS exports for new themes)
- Modify: `apps/studio/src/styles.css` (import all theme CSS files)
- Modify: `packages/themes/src/__tests__/themes.test.ts` (test all 12 themes)

**New variables to add to ALL themes (existing + new):**

```css
/* Semantic colors */
--sm-success: <green>;
--sm-warning: <amber>;
--sm-danger: <red>;

/* Gradients */
--sm-gradient-start: <color>;
--sm-gradient-end: <color>;
--sm-gradient-mesh-1: <color>;
--sm-gradient-mesh-2: <color>;
--sm-gradient-mesh-3: <color>;
--sm-gradient-mesh-4: <color>;

/* Chart palette (6 distinct, accessible colors) */
--sm-chart-1: <color>;
--sm-chart-2: <color>;
--sm-chart-3: <color>;
--sm-chart-4: <color>;
--sm-chart-5: <color>;
--sm-chart-6: <color>;

/* Glass effect */
--sm-glass-bg: <rgba with alpha>;
```

**New theme definitions:**

| Theme | bg | surface | text | primary | secondary | accent |
|-------|-----|---------|------|---------|-----------|--------|
| Noir | `#000000` | `#111111` | `#f5f5f4` | `#d4a574` | `#a8a29e` | `#fbbf24` |
| Dawn | `#fef3c7` | `#ffffff` | `#292524` | `#c2410c` | `#059669` | `#7c3aed` |
| Boardroom | `#0c1929` | `#162a40` | `#f8fafc` | `#f8fafc` | `#38bdf8` | `#a78bfa` |
| Neon | `#0a0a0a` | `#171717` | `#ffffff` | `#ec4899` | `#22d3ee` | `#a3e635` |
| Forest | `#052e16` | `#14532d` | `#f0fdf4` | `#86efac` | `#fbbf24` | `#f9a8d4` |
| Glacier | `#f0f9ff` | `#ffffff` | `#0c4a6e` | `#0369a1` | `#0891b2` | `#6366f1` |
| Sunset | `#1e1b4b` | `#312e81` | `#fef3c7` | `#f97316` | `#ec4899` | `#fbbf24` |
| Paper | `#fffbeb` | `#ffffff` | `#1c1917` | `#1e3a5f` | `#b91c1c` | `#047857` |
| Midnight | `#18181b` | `#27272a` | `#fafafa` | `#8b5cf6` | `#06b6d4` | `#f43f5e` |

Each theme CSS file follows the same structure as existing themes (see `slate.css`).

**Tests:** Update `themes.test.ts` to verify all 12 themes define all required variables (including the new semantic, gradient, chart, and glass variables).

**Commit:**
```bash
git add -A && git commit -m "feat: expand to 12 themes with semantic colors, gradients, and chart palettes"
```

---

## Phase 2: Component Categories (Tasks 4-13)

**IMPORTANT PATTERN for all component tasks:**

Every component follows this structure:
```tsx
import type { CSSProperties, ReactNode } from 'react';

export interface ComponentNameProps {
  // data props
  className?: string;
  style?: CSSProperties;
  animate?: boolean | 'stagger';
}

export function ComponentName({ /* props */, className = '', style, animate }: ComponentNameProps) {
  return (
    <div className={`... ${animate ? 'sm-fade-up' : ''} ${className}`.trim()} style={style}>
      {/* content */}
    </div>
  );
}
```

For `animate: 'stagger'`, child elements get `sm-stagger-N` classes.

Each category task creates:
1. All components in the category
2. A barrel `index.ts` re-exporting them
3. Tests verifying each component renders with correct props
4. Exports added to main `packages/components/src/index.ts`

**Test pattern for each component:**
```tsx
import { render, screen } from '@testing-library/react';
import { ComponentName } from '../category/ComponentName';

describe('ComponentName', () => {
  it('renders with required props', () => {
    render(<ComponentName prop1="value" />);
    expect(screen.getByText('value')).toBeInTheDocument();
  });

  it('applies className and style', () => {
    const { container } = render(<ComponentName prop1="value" className="custom" style={{ color: 'red' }} />);
    expect(container.firstChild).toHaveClass('custom');
    expect(container.firstChild).toHaveStyle({ color: 'red' });
  });

  it('applies animation class when animate is true', () => {
    const { container } = render(<ComponentName prop1="value" animate />);
    expect(container.innerHTML).toContain('sm-');
  });
});
```

---

### Task 4: Category 1 — Typography & Text (12 components)

**Files:**
- Create: `packages/components/src/typography/HeroText.tsx`
- Create: `packages/components/src/typography/GradientText.tsx`
- Create: `packages/components/src/typography/TypewriterText.tsx`
- Create: `packages/components/src/typography/StatCallout.tsx`
- Create: `packages/components/src/typography/PullQuote.tsx`
- Create: `packages/components/src/typography/CodeBlock.tsx`
- Create: `packages/components/src/typography/HighlightBox.tsx`
- Create: `packages/components/src/typography/Annotation.tsx`
- Create: `packages/components/src/typography/BigNumber.tsx`
- Create: `packages/components/src/typography/Label.tsx`
- Create: `packages/components/src/typography/BlockQuoteStack.tsx`
- Create: `packages/components/src/typography/TextReveal.tsx`
- Create: `packages/components/src/typography/index.ts`
- Create: `packages/components/src/__tests__/typography.test.tsx`
- Modify: `packages/components/src/index.ts` (add typography exports)

**Component specs:**

1. **HeroText** `{ children: ReactNode; gradient?: boolean; shadow?: boolean }` — renders `<h1>` with `clamp(3rem, 8vw, 8rem)`. When `gradient`, applies `bg-gradient-to-r from-[var(--sm-primary)] to-[var(--sm-accent)]` + `bg-clip-text text-transparent`. When `shadow`, applies text-shadow.

2. **GradientText** `{ children: ReactNode; from?: string; to?: string; direction?: string }` — renders `<span>` with CSS gradient text fill. Defaults to `from: var(--sm-primary)`, `to: var(--sm-accent)`.

3. **TypewriterText** `{ text: string; speed?: number }` — renders text that types character by character via CSS `steps()` animation. Uses `sm-typewriter` keyframe with `ch` unit width.

4. **StatCallout** `{ value: string; label: string; trend?: { direction: 'up' | 'down'; value: string } }` — giant number (clamp 3rem, 6vw, 5rem) with label below and optional trend badge (green ↑ or red ↓).

5. **PullQuote** `{ quote: string; attribution?: string }` — italic text with oversized decorative `"` characters (8rem, 10% opacity, positioned absolute).

6. **CodeBlock** `{ code: string; language?: string }` — `<pre><code>` block with mono font, surface background, border, line numbers, and language badge. Basic keyword highlighting via regex for common languages.

7. **HighlightBox** `{ children: ReactNode; variant?: 'info' | 'warning' | 'success' | 'tip' }` — colored left border (4px) + light background tint. Uses semantic colors: info=primary, warning=warning, success=success, tip=accent. Includes Lucide icons: Info, AlertTriangle, CheckCircle, Lightbulb.

8. **Annotation** `{ text: string; position?: 'top' | 'bottom' | 'left' | 'right' }` — small tooltip-style floating note with an SVG arrow/pointer.

9. **BigNumber** `{ value: number; prefix?: string; suffix?: string; duration?: number }` — uses `sm-counter` CSS animation. Displays with `clamp(3rem, 7vw, 6rem)` font size.

10. **Label** `{ text: string; color?: string; variant?: 'filled' | 'outline' }` — small pill/badge with rounded-full, px-3 py-1, text-xs font. `filled` uses primary bg, `outline` uses border.

11. **BlockQuoteStack** `{ quotes: Array<{ text: string; author?: string }> }` — stacked quotes with subtle vertical connector line between them.

12. **TextReveal** `{ lines: string[] }` — each line gets `sm-fade-up` + `sm-stagger-N` for sequential reveal.

**Commit:**
```bash
git add -A && git commit -m "feat: add 12 typography components (HeroText, GradientText, CodeBlock, etc.)"
```

---

### Task 5: Category 2 — Lists & Sequential (12 components)

**Files:**
- Create: `packages/components/src/lists/IconList.tsx` (and 11 more)
- Create: `packages/components/src/lists/index.ts`
- Create: `packages/components/src/__tests__/lists.test.tsx`
- Modify: `packages/components/src/index.ts`

**Component specs:**

13. **IconList** `{ items: Array<{ icon: string; text: string }> }` — Each item renders a Lucide icon (by name lookup) + text. Uses dynamic import: `import * as icons from 'lucide-react'` and renders `icons[item.icon]`.

14. **Checklist** `{ items: Array<{ text: string; checked: boolean }> }` — Each item: green CheckCircle or gray Circle icon + text. Checked items can have strikethrough styling.

15. **TimelineVertical** `{ events: Array<{ date: string; title: string; description?: string }> }` — Vertical line (2px) with dot markers. Date on left, content on right. Uses sm-primary for dots, sm-border for line.

16. **TimelineHorizontal** `{ milestones: Array<{ label: string; date?: string; active?: boolean }> }` — Horizontal line with labeled dots. Active milestone is highlighted with sm-primary.

17. **ProcessFlow** `{ steps: Array<{ label: string; icon?: string }> }` — Horizontal boxes connected by arrow SVGs. Each box has border, surface bg, optional Lucide icon.

18. **StepCards** `{ steps: Array<{ number: number; title: string; description: string }> }` — Horizontal row of cards with large number (01, 02...), title, description.

19. **AccordionList** `{ items: Array<{ title: string; content: string; expanded?: boolean }> }` — Shows one item expanded (visually, not interactive). Expanded item has full content visible, others show just title with ChevronRight icon.

20. **ProgressSteps** `{ steps: string[]; current: number }` — Circles connected by lines. Completed circles filled, current pulsing, future empty.

21. **RankedList** `{ items: Array<{ label: string; value: number }> }` — Horizontal bars proportional to value with rank number. Auto-scales to max value.

22. **BreadcrumbPath** `{ steps: string[]; current?: number }` — Horizontal `Step > Step > Step` with chevrons. Current step highlighted.

23. **MilestoneTracker** `{ milestones: Array<{ label: string; status: 'completed' | 'current' | 'upcoming' }> }` — Like ProgressSteps but with explicit status + labels below.

24. **SwimLanes** `{ lanes: Array<{ label: string; items: Array<{ text: string; start: number; end: number }> }> }` — Horizontal tracks with positioned blocks (Gantt-chart style).

**Commit:**
```bash
git add -A && git commit -m "feat: add 12 list/sequential components (IconList, ProcessFlow, SwimLanes, etc.)"
```

---

### Task 6: Category 3 — Grids & Cards (14 components)

**Files:**
- Create: `packages/components/src/cards/IconCard.tsx` (and 13 more)
- Create: `packages/components/src/cards/index.ts`
- Create: `packages/components/src/__tests__/cards.test.tsx`
- Modify: `packages/components/src/index.ts`

**Component specs:**

25. **IconCard** `{ icon: string; title: string; description: string }` — Lucide icon (large, primary color) + title (bold) + description (muted). Border, surface bg, rounded, padding.

26. **FeatureGrid** `{ features: Array<{ icon: string; title: string; description: string }>; columns?: 2 | 3 }` — CSS grid of IconCards. Defaults to 3 columns.

27. **PricingTable** `{ tiers: Array<{ name: string; price: string; period?: string; features: string[]; highlighted?: boolean }> }` — Side-by-side tier cards. Highlighted tier gets primary border + "Popular" badge.

28. **TeamGrid** `{ members: Array<{ name: string; role: string; avatar?: string }> }` — Grid of circular avatar (or initials placeholder) + name + role.

29. **TestimonialCard** `{ quote: string; name: string; title?: string; company?: string; avatar?: string }` — Quote with attribution, avatar circle, italic text.

30. **MetricCard** `{ value: string; label: string; trend?: { direction: 'up' | 'down'; value: string }; sparkline?: number[] }` — StatCard but with mini sparkline SVG (polyline from data points).

31. **ImageCard** `{ src: string; alt: string; title: string; description?: string }` — Image top, text below. Image has object-cover, rounded top corners.

32. **LogoGrid** `{ logos: Array<{ src: string; alt: string }> }` — Even grid of images, grayscale by default (filter: grayscale(1)), full color on hover.

33. **StackedCards** `{ cards: Array<{ title: string; content: string }> }` — Cards overlapping with slight translate offsets creating a fanned/stacked effect.

34. **NumberedCards** `{ items: Array<{ title: string; description: string }> }` — Cards with large faded sequential numbers (01, 02, 03...) in background, title + description in foreground.

35. **GlassCard** `{ children: ReactNode }` — Card with `backdrop-blur-md` and `var(--sm-glass-bg)` background. Subtle border at 20% opacity.

36. **ActionCard** `{ icon: string; title: string; description: string; action: string }` — Card with icon, text, and a styled CTA button at bottom.

37. **InfoCard** `{ title: string; content: string; accent?: string }` — Card with colored left border stripe (4px, uses accent color or primary).

38. **ProfileCard** `{ name: string; title: string; bio?: string; avatar?: string; social?: Array<{ platform: string; url: string }> }` — Full person card with avatar, info, and social icons.

**Commit:**
```bash
git add -A && git commit -m "feat: add 14 card/grid components (IconCard, FeatureGrid, PricingTable, etc.)"
```

---

### Task 7: Category 4 — Diagrams & Frameworks (16 components)

**Files:**
- Create: `packages/components/src/diagrams/Flywheel.tsx` (and 15 more)
- Create: `packages/components/src/diagrams/index.ts`
- Create: `packages/components/src/__tests__/diagrams.test.tsx`
- Modify: `packages/components/src/index.ts`

**These are the most complex components — all pure SVG React.**

**Component specs:**

39. **Flywheel** `{ segments: Array<{ label: string; icon?: string }>; size?: number }` — Renders a circular diagram using ArcSegment primitives. Each segment is an arc with a label. Arrows between segments show flow direction. Default size 400px.

40. **CycleDiagram** `{ stages: Array<{ label: string; icon?: string }>; size?: number }` — Circular arrows connecting 3-6 stages. Each stage is a CircleNode at evenly-spaced angles. Curved arrows between nodes.

41. **FunnelChart** `{ stages: Array<{ label: string; value?: number }> }` — Stacked FunnelTrapezoid primitives, each narrower than the previous. Labels centered in each layer. Optional values shown as percentages.

42. **PyramidChart** `{ layers: Array<{ label: string }> }` — Triangle built from PyramidLayer primitives. Bottom layer widest, top narrowest.

43. **VennDiagram** `{ sets: Array<{ label: string }>; intersection?: string }` — 2-3 overlapping semi-transparent circles with labels. Intersection zone labeled.

44. **OrgChart** `{ nodes: Array<{ id: string; label: string; parentId?: string }> }` — Tree layout. Root at top, children below connected by Connector lines. BoxNode for each person/role.

45. **MindMap** `{ center: string; branches: Array<{ label: string; children?: string[] }> }` — Central CircleNode with radiating branches. Each branch is a line to a smaller node. Children branch further.

46. **Flowchart** `{ nodes: Array<{ id: string; label: string; type: 'process' | 'decision' | 'start' | 'end' }>; edges: Array<{ from: string; to: string; label?: string }> }` — Generic flowchart. Process=BoxNode, Decision=diamond, Start/End=rounded. Edges are Connector/Arrow primitives.

47. **MatrixQuadrant** `{ title?: string; xAxis: string; yAxis: string; quadrants: [string, string, string, string]; items?: Array<{ label: string; x: number; y: number }> }` — 2×2 grid with labeled axes and quadrant names. Optional plotted items.

48. **RadarChart** `{ axes: Array<{ label: string; value: number; max?: number }>; size?: number }` — Spider chart. Draws polygon grid and data polygon filled with primary color at 30% opacity.

49. **ConcentricCircles** `{ rings: Array<{ label: string }> }` — Nested circles, innermost is primary, each outward ring lighter. Labels on each ring.

50. **SankeyFlow** `{ nodes: Array<{ id: string; label: string }>; flows: Array<{ from: string; to: string; value: number }> }` — Left-to-right flow diagram. Nodes as stacked bars, flows as curved filled paths proportional to value.

51. **TreeMap** `{ items: Array<{ label: string; value: number }> }` — Nested rectangles. Size proportional to value. Each rect gets a chart color from the palette.

52. **HubSpoke** `{ center: string; spokes: Array<{ label: string; icon?: string }> }` — Central circle with lines radiating to satellite circles.

53. **BridgeDiagram** `{ start: { label: string; value: number }; changes: Array<{ label: string; value: number }>; end: { label: string; value: number } }` — Waterfall chart. Starting bar, positive (green) and negative (red) floating bars, ending bar.

54. **LoopDiagram** `{ stages: Array<{ label: string }>; direction?: 'clockwise' | 'counterclockwise' }` — Like CycleDiagram but with a single continuous arrow loop.

**Commit:**
```bash
git add -A && git commit -m "feat: add 16 diagram components (Flywheel, Funnel, VennDiagram, Flowchart, etc.)"
```

---

### Task 8: Category 5 — Data Visualization (14 components)

**Files:**
- Create: `packages/components/src/dataviz/BarChart.tsx` (and 13 more)
- Create: `packages/components/src/dataviz/index.ts`
- Create: `packages/components/src/__tests__/dataviz.test.tsx`
- Modify: `packages/components/src/index.ts`

**All pure SVG — no charting library.**

**Component specs:**

55. **BarChart** `{ bars: Array<{ label: string; value: number }>; direction?: 'horizontal' | 'vertical'; max?: number }` — SVG bars with labels. Width proportional to value. Uses `--sm-chart-1` for fill. Animate: bars grow from 0.

56. **StackedBar** `{ bars: Array<{ label: string; segments: Array<{ value: number; label?: string }> }> }` — Each bar has colored segments using chart palette. Legend at bottom.

57. **DonutChart** `{ segments: Array<{ label: string; value: number }>; centerLabel?: string; size?: number }` — Ring chart using Ring primitive with ArcSegments. Center text optional. Uses chart palette for segment colors.

58. **ProgressBar** `{ value: number; max?: number; label?: string; showPercent?: boolean }` — Horizontal bar with fill. Rounded ends. Animate: fill grows from 0.

59. **ProgressRing** `{ value: number; max?: number; size?: number; label?: string }` — Circular ring using Ring primitive. Fill proportional to value/max. Label in center.

60. **GaugeChart** `{ value: number; min?: number; max?: number; label?: string }` — Half-circle gauge. Needle points to value. Color zones (green/yellow/red) optional.

61. **Sparkline** `{ data: number[]; width?: number; height?: number; color?: string }` — Tiny line chart SVG. Polyline from data points scaled to fit. No axes or labels — just the line.

62. **HeatmapGrid** `{ rows: Array<{ label: string; cells: number[] }>; columnLabels?: string[] }` — Grid of colored rectangles. Color intensity proportional to value. Uses primary color with varying opacity.

63. **WaterfallChart** `{ items: Array<{ label: string; value: number }>; startLabel?: string }` — Rising and falling bars. Positive = success color, negative = danger color. Connecting lines between bars.

64. **BulletChart** `{ value: number; target: number; ranges: [number, number, number]; label?: string }` — Horizontal bar with target marker line and background range bands (light/medium/dark).

65. **AreaChart** `{ data: Array<{ label: string; value: number }>; fill?: boolean }` — Line chart with optional filled area below. SVG polyline + polygon fill.

66. **ScatterPlot** `{ points: Array<{ x: number; y: number; label?: string }>; xLabel?: string; yLabel?: string }` — Dots plotted on X/Y axes. Axes with labels.

67. **PieChart** `{ slices: Array<{ label: string; value: number }> }` — Classic pie using ArcSegment. Labels with leader lines.

68. **HarveyBall** `{ value: 0 | 25 | 50 | 75 | 100; size?: number }` — Filled circle quarters. 0=empty, 25=quarter, 50=half, 75=three-quarter, 100=full.

**Commit:**
```bash
git add -A && git commit -m "feat: add 14 data visualization components (BarChart, DonutChart, Sparkline, etc.)"
```

---

### Task 9: Category 6 — Comparison & Analysis (12 components)

**Files:**
- Create: `packages/components/src/comparison/ProsCons.tsx` (and 11 more)
- Create: `packages/components/src/comparison/index.ts`
- Create: `packages/components/src/__tests__/comparison.test.tsx`
- Modify: `packages/components/src/index.ts`

**Component specs:**

69. **ProsCons** `{ pros: string[]; cons: string[] }` — Two columns. Left: green CheckCircle + text. Right: red XCircle + text. Headers "Pros" / "Cons" with appropriate colors.

70. **BeforeAfter** `{ before: { title: string; items: string[] }; after: { title: string; items: string[] } }` — Side-by-side. "Before" side has muted/dimmed styling. "After" side has primary border glow. Arrow or divider between them.

71. **VersusSlide** `{ left: { label: string; points?: string[] }; right: { label: string; points?: string[] } }` — Dramatic "VS" text in center (large, primary color). Left and right sides with content.

72. **FeatureMatrix** `{ features: string[]; products: Array<{ name: string; values: Array<boolean | string> }> }` — Table grid. Features as rows, products as columns. Boolean values render as CheckCircle/Minus icons.

73. **HarveyBallMatrix** `{ criteria: string[]; options: Array<{ name: string; scores: Array<0 | 25 | 50 | 75 | 100> }> }` — Table with HarveyBall components in cells instead of text.

74. **SWOTGrid** `{ strengths: string[]; weaknesses: string[]; opportunities: string[]; threats: string[] }` — 2×2 colored grid. Each quadrant has a header + bullet items. S=success, W=danger, O=primary, T=warning colors.

75. **ScoreCard** `{ criteria: Array<{ label: string; weight: number; score: number }> }` — Table with criteria, weight, score, weighted score columns. Total row at bottom.

76. **TrafficLight** `{ items: Array<{ label: string; status: 'green' | 'yellow' | 'red'; note?: string }> }` — List with colored circle indicators. Uses semantic success/warning/danger colors.

77. **RatingStars** `{ items: Array<{ label: string; rating: number; max?: number }> }` — Items with filled/empty star icons. Uses Lucide Star/StarHalf icons.

78. **GapAnalysis** `{ current: { label: string; value: string }; desired: { label: string; value: string }; gap: string }` — Visual showing current state → gap arrow → desired state. Gap highlighted with warning color.

79. **PriorityMatrix** `{ items: Array<{ label: string; effort: number; impact: number }>; effortLabel?: string; impactLabel?: string }` — Scatter plot on 2×2 grid. "Quick Wins" quadrant (low effort, high impact) highlighted.

80. **CompetitorMap** `{ items: Array<{ label: string; x: number; y: number }>; xAxis: string; yAxis: string }` — Positioning plot. Items as labeled dots on 2 axes.

**Commit:**
```bash
git add -A && git commit -m "feat: add 12 comparison components (ProsCons, SWOT, FeatureMatrix, etc.)"
```

---

### Task 10: Category 7 — Media & Visual (10 components)

**Files:**
- Create: `packages/components/src/media/FullBleedImage.tsx` (and 9 more)
- Create: `packages/components/src/media/index.ts`
- Create: `packages/components/src/__tests__/media.test.tsx`
- Modify: `packages/components/src/index.ts`

**Component specs:**

81. **FullBleedImage** `{ src: string; alt: string; children?: ReactNode; overlay?: 'dark' | 'light' | 'gradient' }` — Image fills entire parent container (absolute inset-0, object-cover). Children positioned on top with z-index. Overlay adds a semi-transparent layer for text readability.

82. **ImageGrid** `{ images: Array<{ src: string; alt: string }>; columns?: 2 | 3 }` — CSS grid of images. All object-cover, rounded corners, equal aspect ratio.

83. **ImageTextSplit** `{ image: { src: string; alt: string }; children: ReactNode; imagePosition?: 'left' | 'right' }` — 50/50 split. Image on one side, content on the other. Flex row.

84. **PhoneMockup** `{ src?: string; children?: ReactNode }` — SVG phone frame (iPhone-style rounded rectangle with notch). Content rendered inside the "screen" area via foreignObject or img.

85. **BrowserMockup** `{ url?: string; src?: string; children?: ReactNode }` — SVG browser chrome (title bar with dots + URL bar). Content below in the "page" area.

86. **LaptopMockup** `{ src?: string; children?: ReactNode }` — SVG laptop frame with screen area and keyboard base.

87. **ScreenshotAnnotated** `{ src: string; alt: string; annotations: Array<{ x: number; y: number; label: string }> }` — Image with numbered circle callouts at specified positions. Numbers correspond to a legend below.

88. **VideoEmbed** `{ src: string; poster?: string; aspectRatio?: string }` — `<video>` or `<iframe>` wrapper with aspect-ratio container. Supports YouTube/Vimeo URLs (iframe) or direct video files.

89. **IconMosaic** `{ icons: string[]; columns?: number; opacity?: number }` — Grid of Lucide icons as a decorative background element. Low opacity by default (0.05).

90. **AvatarStack** `{ avatars: Array<{ src?: string; name: string }>; max?: number }` — Overlapping circular avatars with `-ml-3` offset. Shows "+N more" badge if exceeds max.

**Commit:**
```bash
git add -A && git commit -m "feat: add 10 media components (FullBleedImage, PhoneMockup, AvatarStack, etc.)"
```

---

### Task 11: Category 8 — Backgrounds & Decorative (10 components)

**Files:**
- Create: `packages/components/src/backgrounds/GradientBg.tsx` (and 9 more)
- Create: `packages/components/src/backgrounds/index.ts`
- Create: `packages/components/src/__tests__/backgrounds.test.tsx`
- Modify: `packages/components/src/index.ts`

**Component specs:**

91. **GradientBg** `{ children: ReactNode; type?: 'linear' | 'radial' | 'conic'; from?: string; to?: string; angle?: number }` — Wrapper div with CSS gradient background. Defaults to `var(--sm-gradient-start)` → `var(--sm-gradient-end)`.

92. **MeshGradient** `{ children: ReactNode; colors?: string[] }` — Multiple absolutely-positioned blurred circles (blur 80px+) creating an organic gradient. Defaults to mesh variables.

93. **GeometricPattern** `{ children?: ReactNode; pattern?: 'dots' | 'lines' | 'triangles' | 'crosses'; opacity?: number }` — SVG pattern background using `<pattern>` and `<rect fill="url(#pattern)">`. Low opacity.

94. **BlobShape** `{ color?: string; size?: number; position?: { x: string; y: string } }` — Organic SVG blob shape (randomized border-radius or SVG path). Positioned absolutely as decoration.

95. **GridLines** `{ children?: ReactNode; spacing?: number; opacity?: number }` — Subtle grid/graph-paper background using SVG pattern. Very low opacity (0.05-0.1).

96. **WavesDivider** `{ color?: string; position?: 'top' | 'bottom'; flip?: boolean }` — SVG wave shape. Positioned at top or bottom of container. Used between sections.

97. **CircuitPattern** `{ children?: ReactNode; opacity?: number }` — Tech-themed SVG pattern with lines, dots, and right-angle paths.

98. **TopographyLines** `{ children?: ReactNode; opacity?: number }` — SVG contour/topographic line pattern.

99. **NoisyGradient** `{ children: ReactNode; from?: string; to?: string }` — Gradient with an SVG `<filter>` turbulence noise overlay for grain texture.

100. **SpotlightEffect** `{ children: ReactNode; x?: string; y?: string; size?: string }` — Radial gradient from transparent center to darker edges, creating a spotlight.

**Commit:**
```bash
git add -A && git commit -m "feat: add 10 background/decorative components (GradientBg, MeshGradient, BlobShape, etc.)"
```

---

### Task 12: Category 9 — Navigation & Structure (8 components)

**Files:**
- Create: `packages/components/src/navigation/AgendaNav.tsx` (and 7 more)
- Create: `packages/components/src/navigation/index.ts`
- Create: `packages/components/src/__tests__/navigation.test.tsx`
- Modify: `packages/components/src/index.ts`

**Component specs:**

101. **AgendaNav** `{ items: Array<{ label: string; active?: boolean }> }` — Vertical list. Active item has primary color + bold + left border indicator. Others are muted.

102. **SectionHeader** `{ number?: number; title: string; subtitle?: string }` — Full-height centered layout. Large faded number behind (20% opacity, 20rem), title + subtitle in front.

103. **ChapterCard** `{ number: number; title: string; subtitle?: string }` — Large number top-left, decorative horizontal line, title + subtitle below.

104. **BreadcrumbBar** `{ items: string[]; current?: number }` — Horizontal bar: `Home / Section / Page`. Chevron separators. Current item highlighted.

105. **ProgressIndicator** `{ current: number; total: number; position?: 'top' | 'bottom' }` — Thin bar (4px) at edge of slide showing progress (current/total filled).

106. **TableOfContents** `{ items: Array<{ title: string; page?: number }> }` — List with dot leaders (......) between title and page number. Active item highlighted.

107. **EndSlide** `{ variant: 'thankyou' | 'qa' | 'contact'; message?: string; contactInfo?: { email?: string; website?: string; social?: string } }` — Ending slide. "Thank You" / "Questions?" with optional contact info below.

108. **TitleCard** `{ title: string; subtitle?: string; background?: 'gradient' | 'image'; bgSrc?: string }` — Full-slide title with optional gradient or image background behind text.

**Commit:**
```bash
git add -A && git commit -m "feat: add 8 navigation components (AgendaNav, SectionHeader, ProgressIndicator, etc.)"
```

---

### Task 13: Category 10 — Interactive & CTA (8 components)

**Files:**
- Create: `packages/components/src/interactive/RecommendationBox.tsx` (and 7 more)
- Create: `packages/components/src/interactive/index.ts`
- Create: `packages/components/src/__tests__/interactive.test.tsx`
- Modify: `packages/components/src/index.ts`

**Component specs:**

109. **RecommendationBox** `{ title: string; description: string; icon?: string; priority?: 'high' | 'medium' | 'low' }` — Prominent box with icon, primary border, surface bg. High priority gets danger accent.

110. **NextStepsGrid** `{ steps: Array<{ action: string; owner?: string; date?: string; status?: 'todo' | 'in-progress' | 'done' }> }` — Table/grid of action items. Status shown as colored badges.

111. **ContactCard** `{ name: string; title?: string; email?: string; phone?: string; avatar?: string }` — Card with person info. Lucide icons for each contact method (Mail, Phone, User).

112. **QRCode** `{ url: string; size?: number; label?: string }` — Pure SVG QR code generator (implement basic QR encoding or use a lightweight algorithm). Label below.

113. **CTAButton** `{ text: string; variant?: 'primary' | 'secondary' | 'outline'; icon?: string }` — Large styled button (not interactive — visual only for slides). Primary bg, rounded, bold text. Optional Lucide icon.

114. **PollResults** `{ question?: string; options: Array<{ label: string; value: number; total?: number }> }` — Horizontal bars showing vote/survey results. Percentage labels. Bars animate from 0.

115. **CountdownTimer** `{ targetDate: string; labels?: { days?: string; hours?: string; minutes?: string; seconds?: string } }` — Four boxes showing D:H:M:S. Uses sm-counter animation. Static display (shows time remaining from targetDate to now).

116. **EmbedFrame** `{ src: string; title?: string; aspectRatio?: string }` — Responsive iframe wrapper with title bar.

**Commit:**
```bash
git add -A && git commit -m "feat: add 8 interactive/CTA components (RecommendationBox, QRCode, CTAButton, etc.)"
```

---

## Phase 3: Templates (Task 14)

### Task 14: 28 New Slide Templates

**Files:**
- Create 28 new template files in `packages/renderer/src/templates/`
- Modify: `packages/renderer/src/templates/index.ts` (add all exports)
- Create: `packages/renderer/src/__tests__/new-templates.test.tsx`

**Template pattern (same as existing templates):**

```tsx
import { Headline } from '@slidemason/components';
import { FeatureGrid } from '@slidemason/components';

interface IconFeaturesProps {
  headline: string;
  features: Array<{ icon: string; title: string; description: string }>;
  columns?: 2 | 3;
}

export function IconFeatures({ headline, features, columns }: IconFeaturesProps) {
  return (
    <div className="flex flex-1 flex-col" style={{ gap: 'clamp(1.5rem, 3vh, 3rem)' }}>
      <Headline>{headline}</Headline>
      <div className="flex-1 flex flex-col justify-center">
        <FeatureGrid features={features} columns={columns} />
      </div>
    </div>
  );
}
```

Create all 28 templates from the design doc (templates 13-40). Each template:
1. Composes 1-3 components from the new library
2. Uses the standard slide layout pattern (heading top, content fills with flex-1)
3. Accepts typed props for its specific data needs

**Tests:** Each template renders without errors given valid props.

**Commit:**
```bash
git add -A && git commit -m "feat: add 28 new slide templates (IconFeatures, DataDashboard, FlywheelSlide, etc.)"
```

---

## Phase 4: Schema & Prompts (Task 15)

### Task 15: Update Schemas + Agent Prompts

**Files:**
- Modify: `packages/core/src/schemas/outline.ts` (expand SlideEntry.type enum to 40 values)
- Modify: `packages/core/src/schemas/outline.ts` (add component names to components field suggestions)
- Modify: `prompts/02-outline.md` (reference full component catalog)
- Modify: `prompts/03-slides.md` (reference full component catalog by category)
- Create: `prompts/component-catalog.md` (complete reference of all 116 components with props)
- Modify: `packages/core/src/__tests__/schemas.test.ts` (test new slide types validate)

**Schema changes:**

Expand the `type` enum in SlideEntry to include all 40 template types:
```ts
z.enum([
  // Existing
  'title-hero', 'agenda', 'section-divider', 'two-column-argument',
  'quote-insight', 'stat-grid', 'image-caption', 'comparison-table',
  'timeline', 'roadmap', 'recommendation-ask', 'appendix',
  // New
  'icon-features', 'data-dashboard', 'process-overview', 'funnel-breakdown',
  'cycle-explainer', 'flywheel', 'swot-analysis', 'pros-cons',
  'before-after', 'versus-matchup', 'team-intro', 'testimonial-spotlight',
  'pricing-overview', 'screenshot-demo', 'image-story', 'data-comparison',
  'numbers-impact', 'quadrant-analysis', 'org-structure', 'flow-decision',
  'gap-bridge', 'radar-comparison', 'heatmap-view', 'score-card',
  'next-steps-action', 'contact-end', 'chapter-opener', 'logo-showcase',
])
```

**Prompts update:**
- `02-outline.md`: Add section listing all 40 slide types the agent can choose from
- `03-slides.md`: Add section listing all 116 components organized by category with brief descriptions
- `component-catalog.md`: Full reference document with every component's props, visual description, and when to use it

**Commit:**
```bash
git add -A && git commit -m "feat: update schemas and agent prompts with full component catalog"
```

---

## Phase 5: Showcase & Integration (Task 16)

### Task 16: Showcase Welcome Deck + Integration Test

**Files:**
- Modify: `apps/studio/src/App.tsx` (rewrite welcome deck to showcase premium components)
- Modify: `apps/studio/src/styles.css` (ensure all new @source paths and theme imports)

**Rewrite the welcome deck to showcase the premium component library:**

Create 8 slides that demonstrate the visual range:
1. **HeroText** slide with gradient text + MeshGradient background
2. **IconFeatures** slide showing 6 features with Lucide icons
3. **ProcessFlow** slide showing the Slidemason workflow
4. **Stats dashboard** with DonutChart + BarChart + BigNumber components
5. **Flywheel** diagram showing the content creation loop
6. **ProsCons** comparison: Slidemason vs traditional tools
7. **TeamGrid** or **TestimonialCard** social proof slide
8. **EndSlide** with gradient background

**Integration test:**
- Run `pnpm vitest run` — all tests pass
- Run `pnpm build` — all packages build
- Run `pnpm dev` — studio opens and all 8 slides render

**Commit:**
```bash
git add -A && git commit -m "feat: premium showcase welcome deck with 8 cinematic slides"
git push
```

---

## Summary

| Phase | Tasks | Components | Description |
|-------|-------|-----------|-------------|
| 1: Infrastructure | 1-3 | 0 | Lucide, motion.css, SVG primitives, 12 themes |
| 2: Components | 4-13 | 116 | All 10 categories |
| 3: Templates | 14 | 0 | 28 new slide templates |
| 4: Schema/Prompts | 15 | 0 | Schema expansion + agent prompt updates |
| 5: Showcase | 16 | 0 | Premium welcome deck + integration test |

**Total: 16 tasks, 116 components, 28 templates, 12 themes, 30+ animation classes, 8 SVG primitives**
