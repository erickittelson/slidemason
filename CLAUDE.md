# Slidemason — AI Agent Instructions

> These instructions are for **any AI coding agent** (Claude Code, Cursor, GitHub Copilot, Windsurf, etc.)
> working inside this repository. Read this file completely before generating or modifying
> any presentation content.

---

## What This Project Is

Slidemason is a local-first, open-source presentation builder. The monorepo is structured as follows:

| Path | Purpose |
|---|---|
| `packages/components/` | 116 primitive components + 15 slide templates |
| `packages/renderer/` | Presentation engine with Framer Motion transitions |
| `packages/themes/` | 12 CSS themes |
| `apps/studio/` | Vite-based studio with sidebar workflow |
| `data/` | User's source documents (PDFs, markdown, text, etc.) |
| `generated/brief.json` | Brief file produced by the studio |

---

## How to Generate a Presentation

### Step 1: Read All Source Documents

Read **every file** in `data/`. Synthesize key themes, metrics, decisions, quotes, and takeaways. Do not skip any file — the user placed it there for a reason.

### Step 2: Read the Brief

Read `generated/brief.json` for audience, goal, tone, theme, fonts, and constraints. The brief tells you **who** you are presenting to and **what** the deck should accomplish.

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

### Step 4: Write the Slides

Edit `apps/studio/src/slides.tsx`. Import templates from `@slidemason/components`. Export a default array.

```tsx
import {
  TitleSlide,
  AgendaSlide,
  SectionDividerSlide,
  ContentSlide,
  ContentMediaSlide,
  MetricsSlide,
  FeatureSlide,
  TimelineSlide,
  ComparisonSlide,
  ProcessSlide,
  QuoteSlide,
  DiagramSlide,
  TableSlide,
  FullBleedSlide,
  ConclusionSlide,
} from '@slidemason/components';

const slides = [
  <TitleSlide key="s1" title="Deck Title" subtitle="Subtitle" gradient="blue-purple" />,
  // ... more slides
];

export default slides;
```

---

## Template Decision Table

Use this table to pick the right template for each piece of content:

| Content Type | Recommended Template |
|---|---|
| Opening / big moment | `TitleSlide` |
| Topic overview | `AgendaSlide` |
| Chapter / section break | `SectionDividerSlide` |
| Explaining a concept | `ContentSlide` |
| Text + visual side by side | `ContentMediaSlide` |
| KPIs / big numbers | `MetricsSlide` |
| Feature list / capabilities | `FeatureSlide` |
| Roadmap / milestones | `TimelineSlide` |
| Before/after or pros/cons | `ComparisonSlide` |
| Step-by-step process | `ProcessSlide` |
| Stakeholder quote | `QuoteSlide` |
| Flywheel / funnel / cycle | `DiagramSlide` |
| Action items / next steps | `TableSlide` |
| Dramatic emphasis (1-2 max) | `FullBleedSlide` |
| Final slide / CTA | `ConclusionSlide` |

---

## Slide Template Reference

### TitleSlide

```ts
interface TitleSlideProps {
  title: string;
  subtitle?: string;
  badge?: string;
  gradient?: 'blue-purple' | 'emerald-blue' | 'amber-rose' | 'purple-rose';
}
```

```tsx
<TitleSlide
  key="title"
  title="Your Deck Title"
  subtitle="A compelling subtitle"
  badge="Team Name • Q1 2026"
  gradient="blue-purple"
/>
```

### AgendaSlide

```ts
interface AgendaSlideProps {
  title?: string;
  items: Array<{ label: string; description?: string; icon?: string }>;
}
```

```tsx
<AgendaSlide
  key="agenda"
  title="What We'll Cover"
  items={[
    { label: 'Market Landscape', description: 'Where we stand today', icon: 'Globe' },
    { label: 'Our Strategy', description: 'The path forward', icon: 'Target' },
    { label: 'Key Metrics', description: 'Measuring success', icon: 'BarChart3' },
  ]}
/>
```

### SectionDividerSlide

```ts
interface SectionDividerSlideProps {
  number?: string;
  title: string;
  subtitle?: string;
  gradient?: 'blue-purple' | 'emerald-blue' | 'amber-rose' | 'purple-rose';
}
```

```tsx
<SectionDividerSlide
  key="section-1"
  number="01"
  title="Market Analysis"
  subtitle="Understanding the competitive landscape"
  gradient="emerald-blue"
/>
```

### ContentSlide

```ts
interface ContentSlideProps {
  title: string;
  subtitle?: string;
  bullets?: string[];
  layout?: 'single' | 'two-column';
  rightBullets?: string[];
}
```

```tsx
<ContentSlide
  key="content-1"
  title="Key Findings"
  subtitle="From our Q4 research"
  bullets={[
    'Customer retention increased 23% year-over-year',
    'NPS score reached all-time high of 72',
    'Three new market segments identified',
  ]}
  layout="single"
/>
```

### ContentMediaSlide

