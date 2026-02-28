# Components Reference

All 16 presentation components are in `packages/components/`. Import from `@slidemason/components`.

```typescript
import { Headline, Subheadline, BulletGroup /* ... */ } from '@slidemason/components'
```

Most slides should use **templates** (see `templates.md`) rather than composing components directly. Use components directly only when no template fits your layout.

---

## Core Layout Components (7)

### Headline

Large primary heading for a slide.

```typescript
interface HeadlineProps {
  children: ReactNode;
  className?: string;
}
```

```mdx
<Headline>Q4 Revenue Highlights</Headline>
```

Renders an `<h1>` styled with `text-5xl font-bold`, colored by `--sm-text`.

---

### Subheadline

Secondary heading, smaller and lighter than Headline.

```typescript
interface SubheadlineProps {
  children: ReactNode;
  className?: string;
}
```

```mdx
<Subheadline>Board Review — February 2027</Subheadline>
```

Renders an `<h2>` styled with `text-2xl font-medium`, colored by `--sm-muted`.

---

### BulletGroup

Unordered list with styled bullet markers.

```typescript
interface BulletGroupProps {
  items: string[];
  className?: string;
}
```

```mdx
<BulletGroup items={[
  "Revenue grew 23% year-over-year",
  "Three new Fortune 500 customers signed",
  "Net retention rate at 94%",
]} />
```

Each bullet is a colored circle (`--sm-primary`) followed by text (`--sm-text`). Maximum 5 items recommended.

---

### NumberedSteps

Ordered list with numbered circle markers.

```typescript
interface NumberedStepsProps {
  steps: string[];
  className?: string;
}
```

```mdx
<NumberedSteps steps={[
  "Assess current market position",
  "Identify expansion opportunities",
  "Build and execute go-to-market plan",
]} />
```

Each step has a numbered circle (`--sm-primary` background, `--sm-bg` text) followed by step text.

---

### TwoColumn

Generic two-column layout. Each column accepts any ReactNode.

```typescript
interface TwoColumnProps {
  left: ReactNode;
  right: ReactNode;
  className?: string;
}
```

```mdx
<TwoColumn
  left={<BulletGroup items={["Point A", "Point B"]} />}
  right={<BulletGroup items={["Point C", "Point D"]} />}
/>
```

Columns are equal width with an 8-unit gap. Use the `TwoColumnArgument` template instead for most two-column slides — it handles headlines and column titles automatically.

---

### ThreeCard

Grid of exactly 3 content cards.

```typescript
interface ThreeCardProps {
  cards: Array<{ title: string; content: string }>;
  className?: string;
}
```

```mdx
<ThreeCard cards={[
  { title: "Speed", content: "45ms average response time" },
  { title: "Reliability", content: "99.99% uptime SLA" },
  { title: "Scale", content: "10M requests per second" },
]} />
```

Each card is a bordered box (`--sm-border`, `--sm-surface` background) with a bold title and muted content text.

---

### SectionLabel

Centered divider line with a label. Used in `SectionDivider` template.

```typescript
interface SectionLabelProps {
  label: string;
  className?: string;
}
```

```mdx
<SectionLabel label="Key Findings" />
```

Renders horizontal lines on either side of uppercase, tracked-out label text (`--sm-muted`).

---

## Data Display Components (9)

### StatCard

Single statistic with a large value and a label.

```typescript
interface StatCardProps {
  value: string;
  label: string;
  className?: string;
}
```

```mdx
<StatCard value="$12.3M" label="Revenue" />
```

Centered card with `--sm-surface` background, `--sm-primary` value, `--sm-muted` label. Typically used inside `StatGrid` rather than standalone.

---

### StatGrid

Grid of 2-4 stat cards.

```typescript
interface StatGridProps {
  stats: Array<{ value: string; label: string }>;
  className?: string;
}
```

```mdx
<StatGrid stats={[
  { value: "$12.3M", label: "Revenue" },
  { value: "23%", label: "YoY Growth" },
  { value: "94%", label: "Net Retention" },
]} />
```

Automatically adjusts columns: 2 stats = 2 columns, 3 stats = 3 columns, 4+ stats = 4 columns.

---

### QuoteCallout

Styled blockquote with optional attribution.

```typescript
interface QuoteCalloutProps {
  quote: string;
  attribution?: string;
  className?: string;
}
```

```mdx
<QuoteCallout
  quote="The best way to predict the future is to create it."
  attribution="Peter Drucker"
/>
```

Left-bordered blockquote (`--sm-primary` border), italic quote text, muted attribution with em-dash.

---

### ImagePanel

Image display with optional caption.

```typescript
interface ImagePanelProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}
```

```mdx
<ImagePanel
  src="data/product-screenshot.png"
  alt="Product dashboard showing key metrics"
  caption="The new analytics dashboard (v3.2)"
/>
```

Full-width image with rounded corners (`--sm-radius`), centered muted caption below.

---

### KPIStrip

Horizontal row of key performance indicators. More compact than StatGrid.

```typescript
interface KPIStripProps {
  kpis: Array<{ value: string; label: string }>;
  className?: string;
}
```

```mdx
<KPIStrip kpis={[
  { value: "99.9%", label: "Uptime" },
  { value: "45ms", label: "Latency" },
  { value: "10M", label: "Daily Requests" },
]} />
```

Horizontally spaced KPIs with `--sm-primary` values and `--sm-muted` uppercase labels. Best for 2-5 KPIs as a supporting strip, not the main focus.

---

### TimelineRow

Single event in a timeline. Used inside `TimelineSlide` template.

```typescript
interface TimelineRowProps {
  date: string;
  title: string;
  description?: string;
  className?: string;
}
```

```mdx
<TimelineRow
  date="Q1 2027"
  title="APAC Launch"
  description="Open Tokyo and Singapore offices"
/>
```

Fixed-width date column (`--sm-primary`), vertical border line (`--sm-border`), title and optional description.

---

### ComparisonMatrix

Two-column comparison table with row labels.

```typescript
interface ComparisonMatrixProps {
  headers: [string, string];
  rows: Array<{ label: string; values: [string, string] }>;
  className?: string;
}
```

```mdx
<ComparisonMatrix
  headers={["Our Platform", "Competitor"]}
  rows={[
    { label: "Uptime", values: ["99.99%", "99.9%"] },
    { label: "Latency", values: ["45ms", "120ms"] },
    { label: "Price", values: ["$29/mo", "$49/mo"] },
  ]}
/>
```

Full-width table with `--sm-border` row separators, `--sm-primary` column headers, `--sm-text` body text.

---

### FooterMark

Small, subtle text for slide footers (confidentiality notices, page numbers, branding).

```typescript
interface FooterMarkProps {
  text: string;
  className?: string;
}
```

```mdx
<FooterMark text="Confidential — Do Not Distribute" />
```

Extra-small muted text at 60% opacity. Place at the bottom of a slide layout.

---

### PresenterNotes

Hidden speaker notes. Not rendered on screen during presentation, but available in presenter view.

```typescript
interface PresenterNotesProps {
  children: ReactNode;
}
```

```mdx
<PresenterNotes>
Key talking point: Our retention rate is best-in-class.
Mention the three new Fortune 500 logos by name if the audience asks.
</PresenterNotes>
```

Rendered as a hidden `<aside>` with `data-presenter-notes="true"`. Always placed after the main slide template.
