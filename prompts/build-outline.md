# Build Outline — Generating outline.json

The outline defines the sequence, type, and intent of every slide in the deck. It is the structural blueprint that the deck-building stage will follow.

**Input**: `generated/brief.json` + source files in `data/`
**Output**: `generated/outline.json`

## Steps

1. Read `generated/brief.json`.
2. Re-read the source files listed in `brief.json`'s `sources` array as needed.
3. Plan a narrative arc for the presentation.
4. For each slide, choose a type, write a headline, and describe the intent.
5. Write `generated/outline.json` conforming to the schema below.

## Schema

The outline must validate against `OutlineSchema` from `packages/core/src/schemas/outline.ts`:

```typescript
const SlideTypes = z.enum([
  'title-hero', 'agenda', 'section-divider', 'two-column-argument',
  'quote-insight', 'stat-grid', 'image-caption', 'comparison-table',
  'timeline', 'roadmap', 'recommendation-ask', 'appendix',
]);

SlideEntrySchema = z.object({
  id: z.string().min(1),             // e.g., "s01", "s02"
  type: SlideTypes,                   // Which template to use
  intent: z.string().min(1),          // What this slide should accomplish
  headline: z.string().min(1),        // The main heading text
  subheadline: z.string().optional(), // Secondary heading text
  components: z.array(z.string()).default([]),  // Components used
  copyPoints: z.array(z.string()).optional(),   // Bullet points or key text
  notesSeed: z.string().optional(),   // Speaker notes seed text
  visual: z.string().optional(),      // Image path or visual description
});

OutlineSchema = z.object({
  theme: z.string().default('slate'), // Theme name
  slides: z.array(SlideEntrySchema).min(1),
});
```

## Available Slide Types

| Type | When to Use |
|------|-------------|
| `title-hero` | Opening slide. Always slide 1. |
| `agenda` | Overview of what the deck will cover. Usually slide 2. |
| `section-divider` | Transition between major sections. |
| `two-column-argument` | Comparing two sides, pros/cons, before/after. |
| `quote-insight` | Highlighting a key quote or insight. |
| `stat-grid` | Displaying 2-4 key metrics prominently. |
| `image-caption` | Featuring an image with optional headline and caption. |
| `comparison-table` | Side-by-side comparison with multiple rows. |
| `timeline` | Chronological sequence of events or milestones. |
| `roadmap` | Phased plan or numbered sequence of steps. |
| `recommendation-ask` | Call to action, recommendation, or decision request. Usually near the end. |
| `appendix` | Supplementary material. Always last if present. |

## Narrative Arc

Structure the presentation as a story:

```
Opening → Context → Evidence → Insight → Action
```

1. **Opening** (1-2 slides): `title-hero`, optionally `agenda`
   - Hook the audience. State the topic and why it matters.

2. **Context** (1-3 slides): `section-divider`, `two-column-argument`, `image-caption`
   - Set the stage. What is the situation? What has changed?

3. **Evidence** (3-6 slides): `stat-grid`, `comparison-table`, `timeline`, `two-column-argument`
   - Present the data. Build the argument with facts.

4. **Insight** (1-2 slides): `quote-insight`, `stat-grid`, `section-divider`
   - Synthesize. What does the evidence mean?

5. **Action** (1-2 slides): `recommendation-ask`, `roadmap`
   - What should the audience do? What happens next?

6. **Appendix** (0-1 slides): `appendix`
   - Optional. Additional detail for reference.

## Content Density Rules

- **Slide count**: Aim for 8-15 slides. Under 8 feels thin. Over 15 feels exhausting.
- **Bullet points**: Maximum 5 per slide. Prefer 3.
- **Words per point**: Maximum 30. Prefer under 20.
- **Stats per stat-grid**: 2-4 stats. Never more than 4.
- **Timeline events**: 3-6 per timeline. More than 6 requires splitting across slides.
- **Comparison rows**: 3-5 rows per comparison table.

## Slide Sequencing Principles

- Always start with `title-hero`.
- Use `section-divider` to separate major sections (every 3-5 slides).
- Don't use the same slide type consecutively unless the content demands it.
- Place `recommendation-ask` near the end, before any appendix.
- If you have an `agenda`, mirror its structure in the section dividers.

## Example Output

```json
{
  "theme": "slate",
  "slides": [
    {
      "id": "s01",
      "type": "title-hero",
      "intent": "Set the stage and establish the presentation's focus",
      "headline": "Q4 Revenue: Accelerating Into 2027",
      "subheadline": "Board Review — February 2027"
    },
    {
      "id": "s02",
      "type": "agenda",
      "intent": "Preview the three key topics to set expectations",
      "headline": "Today's Agenda",
      "components": ["NumberedSteps"],
      "copyPoints": [
        "Q4 performance highlights",
        "Enterprise segment deep-dive",
        "2027 investment proposal"
      ]
    },
    {
      "id": "s03",
      "type": "section-divider",
      "intent": "Transition into the Q4 results section",
      "headline": "Q4 Performance"
    },
    {
      "id": "s04",
      "type": "stat-grid",
      "intent": "Show the top-line Q4 numbers at a glance",
      "headline": "Q4 by the Numbers",
      "components": ["StatGrid"],
      "copyPoints": ["$12.3M revenue", "23% YoY growth", "94% retention", "40% enterprise growth"]
    },
    {
      "id": "s05",
      "type": "two-column-argument",
      "intent": "Contrast Q3 and Q4 to show acceleration",
      "headline": "Quarter-over-Quarter Momentum",
      "components": ["TwoColumn", "BulletGroup"],
      "copyPoints": [
        "Q3: Steady growth, 18% YoY",
        "Q3: 12 new logos",
        "Q4: Accelerated to 23% YoY",
        "Q4: 19 new logos including 3 Fortune 500"
      ]
    },
    {
      "id": "s06",
      "type": "recommendation-ask",
      "intent": "Present the investment proposal and request board approval",
      "headline": "The Ask",
      "components": ["Subheadline", "BulletGroup"],
      "copyPoints": [
        "Approve $8M growth investment for 2027",
        "Expand enterprise sales team by 40%",
        "Launch APAC market entry in Q2"
      ],
      "notesSeed": "Emphasize that this investment is funded by Q4 cash flow, not new capital"
    }
  ]
}
```

## Do

- Write a clear `intent` for every slide — this guides the deck builder.
- Include `copyPoints` for any slide that has text content (bullets, stats, steps).
- Choose `components` that match the slide type (see `components.md` for the full list).
- Use the `notesSeed` field for important talking points the presenter should remember.

## Don't

- Create slides without a clear purpose. Every slide must earn its place.
- Put too much content on one slide. Split into two slides if needed.
- Repeat the same headline across multiple slides.
- Use `visual` for non-image slides — it's only for `image-caption` slides.
- Forget to set the `theme` field (defaults to `"slate"` if omitted).