```ts
interface ContentMediaSlideProps {
  title: string;
  subtitle?: string;
  bodyText?: string;
  bullets?: string[];
  mediaPosition?: 'left' | 'right';
  visual?: 'icon-grid' | 'diagram' | 'checklist';
  visualItems?: Array<{ label: string; icon?: string }>;
}
```

```tsx
<ContentMediaSlide
  key="content-media-1"
  title="Platform Capabilities"
  subtitle="Built for scale"
  bullets={[
    'Real-time data processing',
    'Multi-region deployment',
    'Enterprise-grade security',
  ]}
  mediaPosition="right"
  visual="icon-grid"
  visualItems={[
    { label: 'Cloud Native', icon: 'Cloud' },
    { label: 'Auto Scaling', icon: 'Scaling' },
    { label: 'Monitoring', icon: 'Activity' },
    { label: 'Security', icon: 'Shield' },
  ]}
/>
```

### MetricsSlide

```ts
interface MetricsSlideProps {
  title?: string;
  subtitle?: string;
  metrics: Array<{
    value: string;
    label: string;
    trend?: 'up' | 'down' | 'neutral';
    color?: 'blue' | 'emerald' | 'purple' | 'amber' | 'rose';
  }>;
}
```

```tsx
<MetricsSlide
  key="metrics"
  title="Q4 Performance"
  subtitle="All metrics trending positive"
  metrics={[
    { value: '$4.2M', label: 'Revenue', trend: 'up', color: 'emerald' },
    { value: '23%', label: 'Growth Rate', trend: 'up', color: 'blue' },
    { value: '94%', label: 'Retention', trend: 'neutral', color: 'purple' },
    { value: '1.2s', label: 'Avg Response Time', trend: 'down', color: 'amber' },
  ]}
/>
```

### FeatureSlide

```ts
interface FeatureSlideProps {
  title?: string;
  subtitle?: string;
  features: Array<{ label: string; description?: string; icon?: string }>;
  columns?: 2 | 3;
}
```

```tsx
<FeatureSlide
  key="features"
  title="What's New"
  subtitle="Shipping in v3.0"
  columns={3}
  features={[
    { label: 'AI Copilot', description: 'Smart suggestions powered by LLMs', icon: 'Sparkles' },
    { label: 'Real-time Sync', description: 'Instant collaboration across teams', icon: 'RefreshCw' },
    { label: 'Custom Workflows', description: 'Build automations without code', icon: 'Workflow' },
  ]}
/>
```

### TimelineSlide

```ts
interface TimelineSlideProps {
  title?: string;
  subtitle?: string;
  items: Array<{
    phase: string;
    title: string;
    description: string;
    status?: 'completed' | 'in-progress' | 'upcoming';
  }>;
  variant?: 'vertical' | 'horizontal';
}
```

```tsx
<TimelineSlide
  key="timeline"
  title="Implementation Roadmap"
  subtitle="12-month rollout plan"
  variant="horizontal"
  items={[
    { phase: 'Q1', title: 'Foundation', description: 'Core infrastructure and team onboarding', status: 'completed' },
    { phase: 'Q2', title: 'Beta Launch', description: 'Internal beta with select customers', status: 'in-progress' },
    { phase: 'Q3', title: 'GA Release', description: 'General availability and marketing push', status: 'upcoming' },
    { phase: 'Q4', title: 'Scale', description: 'International expansion and enterprise tier', status: 'upcoming' },
  ]}
/>
```

### ComparisonSlide

```ts
interface ComparisonSlideProps {
  title?: string;
  beforeLabel?: string;
  afterLabel?: string;
  variant?: 'before-after' | 'pros-cons';
  items?: Array<{ label: string; before: string; after: string }>;
  pros?: string[];
  cons?: string[];
}
```

**Before/After variant:**

```tsx
<ComparisonSlide
  key="comparison-ba"
  title="The Transformation"
  variant="before-after"
  items={[
    { label: 'Deploy Time', before: '2 weeks', after: '15 minutes' },
    { label: 'Error Rate', before: '4.2%', after: '0.1%' },
    { label: 'Team Size', before: '12 engineers', after: '4 engineers' },
  ]}
/>
```

**Pros/Cons variant:**

```tsx
<ComparisonSlide
  key="comparison-pc"
  title="Build vs. Buy Analysis"
  variant="pros-cons"
  pros={[
    'Full control over roadmap',
    'Deep integration with existing stack',
    'No vendor lock-in',
  ]}
  cons={[
    'Higher upfront engineering cost',
    '6-month longer time to market',
    'Ongoing maintenance burden',
  ]}
/>
```

### ProcessSlide

```ts
interface ProcessSlideProps {
  title?: string;
  subtitle?: string;
  steps: Array<{ label: string; icon?: string }>;
}
```

```tsx
<ProcessSlide
  key="process"
  title="How It Works"
  subtitle="Four simple steps"
  steps={[
    { label: 'Upload your data', icon: 'Upload' },
    { label: 'Configure pipeline', icon: 'Settings' },
    { label: 'Run analysis', icon: 'Play' },
    { label: 'Export results', icon: 'Download' },
  ]}
/>
```

