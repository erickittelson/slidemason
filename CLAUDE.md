# Slidemason — AI Agent Instructions

> These instructions are for **any AI coding agent** (Claude Code, Cursor, GitHub Copilot, Windsurf, etc.)
> working inside this repository. This file is symlinked to `.cursorrules`, `.windsurfrules`, and
> `.github/copilot-instructions.md` so all platforms read the same source.
> Read this file completely before generating or modifying any presentation content.

---

## What This Project Is

Slidemason is a local-first, open-source presentation builder. The monorepo is structured as follows:

| Path | Purpose |
|---|---|
| `packages/renderer/` | Presentation engine with slide transitions |
| `packages/themes/` | 12 CSS themes with 31 variables each |
| `apps/studio/` | Vite-based studio with sidebar workflow |
| `decks/` | Each deck is a folder (e.g. `decks/my-pitch/`) |
| `decks/<slug>/data/` | Source documents (PDFs, markdown, text, etc.) |
| `decks/<slug>/generated/brief.json` | Brief file produced by the studio |
| `decks/<slug>/slides.tsx` | The deck's slide content |

---

## How to Generate a Presentation

### Step 1: Read All Source Documents

Read **every file** in `decks/<slug>/data/`. Synthesize key themes, metrics, decisions, quotes, and takeaways. Do not skip any file — the user placed it there for a reason.

### Step 2: Read the Brief

Read `decks/<slug>/generated/brief.json` for audience, goal, tone, theme, fonts, and constraints. The brief tells you **who** you are presenting to and **what** the deck should accomplish.

### Step 2b: Check Branding & Images

Read `brief.branding` for logo placement and footer text. If `branding.logoFilename` is set, the logo image is at `decks/<slug>/data/assets/<logoFilename>`. Place it on slides according to `branding.logoPlacement` (`top-left`, `top-right`, `bottom-left`, `bottom-right`, or `none`). If `branding.footerText` is set, include it as a subtle footer on each slide.

Check `brief.images[]` for content images the user uploaded. Each entry has a `filename` (file in `decks/<slug>/data/assets/`) and a `description` explaining what it is and how the user wants it used. Reference images in slides using an `<img>` tag with `src` pointing to the asset path. Only use images the user uploaded — do not invent filenames.

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

### Step 3b: Plan Animation & Interaction

After planning the narrative arc, decide where animation and interaction serve the story:

- **Animation budget:** Aim for 3-5 animated moments per 15-slide deck. Each should have a reason.
- **Interaction budget:** 1-3 interactive slides per deck. Each should let the presenter control pacing or reveal depth.
- **Write this plan as comments at the top of slides.tsx** before writing any JSX.

Most slides should be static — instant, confident, and let the content speak. Reserve animation for moments that need emphasis: a key stat landing, a reveal that builds tension, a transition that signals a shift in the narrative.

### Step 4: Design and Write the Slides

Edit `decks/<slug>/slides.tsx`. Each slide is **bespoke JSX** — a unique design tailored to its specific content. Import from `@slidemason/primitives`, `lucide-react`, and optionally `framer-motion`. Use primitives for layout and typography. Use the animation toolkit when animation serves the narrative. Use the interaction toolkit when the presenter needs to control pacing. Use Tailwind classes and theme CSS variables for any custom styling.

```tsx
import {
  Slide, Heading, Text, Badge, Card, GradientText,
  GhostNumber, Divider, IconCircle, StatBox, Step, Pipeline,
  Grid, Split, Stack, Row, Spacer, ColorBar,
  Animate, CountUp, Stagger, TypeWriter, ProgressReveal,
  Tooltip, ClickReveal, Tabs, Flipcard,
} from '@slidemason/primitives';
import { Radio, Brain, Bell, ShieldCheck } from 'lucide-react';

const slides = [
  // Static slide — no animation needed, content speaks for itself
  <Slide key="s1" layout="center" bg="mesh">
    <Badge>Company · Stage · Context</Badge>
    <GradientText size="hero">Product Name</GradientText>
    <Text muted style={{ maxWidth: '28ch' }}>
      Tagline goes here
    </Text>
  </Slide>,

  // Animated stat — CountUp lands the number with impact
  <Slide key="s2" layout="center">
    <Animate effect="fade-up">
      <Heading>Revenue Growth</Heading>
    </Animate>
    <CountUp to={2.3} prefix="$" suffix="M" decimals={1} />
  </Slide>,

  // Interactive — presenter clicks to reveal each point
  <Slide key="s3" layout="free">
    <Heading>Three Pillars</Heading>
    <ClickReveal prompt="Click to reveal first pillar">
      <Card><Text>Platform reliability</Text></Card>
    </ClickReveal>
  </Slide>,
];

export default slides;
```

