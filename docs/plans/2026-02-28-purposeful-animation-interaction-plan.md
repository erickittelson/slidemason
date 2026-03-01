# Purposeful Animation & Interaction Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the primitives package from auto-animated components into pure visual atoms, then add opt-in animation and interaction toolkits that give the AI full creative control.

**Architecture:** Three phases: (1) Strip all Framer Motion and StaggerContext from existing primitives, making them pure visual atoms. (2) Add new layout atoms (Grid, Split, Stack, Row, Spacer, ColorBar) and animation primitives (Animate, CountUp, TypeWriter, Stagger, ProgressReveal). (3) Add interaction primitives (Tooltip, HoverCard, HoverHighlight, ClickReveal, Tabs, Accordion, Flipcard, BeforeAfter, Sortable, Spotlight). Then update CLAUDE.md and rewrite the existing deck.

**Tech Stack:** React 19, TypeScript, Framer Motion 12, CSS, Vitest + React Testing Library

---

## Phase 1: Strip Animation from Existing Primitives

### Task 1: Delete StaggerContext and strip Slide

**Files:**
- Delete: `packages/primitives/src/StaggerContext.tsx`
- Modify: `packages/primitives/src/Slide.tsx`
- Modify: `packages/primitives/src/index.ts`

**Step 1: Delete StaggerContext.tsx**

```bash
rm packages/primitives/src/StaggerContext.tsx
```

**Step 2: Rewrite Slide.tsx — remove StaggerProvider**

Replace entire file with:

```tsx
import type { ReactNode } from 'react';

type Layout = 'center' | 'split' | 'grid' | 'statement' | 'free';
type Bg = 'none' | 'mesh';

const PAD = 'clamp(2rem, 4vw, 4rem)';

const layoutClasses: Record<Layout, string> = {
  center: 'flex flex-1 flex-col items-center justify-center text-center',
  split: 'flex flex-1',
  grid: 'flex flex-1 flex-col',
  statement: 'flex flex-1 flex-col items-center justify-center text-center',
  free: 'flex flex-1 flex-col',
};

interface SlideProps {
  children: ReactNode;
  layout?: Layout;
  bg?: Bg;
  className?: string;
  style?: React.CSSProperties;
}

export function Slide({
  children,
  layout = 'free',
  bg = 'none',
  className = '',
  style,
}: SlideProps) {
  return (
    <div
      className={`${layoutClasses[layout]} relative overflow-hidden ${className}`}
      style={{ padding: PAD, ...style }}
    >
      {bg === 'mesh' && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% 55%, var(--sm-gradient-mesh-1), transparent)',
            opacity: 0.12,
          }}
        />
      )}
      {children}
    </div>
  );
}
```

**Step 3: Remove StaggerProvider and useStagger from index.ts**

Change line 2 of `packages/primitives/src/index.ts` from:
```ts
export { StaggerProvider, useStagger } from './StaggerContext';
```
Delete this line entirely.

**Step 4: Verify it compiles**

```bash
cd packages/primitives && npx tsc --noEmit
```

Expected: Errors in other files that still import `useStagger` — that's expected, we fix them next.

**Step 5: Commit**

```bash
git add -A packages/primitives/src/StaggerContext.tsx packages/primitives/src/Slide.tsx packages/primitives/src/index.ts
git commit -m "refactor: delete StaggerContext, strip Slide of auto-animation"
```

---

### Task 2: Strip animation from all remaining primitives

**Files:**
- Modify: `packages/primitives/src/Heading.tsx`
- Modify: `packages/primitives/src/Text.tsx`
- Modify: `packages/primitives/src/Badge.tsx`
- Modify: `packages/primitives/src/Card.tsx`
- Modify: `packages/primitives/src/GradientText.tsx`
- Modify: `packages/primitives/src/Divider.tsx`
- Modify: `packages/primitives/src/IconCircle.tsx`
- Modify: `packages/primitives/src/StatBox.tsx`
- Modify: `packages/primitives/src/Step.tsx`
- Modify: `packages/primitives/src/Pipeline.tsx`

For each file: remove `import { motion } from 'framer-motion'`, remove `import { useStagger } from './StaggerContext'`, remove `useStagger()` call, replace `motion.div`/`motion.create(Tag)` with plain HTML elements, remove `initial`/`animate`/`transition` props.

**Step 1: Rewrite Heading.tsx**

```tsx
interface HeadingProps {
  children: React.ReactNode;
  size?: 'md' | 'lg' | 'hero';
  as?: 'h1' | 'h2' | 'h3';
  style?: React.CSSProperties;
  className?: string;
}

const SIZES = {
  md: 'clamp(1.5rem, 3vw, 2.25rem)',
  lg: 'clamp(2.5rem, 5vw, 3.5rem)',
  hero: 'clamp(5rem, 12vw, 9rem)',
} as const;

export function Heading({
  children,
  size = 'lg',
  as: Tag = size === 'hero' ? 'h1' : 'h2',
  style,
  className = '',
}: HeadingProps) {
  return (
    <Tag
      className={`font-bold ${className}`}
      style={{
        fontSize: SIZES[size],
        color: 'var(--sm-text)',
        lineHeight: size === 'hero' ? 0.9 : 1.1,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
```

**Step 2: Rewrite Text.tsx**

```tsx
const SIZES = {
  xs: 'clamp(0.6rem, 0.9vw, 0.75rem)',
  sm: 'clamp(0.8rem, 1.3vw, 1.05rem)',
  md: 'clamp(0.85rem, 1.4vw, 1.1rem)',
} as const;

interface TextProps {
  children: React.ReactNode;
  size?: keyof typeof SIZES;
  muted?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function Text({
  children,
  size = 'md',
  muted = false,
  style,
  className = '',
}: TextProps) {
  return (
    <p
      className={className}
      style={{
        fontSize: SIZES[size],
        color: muted ? 'var(--sm-muted)' : 'var(--sm-text)',
        lineHeight: 1.5,
        ...style,
      }}
    >
      {children}
    </p>
  );
}
```

**Step 3: Rewrite Badge.tsx**

