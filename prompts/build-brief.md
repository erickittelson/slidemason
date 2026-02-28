# Build Brief — Generating brief.json

The brief is a structured summary of what the presentation is about. It captures the who, what, why, and how before any slides are planned.

**Input**: `generated/manifest.json` + the actual source files in `data/`
**Output**: `generated/brief.json`

## Steps

1. Read `generated/manifest.json` to get the file list.
2. Read the contents of every source file listed in the manifest.
3. Analyze the source material to identify title, audience, goal, tone, themes, and constraints.
4. Write `generated/brief.json` conforming to the schema below.

## Schema

The brief must validate against `BriefSchema` from `packages/core/src/schemas/brief.ts`:

```typescript
BriefSchema = z.object({
  title: z.string().min(1),      // Required. The presentation title.
  audience: z.string().min(1),   // Required. Who will see this.
  goal: z.string().min(1),       // Required. What the presentation should achieve.
  tone: z.string().min(1),       // Required. The communication style.
  themes: z.array(z.string()),   // Key topics or threads.
  sources: z.array(z.object({    // Summary of each source file.
    file: z.string(),
    type: z.string(),
    summary: z.string(),
  })),
  constraints: z.array(z.string()).default([]),  // Optional limits or requirements.
});
```

### Example Output

```json
{
  "title": "Q4 Revenue Performance and 2027 Outlook",
  "audience": "Board of directors and C-suite executives with financial background",
  "goal": "Secure approval for the 2027 growth investment plan by demonstrating Q4 momentum",
  "tone": "Confident, data-driven, executive-level",
  "themes": [
    "Revenue growth acceleration in Q4",
    "Enterprise segment outperformance",
    "Investment thesis for 2027 expansion"
  ],
  "sources": [
    {
      "file": "data/q4-summary.md",
      "type": "markdown",
      "summary": "Narrative overview of Q4 results: 23% YoY revenue growth, enterprise deals up 40%, three new Fortune 500 logos"
    },
    {
      "file": "data/financials.csv",
      "type": "csv",
      "summary": "Monthly revenue, ARR, and margin data for Q1-Q4. Shows consistent upward trend with Q4 acceleration"
    },
    {
      "file": "data/team-photo.jpg",
      "type": "image",
      "summary": "Team photograph, usable as a visual element on culture or team slides"
    }
  ],
  "constraints": [
    "Must be presentable in under 20 minutes",
    "Board prefers no more than 12 slides"
  ]
}
```

## Good vs Bad Briefs

### Good Brief Fields

**audience**: "Series B investors evaluating a SaaS company with $5M ARR, familiar with PLG metrics"
- Specific about who they are, their context, and their knowledge level.

**goal**: "Convince investors to lead a $20M Series B by showing capital-efficient growth and a clear path to $50M ARR"
- States the desired outcome and the mechanism for achieving it.

**tone**: "Ambitious but grounded, backed by metrics, storytelling where it reinforces the data"
- Describes a specific communication style, not a generic adjective.

### Bad Brief Fields

**audience**: "Business stakeholders"
- Too vague. Which stakeholders? What do they know? What do they care about?

**goal**: "Inform the audience about our progress"
- No desired outcome. "Inform" is not a goal — what should they *do* after seeing this?

**tone**: "Professional"
- Every presentation should be professional. This adds no guidance.

## How to Extract Each Field

**title** — Look for an explicit title in the source material (first heading of the main markdown file). If none exists, synthesize one that captures the core message in under 10 words.

**audience** — Look for clues: who is the document written for? What jargon is used? What is assumed as known? If unclear, default to "general business audience" but flag this as a constraint.

**goal** — What decision or action should result from this presentation? Look for recommendations, asks, or calls to action in the source material.

**tone** — Infer from the writing style of the source material. Is it formal or casual? Data-heavy or narrative? Urgent or reflective?

**themes** — Identify 2-5 distinct threads or topics that the presentation should cover. These become the backbone of the outline.

**sources** — For each file in the manifest, write a 1-2 sentence summary of what it contains and how it's useful for the presentation.

**constraints** — Note any explicit limitations mentioned in the source material (time limits, slide count, branding requirements). Also add practical constraints you infer (e.g., if there are 50 data points, note "data-heavy; will need to summarize").

## Do

- Read every source file, not just the first one.
- Be specific in every field — vague briefs produce vague decks.
- Include all source files in the `sources` array, even if some are less relevant.
- Set `constraints` to an empty array `[]` if there are none — do not omit the field.

## Don't

- Copy-paste raw source text into the brief. Summarize and synthesize.
- Leave `audience` or `goal` generic. If the source material doesn't specify, make a reasonable inference and note it as a constraint.
- Add themes that aren't supported by the source material.