> **Key principle:** Nothing animates by default. Animation and interaction are narrative tools — use them to direct attention, build tension, or let the presenter control pacing.

### Step 5: Validate the Deck

After writing `slides.tsx`, validate that all slides render without errors:

```bash
curl http://localhost:4200/__api/decks/<slug>/validate
```

A successful response looks like `{ "valid": true, "slideCount": 15 }`. If any slide fails, the response includes an `errors` array with the slide index and error message. Fix the errors and re-validate.

**Common validation failures:**
- Invalid `ratio` on `<Split>` — the primitive falls back to `50/50`, but fix the source to use a valid value
- Invalid `effect` on `<Animate>` or `<Stagger>` — falls back to `fade-up`
- Missing required array props on `<Accordion>`, `<DataTable>`, `<Tabs>`, etc.
- Using `framer-motion` features that don't work in SSR (avoid `useMotionValue` at module scope)

---

## Design Principles — FOLLOW THESE

**Think like a cinematic director, not a report writer.** Every slide should feel hand-designed for its content. No two slides should look the same.

1. **Every slide is bespoke.** Design a unique layout for each slide's specific content. Never reuse the same layout pattern on consecutive slides.
2. **Cinematic typography.** Headlines at `text-6xl` to `text-8xl`. Generous whitespace. Let content breathe. Use `clamp()` for responsive sizing.
3. **Glass cards for grouped content.** Use `var(--sm-glass-bg)` background + `backdrop-blur-sm` + `1px solid var(--sm-border)` for card containers. Round with `var(--sm-radius)`.
4. **Gradient text for impact moments.** `linear-gradient(135deg, var(--sm-primary), var(--sm-secondary))` with `WebkitBackgroundClip: 'text'`. Use sparingly — title slide and 1-2 key statements only.
5. **Animation with purpose.** Nothing animates by default. Use `<Animate>` wrapper or `<Stagger>` only when animation serves the narrative — to land a stat, build tension, or signal a shift. A static slide is often stronger than an animated one.
6. **Icons as visual anchors.** Lucide icons at 32-48px, colored with theme variables. Every content slide should have icons to break up text.
7. **Theme variables only — never hardcode colors.** All colors come from `var(--sm-*)` CSS variables. This ensures every theme works.
8. **Ghost numbers on section dividers.** A massive faded number (text-[12rem], opacity 5-10%) positioned behind the section title. Creates depth.
9. **Lists when they work, cards when they don't.** A clean bulleted list is sometimes the best design. Use icon card grids for feature comparisons and visual breakdowns. Use simple lists for sequential steps or short items. Choose the format that best serves the content.
10. **Responsive clamp() sizing.** All text uses `clamp(min, preferred, max)` so slides scale from sidebar preview to fullscreen.
11. **Alternate layout density.** Follow a dense, data-heavy slide with a spacious, breathing slide. Rhythm matters.
12. **Maximum visual variety.** Never repeat the same layout pattern on consecutive slides. Alternate between centered, split, grid, and asymmetric layouts.
13. **Interaction with intent.** Interactive elements serve the presenter's flow. Use `<ClickReveal>` to let them build an argument piece by piece. Use `<Tooltip>` to hide detail until needed. Use `<Tabs>` when one slide has multiple angles. Most slides won't need interaction.
14. **Full React power in deck files.** You can import `framer-motion`, use `useState`/`useEffect`, and build custom interactive components. The primitive toolkit covers common cases; write custom React when it doesn't.

---

## Readability & Accessibility Rules

Every slide must be readable at a glance. If a viewer has to squint, the slide has failed.

### Minimum Font Sizes