```tsx
interface BadgeProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export function Badge({ children, style, className = '' }: BadgeProps) {
  return (
    <div
      className={className}
      style={{
        background: 'var(--sm-glass-bg)',
        backdropFilter: 'blur(12px)',
        border: '1px solid var(--sm-border)',
        borderRadius: 'var(--sm-radius)',
        padding: 'clamp(0.35rem, 0.6vw, 0.5rem) clamp(1rem, 2vw, 1.5rem)',
        fontSize: 'clamp(0.6rem, 0.9vw, 0.75rem)',
        color: 'var(--sm-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.2em',
        fontWeight: 500,
        display: 'inline-block',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
```

**Step 4: Rewrite Card.tsx**

```tsx
const PADS = {
  sm: 'clamp(0.75rem, 1.5vw, 1.25rem)',
  md: 'clamp(1.25rem, 2.5vw, 2rem)',
  lg: 'clamp(1.5rem, 3vw, 2.5rem)',
} as const;

interface CardProps {
  children: React.ReactNode;
  glass?: boolean;
  pad?: keyof typeof PADS;
  style?: React.CSSProperties;
  className?: string;
}

export function Card({
  children,
  glass = true,
  pad = 'md',
  style,
  className = '',
}: CardProps) {
  return (
    <div
      className={className}
      style={{
        ...(glass
          ? {
              background: 'var(--sm-glass-bg)',
              backdropFilter: 'blur(12px)',
              border: '1px solid var(--sm-border)',
              borderRadius: 'var(--sm-radius)',
            }
          : {}),
        padding: PADS[pad],
        ...style,
      }}
    >
      {children}
    </div>
  );
}
```

**Step 5: Rewrite GradientText.tsx**

```tsx
const SIZES = {
  md: 'clamp(2rem, 4vw, 3rem)',
  lg: 'clamp(5rem, 10vw, 7rem)',
  hero: 'clamp(5rem, 12vw, 9rem)',
  stat: 'clamp(7rem, 18vw, 14rem)',
} as const;

interface GradientTextProps {
  children: React.ReactNode;
  size?: keyof typeof SIZES;
  as?: 'h1' | 'h2' | 'span' | 'div';
  style?: React.CSSProperties;
  className?: string;
}

export function GradientText({
  children,
  size = 'hero',
  as: Tag = 'h1',
  style,
  className = '',
}: GradientTextProps) {
  return (
    <Tag
      className={`font-extrabold ${className}`}
      style={{
        background: 'linear-gradient(135deg, var(--sm-primary), var(--sm-secondary))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontSize: SIZES[size],
        lineHeight: 0.9,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
```

**Step 6: Rewrite Divider.tsx**

```tsx
interface DividerProps {
  width?: string;
  style?: React.CSSProperties;
}

export function Divider({ width = 'clamp(2.5rem, 5vw, 3.5rem)', style }: DividerProps) {
  return (
    <div
      style={{
        width,
        height: 3,
        background: 'linear-gradient(90deg, var(--sm-primary), var(--sm-secondary))',
        borderRadius: 2,
        ...style,
      }}
    />
  );
}
```

**Step 7: Rewrite IconCircle.tsx**

```tsx
import type { ComponentType } from 'react';

const SIZES = {
  sm: { box: 'clamp(28px,3.5vw,40px)', icon: 16 },
  md: { box: 'clamp(40px,5vw,52px)', icon: 20 },
  lg: { box: 'clamp(52px,6.5vw,72px)', icon: 24 },
} as const;

interface IconCircleProps {
  icon: ComponentType<{ size?: number; style?: React.CSSProperties }>;
  size?: keyof typeof SIZES;
  active?: boolean;
  color?: string;
  style?: React.CSSProperties;
}

export function IconCircle({
  icon: Icon,
  size = 'md',
  active = false,
  color = 'var(--sm-primary)',
  style,
}: IconCircleProps) {
  const s = SIZES[size];

  return (
    <div
      style={{
        width: s.box,
        height: s.box,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: active ? color : 'var(--sm-surface)',
        border: `2px solid ${active ? color : 'var(--sm-border)'}`,
        flexShrink: 0,
        ...style,
      }}
    >
      <Icon size={s.icon} style={{ color: active ? 'var(--sm-bg)' : color }} />
    </div>
  );
}
```

**Step 8: Rewrite StatBox.tsx**

```tsx
import type { ComponentType } from 'react';

interface StatBoxProps {
  value: string;
  label: string;
  icon?: ComponentType<{ size?: number; style?: React.CSSProperties }>;
  color?: string;
  style?: React.CSSProperties;
}

export function StatBox({ value, label, icon: Icon, color, style }: StatBoxProps) {
  return (
    <div
      style={{
        background: 'var(--sm-glass-bg)',
        backdropFilter: 'blur(12px)',
        border: '1px solid var(--sm-border)',
        borderRadius: 'var(--sm-radius)',
        padding: 'clamp(1.5rem, 3vw, 2.5rem)',
        textAlign: 'center',
        ...style,
      }}
    >
      {Icon && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'clamp(0.75rem, 1.5vh, 1rem)' }}>
          <div style={{
            width: 'clamp(52px,6.5vw,72px)',
            height: 'clamp(52px,6.5vw,72px)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--sm-surface)',
            border: '2px solid var(--sm-border)',
          }}>
            <Icon size={24} style={{ color: color || 'var(--sm-primary)' }} />
          </div>
        </div>
      )}
      <div
        className="font-extrabold"
        style={{
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          color: color || 'var(--sm-text)',
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 'clamp(0.7rem, 1vw, 0.85rem)',
          color: 'var(--sm-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          marginTop: '0.25rem',
        }}
      >
        {label}
      </div>
    </div>
  );
}
```

**Step 9: Rewrite Step.tsx**

```tsx
interface StepProps {
  n: number;
  children: React.ReactNode;
  active?: boolean;
  style?: React.CSSProperties;
}

export function Step({ n, children, active = false, style }: StepProps) {
  return (
    <div
      className="flex items-center"
      style={{ gap: 'clamp(0.75rem,1.5vw,1.25rem)', position: 'relative', zIndex: 1, ...style }}
    >
      <div
        style={{
          width: 'clamp(28px,3.5vw,40px)',
          height: 'clamp(28px,3.5vw,40px)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: active ? 'var(--sm-primary)' : 'var(--sm-surface)',
          border: `2px solid ${active ? 'var(--sm-primary)' : 'var(--sm-border)'}`,
          fontSize: 'clamp(0.65rem,1vw,0.8rem)',
          fontWeight: 700,
          color: active ? 'var(--sm-bg)' : 'var(--sm-muted)',
          flexShrink: 0,
        }}
      >
        {n}
      </div>
      <span
        style={{
          fontSize: 'clamp(0.8rem,1.3vw,1.05rem)',
          color: 'var(--sm-text)',
          lineHeight: 1.4,
          fontWeight: active ? 600 : 400,
        }}
      >
        {children}
      </span>
    </div>
  );
}
```