### QuoteSlide

```ts
interface QuoteSlideProps {
  quote: {
    text: string;
    attribution?: string;
    role?: string;
  };
  theme?: 'blue' | 'emerald' | 'purple' | 'amber' | 'rose';
}
```

```tsx
<QuoteSlide
  key="quote"
  quote={{
    text: 'This platform reduced our time-to-insight from weeks to hours. It changed how we make decisions.',
    attribution: 'Sarah Chen',
    role: 'VP of Engineering, Acme Corp',
  }}
  theme="purple"
/>
```

### DiagramSlide

```ts
interface DiagramSlideProps {
  title?: string;
  subtitle?: string;
  type: 'flywheel' | 'funnel' | 'cycle' | 'pyramid';
  segments: Array<{ label: string; value?: number }>;
}
```

```tsx
<DiagramSlide
  key="diagram"
  title="Growth Flywheel"
  subtitle="Self-reinforcing growth loop"
  type="flywheel"
  segments={[
    { label: 'Acquire Users' },
    { label: 'Deliver Value' },
    { label: 'Generate Referrals' },
    { label: 'Expand Revenue' },
  ]}
/>
```

### TableSlide

```ts
interface TableSlideProps {
  title?: string;
  subtitle?: string;
  steps: Array<{
    action: string;
    owner?: string;
    date?: string;
    status?: 'todo' | 'in-progress' | 'done';
  }>;
}
```

```tsx
<TableSlide
  key="action-items"
  title="Next Steps"
  subtitle="Owners and deadlines"
  steps={[
    { action: 'Finalize vendor contract', owner: 'Legal', date: 'Mar 15', status: 'in-progress' },
    { action: 'Complete security audit', owner: 'InfoSec', date: 'Mar 30', status: 'todo' },
    { action: 'Launch internal beta', owner: 'Engineering', date: 'Apr 15', status: 'todo' },
  ]}
/>
```

### FullBleedSlide

```ts
interface FullBleedSlideProps {
  title: string;
  subtitle?: string;
  gradient?: 'blue' | 'emerald' | 'purple' | 'amber' | 'rose' | 'dark';
}
```

```tsx
<FullBleedSlide
  key="fullbleed"
  title="The future belongs to those who ship."
  subtitle="Let's build it together."
  gradient="dark"
/>
```

### ConclusionSlide

```ts
interface ConclusionSlideProps {
  variant?: 'thankyou' | 'qa' | 'contact';
  title?: string;
  subtitle?: string;
  callToAction?: string;
  contactInfo?: {
    email?: string;
    website?: string;
    social?: string;
  };
  items?: Array<{ label: string }>;
}
```

```tsx
<ConclusionSlide
  key="conclusion"
  variant="contact"
  title="Let's Talk"
  subtitle="Ready to get started?"
  callToAction="Schedule a demo this week"
  contactInfo={{
    email: 'team@example.com',
    website: 'example.com',
    social: '@example',
  }}
/>
```

---

## Design Principles — FOLLOW THESE

1. **Each slide makes ONE point** — do not overload a slide with multiple ideas.
2. **8-15 slides per deck** — more than 20 is almost always too many.
3. **Alternate text-heavy and visual-heavy slides** for rhythm and pacing.
4. **Use `SectionDividerSlide` between major narrative shifts** to give the audience a mental reset.
5. **`ContentMediaSlide` should alternate `mediaPosition`** — use `'left'` then `'right'` then `'left'` for visual variety.
6. **Never use the same slide type twice in a row** — `ContentSlide` is the only exception.
7. **`FullBleedSlide` max 1-2 per deck** — overuse kills the impact.
8. **Gradient text appears only on `TitleSlide` and `MetricsSlide` headlines** — do not apply gradients elsewhere.
9. **Use the brief's theme and fonts** — they are already applied by the renderer. Do not override them.

---

## Critical Rules

1. **NEVER modify files in `packages/renderer/` or `packages/components/`** — these are framework internals.
2. **ALL presentation content goes in `apps/studio/src/slides.tsx`** — this is the only file you should create or edit.
3. **Import templates from `@slidemason/components`** — do not import from relative paths into packages.
4. **Every slide needs a unique `key` prop** — React requires this for arrays.
5. **Do not add new dependencies** — everything you need is already installed.
6. **Read ALL files in `data/` before generating** — do not skip any source material.
7. **Use TypeScript** — the project is fully typed.
8. **Icon names are PascalCase Lucide icons** — e.g., `'Database'`, `'Shield'`, `'Zap'`, `'BarChart3'`, `'Globe'`.

---

## Available Themes

The following themes can be specified in the brief. They are applied automatically by the renderer:

`midnight` · `slate` · `canvas` · `signal` · `noir` · `dawn` · `boardroom` · `neon` · `forest` · `glacier` · `sunset` · `paper`