| Element | Minimum | Recommended | Example |
|---|---|---|---|
| Hero / title text | `clamp(2.5rem, 6vw, 5rem)` | `text-6xl` to `text-8xl` | Slide titles, section headers |
| Body / content text | `clamp(1rem, 1.8vw, 1.5rem)` | `text-lg` to `text-xl` | Bullet points, descriptions |
| Captions / labels | `clamp(0.75rem, 1.2vw, 1rem)` | `text-sm` to `text-base` | Badges, footnotes, presenter name |
| Absolute minimum | `0.75rem` (12px) | — | Nothing on any slide may render below this |

### Gradient Text Readability

- **Both** gradient endpoint colors must have WCAG AA contrast (4.5:1) against the slide background.
- Never gradient from a readable color to one that blends into the background (e.g. cyan → dark blue on a dark slide).
- Test by imagining each color rendered as solid text — if either is unreadable, pick a different gradient.

### Color Contrast

- All text must pass WCAG AA contrast (4.5:1) against its immediate background.
- `var(--sm-muted)` text must still be clearly readable — if it's not, use `var(--sm-text)` instead.
- Text on glass cards (`var(--sm-glass-bg)`) must contrast against both the glass tint and whatever is behind it.

### Footer & Attribution

- Presenter name: use `<Text size="sm">` minimum, never raw inline styles with tiny font sizes.
- Classification / footer text: `0.75rem` minimum, `var(--sm-muted)` color, never below 12px.
- These elements should be small but comfortably readable, not microscopic.

---

## Slide Primitives (`@slidemason/primitives`)

When generating slides, **always use primitives** instead of raw `<div>` + inline styles. This dramatically reduces code size and ensures consistent theming.

### Visual Atoms (no animation — instant render)

| Component | Purpose | Example |
|---|---|---|
| `<Slide layout bg?>` | Slide wrapper | `<Slide layout="center" bg="mesh">` |
| `<Heading size?>` | Themed heading | `<Heading size="hero">Title</Heading>` |
| `<Text size? muted?>` | Body paragraph | `<Text muted>Subtitle</Text>` |
| `<Badge>` | Glass pill label | `<Badge>Pre-Seed · Q1 2026</Badge>` |
| `<Card glass? pad?>` | Glass card container | `<Card pad="lg">content</Card>` |
| `<StatBox icon? value label color?>` | Metric display | `<StatBox icon={Wifi} value="200K+" label="Signals" />` |
| `<IconCircle icon size? active? color?>` | Icon in circle | `<IconCircle icon={Brain} size="lg" />` |
| `<GradientText size? as?>` | Gradient-clipped text | `<GradientText size="hero">Title</GradientText>` |
| `<GhostNumber n>` | Faded background number | `<GhostNumber n={3} />` |
| `<Divider width?>` | Gradient horizontal rule | `<Divider />` |
| `<Step n active?>` | Numbered step | `<Step n={1} active>First</Step>` |
| `<Pipeline items>` | Horizontal process flow | `<Pipeline items={[{icon, label, sub}]} />` |
| `<Chart type data>` | Bar/line/area/pie chart | `<Chart type="bar" data={[...]} series={['rev']} />` |
| `<DataTable headers rows>` | Themed data table | `<DataTable headers={['Q','Rev']} rows={[['Q1','$2M']]} />` |

### Layout Atoms

| Component | Purpose | Example |
|---|---|---|
| `<Grid cols gap?>` | CSS grid shorthand | `<Grid cols={3} gap="md">` |
| `<Split ratio? reverse?>` | Two-panel flex layout | `<Split ratio="40/60">` |
| `<Stack gap? align?>` | Flex column | `<Stack gap="lg" align="center">` |
| `<Row gap? align? wrap?>` | Flex row | `<Row gap="sm">` |
| `<Spacer size?>` | Intentional whitespace | `<Spacer size="lg" />` |
| `<ColorBar color? position?>` | Accent stripe on cards | `<ColorBar color="var(--sm-primary)" />` |

### Animation Toolkit (opt-in — use only when narratively warranted)

| Component | Purpose | Example |
|---|---|---|
| `<Animate effect? delay? duration?>` | Wrap any element to animate it | `<Animate effect="fade-up" delay={0.3}>` |
| `<CountUp to prefix? suffix?>` | Animated number counter | `<CountUp to={500} prefix="$" suffix="M" />` |
| `<TypeWriter text speed?>` | Character-by-character text | `<TypeWriter text="We need to act now." />` |
| `<Stagger interval? effect?>` | Stagger children entrance | `<Stagger interval={0.15}>` |
| `<ProgressReveal value label?>` | Animated progress bar | `<ProgressReveal value={73} label="Done" />` |