**Step 10: Rewrite Pipeline.tsx**

```tsx
import type { ComponentType } from 'react';

interface PipelineItem {
  icon: ComponentType<{ size?: number; style?: React.CSSProperties }>;
  label: string;
  sub?: string;
}

interface PipelineProps {
  items: PipelineItem[];
  style?: React.CSSProperties;
}

export function Pipeline({ items, style }: PipelineProps) {
  return (
    <div
      className="flex items-center justify-center w-full relative"
      style={{ maxWidth: '90%', gap: 0, ...style }}
    >
      <div
        className="absolute"
        style={{
          left: '10%',
          right: '10%',
          top: '50%',
          height: 2,
          marginTop: -1,
          background: 'linear-gradient(90deg, var(--sm-primary), var(--sm-secondary), var(--sm-accent))',
          opacity: 0.4,
          zIndex: 0,
        }}
      />

      {items.map(({ icon: Icon, label, sub }, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <div
            key={label}
            className="flex flex-col items-center text-center relative z-10"
            style={{ flex: 1 }}
          >
            <div
              style={{
                width: 'clamp(52px,6.5vw,72px)',
                height: 'clamp(52px,6.5vw,72px)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isLast ? 'var(--sm-primary)' : 'var(--sm-surface)',
                border: `2px solid ${isLast ? 'var(--sm-primary)' : 'var(--sm-border)'}`,
              }}
            >
              <Icon size={24} style={{ color: isLast ? 'var(--sm-bg)' : 'var(--sm-primary)' }} />
            </div>
            <span
              className="font-semibold"
              style={{
                fontSize: 'clamp(0.75rem,1.2vw,0.95rem)',
                color: 'var(--sm-text)',
                marginTop: 'clamp(0.75rem,1.5vh,1rem)',
              }}
            >
              {label}
            </span>
            {sub && (
              <span
                style={{
                  fontSize: 'clamp(0.6rem,0.9vw,0.75rem)',
                  color: 'var(--sm-muted)',
                  marginTop: '0.25rem',
                }}
              >
                {sub}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

**Step 11: Remove framer-motion from package.json dependencies**

In `packages/primitives/package.json`, remove `"framer-motion": "^12.34.3"` from the `dependencies` object. Keep `react`.

**Step 12: Verify it compiles**

```bash
cd packages/primitives && npx tsc --noEmit
```

Expected: PASS — no errors. All framer-motion and StaggerContext references removed.

**Step 13: Commit**

```bash
git add packages/primitives/
git commit -m "refactor: strip all animation from primitives, remove framer-motion dep"
```

---

## Phase 2: New Layout Atoms + Animation Toolkit

### Task 3: Add layout atom primitives

**Files:**
- Create: `packages/primitives/src/Grid.tsx`
- Create: `packages/primitives/src/Split.tsx`
- Create: `packages/primitives/src/Stack.tsx`
- Create: `packages/primitives/src/Row.tsx`
- Create: `packages/primitives/src/Spacer.tsx`
- Create: `packages/primitives/src/ColorBar.tsx`
- Modify: `packages/primitives/src/index.ts`

**Step 1: Create Grid.tsx**

```tsx
import type { ReactNode } from 'react';

const GAPS = {
  sm: 'clamp(0.5rem, 1vw, 0.75rem)',
  md: 'clamp(0.75rem, 1.5vw, 1.25rem)',
  lg: 'clamp(1.25rem, 2.5vw, 2rem)',
} as const;

interface GridProps {
  children: ReactNode;
  cols?: 2 | 3 | 4;
  gap?: keyof typeof GAPS;
  style?: React.CSSProperties;
  className?: string;
}

export function Grid({ children, cols = 2, gap = 'md', style, className = '' }: GridProps) {
  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: GAPS[gap],
        ...style,
      }}
    >
      {children}
    </div>
  );
}
```

**Step 2: Create Split.tsx**

```tsx
import type { ReactNode } from 'react';

interface SplitProps {
  children: ReactNode;
  ratio?: '35/65' | '40/60' | '50/50' | '60/40' | '65/35';
  reverse?: boolean;
  gap?: string;
  style?: React.CSSProperties;
  className?: string;
}

const RATIOS: Record<string, [string, string]> = {
  '35/65': ['35%', '65%'],
  '40/60': ['40%', '60%'],
  '50/50': ['50%', '50%'],
  '60/40': ['60%', '40%'],
  '65/35': ['65%', '35%'],
};

