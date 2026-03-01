# Data Primitives & UX Trim Design

## Goal

Support content-heavy, research-type presentations by adding `<Chart>` and `<DataTable>` primitives, and reduce decision fatigue in the studio UI by capping every dropdown to 5 options max.

## Architecture

Two new primitives in `packages/primitives/`. UX changes in `apps/studio/src/components/` and `apps/studio/src/lib/fonts.ts`. CLAUDE.md updated with data deck guidance.

---

## New Primitive: `<Chart>`

Thin wrapper around recharts. Auto-themes with `--sm-chart-*` variables.

**File:** `packages/primitives/src/Chart.tsx`

**API:**

```tsx
// Bar, line, or area chart
<Chart
  type="bar"
  data={[
    { label: 'Q1', revenue: 2.1, costs: 1.4 },
    { label: 'Q2', revenue: 3.2, costs: 1.8 },
  ]}
  xKey="label"
  series={['revenue', 'costs']}
  height={300}
/>

// Pie chart
<Chart
  type="pie"
  data={[
    { label: 'Enterprise', value: 45 },
    { label: 'SMB', value: 35 },
    { label: 'Consumer', value: 20 },
  ]}
  height={300}
/>
```

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | `'bar' \| 'line' \| 'area' \| 'pie'` | required | Chart type |
| `data` | `Record<string, string \| number>[]` | required | Data array |
| `xKey` | `string` | `'label'` | Field for x-axis (bar/line/area) |
| `series` | `string[]` | auto-detect | Fields to plot |
| `height` | `number` | `300` | Chart height in px |
| `showAxes` | `boolean` | `false` | Show axis labels |
| `showLegend` | `boolean` | `false` | Show legend |
| `stacked` | `boolean` | `false` | Stack bars/areas |

**Behavior:**

- Series auto-colored: series[0] = `--sm-chart-1`, series[1] = `--sm-chart-2`, etc.
- Tooltip styled with `var(--sm-glass-bg)`, `backdrop-blur`, theme text colors
- No gridlines by default (clean presentation aesthetic)
- Responsive via recharts `ResponsiveContainer`
- Pie chart expects `{ label: string, value: number }` data shape
- Gets `data-pptx-type="chart"` attribute (skipped in PPTX export initially)

**Dependency:** Add `recharts` to `packages/primitives/package.json`.

---

## New Primitive: `<DataTable>`

Styled HTML table with glassmorphic theme integration.

**File:** `packages/primitives/src/DataTable.tsx`

**API:**

```tsx
<DataTable
  headers={['Metric', 'Q1', 'Q2', 'Q3']}
  rows={[
    ['Revenue', '$2.1M', '$3.2M', '$4.1M'],
    ['Users', '12K', '28K', '45K'],
    ['Churn', '4.2%', '3.1%', '2.8%'],
  ]}
  highlight={[0]}
/>
```

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `headers` | `string[]` | required | Column headers |
| `rows` | `string[][]` | required | Row data |
| `highlight` | `number[]` | `[]` | Row indices to accent with primary color |
| `compact` | `boolean` | `false` | Tighter padding for dense data |

**Styling:**

- Table background: `var(--sm-glass-bg)` with `backdrop-blur-sm`
- Border: `1px solid var(--sm-border)`
- Header row: heading font, `var(--sm-muted)` color, uppercase, small font
- Body rows: body font, `var(--sm-text)` color
- Alternating rows: subtle opacity difference for readability
- Highlighted rows: left border accent with `var(--sm-primary)`
- Rounded corners via `var(--sm-radius)`
- Responsive text: `clamp()` sizing
- Gets `data-pptx-type="table"` attribute

---

## UX Trim: Font Picker

**Current:** 15 pairing buttons + 24-option heading select + 22-option body select.

**New:** 5 curated pairing buttons. No custom selects.

```
1. Clean & Modern     — Inter / Inter
2. Bold Impact        — Oswald / DM Sans
3. Startup Vibes      — Space Grotesk / DM Sans
4. Executive Suite    — Playfair Display / Source Sans 3
5. Tech Forward       — Plus Jakarta Sans / IBM Plex Sans
```

**Files changed:**
- `apps/studio/src/lib/fonts.ts` — trim `PAIRINGS` to 5, remove `HEADING_FONTS` and `BODY_FONTS` exports
- `apps/studio/src/components/FontPicker.tsx` — remove custom heading/body selects, show only pairings

---

## UX Trim: BriefForm Dropdowns

All dropdowns capped at 5 options. The `DropdownOrText` component already supports free-text fallback for Audience and Goal.

**Audience** (17 → 5 + free text):
1. Executive leadership
2. Your direct team
3. Investors / VCs
4. Clients / customers
5. Conference attendees

**Goal** (15 → 5 + free text):
1. Get approval (budget/resources/proposal)
2. Share progress / results
3. Pitch for investment
4. Align team on strategy
5. Educate or train

**Duration** (7 → 5):
1. 5 minutes
2. 10 minutes
3. 15 minutes
4. 30 minutes
5. 60 minutes

**Content focus** (7 → 5):
1. Strategic
2. Tactical
3. Educational
4. Persuasive
5. Status update

**No changes needed:** Tone (6 — close enough), Slide count (5), Data density (5), Visual style (6 — close enough).

**File changed:** `apps/studio/src/components/BriefForm.tsx` — trim option arrays inline.

---

## CLAUDE.md Updates

Add to the primitives reference table:

| Component | Purpose | Example |
|---|---|---|
| `<Chart type data>` | Bar/line/area/pie chart | `<Chart type="bar" data={[...]} series={['rev']} />` |
| `<DataTable headers rows>` | Themed data table | `<DataTable headers={[...]} rows={[...]} />` |

Add a "Research & Data-Heavy Decks" section after the existing "Animation & Interaction Recipes":

- Alternative narrative arc: Context → Hypothesis → Data → Analysis → Findings → Implications → Recommendations
- When to use Chart vs. DataTable vs. StatBox (chart for trends, table for comparisons, statbox for single KPIs)
- Data density guideline: max 1 chart + 1 supporting element per slide, or 1 table per slide
- Chart animation: charts animate on slide entrance by default, no extra `<Animate>` wrapper needed

---

## What's NOT in scope

- PPTX export of charts/tables (future work — charts would need screenshot fallback)
- Chart interactivity (hover tooltips are enough, no click-to-drill)
- Sorting/filtering in DataTable (this is a presentation, not a dashboard)
- Removing any themes (all 12 stay)