### Interaction Toolkit (presenter-driven — use when interaction serves the story)

| Component | Purpose | Example |
|---|---|---|
| `<Tooltip content>` | Hover tooltip | `<Tooltip content="$2.3M ARR">` |
| `<HoverCard hoverContent>` | Card with hover detail | `<HoverCard hoverContent={<Text>...</Text>}>` |
| `<HoverHighlight>` | Dims siblings on hover | Wraps a group of children |
| `<ClickReveal prompt?>` | Hidden until click | `<ClickReveal prompt="Click to see">` |
| `<Tabs items>` | Tabbed panels | `<Tabs items={[{label, content}]}>` |
| `<Accordion items>` | Expandable sections | `<Accordion items={[{title, content}]}>` |
| `<Flipcard front back>` | Click to flip | `<Flipcard front={...} back={...}>` |
| `<BeforeAfter before after>` | Toggle two states | `<BeforeAfter before={...} after={...}>` |
| `<Sortable items>` | Draggable reorder list | `<Sortable items={[{id, content}]}>` |
| `<Spotlight>` | Click through focused items | Wraps a group of children |

### Slide Layouts

- `center` — centered flex column (hero slides, statements)
- `split` — two-panel 35/65 split
- `grid` — auto-grid based on children
- `statement` — centered with extra breathing room
- `free` — no preset layout (default)

### Size Props

| Component | Sizes |
|---|---|
| `Heading` | `"md"` \| `"lg"` \| `"hero"` |
| `Text` | `"xs"` \| `"sm"` \| `"md"` |
| `GradientText` | `"md"` \| `"lg"` \| `"hero"` \| `"stat"` |
| `Card` pad | `"sm"` \| `"md"` \| `"lg"` |
| `IconCircle` | `"sm"` \| `"md"` \| `"lg"` |
| `Chart` type | `"bar"` \| `"line"` \| `"area"` \| `"pie"` |
| `DataTable` | default \| `compact` |

### Valid Constrained Props

These props only accept specific values. Invalid values fall back to the default but should be fixed.

| Component | Prop | Valid Values | Default |
|---|---|---|---|
| `Split` | `ratio` | `'35/65'` `'40/60'` `'50/50'` `'60/40'` `'65/35'` | `'35/65'` |
| `Animate` | `effect` | `'fade-up'` `'fade-down'` `'fade-left'` `'fade-right'` `'scale'` `'blur-in'` `'slide-left'` `'slide-right'` | `'fade-up'` |
| `Stagger` | `effect` | `'fade-up'` `'fade-down'` `'scale'` | `'fade-up'` |
| `Slide` | `layout` | `'center'` `'split'` `'grid'` `'statement'` `'free'` | `'free'` |
| `Slide` | `bg` | `'none'` `'mesh'` | `'none'` |
| `Grid` | `gap` | `'sm'` `'md'` `'lg'` | `'md'` |
| `Stack` | `gap` | `'xs'` `'sm'` `'md'` `'lg'` `'xl'` | `'md'` |
| `Row` | `gap` | `'xs'` `'sm'` `'md'` `'lg'` | `'md'` |
| `Spacer` | `size` | `'sm'` `'md'` `'lg'` `'xl'` | `'md'` |

### Rules for Primitives

1. **Animation is opt-in** — wrap elements in `<Animate>` or `<Stagger>` only when narratively warranted
2. **You CAN import `framer-motion`** — for custom animations beyond what the toolkit provides
3. **You CAN use React hooks** — `useState`, `useEffect`, etc. for custom interactions
4. **`style` prop for overrides only** — most styling is handled by props
5. **Still use `var(--sm-*)` for colors** — primitives use theme vars internally
6. **Use layout atoms** — prefer `<Grid>`, `<Split>`, `<Stack>`, `<Row>` over manual CSS flex/grid

---

## Theme Variable Reference

All 12 themes define these CSS custom properties. Use them for ALL colors:

| Variable | Purpose | Sunset Example |
|---|---|---|
| `--sm-bg` | Page background | `#1e1b4b` |
| `--sm-surface` | Card/container background | `#312e81` |
| `--sm-text` | Primary text color | `#fef3c7` |
| `--sm-muted` | Secondary/subtle text | `#a5b4fc` |
| `--sm-primary` | Brand/accent color | `#f97316` |
| `--sm-secondary` | Second accent color | `#ec4899` |
| `--sm-accent` | Highlight color | `#fbbf24` |
| `--sm-border` | Border color | `#3730a3` |
| `--sm-glass-bg` | Glassmorphic background | `rgba(49,46,129,0.7)` |
| `--sm-gradient-start` | Gradient start | `#f97316` |
| `--sm-gradient-end` | Gradient end | `#ec4899` |
| `--sm-gradient-mesh-1/2/3/4` | Mesh gradient colors | (theme-specific) |
| `--sm-chart-1` through `--sm-chart-6` | Data visualization colors | (theme-specific) |
| `--sm-success` | Positive status | `#22c55e` |
| `--sm-warning` | Caution status | `#fbbf24` |
| `--sm-danger` | Negative status | `#ef4444` |
| `--sm-shadow-sm/md/lg` | Shadow values | (theme-specific) |
| `--sm-radius` | Border radius | `0.5rem` |
| `--sm-mono-font` | Monospace font | `JetBrains Mono` |

---

## Animation & Interaction Recipes

> **Note:** The animation and interaction toolkits cover most common cases. These recipes are for **custom animations** when you import `framer-motion` directly in deck files.

**When to use the toolkit vs. custom:**
- Toolkit `<Animate effect="fade-up">` — standard entrance effects, no boilerplate
- Toolkit `<CountUp>`, `<TypeWriter>` — purpose-built effects
- Custom `motion.div` — complex choreography, physics springs, layout animations, or anything the toolkit doesn't cover

```tsx
// Custom spring entrance (for playful moments)
<motion.div
  initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
  animate={{ opacity: 1, scale: 1, rotate: 0 }}
  transition={{ type: 'spring', damping: 15 }}
>

// Custom stagger with different effects per child
{items.map((item, i) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: i * 0.2 }}
  />
))}

// Layout animation (for interactive reordering)
<motion.div layout transition={{ type: 'spring', damping: 25 }}>

// Custom interaction (timer, calculator, etc.)
function LiveTimer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return <Heading>{seconds}s</Heading>;
}
```

---

## Research & Data-Heavy Decks

Not every presentation follows a pitch narrative. Research, analysis, and status decks need a different structure and heavier use of data primitives.

### Alternative Narrative Arc

For research and data-driven decks, use this arc instead of the pitch framework:

1. **Context** — Why this research matters now
2. **Hypothesis** — What we set out to prove or discover
3. **Data** — Key metrics and measurements (use `<Chart>` and `<DataTable>`)
4. **Analysis** — What the data tells us (use `<StatBox>` for callout metrics)
5. **Findings** — Conclusions drawn from the analysis
6. **Implications** — What this means for the audience
7. **Recommendations** — Concrete next steps

### When to Use Each Data Primitive

| Primitive | Best for | Example |
|---|---|---|
| `<Chart type="bar">` | Comparing categories | Revenue by region, feature usage counts |
| `<Chart type="line">` | Showing trends over time | Monthly growth, performance over quarters |
| `<Chart type="area">` | Cumulative trends | Total users, stacked revenue streams |
| `<Chart type="pie">` | Part-of-whole breakdown | Market share, budget allocation |
| `<DataTable>` | Exact comparisons | Feature matrices, quarterly metrics, pricing tiers |
| `<StatBox>` | Single headline metric | "45% growth", "$2.3M ARR", "99.9% uptime" |
| `<ProgressReveal>` | Single percentage | Completion rate, goal progress |

### Data Density Rules

- **Max 1 chart + 1 supporting element per slide** (e.g., chart + a row of StatBoxes)
- **Max 1 table per slide** — tables need room to breathe
- **Use `<Chart>` for trends and patterns**, `<DataTable>` for exact values and comparisons
- **Follow a data-heavy slide with a breathing slide** — a key takeaway or implication slide
- **Use `highlight` on DataTable rows** to draw attention to the most important data points

### Chart Usage