export function Split({
  children,
  ratio = '35/65',
  reverse = false,
  gap = 'clamp(1.5rem, 3vw, 3rem)',
  style,
  className = '',
}: SplitProps) {
  const [left, right] = RATIOS[ratio] ?? RATIOS['35/65'];
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: reverse ? 'row-reverse' : 'row',
        gap,
        gridTemplateColumns: `${left} ${right}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
```

**Step 3: Create Stack.tsx**

```tsx
import type { ReactNode } from 'react';

const GAPS = {
  xs: 'clamp(0.25rem, 0.5vw, 0.5rem)',
  sm: 'clamp(0.5rem, 1vw, 0.75rem)',
  md: 'clamp(0.75rem, 1.5vw, 1.25rem)',
  lg: 'clamp(1.25rem, 2.5vw, 2rem)',
  xl: 'clamp(2rem, 4vw, 3rem)',
} as const;

interface StackProps {
  children: ReactNode;
  gap?: keyof typeof GAPS;
  align?: 'start' | 'center' | 'end' | 'stretch';
  style?: React.CSSProperties;
  className?: string;
}

export function Stack({ children, gap = 'md', align = 'stretch', style, className = '' }: StackProps) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: GAPS[gap],
        alignItems: align,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
```

**Step 4: Create Row.tsx**

```tsx
import type { ReactNode } from 'react';

const GAPS = {
  xs: 'clamp(0.25rem, 0.5vw, 0.5rem)',
  sm: 'clamp(0.5rem, 1vw, 0.75rem)',
  md: 'clamp(0.75rem, 1.5vw, 1.25rem)',
  lg: 'clamp(1.25rem, 2.5vw, 2rem)',
} as const;

interface RowProps {
  children: ReactNode;
  gap?: keyof typeof GAPS;
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  wrap?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function Row({ children, gap = 'md', align = 'center', wrap = false, style, className = '' }: RowProps) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: GAPS[gap],
        alignItems: align,
        flexWrap: wrap ? 'wrap' : 'nowrap',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
```

**Step 5: Create Spacer.tsx**

```tsx
const SIZES = {
  sm: 'clamp(0.75rem, 1.5vh, 1.25rem)',
  md: 'clamp(1.5rem, 3vh, 2.5rem)',
  lg: 'clamp(2.5rem, 5vh, 4rem)',
  xl: 'clamp(4rem, 8vh, 6rem)',
} as const;

interface SpacerProps {
  size?: keyof typeof SIZES;
  style?: React.CSSProperties;
}

export function Spacer({ size = 'md', style }: SpacerProps) {
  return <div style={{ height: SIZES[size], flexShrink: 0, ...style }} />;
}
```

**Step 6: Create ColorBar.tsx**

```tsx
interface ColorBarProps {
  color?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  thickness?: number;
  style?: React.CSSProperties;
}

export function ColorBar({
  color = 'var(--sm-primary)',
  position = 'top',
  thickness = 3,
  style,
}: ColorBarProps) {
  const isHorizontal = position === 'top' || position === 'bottom';
  return (
    <div
      style={{
        position: 'absolute',
        [position]: 0,
        ...(isHorizontal
          ? { left: 0, right: 0, height: thickness }
          : { top: 0, bottom: 0, width: thickness }),
        background: color,
        borderRadius: thickness / 2,
        ...style,
      }}
    />
  );
}
```

**Step 7: Update index.ts — add all new exports**

The full `packages/primitives/src/index.ts` should be:

```ts
export { Slide } from './Slide';
export { Heading } from './Heading';
export { Text } from './Text';
export { Badge } from './Badge';
export { Card } from './Card';
export { GradientText } from './GradientText';
export { Divider } from './Divider';
export { GhostNumber } from './GhostNumber';
export { IconCircle } from './IconCircle';
export { StatBox } from './StatBox';
export { Step } from './Step';
export { Pipeline } from './Pipeline';
export { Grid } from './Grid';
export { Split } from './Split';
export { Stack } from './Stack';
export { Row } from './Row';
export { Spacer } from './Spacer';
export { ColorBar } from './ColorBar';
```

**Step 8: Verify it compiles**

```bash
cd packages/primitives && npx tsc --noEmit
```

Expected: PASS

**Step 9: Commit**

```bash
git add packages/primitives/
git commit -m "feat: add layout atom primitives (Grid, Split, Stack, Row, Spacer, ColorBar)"
```

---

### Task 4: Add animation toolkit

**Files:**
- Create: `packages/primitives/src/Animate.tsx`
- Create: `packages/primitives/src/CountUp.tsx`
- Create: `packages/primitives/src/TypeWriter.tsx`
- Create: `packages/primitives/src/Stagger.tsx`
- Create: `packages/primitives/src/ProgressReveal.tsx`
- Modify: `packages/primitives/src/index.ts`
- Modify: `packages/primitives/package.json` (re-add framer-motion as dep)

**Important:** framer-motion must be re-added to package.json as a dependency because the *animation toolkit* components use it. The visual atom primitives from Task 1-2 don't import it, but these new animation components do.

**Step 1: Re-add framer-motion to package.json**

In `packages/primitives/package.json`, add `"framer-motion": "^12.34.3"` back to `dependencies`.

**Step 2: Create Animate.tsx**

```tsx
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type Effect =
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'scale'
  | 'blur-in'
  | 'slide-left'
  | 'slide-right';

const EASE = [0.22, 1, 0.36, 1] as const;

const EFFECTS: Record<Effect, { initial: object; animate: object }> = {
  'fade-up': { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } },
  'fade-down': { initial: { opacity: 0, y: -30 }, animate: { opacity: 1, y: 0 } },
  'fade-left': { initial: { opacity: 0, x: 40 }, animate: { opacity: 1, x: 0 } },
  'fade-right': { initial: { opacity: 0, x: -40 }, animate: { opacity: 1, x: 0 } },
  'scale': { initial: { opacity: 0, scale: 0.85 }, animate: { opacity: 1, scale: 1 } },
  'blur-in': { initial: { opacity: 0, filter: 'blur(10px)' }, animate: { opacity: 1, filter: 'blur(0px)' } },
  'slide-left': { initial: { x: '100%', opacity: 0 }, animate: { x: 0, opacity: 1 } },
  'slide-right': { initial: { x: '-100%', opacity: 0 }, animate: { x: 0, opacity: 1 } },
};

interface AnimateProps {
  children: ReactNode;
  effect?: Effect;
  delay?: number;
  duration?: number;
  ease?: readonly number[];
  once?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function Animate({
  children,
  effect = 'fade-up',
  delay = 0,
  duration = 0.7,
  ease = EASE,
  once = true,
  style,
  className,
}: AnimateProps) {
  const { initial, animate } = EFFECTS[effect];

  return (
    <motion.div
      initial={initial}
      whileInView={once ? animate : undefined}
      animate={once ? undefined : animate}
      viewport={once ? { once: true } : undefined}
      transition={{ delay, duration, ease: ease as unknown as number[] }}
      style={style}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

**Step 3: Create CountUp.tsx**

```tsx
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface CountUpProps {
  to: number;
  from?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
  style?: React.CSSProperties;
  className?: string;
}

export function CountUp({
  to,
  from = 0,
  prefix = '',
  suffix = '',
  duration = 2,
  decimals = 0,
  style,
  className = '',
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (!isInView) return;

    const start = performance.now();
    const diff = to - from;

    function tick(now: number) {
      const elapsed = (now - start) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(from + diff * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [isInView, from, to, duration]);

  return (
    <span ref={ref} style={style} className={className}>
      {prefix}{value.toFixed(decimals)}{suffix}
    </span>
  );
}
```

**Step 4: Create TypeWriter.tsx**

```tsx
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface TypeWriterProps {
  text: string;
  speed?: number;
  delay?: number;
  cursor?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function TypeWriter({
  text,
  speed = 40,
  delay = 0,
  cursor = true,
  style,
  className = '',
}: TypeWriterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!isInView) return;

    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [isInView, text, speed, delay]);

  return (
    <span ref={ref} style={style} className={className}>
      {displayed}
      {cursor && !done && (
        <span style={{ opacity: 0.7, animation: 'blink 1s step-end infinite' }}>|</span>
      )}
      {cursor && (
        <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
      )}
    </span>
  );
}
```

**Step 5: Create Stagger.tsx**

```tsx
import { motion } from 'framer-motion';
import { Children, type ReactNode } from 'react';

const EASE = [0.22, 1, 0.36, 1] as const;

interface StaggerProps {
  children: ReactNode;
  interval?: number;
  effect?: 'fade-up' | 'fade-down' | 'scale';
  duration?: number;
  style?: React.CSSProperties;
  className?: string;
}

const EFFECTS = {
  'fade-up': { initial: { opacity: 0, y: 25 }, animate: { opacity: 1, y: 0 } },
  'fade-down': { initial: { opacity: 0, y: -25 }, animate: { opacity: 1, y: 0 } },
  'scale': { initial: { opacity: 0, scale: 0.85 }, animate: { opacity: 1, scale: 1 } },
} as const;

export function Stagger({
  children,
  interval = 0.15,
  effect = 'fade-up',
  duration = 0.7,
  style,
  className,
}: StaggerProps) {
  const { initial, animate } = EFFECTS[effect];

  return (
    <div style={style} className={className}>
      {Children.map(children, (child, i) => (
        <motion.div
          key={i}
          initial={initial}
          animate={animate}
          transition={{ delay: interval * i, duration, ease: EASE as unknown as number[] }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}
```

**Step 6: Create ProgressReveal.tsx**

```tsx
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface ProgressRevealProps {
  value: number;
  label?: string;
  color?: string;
  height?: number;
  duration?: number;
  style?: React.CSSProperties;
  className?: string;
}

export function ProgressReveal({
  value,
  label,
  color = 'var(--sm-primary)',
  height = 8,
  duration = 1.2,
  style,
  className = '',
}: ProgressRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} style={style} className={className}>
      {label && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '0.5rem',
          fontSize: 'clamp(0.7rem, 1vw, 0.85rem)',
        }}>
          <span style={{ color: 'var(--sm-text)' }}>{label}</span>
          <span style={{ color: 'var(--sm-muted)' }}>{value}%</span>
        </div>
      )}
      <div style={{
        height,
        borderRadius: height / 2,
        background: 'var(--sm-surface)',
        overflow: 'hidden',
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${value}%` } : { width: 0 }}
          transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
          style={{
            height: '100%',
            borderRadius: height / 2,
            background: `linear-gradient(90deg, ${color}, var(--sm-secondary))`,
          }}
        />
      </div>
    </div>
  );
}
```

**Step 7: Add exports to index.ts**

Append these lines to `packages/primitives/src/index.ts`:

```ts
export { Animate } from './Animate';
export { CountUp } from './CountUp';
export { TypeWriter } from './TypeWriter';
export { Stagger } from './Stagger';
export { ProgressReveal } from './ProgressReveal';
```

**Step 8: Verify it compiles**

```bash
cd packages/primitives && npx tsc --noEmit
```

Expected: PASS

**Step 9: Commit**

```bash
git add packages/primitives/
git commit -m "feat: add animation toolkit (Animate, CountUp, TypeWriter, Stagger, ProgressReveal)"
```

---

## Phase 3: Interaction Toolkit

### Task 5: Add hover-based interaction primitives

**Files:**
- Create: `packages/primitives/src/Tooltip.tsx`
- Create: `packages/primitives/src/HoverCard.tsx`
- Create: `packages/primitives/src/HoverHighlight.tsx`
- Modify: `packages/primitives/src/index.ts`

**Step 1: Create Tooltip.tsx**

```tsx
import { useState, type ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  position?: 'top' | 'bottom';
  style?: React.CSSProperties;
}

export function Tooltip({ children, content, position = 'top', style }: TooltipProps) {
  const [show, setShow] = useState(false);

  return (
    <div
      style={{ position: 'relative', display: 'inline-block', ...style }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          style={{
            position: 'absolute',
            [position === 'top' ? 'bottom' : 'top']: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: position === 'top' ? 8 : undefined,
            marginTop: position === 'bottom' ? 8 : undefined,
            padding: 'clamp(0.5rem, 1vw, 0.75rem) clamp(0.75rem, 1.5vw, 1rem)',
            background: 'var(--sm-surface)',
            border: '1px solid var(--sm-border)',
            borderRadius: 'var(--sm-radius)',
            fontSize: 'clamp(0.65rem, 0.9vw, 0.8rem)',
            color: 'var(--sm-text)',
            whiteSpace: 'nowrap',
            zIndex: 50,
            pointerEvents: 'none',
            boxShadow: 'var(--sm-shadow-md)',
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
}
```

**Step 2: Create HoverCard.tsx**

```tsx
import { useState, type ReactNode } from 'react';

interface HoverCardProps {
  children: ReactNode;
  hoverContent: ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export function HoverCard({ children, hoverContent, style, className = '' }: HoverCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={className}
      style={{
        background: 'var(--sm-glass-bg)',
        backdropFilter: 'blur(12px)',
        border: '1px solid var(--sm-border)',
        borderRadius: 'var(--sm-radius)',
        padding: 'clamp(1.25rem, 2.5vw, 2rem)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered ? 'var(--sm-shadow-lg)' : 'none',
        cursor: 'default',
        ...style,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      {hovered && (
        <div style={{ marginTop: 'clamp(0.75rem, 1.5vw, 1rem)' }}>
          {hoverContent}
        </div>
      )}
    </div>
  );
}
```

**Step 3: Create HoverHighlight.tsx**

```tsx
import { useState, Children, cloneElement, isValidElement, type ReactNode, type ReactElement } from 'react';

interface HoverHighlightProps {
  children: ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export function HoverHighlight({ children, style, className = '' }: HoverHighlightProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const childArray = Children.toArray(children);

  return (
    <div style={style} className={className}>
      {childArray.map((child, i) => {
        if (!isValidElement(child)) return child;
        const dimmed = hoveredIndex !== null && hoveredIndex !== i;
        return cloneElement(child as ReactElement<{ style?: React.CSSProperties }>, {
          key: i,
          style: {
            ...(child as ReactElement<{ style?: React.CSSProperties }>).props.style,
            transition: 'opacity 0.2s ease, transform 0.2s ease',
            opacity: dimmed ? 0.35 : 1,
            transform: hoveredIndex === i ? 'scale(1.02)' : 'none',
          },
          onMouseEnter: () => setHoveredIndex(i),
          onMouseLeave: () => setHoveredIndex(null),
        } as Partial<{ style: React.CSSProperties; onMouseEnter: () => void; onMouseLeave: () => void }>);
      })}
    </div>
  );
}
```

**Step 4: Add exports to index.ts**

Append:

```ts
export { Tooltip } from './Tooltip';
export { HoverCard } from './HoverCard';
export { HoverHighlight } from './HoverHighlight';
```

**Step 5: Verify and commit**

```bash
cd packages/primitives && npx tsc --noEmit
git add packages/primitives/
git commit -m "feat: add hover interaction primitives (Tooltip, HoverCard, HoverHighlight)"
```

---

### Task 6: Add click-driven interaction primitives

**Files:**
- Create: `packages/primitives/src/ClickReveal.tsx`
- Create: `packages/primitives/src/Tabs.tsx`
- Create: `packages/primitives/src/Accordion.tsx`
- Create: `packages/primitives/src/Flipcard.tsx`
- Modify: `packages/primitives/src/index.ts`

**Step 1: Create ClickReveal.tsx**

```tsx
import { useState, type ReactNode } from 'react';

interface ClickRevealProps {
  children: ReactNode;
  prompt?: string;
  style?: React.CSSProperties;
  className?: string;
}

export function ClickReveal({
  children,
  prompt = 'Click to reveal',
  style,
  className = '',
}: ClickRevealProps) {
  const [revealed, setRevealed] = useState(false);

  if (revealed) {
    return <div style={style} className={className}>{children}</div>;
  }

  return (
    <div
      onClick={() => setRevealed(true)}
      className={className}
      style={{
        cursor: 'pointer',
        padding: 'clamp(1rem, 2vw, 1.5rem)',
        border: '2px dashed var(--sm-border)',
        borderRadius: 'var(--sm-radius)',
        textAlign: 'center',
        color: 'var(--sm-muted)',
        fontSize: 'clamp(0.75rem, 1.2vw, 0.95rem)',
        transition: 'border-color 0.2s ease',
        ...style,
      }}
    >
      {prompt}
    </div>
  );
}
```

**Step 2: Create Tabs.tsx**

```tsx
import { useState, type ReactNode } from 'react';

interface TabItem {
  label: string;
  content: ReactNode;
}

interface TabsProps {
  items: TabItem[];
  defaultIndex?: number;
  style?: React.CSSProperties;
  className?: string;
}

export function Tabs({ items, defaultIndex = 0, style, className = '' }: TabsProps) {
  const [active, setActive] = useState(defaultIndex);

  return (
    <div style={style} className={className}>
      <div style={{ display: 'flex', gap: 'clamp(0.25rem, 0.5vw, 0.5rem)', marginBottom: 'clamp(1rem, 2vw, 1.5rem)' }}>
        {items.map((item, i) => (
          <button
            key={item.label}
            onClick={() => setActive(i)}
            style={{
              padding: 'clamp(0.4rem, 0.8vw, 0.6rem) clamp(0.75rem, 1.5vw, 1.25rem)',
              fontSize: 'clamp(0.65rem, 1vw, 0.8rem)',
              fontWeight: 600,
              border: '1px solid',
              borderColor: i === active ? 'var(--sm-primary)' : 'var(--sm-border)',
              borderRadius: 'var(--sm-radius)',
              background: i === active ? 'var(--sm-primary)' : 'var(--sm-glass-bg)',
              color: i === active ? 'var(--sm-bg)' : 'var(--sm-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div>{items[active]?.content}</div>
    </div>
  );
}
```

**Step 3: Create Accordion.tsx**

```tsx
import { useState, type ReactNode } from 'react';

interface AccordionItem {
  title: string;
  content: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpen?: number;
  style?: React.CSSProperties;
  className?: string;
}

export function Accordion({ items, defaultOpen, style, className = '' }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen ?? null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.35rem, 0.7vw, 0.5rem)', ...style }} className={className}>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={item.title}
            style={{
              background: 'var(--sm-glass-bg)',
              backdropFilter: 'blur(12px)',
              border: '1px solid var(--sm-border)',
              borderRadius: 'var(--sm-radius)',
              overflow: 'hidden',
            }}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                padding: 'clamp(0.75rem, 1.5vw, 1.25rem)',
                background: 'none',
                border: 'none',
                color: isOpen ? 'var(--sm-text)' : 'var(--sm-muted)',
                fontSize: 'clamp(0.8rem, 1.2vw, 1rem)',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              {item.title}
              <span style={{ transition: 'transform 0.2s ease', transform: isOpen ? 'rotate(180deg)' : 'none' }}>
                &#x25BE;
              </span>
            </button>
            {isOpen && (
              <div style={{ padding: '0 clamp(0.75rem, 1.5vw, 1.25rem) clamp(0.75rem, 1.5vw, 1.25rem)' }}>
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

**Step 4: Create Flipcard.tsx**

```tsx
import { useState, type ReactNode } from 'react';

interface FlipcardProps {
  front: ReactNode;
  back: ReactNode;
  width?: string;
  height?: string;
  style?: React.CSSProperties;
  className?: string;
}

export function Flipcard({
  front,
  back,
  width = '100%',
  height = '100%',
  style,
  className = '',
}: FlipcardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className={className}
      style={{
        width,
        height,
        perspective: '1000px',
        cursor: 'pointer',
        ...style,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transition: 'transform 0.6s ease',
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            background: 'var(--sm-glass-bg)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--sm-border)',
            borderRadius: 'var(--sm-radius)',
            padding: 'clamp(1.25rem, 2.5vw, 2rem)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {front}
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'var(--sm-glass-bg)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--sm-primary)',
            borderRadius: 'var(--sm-radius)',
            padding: 'clamp(1.25rem, 2.5vw, 2rem)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {back}
        </div>
      </div>
    </div>
  );
}
```

**Step 5: Add exports to index.ts**

Append:

```ts
export { ClickReveal } from './ClickReveal';
export { Tabs } from './Tabs';
export { Accordion } from './Accordion';
export { Flipcard } from './Flipcard';
```

**Step 6: Verify and commit**

```bash
cd packages/primitives && npx tsc --noEmit
git add packages/primitives/
git commit -m "feat: add click interaction primitives (ClickReveal, Tabs, Accordion, Flipcard)"
```

---

### Task 7: Add rich interaction primitives

**Files:**
- Create: `packages/primitives/src/BeforeAfter.tsx`
- Create: `packages/primitives/src/Sortable.tsx`
- Create: `packages/primitives/src/Spotlight.tsx`
- Modify: `packages/primitives/src/index.ts`

**Step 1: Create BeforeAfter.tsx**

```tsx
import { useState, type ReactNode } from 'react';

interface BeforeAfterProps {
  before: ReactNode;
  after: ReactNode;
  beforeLabel?: string;
  afterLabel?: string;
  style?: React.CSSProperties;
  className?: string;
}

export function BeforeAfter({
  before,
  after,
  beforeLabel = 'Before',
  afterLabel = 'After',
  style,
  className = '',
}: BeforeAfterProps) {
  const [showAfter, setShowAfter] = useState(false);

  return (
    <div style={style} className={className}>
      <div style={{ display: 'flex', gap: 'clamp(0.25rem, 0.5vw, 0.5rem)', marginBottom: 'clamp(0.75rem, 1.5vw, 1rem)' }}>
        {[
          { label: beforeLabel, active: !showAfter, onClick: () => setShowAfter(false) },
          { label: afterLabel, active: showAfter, onClick: () => setShowAfter(true) },
        ].map(({ label, active, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            style={{
              padding: 'clamp(0.4rem, 0.8vw, 0.6rem) clamp(0.75rem, 1.5vw, 1.25rem)',
              fontSize: 'clamp(0.65rem, 1vw, 0.8rem)',
              fontWeight: 600,
              border: '1px solid',
              borderColor: active ? 'var(--sm-primary)' : 'var(--sm-border)',
              borderRadius: 'var(--sm-radius)',
              background: active ? 'var(--sm-primary)' : 'var(--sm-glass-bg)',
              color: active ? 'var(--sm-bg)' : 'var(--sm-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div>{showAfter ? after : before}</div>
    </div>
  );
}
```

**Step 2: Create Sortable.tsx**

```tsx
import { useState, type ReactNode } from 'react';

interface SortableItem {
  id: string;
  content: ReactNode;
}

interface SortableProps {
  items: SortableItem[];
  style?: React.CSSProperties;
  className?: string;
}

export function Sortable({ items: initialItems, style, className = '' }: SortableProps) {
  const [items, setItems] = useState(initialItems);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const handleDragStart = (i: number) => {
    setDragIndex(i);
  };

  const handleDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === i) return;
    const newItems = [...items];
    const [moved] = newItems.splice(dragIndex, 1);
    newItems.splice(i, 0, moved);
    setItems(newItems);
    setDragIndex(i);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.35rem, 0.7vw, 0.5rem)', ...style }}
      className={className}
    >
      {items.map((item, i) => (
        <div
          key={item.id}
          draggable
          onDragStart={() => handleDragStart(i)}
          onDragOver={(e) => handleDragOver(e, i)}
          onDragEnd={handleDragEnd}
          style={{
            padding: 'clamp(0.75rem, 1.5vw, 1.25rem)',
            background: dragIndex === i ? 'var(--sm-surface)' : 'var(--sm-glass-bg)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${dragIndex === i ? 'var(--sm-primary)' : 'var(--sm-border)'}`,
            borderRadius: 'var(--sm-radius)',
            cursor: 'grab',
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(0.5rem, 1vw, 0.75rem)',
            transition: 'background 0.15s ease, border-color 0.15s ease',
          }}
        >
          <span style={{ color: 'var(--sm-muted)', fontSize: '0.8rem', fontWeight: 700, minWidth: '1.5em' }}>
            {i + 1}
          </span>
          {item.content}
        </div>
      ))}
    </div>
  );
}
```

**Step 3: Create Spotlight.tsx**

```tsx
import { useState, Children, cloneElement, isValidElement, type ReactNode, type ReactElement } from 'react';

interface SpotlightProps {
  children: ReactNode;
  defaultActive?: number;
  style?: React.CSSProperties;
  className?: string;
}

export function Spotlight({ children, defaultActive = 0, style, className = '' }: SpotlightProps) {
  const [active, setActive] = useState(defaultActive);
  const childArray = Children.toArray(children);

  return (
    <div style={style} className={className}>
      <div>
        {childArray.map((child, i) => {
          if (!isValidElement(child)) return child;
          const isActive = i === active;
          return cloneElement(child as ReactElement<{ style?: React.CSSProperties; onClick?: () => void }>, {
            key: i,
            onClick: () => setActive(i),
            style: {
              ...(child as ReactElement<{ style?: React.CSSProperties }>).props.style,
              transition: 'opacity 0.3s ease, transform 0.3s ease',
              opacity: isActive ? 1 : 0.3,
              transform: isActive ? 'scale(1.02)' : 'scale(0.98)',
              cursor: 'pointer',
            },
          } as Partial<{ style: React.CSSProperties; onClick: () => void }>);
        })}
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 'clamp(0.3rem, 0.6vw, 0.5rem)',
        marginTop: 'clamp(0.75rem, 1.5vw, 1rem)',
      }}>
        {childArray.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              width: i === active ? 24 : 8,
              height: 8,
              borderRadius: 4,
              border: 'none',
              background: i === active ? 'var(--sm-primary)' : 'var(--sm-border)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}
```

**Step 4: Add exports to index.ts**

Append:

```ts
export { BeforeAfter } from './BeforeAfter';
export { Sortable } from './Sortable';
export { Spotlight } from './Spotlight';
```

**Step 5: Verify and commit**

```bash
cd packages/primitives && npx tsc --noEmit
git add packages/primitives/
git commit -m "feat: add rich interaction primitives (BeforeAfter, Sortable, Spotlight)"
```

---

## Phase 4: Update CLAUDE.md and Migrate Deck

### Task 8: Rewrite CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Rewrite the following sections of CLAUDE.md**

Changes to make (keeping everything else intact):

**In "How to Generate a Presentation" → Step 3 (Plan the Narrative Arc):**

Add after the 8 beats:

```markdown
### Step 3b: Plan Animation & Interaction

After planning the narrative arc, decide where animation and interaction serve the story:

- **Animation budget:** Aim for 3-5 animated moments per 15-slide deck. Each should have a reason.
- **Interaction budget:** 1-3 interactive slides per deck. Each should let the presenter control pacing or reveal depth.
- **Write this plan as comments at the top of slides.tsx** before writing any JSX.

Most slides should be static — instant, confident, and let the content speak. Reserve animation for moments that need emphasis: a key stat landing, a reveal that builds tension, a transition that signals a shift in the narrative.
```

**In "Design Principles — FOLLOW THESE":**

Replace rule 5 ("Staggered entrance animations...") with:
```markdown
5. **Animation with purpose.** Nothing animates by default. Use `<Animate>` wrapper or `<Stagger>` only when animation serves the narrative — to land a stat, build tension, or signal a shift. A static slide is often stronger than an animated one.
```

Replace rule 9 ("No bullet lists ever...") with:
```markdown
9. **Lists when they work, cards when they don't.** A clean bulleted list is sometimes the best design. Use icon card grids for feature comparisons and visual breakdowns. Use simple lists for sequential steps or short items. Choose the format that best serves the content.
```

Add two new rules at the end:
```markdown
13. **Interaction with intent.** Interactive elements serve the presenter's flow. Use `<ClickReveal>` to let them build an argument piece by piece. Use `<Tooltip>` to hide detail until needed. Use `<Tabs>` when one slide has multiple angles. Most slides won't need interaction.
14. **Full React power in deck files.** You can import `framer-motion`, use `useState`/`useEffect`, and build custom interactive components. The primitive toolkit covers common cases; write custom React when it doesn't.
```

**In "Slide Primitives" section:**

Update the table to add all new primitives:

```markdown
### Layout Atoms
| Component | Purpose | Example |
|---|---|---|
| `<Grid cols gap?>` | CSS grid shorthand | `<Grid cols={3} gap="md">` |
| `<Split ratio? reverse?>` | Two-panel flex layout | `<Split ratio="40/60">` |
| `<Stack gap? align?>` | Flex column | `<Stack gap="lg" align="center">` |
| `<Row gap? align? wrap?>` | Flex row | `<Row gap="sm">` |
| `<Spacer size?>` | Intentional whitespace | `<Spacer size="lg" />` |
| `<ColorBar color? position?>` | Accent stripe on cards | `<ColorBar color="var(--sm-primary)" />` |

### Animation Toolkit (opt-in)
| Component | Purpose | Example |
|---|---|---|
| `<Animate effect? delay? duration?>` | Wrap any element to animate it | `<Animate effect="fade-up" delay={0.3}>` |
| `<CountUp to prefix? suffix?>` | Animated number counter | `<CountUp to={500} prefix="$" suffix="M" />` |
| `<TypeWriter text speed?>` | Character-by-character text | `<TypeWriter text="We need to act now." />` |
| `<Stagger interval? effect?>` | Stagger children entrance | `<Stagger interval={0.15}>` |
| `<ProgressReveal value label?>` | Animated progress bar | `<ProgressReveal value={73} label="Done" />` |

### Interaction Toolkit (presenter-driven)
| Component | Purpose | Example |
|---|---|---|
| `<Tooltip content>` | Hover tooltip | `<Tooltip content="$2.3M ARR">` |
| `<HoverCard hoverContent>` | Card with hover detail | `<HoverCard hoverContent={<Text>...</Text>}>` |
| `<HoverHighlight>` | Dims siblings on hover | `<HoverHighlight>` wraps child group |
| `<ClickReveal prompt?>` | Hidden until click | `<ClickReveal prompt="Click to see">` |
| `<Tabs items>` | Tabbed panels | `<Tabs items={[{label, content}]}>` |
| `<Accordion items>` | Expandable sections | `<Accordion items={[{title, content}]}>` |
| `<Flipcard front back>` | Click to flip | `<Flipcard front={...} back={...}>` |
| `<BeforeAfter before after>` | Toggle two states | `<BeforeAfter before={...} after={...}>` |
| `<Sortable items>` | Draggable reorder list | `<Sortable items={[{id, content}]}>` |
| `<Spotlight>` | Click through focused items | `<Spotlight>` wraps child group |
```

**In "Rules for Primitives":**

Replace the entire list with:

```markdown
1. **Animation is opt-in** — wrap elements in `<Animate>` or `<Stagger>` only when narratively warranted
2. **You CAN import `framer-motion`** — for custom animations beyond what the toolkit provides
3. **You CAN use React hooks** — `useState`, `useEffect`, etc. for custom interactions
4. **`style` prop for overrides only** — most styling is handled by props
5. **Still use `var(--sm-*)` for colors** — primitives use theme vars internally
6. **Use layout atoms** — prefer `<Grid>`, `<Split>`, `<Stack>`, `<Row>` over manual CSS flex/grid
```

**In "Critical Rules":**

Update rule 3 from:
```
3. **Import only from `@slidemason/primitives` and `lucide-react`** — no other external dependencies in deck files. Do NOT import `framer-motion` directly.
```
to:
```
3. **Import from `@slidemason/primitives`, `lucide-react`, and `framer-motion`** — use React hooks (`useState`, `useEffect`, etc.) freely in deck files when building custom interactions.
```

**Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: rewrite CLAUDE.md for purposeful animation and interaction system"
```

---

### Task 9: Verify full build and type-check

**Files:** None (verification only)

**Step 1: Type-check primitives package**

```bash
cd packages/primitives && npx tsc --noEmit
```

Expected: PASS

**Step 2: Type-check studio app**

```bash
cd apps/studio && npx tsc --noEmit
```

Expected: May show pre-existing module resolution warnings. Should NOT show errors related to missing StaggerProvider/useStagger or framer-motion imports in primitives.

**Step 3: Start dev server and verify deck renders**

```bash
cd apps/studio && pnpm dev
```

Open `http://localhost:4200/#saberalert-mvp` — the deck should render with all slides visible but NO entrance animations (since we stripped them). Navigation, screenshot, fullscreen should all still work.

**Step 4: Commit if any fixes were needed**

```bash
git add -A
git commit -m "fix: resolve build issues from primitives overhaul"
```
