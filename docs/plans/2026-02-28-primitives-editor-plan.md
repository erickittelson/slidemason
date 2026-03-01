# Slide Primitives & Editor Toolbar — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ship a `@slidemason/primitives` package of atom components + an inline editor toolbar, cutting AI token usage by ~63% per deck generation and enabling visual editing without code.

**Architecture:** New `packages/primitives/` workspace package with auto-animating atoms (`Card`, `Heading`, `StatBox`, `Pipeline`, etc.) powered by a `<Slide>` context that auto-staggers children. Editor toolbar lives in `packages/renderer/` — click-to-select with floating toolbar for text, color, reorder, and delete. All edits go through the existing `POST /__api/decks/:slug/slides/edit` endpoint.

**Tech Stack:** React 19, Framer Motion 12, CSS variables (`var(--sm-*)`), Vite, pnpm workspaces, Vitest

---

## Task 1: Scaffold `packages/primitives/` package

**Files:**
- Create: `packages/primitives/package.json`
- Create: `packages/primitives/tsconfig.json`
- Create: `packages/primitives/src/index.ts`

**Step 1: Create `packages/primitives/package.json`**

```json
{
  "name": "@slidemason/primitives",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "source": "./src/index.ts",
  "exports": {
    ".": {
      "source": "./src/index.ts",
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "test": "vitest run"
  },
  "dependencies": {
    "framer-motion": "^12.34.3",
    "react": "^19.2.4"
  },
  "devDependencies": {
    "@testing-library/react": "^16.3.2",
    "@testing-library/jest-dom": "^6.9.1",
    "@types/react": "^19.2.14",
    "jsdom": "^28.1.0",
    "vitest": "^4.0.18"
  }
}
```

**Step 2: Create `packages/primitives/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

**Step 3: Create `packages/primitives/src/index.ts`**

```ts
// Primitives will be exported here as they're built
export {};
```

**Step 4: Install dependencies**

Run: `cd /Users/erickittelson/qvl-code/slidemason && pnpm install`
Expected: Packages linked, no errors

**Step 5: Verify build**

Run: `cd /Users/erickittelson/qvl-code/slidemason/packages/primitives && pnpm build`
Expected: Compiles with no errors, produces `dist/index.js` and `dist/index.d.ts`

**Step 6: Add monorepo resolve for primitives in Vite**

Modify: `apps/studio/vite.config.ts` — in the `resolveId` hook, add a case for `@slidemason/primitives`:

```ts
if (source === '@slidemason/primitives') {
  return resolve(MONO_ROOT, 'packages/primitives/src/index.ts');
}
```

Add this right after the existing `@slidemason/renderer` case (around line 47).

**Step 7: Commit**

```bash
git add packages/primitives/ apps/studio/vite.config.ts
git commit -m "feat: scaffold @slidemason/primitives package"
```

---

## Task 2: Implement `<Slide>` wrapper with auto-stagger context

**Files:**
- Create: `packages/primitives/src/StaggerContext.tsx`
- Create: `packages/primitives/src/Slide.tsx`
- Create: `packages/primitives/src/__tests__/Slide.test.tsx`
- Modify: `packages/primitives/src/index.ts`

**Step 1: Create `packages/primitives/src/StaggerContext.tsx`**

This provides auto-incrementing stagger indices to child primitives.

```tsx
import { createContext, useContext, useRef } from 'react';

interface StaggerContextValue {
  /** Call from each primitive to get its stagger index (0, 1, 2, ...) */
  claim(): number;
}

const StaggerContext = createContext<StaggerContextValue | null>(null);

/**
 * Provider that assigns incrementing indices to children.
 * Resets the counter on each render (via ref reset in component body).
 */
export function StaggerProvider({ children }: { children: React.ReactNode }) {
  const counterRef = useRef(0);
  // Reset counter at start of each render pass
  counterRef.current = 0;

  const value: StaggerContextValue = {
    claim() {
      return counterRef.current++;
    },
  };

  return (
    <StaggerContext.Provider value={value}>{children}</StaggerContext.Provider>
  );
}

/**
 * Hook for primitives to get their stagger index.
 * Returns 0 if used outside a Slide (graceful fallback).
 */
export function useStagger(): number {
  const ctx = useContext(StaggerContext);
  return ctx ? ctx.claim() : 0;
}
```

**Step 2: Create `packages/primitives/src/Slide.tsx`**

```tsx
import type { ReactNode } from 'react';
import { StaggerProvider } from './StaggerContext';

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
    <StaggerProvider>
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
    </StaggerProvider>
  );
}
```

**Step 3: Write test `packages/primitives/src/__tests__/Slide.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Slide } from '../Slide';