```tsx
// Bar chart — comparing categories
<Chart
  type="bar"
  data={[
    { quarter: 'Q1', revenue: 2.1, costs: 1.4 },
    { quarter: 'Q2', revenue: 3.2, costs: 1.8 },
    { quarter: 'Q3', revenue: 4.1, costs: 2.0 },
  ]}
  xKey="quarter"
  series={['revenue', 'costs']}
/>

// Line chart with axes — showing a trend
<Chart type="line" data={monthlyData} xKey="month" series={['users']} showAxes />

// Pie chart — part of whole
<Chart
  type="pie"
  data={[
    { label: 'Enterprise', value: 45 },
    { label: 'SMB', value: 35 },
    { label: 'Consumer', value: 20 },
  ]}
/>
```

### DataTable Usage

```tsx
// Simple comparison table
<DataTable
  headers={['Metric', 'Q1', 'Q2', 'Q3', 'Q4']}
  rows={[
    ['Revenue', '$2.1M', '$3.2M', '$4.1M', '$5.0M'],
    ['Users', '12K', '28K', '45K', '67K'],
    ['Churn', '4.2%', '3.1%', '2.8%', '2.1%'],
  ]}
  highlight={[0]}
/>

// Compact table for dense data
<DataTable
  headers={['Feature', 'Us', 'Competitor A', 'Competitor B']}
  rows={[
    ['API Access', 'Yes', 'Yes', 'No'],
    ['SSO', 'Yes', 'Enterprise only', 'No'],
    ['Custom Reports', 'Yes', 'No', 'Yes'],
  ]}
  compact
/>
```

---

## Layout Patterns

These are **examples to inspire**, not rigid templates. Combine and remix freely.

**Hero** — Centered stack, gradient title, optional badge above, subtitle below. Full breathing room.

**Split** — 50/50 flex layout. Content (text + bullets as icon rows) on one side, visual panel (icon grid, illustration, or decorative element) on the other. Alternate left/right between slides.

**Card Grid** — 2x2 or 3-column grid of glass cards. Each card has an icon (32-48px), a title, and 1-2 lines of description. Stagger the entrance animation.

**Statement** — Single large number or quote, centered, with a decorative background effect (radial gradient, mesh, or geometric pattern using CSS).

**Data Wall** — 3-4 large metric boxes in a row. Each box shows a big number (text-5xl+) with a label below. Color-coded using `--sm-chart-*` variables.

**Section Break** — Ghost number (text-[12rem], 5-10% opacity) positioned absolutely behind the title. Small subtitle below. Creates visual rhythm between sections.

**Timeline** — Horizontal or vertical connected steps. Each step is a glass card with a status indicator (colored dot or icon). Connected by a thin line using `--sm-border`.

**Comparison** — Two columns with contrasting accent colors (e.g., `--sm-danger` for "before" and `--sm-success` for "after"). Each column is a glass card.

---

## Available Themes

The following themes can be specified in the brief. They are applied automatically by the renderer:

`midnight` · `slate` · `canvas` · `signal` · `noir` · `dawn` · `boardroom` · `neon` · `forest` · `glacier` · `sunset` · `paper`

---

## Critical Rules

1. **NEVER modify files in `packages/renderer/`, `packages/primitives/`, or `packages/themes/`** — these are framework internals.
2. **ALL presentation content goes in `decks/<slug>/slides.tsx`** — this is the only file you should create or edit per deck.
3. **Import from `@slidemason/primitives`, `lucide-react`, and optionally `framer-motion`** — use React hooks (`useState`, `useEffect`, etc.) freely for custom interactions.
4. **Every slide needs a unique `key` prop** — React requires this for arrays.
5. **Do not add new dependencies** — everything you need is already installed.
6. **Read ALL files in `decks/<slug>/data/` before generating** — do not skip any source material.
7. **Use TypeScript** — the project is fully typed.
8. **Icon names are PascalCase Lucide icons** — e.g., `Database`, `Shield`, `Zap`, `BarChart3`, `Globe`.
9. **All colors via `var(--sm-*)` variables** — never hardcode hex values like `#fff` or `#000`.
10. **Use `style={{}}` for theme variables** — Tailwind can't read CSS variables at build time. Use `className` for layout (flex, grid, padding) and `style` for colors and dynamic values.
