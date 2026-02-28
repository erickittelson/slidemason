# Templates Reference

All 12 slide templates are in `packages/renderer/src/templates/`. Import from `@slidemason/renderer`.

```typescript
import { TitleHero, Agenda, SectionDivider /* ... */ } from '@slidemason/renderer'
```

Templates compose components from `@slidemason/components` into full slide layouts. Always prefer a template over manually composing components.

---

## TitleHero

**When to use**: Opening slide. Always slide 1.

```typescript
interface TitleHeroProps {
  headline: string;
  subheadline?: string;
}
```

```mdx
import { TitleHero } from '@slidemason/renderer'

<TitleHero
  headline="Q4 Revenue: Accelerating Into 2027"
  subheadline="Board Review — February 2027"
/>
```

**Layout**: Vertically and horizontally centered. Headline above subheadline with a gap.

**Tips**:
- Keep the headline under 8 words.
- Use the subheadline for date, audience, or event name.
- Do not add bullet points or data to a title slide.

---

## Agenda

**When to use**: Slide 2, to preview the presentation's structure.

```typescript
interface AgendaProps {
  headline: string;
  items: string[];
}
```

```mdx
import { Agenda } from '@slidemason/renderer'

<Agenda
  headline="Today's Agenda"
  items={[
    "Q4 performance highlights",
    "Enterprise segment deep-dive",
    "2027 investment proposal",
  ]}
/>
```

**Layout**: Headline at top, numbered steps below using `NumberedSteps` component.

**Tips**:
- Use 3-5 items. Fewer than 3 doesn't justify an agenda slide. More than 5 is hard to remember.
- Each item should correspond to a section in the deck.
- Phrase items as topics, not sentences ("Market analysis" not "We will analyze the market").

---

## SectionDivider

**When to use**: Transition between major sections. Place every 3-5 content slides.

```typescript
interface SectionDividerProps {
  label: string;
  subtitle?: string;
}
```

```mdx
import { SectionDivider } from '@slidemason/renderer'

<SectionDivider
  label="Key Findings"
  subtitle="What the data tells us about Q4 performance"
/>
```

**Layout**: Centered label with decorative horizontal lines, optional subtitle below.

**Tips**:
- Labels should match or closely mirror the agenda items.
- Keep labels to 2-4 words.
- Use subtitle sparingly — only when the section needs additional context.

---

## TwoColumnArgument

**When to use**: Comparing two sides, pros/cons, before/after, options A vs B.

```typescript
interface TwoColumnArgumentProps {
  headline: string;
  leftTitle: string;
  leftPoints: string[];
  rightTitle: string;
  rightPoints: string[];
}
```

```mdx
import { TwoColumnArgument } from '@slidemason/renderer'

<TwoColumnArgument
  headline="Build vs Buy"
  leftTitle="Build In-House"
  leftPoints={[
    "Full control over roadmap",
    "Deeper integration",
    "Higher upfront cost",
  ]}
  rightTitle="Buy Off-the-Shelf"
  rightPoints={[
    "Faster time to market",
    "Proven reliability",
    "Recurring license fees",
  ]}
/>
```

**Layout**: Headline at top, two equal columns below, each with a colored title (`--sm-primary`) and bullet list.

**Tips**:
- Keep left and right point counts balanced (same number or differ by 1).
- Column titles should be parallel in structure ("Build" / "Buy", not "Building" / "Purchasing").
- Maximum 4 points per column.

---

## QuoteInsight

**When to use**: Highlighting a powerful quote, customer testimonial, or key insight.

```typescript
interface QuoteInsightProps {
  quote: string;
  attribution?: string;
  context?: string;
}
```

```mdx
import { QuoteInsight } from '@slidemason/renderer'

<QuoteInsight
  quote="The best way to predict the future is to create it."
  attribution="Peter Drucker"
  context="This philosophy drives our approach to product development."
/>
```

**Layout**: Centered blockquote with left border, attribution below, optional context paragraph.

**Tips**:
- Keep quotes under 40 words. Trim for impact.
- Always attribute quotes. Use "Internal research" or "Customer interview" for unattributed quotes.
- Use `context` to connect the quote to the presentation's narrative.

---

## StatGridSlide

**When to use**: Displaying 2-4 key metrics prominently.

```typescript
interface StatGridSlideProps {
  headline: string;
  stats: Array<{ value: string; label: string }>;
}
```

```mdx
import { StatGridSlide } from '@slidemason/renderer'

<StatGridSlide
  headline="Q4 by the Numbers"
  stats={[
    { value: "$12.3M", label: "Revenue" },
    { value: "23%", label: "YoY Growth" },
    { value: "94%", label: "Net Retention" },
  ]}
/>
```

**Layout**: Headline at top, stat cards in a responsive grid below (2-4 columns based on count).

**Tips**:
- Use 2-4 stats. Never more than 4 — it dilutes impact.
- Format values concisely: `$12.3M` not `$12,300,000`. `23%` not `23 percent`.
- Labels should be 1-3 words.
- Order stats by importance (most impactful first) or by narrative flow.

---

## ImageCaption

**When to use**: Featuring a photograph, screenshot, diagram, or chart.

```typescript
interface ImageCaptionProps {
  headline?: string;
  src: string;
  alt: string;
  caption?: string;
}
```