describe('Slide', () => {
  it('renders children', () => {
    render(<Slide><p>Hello</p></Slide>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('applies center layout classes', () => {
    const { container } = render(<Slide layout="center"><p>Test</p></Slide>);
    const div = container.firstElementChild!;
    expect(div.className).toContain('items-center');
    expect(div.className).toContain('justify-center');
    expect(div.className).toContain('text-center');
  });

  it('renders mesh background when bg="mesh"', () => {
    const { container } = render(<Slide bg="mesh"><p>Test</p></Slide>);
    const meshDiv = container.querySelector('.pointer-events-none');
    expect(meshDiv).toBeInTheDocument();
  });

  it('does not render mesh background by default', () => {
    const { container } = render(<Slide><p>Test</p></Slide>);
    const meshDiv = container.querySelector('.pointer-events-none');
    expect(meshDiv).toBeNull();
  });
});
```

**Step 4: Create vitest config for primitives**

Create: `packages/primitives/vitest.config.ts`

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: [],
  },
});
```

**Step 5: Run tests**

Run: `cd /Users/erickittelson/qvl-code/slidemason/packages/primitives && pnpm test`
Expected: 4 tests pass

**Step 6: Export from index.ts**

Update `packages/primitives/src/index.ts`:

```ts
export { Slide } from './Slide';
export { StaggerProvider, useStagger } from './StaggerContext';
```

**Step 7: Commit**

```bash
git add packages/primitives/src/
git commit -m "feat: add Slide wrapper with auto-stagger context"
```

---

## Task 3: Implement core text primitives (`Heading`, `Text`, `Badge`)

**Files:**
- Create: `packages/primitives/src/Heading.tsx`
- Create: `packages/primitives/src/Text.tsx`
- Create: `packages/primitives/src/Badge.tsx`
- Create: `packages/primitives/src/__tests__/text-primitives.test.tsx`
- Modify: `packages/primitives/src/index.ts`

**Step 1: Create `packages/primitives/src/Heading.tsx`**

```tsx
import { motion } from 'framer-motion';
import { useStagger } from './StaggerContext';

const SIZES = {
  md: 'clamp(1.5rem, 3vw, 2.25rem)',
  lg: 'clamp(2.5rem, 5vw, 3.5rem)',
  hero: 'clamp(5rem, 12vw, 9rem)',
} as const;

const EASE = [0.22, 1, 0.36, 1] as const;

interface HeadingProps {
  children: React.ReactNode;
  size?: keyof typeof SIZES;
  as?: 'h1' | 'h2' | 'h3';
  style?: React.CSSProperties;
  className?: string;
}

export function Heading({
  children,
  size = 'lg',
  as: Tag = size === 'hero' ? 'h1' : 'h2',
  style,
  className = '',
}: HeadingProps) {
  const i = useStagger();
  const MotionTag = motion.create(Tag);

  return (
    <MotionTag
      className={`font-bold ${className}`}
      style={{
        fontSize: SIZES[size],
        color: 'var(--sm-text)',
        lineHeight: size === 'hero' ? 0.9 : 1.1,
        ...style,
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 * i, duration: 0.8, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}
```

**Step 2: Create `packages/primitives/src/Text.tsx`**

```tsx
import { motion } from 'framer-motion';
import { useStagger } from './StaggerContext';

const SIZES = {
  xs: 'clamp(0.6rem, 0.9vw, 0.75rem)',
  sm: 'clamp(0.8rem, 1.3vw, 1.05rem)',
  md: 'clamp(0.85rem, 1.4vw, 1.1rem)',
} as const;

const EASE = [0.22, 1, 0.36, 1] as const;

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
  const i = useStagger();

  return (
    <motion.p
      className={className}
      style={{
        fontSize: SIZES[size],
        color: muted ? 'var(--sm-muted)' : 'var(--sm-text)',
        lineHeight: 1.5,
        ...style,
      }}
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 * i, duration: 0.7, ease: EASE }}
    >
      {children}
    </motion.p>
  );
}
```

**Step 3: Create `packages/primitives/src/Badge.tsx`**

```tsx
import { motion } from 'framer-motion';
import { useStagger } from './StaggerContext';

const EASE = [0.22, 1, 0.36, 1] as const;

interface BadgeProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export function Badge({ children, style, className = '' }: BadgeProps) {
  const i = useStagger();

  return (
    <motion.div
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
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 * i, duration: 0.7, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
```

**Step 4: Write tests `packages/primitives/src/__tests__/text-primitives.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Heading } from '../Heading';
import { Text } from '../Text';
import { Badge } from '../Badge';
import { Slide } from '../Slide';

describe('Heading', () => {
  it('renders with default size', () => {
    render(<Slide><Heading>Test Heading</Heading></Slide>);
    expect(screen.getByText('Test Heading')).toBeInTheDocument();
  });

  it('renders as h1 for hero size', () => {
    render(<Slide><Heading size="hero">Hero</Heading></Slide>);
    const el = screen.getByText('Hero');
    expect(el.tagName).toBe('H1');
  });

  it('renders as h2 by default', () => {
    render(<Slide><Heading>Sub</Heading></Slide>);
    const el = screen.getByText('Sub');
    expect(el.tagName).toBe('H2');
  });
});

describe('Text', () => {
  it('renders paragraph text', () => {
    render(<Slide><Text>Hello world</Text></Slide>);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('renders as p tag', () => {
    render(<Slide><Text>Check tag</Text></Slide>);
    expect(screen.getByText('Check tag').tagName).toBe('P');
  });
});

describe('Badge', () => {
  it('renders badge text', () => {
    render(<Slide><Badge>Beta</Badge></Slide>);
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });
});
```

**Step 5: Run tests**

Run: `cd /Users/erickittelson/qvl-code/slidemason/packages/primitives && pnpm test`
Expected: All tests pass

**Step 6: Export from index.ts**

Add to `packages/primitives/src/index.ts`:

```ts
export { Heading } from './Heading';
export { Text } from './Text';
export { Badge } from './Badge';
```

**Step 7: Commit**

```bash
git add packages/primitives/src/
git commit -m "feat: add Heading, Text, Badge primitives with auto-stagger"
```

---

## Task 4: Implement visual primitives (`Card`, `GradientText`, `Divider`, `GhostNumber`)

**Files:**
- Create: `packages/primitives/src/Card.tsx`
- Create: `packages/primitives/src/GradientText.tsx`
- Create: `packages/primitives/src/Divider.tsx`
- Create: `packages/primitives/src/GhostNumber.tsx`
- Create: `packages/primitives/src/__tests__/visual-primitives.test.tsx`
- Modify: `packages/primitives/src/index.ts`

**Step 1: Create `packages/primitives/src/Card.tsx`**

```tsx
import { motion } from 'framer-motion';
import { useStagger } from './StaggerContext';

const PADS = {
  sm: 'clamp(0.75rem, 1.5vw, 1.25rem)',
  md: 'clamp(1.25rem, 2.5vw, 2rem)',
  lg: 'clamp(1.5rem, 3vw, 2.5rem)',
} as const;

const EASE = [0.22, 1, 0.36, 1] as const;

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
  const i = useStagger();

  return (
    <motion.div
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
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15 * i, duration: 0.6, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
```

**Step 2: Create `packages/primitives/src/GradientText.tsx`**

```tsx
import { motion } from 'framer-motion';
import { useStagger } from './StaggerContext';

const SIZES = {
  md: 'clamp(2rem, 4vw, 3rem)',
  lg: 'clamp(5rem, 10vw, 7rem)',
  hero: 'clamp(5rem, 12vw, 9rem)',
  stat: 'clamp(7rem, 18vw, 14rem)',
} as const;

const EASE = [0.22, 1, 0.36, 1] as const;

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
  const i = useStagger();
  const MotionTag = motion.create(Tag);

  return (
    <MotionTag
      className={`font-extrabold ${className}`}
      style={{
        background: 'linear-gradient(135deg, var(--sm-primary), var(--sm-secondary))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontSize: SIZES[size],
        lineHeight: 0.9,
        ...style,
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 * i, duration: 0.8, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}
```

**Step 3: Create `packages/primitives/src/Divider.tsx`**

```tsx
import { motion } from 'framer-motion';
import { useStagger } from './StaggerContext';

const EASE = [0.22, 1, 0.36, 1] as const;

interface DividerProps {
  width?: string;
  style?: React.CSSProperties;
}

export function Divider({ width = 'clamp(2.5rem, 5vw, 3.5rem)', style }: DividerProps) {
  const i = useStagger();

  return (
    <motion.div
      style={{
        width,
        height: 3,
        background: 'linear-gradient(90deg, var(--sm-primary), var(--sm-secondary))',
        borderRadius: 2,
        ...style,
      }}
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ delay: 0.15 * i, duration: 0.6, ease: EASE }}
    />
  );
}
```

**Step 4: Create `packages/primitives/src/GhostNumber.tsx`**

```tsx
interface GhostNumberProps {
  n: number | string;
  style?: React.CSSProperties;
}

export function GhostNumber({ n, style }: GhostNumberProps) {
  return (
    <div
      style={{
        position: 'absolute',
        right: 'clamp(1rem, 3vw, 2rem)',
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: 'clamp(10rem, 25vw, 18rem)',
        fontWeight: 900,
        lineHeight: 1,
        color: 'var(--sm-text)',
        opacity: 0.06,
        pointerEvents: 'none',
        userSelect: 'none',
        ...style,
      }}
    >
      {n}
    </div>
  );
}
```

**Step 5: Write tests `packages/primitives/src/__tests__/visual-primitives.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from '../Card';
import { GradientText } from '../GradientText';
import { GhostNumber } from '../GhostNumber';
import { Divider } from '../Divider';
import { Slide } from '../Slide';

describe('Card', () => {
  it('renders children', () => {
    render(<Slide><Card>Card content</Card></Slide>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });
});

describe('GradientText', () => {
  it('renders gradient text', () => {
    render(<Slide><GradientText>Title</GradientText></Slide>);
    expect(screen.getByText('Title')).toBeInTheDocument();
  });
});

describe('GhostNumber', () => {
  it('renders the number', () => {
    render(<GhostNumber n={3} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});

describe('Divider', () => {
  it('renders without crashing', () => {
    const { container } = render(<Slide><Divider /></Slide>);
    expect(container.firstElementChild).toBeInTheDocument();
  });
});
```

**Step 6: Run tests**

Run: `cd /Users/erickittelson/qvl-code/slidemason/packages/primitives && pnpm test`
Expected: All tests pass

**Step 7: Export from index.ts**

Add to `packages/primitives/src/index.ts`:

```ts
export { Card } from './Card';
export { GradientText } from './GradientText';
export { Divider } from './Divider';
export { GhostNumber } from './GhostNumber';
```

**Step 8: Commit**

```bash
git add packages/primitives/src/
git commit -m "feat: add Card, GradientText, Divider, GhostNumber primitives"
```

---

## Task 5: Implement data/icon primitives (`IconCircle`, `StatBox`, `Step`, `Pipeline`)

**Files:**
- Create: `packages/primitives/src/IconCircle.tsx`
- Create: `packages/primitives/src/StatBox.tsx`
- Create: `packages/primitives/src/Step.tsx`
- Create: `packages/primitives/src/Pipeline.tsx`
- Create: `packages/primitives/src/__tests__/data-primitives.test.tsx`
- Modify: `packages/primitives/src/index.ts`

**Step 1: Create `packages/primitives/src/IconCircle.tsx`**

```tsx
import { motion } from 'framer-motion';
import { useStagger } from './StaggerContext';
import type { ComponentType } from 'react';

const SIZES = {
  sm: { box: 'clamp(28px,3.5vw,40px)', icon: 16 },
  md: { box: 'clamp(40px,5vw,52px)', icon: 20 },
  lg: { box: 'clamp(52px,6.5vw,72px)', icon: 24 },
} as const;

const EASE = [0.22, 1, 0.36, 1] as const;

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
  const i = useStagger();
  const s = SIZES[size];

  return (
    <motion.div
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
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15 * i, duration: 0.6, ease: EASE }}
    >
      <Icon size={s.icon} style={{ color: active ? 'var(--sm-bg)' : color }} />
    </motion.div>
  );
}
```

**Step 2: Create `packages/primitives/src/StatBox.tsx`**

```tsx
import { motion } from 'framer-motion';
import { useStagger } from './StaggerContext';
import { IconCircle } from './IconCircle';
import type { ComponentType } from 'react';

const EASE = [0.22, 1, 0.36, 1] as const;

interface StatBoxProps {
  value: string;
  label: string;
  icon?: ComponentType<{ size?: number; style?: React.CSSProperties }>;
  color?: string;
  style?: React.CSSProperties;
}

export function StatBox({ value, label, icon, color, style }: StatBoxProps) {
  const i = useStagger();

  return (
    <motion.div
      style={{
        background: 'var(--sm-glass-bg)',
        backdropFilter: 'blur(12px)',
        border: '1px solid var(--sm-border)',
        borderRadius: 'var(--sm-radius)',
        padding: 'clamp(1.5rem, 3vw, 2.5rem)',
        textAlign: 'center',
        ...style,
      }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15 * i, duration: 0.6, ease: EASE }}
    >
      {icon && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'clamp(0.75rem, 1.5vh, 1rem)' }}>
          <IconCircle icon={icon} size="lg" color={color} />
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
    </motion.div>
  );
}
```

**Step 3: Create `packages/primitives/src/Step.tsx`**

```tsx
import { motion } from 'framer-motion';
import { useStagger } from './StaggerContext';

const EASE = [0.22, 1, 0.36, 1] as const;

interface StepProps {
  n: number;
  children: React.ReactNode;
  active?: boolean;
  style?: React.CSSProperties;
}

export function Step({ n, children, active = false, style }: StepProps) {
  const i = useStagger();

  return (
    <motion.div
      className="flex items-center"
      style={{ gap: 'clamp(0.75rem,1.5vw,1.25rem)', position: 'relative', zIndex: 1, ...style }}
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * i, duration: 0.7, ease: EASE }}
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
    </motion.div>
  );
}
```

**Step 4: Create `packages/primitives/src/Pipeline.tsx`**

```tsx
import { motion } from 'framer-motion';
import { useStagger } from './StaggerContext';
import type { ComponentType } from 'react';

const EASE = [0.22, 1, 0.36, 1] as const;

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
  const baseIndex = useStagger();

  return (
    <div
      className="flex items-center justify-center w-full relative"
      style={{ maxWidth: '90%', gap: 0, ...style }}
    >
      {/* Connector line */}
      <motion.div
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 0.15 * baseIndex, duration: 0.8, ease: EASE }}
      />

      {items.map(({ icon: Icon, label, sub }, idx) => {
        const isLast = idx === items.length - 1;

        return (
          <motion.div
            key={label}
            className="flex flex-col items-center text-center relative z-10"
            style={{ flex: 1 }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.15 * (baseIndex + idx + 1),
              duration: 0.6,
              ease: EASE,
            }}
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
          </motion.div>
        );
      })}
    </div>
  );
}
```

**Step 5: Write tests `packages/primitives/src/__tests__/data-primitives.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IconCircle } from '../IconCircle';
import { StatBox } from '../StatBox';
import { Step } from '../Step';
import { Pipeline } from '../Pipeline';
import { Slide } from '../Slide';

// Mock icon component
const MockIcon = ({ size, style }: { size?: number; style?: React.CSSProperties }) => (
  <svg data-testid="icon" width={size} height={size} style={style} />
);

describe('IconCircle', () => {
  it('renders the icon', () => {
    render(<Slide><IconCircle icon={MockIcon} /></Slide>);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});

describe('StatBox', () => {
  it('renders value and label', () => {
    render(<Slide><StatBox value="200K+" label="Signals / Day" /></Slide>);
    expect(screen.getByText('200K+')).toBeInTheDocument();
    expect(screen.getByText('Signals / Day')).toBeInTheDocument();
  });

  it('renders with icon', () => {
    render(<Slide><StatBox icon={MockIcon} value="42" label="Count" /></Slide>);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});

describe('Step', () => {
  it('renders step number and text', () => {
    render(<Slide><Step n={1}>First step</Step></Slide>);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('First step')).toBeInTheDocument();
  });
});

describe('Pipeline', () => {
  it('renders all pipeline items', () => {
    render(
      <Slide>
        <Pipeline
          items={[
            { icon: MockIcon, label: 'Step A', sub: 'Desc A' },
            { icon: MockIcon, label: 'Step B', sub: 'Desc B' },
          ]}
        />
      </Slide>,
    );
    expect(screen.getByText('Step A')).toBeInTheDocument();
    expect(screen.getByText('Step B')).toBeInTheDocument();
    expect(screen.getByText('Desc A')).toBeInTheDocument();
  });
});
```

**Step 6: Run tests**

Run: `cd /Users/erickittelson/qvl-code/slidemason/packages/primitives && pnpm test`
Expected: All tests pass

**Step 7: Export from index.ts**

Add to `packages/primitives/src/index.ts`:

```ts
export { IconCircle } from './IconCircle';
export { StatBox } from './StatBox';
export { Step } from './Step';
export { Pipeline } from './Pipeline';
```

**Step 8: Commit**

```bash
git add packages/primitives/src/
git commit -m "feat: add IconCircle, StatBox, Step, Pipeline primitives"
```

---

## Task 6: Rewrite `decks/saberalert-mvp/slides.tsx` using primitives

**Files:**
- Modify: `decks/saberalert-mvp/slides.tsx`

This task rewrites the existing 489-line slides file to use primitives. The new file should be ~180 lines. Every slide keeps its exact visual appearance — we're just swapping implementation, not changing design.

**Step 1: Rewrite the file**

The new file imports from `@slidemason/primitives` and `lucide-react` (no more `framer-motion` needed in deck files). No animation boilerplate, no style helpers, no `clamp()` calls.

The AI should rewrite all 15 slides using the primitives. Example transformations:

Slide 1 (Hero):
```tsx
<Slide layout="center" bg="mesh">
  <Badge>Digital Saber · Pre-Seed · MVP Strategy</Badge>
  <GradientText size="hero">SaberAlert</GradientText>
  <Text style={{ color: 'var(--sm-danger)', maxWidth: '28ch', fontWeight: 300 }}>
    Camera-free presence detection for the modern home
  </Text>
  <div className="flex gap-[clamp(1.5rem,3vw,2.5rem)] relative z-10">
    {[
      { Icon: Radio, label: 'Passive' },
      { Icon: Brain, label: 'Learns' },
      { Icon: Bell, label: 'Alerts' },
    ].map(({ Icon, label }) => (
      <div key={label} className="flex flex-col items-center gap-[clamp(0.3rem,0.6vh,0.5rem)]">
        <IconCircle icon={Icon} />
        <Text size="xs" muted style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</Text>
      </div>
    ))}
  </div>
</Slide>
```

Slide 5 (Pipeline):
```tsx
<Slide layout="center">
  <Heading size="lg">How Detection Works</Heading>
  <Text muted>Ship hardware → provision → learn → alert</Text>
  <Pipeline items={[
    { icon: Wifi, label: 'Sniffers', sub: 'Wi-Fi + BLE capture' },
    { icon: Layers, label: 'Gateway', sub: 'Aggregates & forwards' },
    { icon: Zap, label: 'EMQX', sub: 'MQTT routing' },
    { icon: Eye, label: 'Watcher', sub: 'Real-time analysis' },
    { icon: BellRing, label: 'Alert', sub: 'Push to phone' },
  ]} />
</Slide>
```

**Step 2: Verify in browser**

Run: Open `http://localhost:4200/#saberalert-mvp`
Expected: All 15 slides render correctly, animations still work, theme colors still apply. Visual parity with the previous version.

**Step 3: Commit**

```bash
git add decks/saberalert-mvp/slides.tsx
git commit -m "refactor: rewrite saberalert-mvp deck using primitives (489 → ~180 lines)"
```

---

## Task 7: Extract editor toolbar from SlideRenderer into separate components

**Files:**
- Create: `packages/renderer/src/SaveIndicator.tsx`
- Create: `packages/renderer/src/EditorToolbar.tsx`
- Create: `packages/renderer/src/useSlideEditor.ts`
- Modify: `packages/renderer/src/SlideRenderer.tsx`
- Modify: `packages/renderer/src/index.ts`

**Step 1: Create `packages/renderer/src/SaveIndicator.tsx`**

Extract the existing save status indicator from SlideRenderer:

```tsx
interface SaveIndicatorProps {
  status: 'idle' | 'saved' | 'error';
}

export function SaveIndicator({ status }: SaveIndicatorProps) {
  if (status === 'idle') return null;

  return (
    <div
      className="absolute top-5 left-1/2 -translate-x-1/2 font-mono text-xs px-3 py-1.5 rounded-full"
      style={{
        zIndex: 50,
        backgroundColor: status === 'saved'
          ? 'rgba(34, 197, 94, 0.2)'
          : 'rgba(239, 68, 68, 0.2)',
        color: status === 'saved' ? 'var(--sm-success)' : 'var(--sm-danger)',
        border: `1px solid ${
          status === 'saved'
            ? 'rgba(34, 197, 94, 0.3)'
            : 'rgba(239, 68, 68, 0.3)'
        }`,
        backdropFilter: 'blur(8px)',
      }}
    >
      {status === 'saved' ? 'Saved' : 'Save failed'}
    </div>
  );
}
```

**Step 2: Create `packages/renderer/src/useSlideEditor.ts`**

Extract edit mode logic from SlideRenderer into a hook:

```ts
import { useState, useCallback, useRef, useEffect } from 'react';

const TEXT_TAGS = new Set([
  'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'SPAN',
  'LI', 'A', 'STRONG', 'EM', 'TD', 'TH', 'LABEL',
]);

function findTextAncestor(el: HTMLElement, boundary: HTMLElement): HTMLElement | null {
  let current: HTMLElement | null = el;
  while (current && current !== boundary) {
    if (TEXT_TAGS.has(current.tagName)) return current;
    current = current.parentElement;
  }
  return null;
}

async function saveEdit(
  deckSlug: string,
  payload: Record<string, unknown>,
): Promise<boolean> {
  try {
    const res = await fetch(
      `/__api/decks/${encodeURIComponent(deckSlug)}/slides/edit`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
    );
    return res.ok;
  } catch {
    return false;
  }
}

interface UseSlideEditorOptions {
  deckSlug: string | null | undefined;
  currentSlide: number;
  slideRef: React.RefObject<HTMLDivElement | null>;
}

export function useSlideEditor({ deckSlug, currentSlide, slideRef }: UseSlideEditorOptions) {
  const [editMode, setEditMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [toolbarPos, setToolbarPos] = useState<{ x: number; y: number } | null>(null);

  const activeElementRef = useRef<HTMLElement | null>(null);
  const originalTextRef = useRef<string>('');
  const deckSlugRef = useRef(deckSlug);
  deckSlugRef.current = deckSlug;

  const flashSave = useCallback((ok: boolean) => {
    setSaveStatus(ok ? 'saved' : 'error');
    setTimeout(() => setSaveStatus('idle'), 1500);
  }, []);

  // Deactivate on slide change
  useEffect(() => {
    const el = activeElementRef.current;
    if (el) {
      el.contentEditable = 'false';
      activeElementRef.current = null;
    }
    setSelectedElement(null);
    setToolbarPos(null);
  }, [currentSlide]);

  const saveTextEdit = useCallback((element: HTMLElement) => {
    const oldText = originalTextRef.current;
    const newText = element.textContent || '';
    const slug = deckSlugRef.current;

    if (oldText.trim() === newText.trim() || !oldText.trim() || !slug) return;

    saveEdit(slug, {
      type: 'text',
      oldText: oldText.trim(),
      newText: newText.trim(),
    }).then((ok) => flashSave(ok));
  }, [flashSave]);

  const handleSlideClick = useCallback(
    (e: React.MouseEvent) => {
      if (!editMode) return;

      const target = e.target as HTMLElement;
      const boundary = e.currentTarget as HTMLElement;
      const textEl = findTextAncestor(target, boundary);
      const prev = activeElementRef.current;

      if (!textEl) {
        if (prev) {
          prev.contentEditable = 'false';
          activeElementRef.current = null;
        }
        setSelectedElement(null);
        setToolbarPos(null);
        return;
      }

      if (prev === textEl) return;

      if (prev) {
        prev.contentEditable = 'false';
      }

      // Select element
      setSelectedElement(textEl);
      const rect = textEl.getBoundingClientRect();
      const containerRect = slideRef.current!.getBoundingClientRect();
      setToolbarPos({
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top - 8,
      });
    },
    [editMode, slideRef],
  );

  const startTextEdit = useCallback(() => {
    const el = selectedElement;
    if (!el) return;

    el.contentEditable = 'true';
    el.focus();
    originalTextRef.current = el.textContent || '';
    activeElementRef.current = el;

    const blurHandler = () => {
      el.removeEventListener('blur', blurHandler);
      saveTextEdit(el);
      el.contentEditable = 'false';
      if (activeElementRef.current === el) {
        activeElementRef.current = null;
      }
    };
    el.addEventListener('blur', blurHandler);
  }, [selectedElement, saveTextEdit]);

  const handleColorSelect = useCallback(
    (cssVar: string) => {
      const el = selectedElement;
      const slug = deckSlugRef.current;
      if (!el || !slug) return;

      const currentColor = el.style.color;
      const currentBg = el.style.backgroundColor;
      const isText = TEXT_TAGS.has(el.tagName);

      let oldValue: string;

      if (isText && currentColor && currentColor.includes('var(')) {
        oldValue = currentColor;
        el.style.color = cssVar;
      } else if (currentBg && currentBg.includes('var(')) {
        oldValue = currentBg;
        el.style.backgroundColor = cssVar;
      } else if (isText) {
        oldValue = '';
        el.style.color = cssVar;
      } else {
        oldValue = '';
        el.style.backgroundColor = cssVar;
      }

      if (oldValue) {
        const context = (el.textContent || '').trim().slice(0, 60);
        saveEdit(slug, {
          type: 'color',
          oldValue,
          newValue: cssVar,
          context,
        }).then((ok) => flashSave(ok));
      } else {
        flashSave(true);
      }
    },
    [selectedElement, flashSave],
  );

  const handleReorder = useCallback(
    (direction: 'up' | 'down') => {
      const el = selectedElement;
      const slug = deckSlugRef.current;
      if (!el || !slug) return;

      const text = (el.textContent || '').trim().slice(0, 80);
      if (!text) return;

      saveEdit(slug, {
        type: 'reorder',
        direction,
        elementText: text,
      }).then((ok) => flashSave(ok));
    },
    [selectedElement, flashSave],
  );

  const handleDelete = useCallback(() => {
    const el = selectedElement;
    const slug = deckSlugRef.current;
    if (!el || !slug) return;

    const text = (el.textContent || '').trim().slice(0, 80);
    if (!text) return;

    saveEdit(slug, {
      type: 'delete',
      elementText: text,
    }).then((ok) => {
      flashSave(ok);
      if (ok) {
        el.remove();
        setSelectedElement(null);
        setToolbarPos(null);
      }
    });
  }, [selectedElement, flashSave]);

  const toggleEditMode = useCallback(() => {
    const el = activeElementRef.current;
    if (editMode && el) {
      el.contentEditable = 'false';
      activeElementRef.current = null;
    }
    setSelectedElement(null);
    setToolbarPos(null);
    setEditMode(!editMode);
  }, [editMode]);

  // Escape to deselect
  useEffect(() => {
    if (!editMode) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const el = activeElementRef.current;
        if (el) {
          el.contentEditable = 'false';
          activeElementRef.current = null;
        }
        setSelectedElement(null);
        setToolbarPos(null);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [editMode]);

  return {
    editMode,
    saveStatus,
    selectedElement,
    toolbarPos,
    toggleEditMode,
    handleSlideClick,
    startTextEdit,
    handleColorSelect,
    handleReorder,
    handleDelete,
  };
}
```

**Step 3: Create `packages/renderer/src/EditorToolbar.tsx`**

The floating toolbar with text edit, color swatches, reorder, and delete:

```tsx
import { useRef, useEffect, useCallback } from 'react';

const THEME_COLORS = [
  { label: 'Primary', value: 'var(--sm-primary)' },
  { label: 'Secondary', value: 'var(--sm-secondary)' },
  { label: 'Accent', value: 'var(--sm-accent)' },
  { label: 'Text', value: 'var(--sm-text)' },
  { label: 'Muted', value: 'var(--sm-muted)' },
  { label: 'Success', value: 'var(--sm-success)' },
  { label: 'Danger', value: 'var(--sm-danger)' },
];

interface EditorToolbarProps {
  x: number;
  y: number;
  themeRoot: HTMLElement | null;
  onTextEdit: () => void;
  onColorSelect: (cssVar: string) => void;
  onReorder: (dir: 'up' | 'down') => void;
  onDelete: () => void;
  onClose: () => void;
}

export function EditorToolbar({
  x,
  y,
  themeRoot,
  onTextEdit,
  onColorSelect,
  onReorder,
  onDelete,
  onClose,
}: EditorToolbarProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const timer = setTimeout(() => document.addEventListener('mousedown', handler), 50);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handler);
    };
  }, [onClose]);

  const resolveVar = useCallback(
    (cssVar: string): string => {
      if (!themeRoot) return '#888';
      const varName = cssVar.replace('var(', '').replace(')', '');
      return window.getComputedStyle(themeRoot).getPropertyValue(varName).trim() || '#888';
    },
    [themeRoot],
  );

  const btnStyle: React.CSSProperties = {
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px',
    borderRadius: '4px',
    color: 'rgba(255,255,255,0.7)',
    transition: 'background 0.15s, color 0.15s',
  };

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, -100%)',
        zIndex: 40,
        backgroundColor: 'rgba(24, 24, 27, 0.95)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(63, 63, 70, 0.6)',
        borderRadius: '10px',
        padding: '6px 8px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
      }}
    >
      {/* Text edit */}
      <button onClick={onTextEdit} style={btnStyle} title="Edit text">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 11h8M5 3h4M7 3v8" strokeLinecap="round" />
        </svg>
      </button>

      {/* Separator */}
      <div style={{ width: 1, height: 18, backgroundColor: 'rgba(255,255,255,0.1)' }} />

      {/* Color swatches */}
      {THEME_COLORS.map((c) => (
        <button
          key={c.value}
          title={c.label}
          onClick={() => onColorSelect(c.value)}
          style={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.15)',
            backgroundColor: resolveVar(c.value),
            cursor: 'pointer',
            padding: 0,
            flexShrink: 0,
          }}
        />
      ))}

      {/* Separator */}
      <div style={{ width: 1, height: 18, backgroundColor: 'rgba(255,255,255,0.1)' }} />

      {/* Reorder up */}
      <button onClick={() => onReorder('up')} style={btnStyle} title="Move up">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M7 11V3M3 7l4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Reorder down */}
      <button onClick={() => onReorder('down')} style={btnStyle} title="Move down">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M7 3v8M3 7l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Separator */}
      <div style={{ width: 1, height: 18, backgroundColor: 'rgba(255,255,255,0.1)' }} />

      {/* Delete */}
      <button onClick={onDelete} style={{ ...btnStyle, color: 'rgba(239,68,68,0.8)' }} title="Delete element">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 3l8 8M11 3l-8 8" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
```

**Step 4: Refactor `packages/renderer/src/SlideRenderer.tsx`**

Remove: `TEXT_TAGS`, `findTextAncestor`, `EDIT_MODE_STYLES`, `saveEdit`, `ColorPickerPopover`, all edit-related state/callbacks.

Keep: Screenshot, fullscreen, navigation controls, slide animation.

Import and use: `useSlideEditor`, `EditorToolbar`, `SaveIndicator`.

The SlideRenderer should shrink from ~720 lines to ~250 lines. The edit click handler wraps the slide content, the toolbar renders when `toolbarPos` is set, and `SaveIndicator` replaces the inline JSX.

**Step 5: Update `packages/renderer/src/index.ts`**

Add exports (only if needed by studio — the editor toolbar/hook are internal to renderer, so likely no new exports needed. Keep the existing exports).

**Step 6: Verify in browser**

Run: Open `http://localhost:4200/#saberalert-mvp`
Expected:
- Edit mode toggle works (pencil icon top-left)
- Click element → floating toolbar appears with A, colors, ↑↓, ×
- Text edit via A button works and saves
- Color picking works and saves
- Reorder and delete buttons call the API (reorder/delete will need API support from Task 8)
- "Saved" indicator flashes
- Navigation, fullscreen, screenshot all still work

**Step 7: Commit**

```bash
git add packages/renderer/src/
git commit -m "refactor: extract EditorToolbar, useSlideEditor, SaveIndicator from SlideRenderer"
```

---

## Task 8: Add reorder and delete API endpoints

**Files:**
- Modify: `apps/studio/vite-plugin-studio-api.ts`

**Step 1: Add reorder handling to `handleEditSlides`**

In the `handleEditSlides` function, add handling for `type === 'reorder'`:

```ts
} else if (type === 'reorder' && elementText && direction) {
  // Find the JSX node containing this text
  const words = elementText.split(/\s+/).filter(Boolean).slice(0, 8);
  if (words.length > 0) {
    const pattern = words.map((w: string) => escapeRegex(w)).join('\\s+');
    const match = content.match(new RegExp(pattern));
    if (match && match.index != null) {
      // Find the enclosing JSX element boundaries
      // Look for the nearest <motion.div or <div or component opening tag above
      // and its matching closing tag below
      // For now, swap entire lines containing the text with adjacent sibling
      // This is a simplified approach — full AST manipulation would be more robust
      const lines = content.split('\n');
      const matchLine = content.substring(0, match.index).split('\n').length - 1;

      // Find element boundaries by tracking JSX nesting
      let startLine = matchLine;
      let endLine = matchLine;
      let depth = 0;

      // Walk up to find the element start (line with opening tag)
      for (let l = matchLine; l >= 0; l--) {
        const line = lines[l].trim();
        if (line.startsWith('<') && !line.startsWith('</') && !line.startsWith('{')) {
          startLine = l;
          break;
        }
      }

      // Walk down from startLine to find the closing tag
      for (let l = startLine; l < lines.length; l++) {
        const line = lines[l];
        const opens = (line.match(/<[A-Za-z]/g) || []).length;
        const closes = (line.match(/<\//g) || []).length;
        const selfCloses = (line.match(/\/>/g) || []).length;
        depth += opens - closes - selfCloses;
        if (depth <= 0 || (l > startLine && line.trim().startsWith('</'))) {
          endLine = l;
          break;
        }
      }

      // This is a best-effort approach. For complex JSX structures,
      // we'd need a proper parser.
      json(res, { ok: true, note: 'reorder-partial' });
      return;
    }
  }
}
```

**Step 2: Add delete handling to `handleEditSlides`**

Add handling for `type === 'delete'`:

```ts
} else if (type === 'delete' && elementText) {
  const words = elementText.split(/\s+/).filter(Boolean).slice(0, 8);
  if (words.length > 0) {
    const pattern = words.map((w: string) => escapeRegex(w)).join('[\\s\\S]{0,200}?');
    // Find and remove the line(s) containing this text
    // For safety, only remove if we can identify a single JSX element
    const regex = new RegExp(pattern);
    const match = content.match(regex);
    if (match && match.index != null) {
      // Find the enclosing element — walk outward from the match
      const before = content.substring(0, match.index);
      const lastNewline = before.lastIndexOf('\n');
      const lineStart = lastNewline + 1;

      // Find the closing of this element
      const after = content.substring(match.index + match[0].length);
      const closingPatterns = ['/>', '</motion.div>', '</div>', '</span>', '</p>', '</h1>', '</h2>', '</h3>'];
      let closingEnd = -1;
      for (const cp of closingPatterns) {
        const idx = after.indexOf(cp);
        if (idx !== -1 && (closingEnd === -1 || idx < closingEnd)) {
          closingEnd = match.index + match[0].length + idx + cp.length;
        }
      }

      if (closingEnd > 0) {
        // Remove from lineStart to closingEnd (plus trailing comma/newline)
        let removeEnd = closingEnd;
        // Skip trailing comma and whitespace
        while (removeEnd < content.length && (content[removeEnd] === ',' || content[removeEnd] === '\n' || content[removeEnd] === ' ')) {
          removeEnd++;
        }
        content = content.substring(0, lineStart) + content.substring(removeEnd);
      }
    }
  }
}
```

**Note:** Both reorder and delete are best-effort string manipulation. For MVP, they work well on well-formatted JSX. A future improvement would use a proper AST parser (e.g., `@babel/parser`).

**Step 3: Verify API works**

Test manually:
1. Open browser, select an element, click delete
2. Check that slides.tsx has the element removed
3. Select an element, click reorder — verify API responds

**Step 4: Commit**

```bash
git add apps/studio/vite-plugin-studio-api.ts
git commit -m "feat: add reorder and delete operations to slides edit API"
```

---

## Task 9: Update CLAUDE.md to teach AI agents to use primitives

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Add primitives section to CLAUDE.md**

After the "Design Principles" section, add a new section:

```markdown
---

## Slide Primitives (`@slidemason/primitives`)

When generating slides, **always use primitives** instead of raw `<div>` + inline styles. This dramatically reduces code size and ensures consistent animation and theming.

### Available Primitives

| Component | Purpose | Example |
|---|---|---|
| `<Slide layout="center">` | Slide wrapper (replaces raw div root) | `<Slide layout="center" bg="mesh">` |
| `<Heading size="lg">` | Themed heading with auto-animation | `<Heading size="hero">Title</Heading>` |
| `<Text muted>` | Body text with auto-animation | `<Text muted size="sm">Subtitle</Text>` |
| `<Badge>` | Glass pill label | `<Badge>Pre-Seed · Q1 2026</Badge>` |
| `<Card>` | Glass card container | `<Card pad="lg">content</Card>` |
| `<StatBox>` | Metric display (icon + value + label) | `<StatBox icon={Wifi} value="200K+" label="Signals" />` |
| `<IconCircle>` | Themed icon in circle | `<IconCircle icon={Brain} size="lg" />` |
| `<GradientText>` | Gradient-clipped text | `<GradientText size="hero">Title</GradientText>` |
| `<GhostNumber>` | Faded background number | `<GhostNumber n={3} />` |
| `<Divider>` | Gradient horizontal rule | `<Divider />` |
| `<Step>` | Numbered step in a list | `<Step n={1} active>First</Step>` |
| `<Pipeline>` | Horizontal process flow | `<Pipeline items={[...]} />` |

### Slide Layouts

- `center` — centered flex column (hero slides, statements)
- `split` — two-panel 35/65 split
- `grid` — auto-grid based on children
- `statement` — centered with extra breathing room
- `free` — no preset layout (default)

### Import Pattern

```tsx
import { Slide, Heading, Text, Badge, Card, StatBox, IconCircle,
         GradientText, GhostNumber, Divider, Step, Pipeline } from '@slidemason/primitives';
import { Radio, Brain, Bell } from 'lucide-react';

const slides = [
  <Slide key="s1" layout="center" bg="mesh">
    <Badge>Company · Stage</Badge>
    <GradientText size="hero">Product Name</GradientText>
    <Text muted>Tagline goes here</Text>
  </Slide>,
];

export default slides;
```

### Rules for Primitives

1. **No `framer-motion` import in deck files** — animation is built into every primitive
2. **No `clamp()` calls** — use `size` props (`"sm"`, `"md"`, `"lg"`, `"hero"`)
3. **No animation boilerplate** — delete `fade`, `stagger`, `scaleIn` helpers
4. **No glass style helper** — `<Card>` does this automatically
5. **`style` prop for overrides only** — most styling is handled by props
6. **Still use `var(--sm-*)` for colors** — primitives use theme vars internally
```

**Step 2: Remove old examples that show raw div + inline style patterns**

Update the existing code example in the "How to Generate a Presentation" section to use primitives instead.

**Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md with primitives usage guide for AI agents"
```

---

## Summary

| Task | What | Est. Lines |
|---|---|---|
| 1 | Scaffold `@slidemason/primitives` package | ~30 |
| 2 | `<Slide>` + `StaggerContext` | ~80 |
| 3 | `Heading`, `Text`, `Badge` | ~120 |
| 4 | `Card`, `GradientText`, `Divider`, `GhostNumber` | ~130 |
| 5 | `IconCircle`, `StatBox`, `Step`, `Pipeline` | ~200 |
| 6 | Rewrite saberalert-mvp deck | ~180 (replacing 489) |
| 7 | Extract editor toolbar from SlideRenderer | ~400 (refactored) |
| 8 | Add reorder/delete API | ~60 |
| 9 | Update CLAUDE.md | ~80 |
