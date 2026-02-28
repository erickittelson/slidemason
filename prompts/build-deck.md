# Build Deck — Generating MDX Slide Files

This stage converts the outline into actual slide files. Each slide becomes an MDX file in `generated/deck/`, and a `deck.config.json` ties them together.

**Input**: `generated/outline.json` + `generated/brief.json`
**Output**: `generated/deck/*.mdx` + `generated/deck/deck.config.json`

## Steps

1. Read `generated/outline.json`.
2. Read `generated/brief.json` for the title and theme.
3. Create the `generated/deck/` directory if it doesn't exist.
4. For each slide entry in the outline, generate an MDX file.
5. Generate `generated/deck/deck.config.json`.

## File Naming

Each MDX file is named `s{NN}-{type}.mdx` where `NN` is the zero-padded slide number and `type` matches the slide type from the outline.

Examples:
- `s01-title-hero.mdx`
- `s02-agenda.mdx`
- `s03-section-divider.mdx`
- `s04-stat-grid.mdx`
- `s05-two-column-argument.mdx`

## MDX File Structure

Every MDX file follows this structure:

```mdx
import { TemplateName } from '@slidemason/renderer'

<TemplateName
  prop1="value1"
  prop2="value2"
/>
```

Templates are imported from `@slidemason/renderer`. Components are imported from `@slidemason/components`. Most slides only need a template import — templates already compose the underlying components internally.

Use direct component imports only when you need a layout that no template provides.

## Template-to-Type Mapping

| Outline `type` | Template Import | Required Props |
|-----------------|-----------------|----------------|
| `title-hero` | `TitleHero` | `headline`, optional `subheadline` |
| `agenda` | `Agenda` | `headline`, `items` (string array) |
| `section-divider` | `SectionDivider` | `label`, optional `subtitle` |
| `two-column-argument` | `TwoColumnArgument` | `headline`, `leftTitle`, `leftPoints`, `rightTitle`, `rightPoints` |
| `quote-insight` | `QuoteInsight` | `quote`, optional `attribution`, optional `context` |
| `stat-grid` | `StatGridSlide` | `headline`, `stats` (array of `{value, label}`) |
| `image-caption` | `ImageCaption` | `src`, `alt`, optional `headline`, optional `caption` |
| `comparison-table` | `ComparisonTableSlide` | `headline`, `headers` (tuple), `rows` (array of `{label, values}`) |
| `timeline` | `TimelineSlide` | `headline`, `events` (array of `{date, title, description?}`) |
| `roadmap` | `Roadmap` | `headline`, `phases` (string array) |
| `recommendation-ask` | `RecommendationAsk` | `headline`, `recommendation`, optional `supportingPoints` |
| `appendix` | `Appendix` | `headline`, optional `items` (string array) |

See `templates.md` for full prop details and examples.

## Complete MDX Examples

### Title Hero

```mdx
import { TitleHero } from '@slidemason/renderer'

<TitleHero
  headline="Q4 Revenue: Accelerating Into 2027"
  subheadline="Board Review — February 2027"
/>
```

### Stat Grid

```mdx
import { StatGridSlide } from '@slidemason/renderer'

<StatGridSlide
  headline="Q4 by the Numbers"
  stats={[
    { value: "$12.3M", label: "Revenue" },
    { value: "23%", label: "YoY Growth" },
    { value: "94%", label: "Net Retention" },
    { value: "40%", label: "Enterprise Growth" },
  ]}
/>
```

### Two Column Argument

```mdx
import { TwoColumnArgument } from '@slidemason/renderer'

<TwoColumnArgument
  headline="Build vs Buy"
  leftTitle="Build In-House"
  leftPoints={[
    "Full control over roadmap",
    "Deeper integration with existing stack",
    "Higher upfront cost, lower long-term TCO",
  ]}
  rightTitle="Buy Off-the-Shelf"
  rightPoints={[
    "Faster time to market",
    "Proven reliability and support",
    "Lower upfront cost, recurring license fees",
  ]}
/>
```

### Comparison Table

```mdx
import { ComparisonTableSlide } from '@slidemason/renderer'

<ComparisonTableSlide
  headline="Platform Comparison"
  headers={["Our Platform", "Competitor A"]}
  rows={[
    { label: "Uptime", values: ["99.99%", "99.9%"] },
    { label: "Avg Response Time", values: ["45ms", "120ms"] },
    { label: "Price / seat / mo", values: ["$29", "$49"] },
  ]}
/>
```

### Adding Presenter Notes

If the outline includes `notesSeed`, add a `PresenterNotes` component after the template:

```mdx
import { StatGridSlide } from '@slidemason/renderer'
import { PresenterNotes } from '@slidemason/components'

<StatGridSlide
  headline="Q4 by the Numbers"
  stats={[
    { value: "$12.3M", label: "Revenue" },
    { value: "23%", label: "YoY Growth" },
  ]}
/>

<PresenterNotes>
Emphasize that Q4 growth rate is the highest in company history.
Mention that enterprise deals contributed 60% of new revenue.
</PresenterNotes>
```

## deck.config.json

After generating all MDX files, create `generated/deck/deck.config.json`:

```json
{
  "title": "Q4 Revenue: Accelerating Into 2027",
  "theme": "slate",
  "slides": [
    "s01-title-hero.mdx",
    "s02-agenda.mdx",
    "s03-section-divider.mdx",
    "s04-stat-grid.mdx",
    "s05-two-column-argument.mdx",
    "s06-recommendation-ask.mdx"
  ]
}
```

This file validates against `DeckConfigSchema` from `packages/core/src/schemas/deck-config.ts`:

```typescript
DeckConfigSchema = z.object({
  title: z.string(),                 // From brief.title
  theme: z.string().default('slate'), // From outline.theme
  slides: z.array(z.string()),       // Ordered list of MDX filenames
});
```

## Content Density Rules

These rules apply to every slide:

- **Headlines**: Maximum 10 words. Write in active voice. No periods.
- **Bullet points**: Maximum 5 per slide. Maximum 30 words per point.
- **Stats**: Use short values (`$12.3M` not `$12,300,000.00`). Labels under 4 words.
- **Quotes**: Under 40 words. Trim for impact.
- **Images**: Always include an `alt` prop. Keep captions under 15 words.

## Do

- Generate one MDX file per slide entry in the outline.
- Use only templates and components that exist in the codebase.
- Pull content from the outline's `headline`, `copyPoints`, and `notesSeed` fields.
- Ensure `deck.config.json` lists slides in the correct order.
- Format MDX cleanly with proper JSX syntax (self-closing tags, curly braces for arrays/objects).

## Don't

- Put raw text or markdown in MDX files — always use components or templates.
- Import components that a template already includes internally (e.g., don't import `Headline` if you're using `TitleHero`).
- Use HTML tags like `<div>`, `<p>`, or `<h1>` directly — use the Slidemason components.
- Hardcode theme colors — components already reference CSS custom properties.
- Generate MDX files for slides not in the outline.