```mdx
import { ImageCaption } from '@slidemason/renderer'

<ImageCaption
  headline="The New Dashboard"
  src="data/dashboard-screenshot.png"
  alt="Analytics dashboard showing key performance metrics"
  caption="Version 3.2, launched January 2027"
/>
```

**Layout**: Optional headline at top, centered image with rounded corners, optional caption below.

**Tips**:
- Always provide a descriptive `alt` text.
- The `src` path should reference an image file from `data/` (check the manifest).
- Keep captions under 15 words.
- Omit `headline` if the image is self-explanatory.

---

## ComparisonTableSlide

**When to use**: Side-by-side comparison with multiple criteria/rows.

```typescript
interface ComparisonTableSlideProps {
  headline: string;
  headers: [string, string];
  rows: Array<{ label: string; values: [string, string] }>;
}
```

```mdx
import { ComparisonTableSlide } from '@slidemason/renderer'

<ComparisonTableSlide
  headline="Platform Comparison"
  headers={["Our Platform", "Competitor A"]}
  rows={[
    { label: "Uptime", values: ["99.99%", "99.9%"] },
    { label: "Avg Latency", values: ["45ms", "120ms"] },
    { label: "Price / seat", values: ["$29/mo", "$49/mo"] },
  ]}
/>
```

**Layout**: Headline at top, full-width table below with row borders.

**Tips**:
- Use 3-5 rows. More than 5 gets hard to read on a slide.
- Put your preferred option as the first header (left column).
- Use consistent units across each row.
- Keep cell values short — under 5 words per cell.

---

## TimelineSlide

**When to use**: Showing a chronological sequence of events or milestones.

```typescript
interface TimelineSlideProps {
  headline: string;
  events: Array<{ date: string; title: string; description?: string }>;
}
```

```mdx
import { TimelineSlide } from '@slidemason/renderer'

<TimelineSlide
  headline="Product Roadmap"
  events={[
    { date: "Q1 2027", title: "APAC Launch", description: "Tokyo and Singapore offices" },
    { date: "Q2 2027", title: "Platform v4.0", description: "AI-powered analytics" },
    { date: "Q3 2027", title: "Enterprise Tier", description: "SSO, SCIM, audit logs" },
    { date: "Q4 2027", title: "IPO Readiness", description: "SOC 2 Type II certification" },
  ]}
/>
```

**Layout**: Headline at top, vertical timeline of events with date on the left and title/description on the right.

**Tips**:
- Use 3-6 events. More than 6 should be split across slides.
- Keep dates short: "Q1 2027", "Jan 2027", "2026" — not "January 15th, 2027".
- Descriptions are optional — omit them for a cleaner look if the title is sufficient.

---

## Roadmap

**When to use**: Showing a phased plan or sequential steps.

```typescript
interface RoadmapProps {
  headline: string;
  phases: string[];
}
```

```mdx
import { Roadmap } from '@slidemason/renderer'

<Roadmap
  headline="Implementation Plan"
  phases={[
    "Phase 1: Discovery and requirements (4 weeks)",
    "Phase 2: Build core platform (8 weeks)",
    "Phase 3: Beta testing with 5 customers (4 weeks)",
    "Phase 4: General availability launch",
  ]}
/>
```

**Layout**: Headline at top, numbered steps below using `NumberedSteps` component.

**Tips**:
- Use 3-6 phases. More than 6 is too detailed for a slide — put details in an appendix.
- Include timeframes when known.
- Phrase each phase as a clear action or milestone.
- Differs from `Agenda` in intent: Roadmap is about what happens next, Agenda is about what this deck covers.

---

## RecommendationAsk

**When to use**: Call to action, decision request, or recommendation. Usually the second-to-last slide.

```typescript
interface RecommendationAskProps {
  headline: string;
  recommendation: string;
  supportingPoints?: string[];
}
```

```mdx
import { RecommendationAsk } from '@slidemason/renderer'

<RecommendationAsk
  headline="Our Recommendation"
  recommendation="Approve the $8M growth investment for 2027"
  supportingPoints={[
    "Funded entirely by Q4 cash flow",
    "Expected 3x ROI within 18 months",
    "Aligned with board-approved strategic plan",
  ]}
/>
```

**Layout**: Headline at top, recommendation in a bordered surface box, optional supporting bullet list below.

**Tips**:
- The `recommendation` should be a single, clear sentence.
- Supporting points should answer "why should we do this?"
- Maximum 4 supporting points.
- This is the most important slide — make it decisive, not hedging.

---

## Appendix

**When to use**: Supplementary detail, references, or methodology notes. Always the last slide if present.

```typescript
interface AppendixProps {
  headline: string;
  items?: string[];
}
```

```mdx
import { Appendix } from '@slidemason/renderer'

<Appendix
  headline="Appendix: Data Sources"
  items={[
    "Revenue data: Internal finance system (audited)",
    "Market data: Gartner Q4 2026 report",
    "Customer survey: NPS survey, n=1,247, December 2026",
  ]}
/>
```

**Layout**: Headline at top, optional bullet list below.

**Tips**:
- Use for material that supports the main deck but doesn't belong in the flow.
- Common uses: data sources, methodology, detailed breakdowns, glossary.
- Keep it to one slide. If you need more, the content should be in the main deck.
