# Data Primitives & UX Trim Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add `<Chart>` and `<DataTable>` primitives for data-heavy presentations, and trim all studio dropdowns to max 5 options.

**Architecture:** Two new React components in `packages/primitives/src/` following the existing pattern (theme CSS variables, `data-pptx-type` attributes, clamp() responsive sizing). UX changes are array trims in `apps/studio/`. `<Chart>` wraps recharts with theme-aware defaults. `<DataTable>` is a styled HTML table.

**Tech Stack:** React, recharts (new dependency), CSS custom properties, TypeScript

---

### Task 1: Install recharts dependency

**Files:**
- Modify: `packages/primitives/package.json`

**Step 1: Add recharts to primitives package**

```bash
cd /Users/erickittelson/qvl-code/slidemason/packages/primitives && pnpm add recharts
```

**Step 2: Verify it installed**

Run: `cd /Users/erickittelson/qvl-code/slidemason/packages/primitives && pnpm list recharts`
Expected: Shows recharts version

**Step 3: Commit**

```bash
cd /Users/erickittelson/qvl-code/slidemason
git add packages/primitives/package.json pnpm-lock.yaml
git commit -m "feat: add recharts dependency to primitives package"
```

---

### Task 2: Create `<Chart>` primitive

**Files:**
- Create: `packages/primitives/src/Chart.tsx`
- Modify: `packages/primitives/src/index.ts`

**Step 1: Create Chart.tsx**

Create `packages/primitives/src/Chart.tsx` with this exact content:

```tsx
import {
  ResponsiveContainer,
  BarChart, Bar,
  LineChart, Line,
  AreaChart, Area,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend,
} from 'recharts';

/* ── Theme color reader ── */

function getChartColors(): string[] {
  if (typeof window === 'undefined') {
    return ['#8b5cf6', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4'];
  }
  const style = getComputedStyle(document.documentElement);
  return [1, 2, 3, 4, 5, 6].map(
    (i) => style.getPropertyValue(`--sm-chart-${i}`).trim() || '#8b5cf6',
  );
}

function getThemeColor(varName: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || fallback;
}

/* ── Tooltip ── */

function ThemedTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: getThemeColor('--sm-glass-bg', 'rgba(0,0,0,0.8)'),
        backdropFilter: 'blur(12px)',
        border: `1px solid ${getThemeColor('--sm-border', '#333')}`,
        borderRadius: getThemeColor('--sm-radius', '0.5rem'),
        padding: '8px 12px',
        fontSize: '0.75rem',
        color: getThemeColor('--sm-text', '#fff'),
      }}
    >
      {label && <div style={{ fontWeight: 600, marginBottom: '4px' }}>{label}</div>}
      {payload.map((entry: any, i: number) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: entry.color, flexShrink: 0 }} />
          <span style={{ color: getThemeColor('--sm-muted', '#aaa') }}>{entry.name}:</span>
          <span style={{ fontWeight: 600 }}>{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Props ── */

interface ChartProps {
  type: 'bar' | 'line' | 'area' | 'pie';
  data: Record<string, string | number>[];
  xKey?: string;
  series?: string[];
  height?: number;
  showAxes?: boolean;
  showLegend?: boolean;
  stacked?: boolean;
  style?: React.CSSProperties;
}

/* ── Component ── */

export function Chart({
  type,
  data,
  xKey = 'label',
  series: seriesProp,
  height = 300,
  showAxes = false,
  showLegend = false,
  stacked = false,
  style,
}: ChartProps) {
  const colors = getChartColors();

  // Auto-detect series keys: all numeric fields except xKey
  const series = seriesProp || (data.length > 0
    ? Object.keys(data[0]).filter(k => k !== xKey && typeof data[0][k] === 'number')
    : []);

  const axisColor = getThemeColor('--sm-muted', '#666');
  const axisProps = {
    tick: { fill: axisColor, fontSize: 11 },
    axisLine: { stroke: axisColor, strokeOpacity: 0.3 },
    tickLine: false,
  };

  if (type === 'pie') {
    return (
      <div data-pptx-type="chart" data-pptx-chart-type="pie" style={style}>
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey={xKey}
              cx="50%"
              cy="50%"
              outerRadius="80%"
              strokeWidth={0}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <RechartsTooltip content={<ThemedTooltip />} />
            {showLegend && <Legend />}
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  const ChartContainer = type === 'bar' ? BarChart : type === 'area' ? AreaChart : LineChart;
  const SeriesComponent = type === 'bar' ? Bar : type === 'area' ? Area : Line;

  return (
    <div data-pptx-type="chart" data-pptx-chart-type={type} style={style}>
      <ResponsiveContainer width="100%" height={height}>
        <ChartContainer data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          {showAxes && <CartesianGrid strokeDasharray="3 3" stroke={axisColor} strokeOpacity={0.15} />}
          <XAxis dataKey={xKey} {...axisProps} hide={!showAxes} />
          <YAxis {...axisProps} hide={!showAxes} />
          <RechartsTooltip content={<ThemedTooltip />} />
          {showLegend && <Legend />}
          {series.map((key, i) => {
            const color = colors[i % colors.length];
            if (type === 'bar') {
              return (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={color}
                  radius={[4, 4, 0, 0]}
                  stackId={stacked ? 'stack' : undefined}
                />
              );
            }
            if (type === 'area') {
              return (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={color}
                  fill={color}
                  fillOpacity={0.2}
                  strokeWidth={2}
                  stackId={stacked ? 'stack' : undefined}
                />
              );
            }
            return (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={color}
                strokeWidth={2}
                dot={{ r: 3, fill: color }}
                activeDot={{ r: 5 }}
              />
            );
          })}
        </ChartContainer>
      </ResponsiveContainer>
    </div>
  );
}
```

**Step 2: Add export to index.ts**

In `packages/primitives/src/index.ts`, add this line after the `Spotlight` export (line 33):

```ts
export { Chart } from './Chart';
```

**Step 3: Verify it compiles**

Run: `cd /Users/erickittelson/qvl-code/slidemason/packages/primitives && pnpm run build`
Expected: Clean compilation, no errors

**Step 4: Commit**

```bash
cd /Users/erickittelson/qvl-code/slidemason
git add packages/primitives/src/Chart.tsx packages/primitives/src/index.ts
git commit -m "feat: add Chart primitive (bar/line/area/pie) with theme integration"
```

---

### Task 3: Create `<DataTable>` primitive

**Files:**
- Create: `packages/primitives/src/DataTable.tsx`
- Modify: `packages/primitives/src/index.ts`

**Step 1: Create DataTable.tsx**

Create `packages/primitives/src/DataTable.tsx` with this exact content:

```tsx
interface DataTableProps {
  headers: string[];
  rows: string[][];
  highlight?: number[];
  compact?: boolean;
  style?: React.CSSProperties;
}

export function DataTable({
  headers,
  rows,
  highlight = [],
  compact = false,
  style,
}: DataTableProps) {
  const cellPad = compact
    ? 'clamp(0.3rem, 0.6vw, 0.5rem) clamp(0.5rem, 1vw, 0.75rem)'
    : 'clamp(0.5rem, 1vw, 0.75rem) clamp(0.75rem, 1.5vw, 1.25rem)';

  return (
    <div
      data-pptx-type="table"
      style={{
        overflow: 'hidden',
        borderRadius: 'var(--sm-radius)',
        border: '1px solid var(--sm-border)',
        background: 'var(--sm-glass-bg)',
        backdropFilter: 'blur(12px)',
        ...style,
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: compact ? 'clamp(0.65rem, 0.9vw, 0.8rem)' : 'clamp(0.75rem, 1vw, 0.9rem)',
        }}
      >
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                style={{
                  padding: cellPad,
                  textAlign: 'left',
                  color: 'var(--sm-muted)',
                  fontWeight: 600,
                  fontSize: 'clamp(0.6rem, 0.8vw, 0.75rem)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  borderBottom: '1px solid var(--sm-border)',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => {
            const isHighlighted = highlight.includes(ri);
            return (
              <tr
                key={ri}
                style={{
                  borderBottom: ri < rows.length - 1 ? '1px solid var(--sm-border)' : undefined,
                  background: isHighlighted
                    ? 'rgba(139,92,246,0.1)'
                    : ri % 2 === 1
                      ? 'rgba(255,255,255,0.02)'
                      : undefined,
                }}
              >
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    style={{
                      padding: cellPad,
                      color: isHighlighted ? 'var(--sm-text)' : ci === 0 ? 'var(--sm-text)' : 'var(--sm-muted)',
                      fontWeight: ci === 0 || isHighlighted ? 500 : 400,
                      borderLeft: isHighlighted && ci === 0
                        ? '3px solid var(--sm-primary)'
                        : undefined,
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
```

**Step 2: Add export to index.ts**

In `packages/primitives/src/index.ts`, add this line after the `Chart` export:

```ts
export { DataTable } from './DataTable';
```

**Step 3: Verify it compiles**

Run: `cd /Users/erickittelson/qvl-code/slidemason/packages/primitives && pnpm run build`
Expected: Clean compilation, no errors

**Step 4: Commit**

```bash
cd /Users/erickittelson/qvl-code/slidemason
git add packages/primitives/src/DataTable.tsx packages/primitives/src/index.ts
git commit -m "feat: add DataTable primitive with glassmorphic theme styling"
```

---

### Task 4: Trim FontPicker to 5 pairings, remove custom selects

**Files:**
- Modify: `apps/studio/src/lib/fonts.ts:32-48` (trim FONT_PAIRINGS to 5)
- Modify: `apps/studio/src/components/FontPicker.tsx` (remove custom heading/body selects)

**Step 1: Trim FONT_PAIRINGS in fonts.ts**

Replace the `FONT_PAIRINGS` array (lines 32-48) with only these 5 entries:

```ts
export const FONT_PAIRINGS: FontPairing[] = [
  { name: 'Clean & Modern', heading: 'Inter', body: 'Inter', vibe: 'Versatile, no-nonsense' },
  { name: 'Bold Impact', heading: 'Oswald', body: 'DM Sans', vibe: 'Strong headlines, smooth body' },
  { name: 'Startup Vibes', heading: 'Space Grotesk', body: 'DM Sans', vibe: 'Techy, approachable' },
  { name: 'Executive Suite', heading: 'Playfair Display', body: 'Source Sans 3', vibe: 'Elegant serif + clean sans' },
  { name: 'Tech Forward', heading: 'Plus Jakarta Sans', body: 'IBM Plex Sans', vibe: 'Geometric, professional' },
];
```

The `HEADING_FONTS` and `BODY_FONTS` arrays can stay in the file (they're not hurting anything and the font loading utility uses the names). But they no longer appear in the UI.

**Step 2: Remove custom heading/body selects from FontPicker.tsx**

Replace the entire file `apps/studio/src/components/FontPicker.tsx` with:

```tsx
import { FONT_PAIRINGS, loadGoogleFont } from '../lib/fonts';

interface FontPickerProps {
  headingFont: string;
  bodyFont: string;
  onChangeHeading: (font: string) => void;
  onChangeBody: (font: string) => void;
  onChangePairing: (heading: string, body: string) => void;
}

export function FontPicker({ headingFont, bodyFont, onChangePairing }: FontPickerProps) {
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
        {FONT_PAIRINGS.map(p => {
          const isActive = p.heading === headingFont && p.body === bodyFont;
          return (
            <button
              key={p.name}
              onClick={() => {
                loadGoogleFont(p.heading);
                loadGoogleFont(p.body);
                onChangePairing(p.heading, p.body);
              }}
              onMouseEnter={() => {
                loadGoogleFont(p.heading);
                loadGoogleFont(p.body);
              }}
              style={{
                padding: '10px 12px', textAlign: 'left', cursor: 'pointer',
                backgroundColor: isActive ? 'rgba(139,92,246,0.25)' : '#2a2a3e',
                border: `1px solid ${isActive ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: '6px', color: '#fff', lineHeight: 1.2,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{
                  fontFamily: `'${p.heading}', sans-serif`,
                  fontWeight: 700, fontSize: '0.95rem',
                }}>
                  {p.name}
                </span>
                <span style={{ fontSize: '0.6rem', color: '#666' }}>
                  {p.heading === p.body ? p.heading : `${p.heading} + ${p.body}`}
                </span>
              </div>
              <span style={{
                display: 'block', fontFamily: `'${p.body}', sans-serif`,
                fontSize: '0.7rem', color: '#888', marginTop: '2px',
              }}>
                {p.vibe}
              </span>
            </button>
          );
        })}
      </div>

      {/* Preview of current selection */}
      <div style={{
        backgroundColor: '#1a1a2e', borderRadius: '6px', padding: '10px',
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
        <p style={{
          color: '#fff', fontSize: '1.1rem', fontWeight: 700, margin: '0 0 4px',
          fontFamily: `'${headingFont}', sans-serif`,
        }}>
          Heading Preview
        </p>
        <p style={{
          color: '#aaa', fontSize: '0.8rem', margin: 0,
          fontFamily: `'${bodyFont}', sans-serif`,
        }}>
          Body text looks like this. The quick brown fox jumps over the lazy dog.
        </p>
      </div>
    </div>
  );
}
```

Key changes:
- Removed `HEADING_FONTS` and `BODY_FONTS` imports
- Removed `onChangeHeading` and `onChangeBody` from destructured props (kept in interface for compatibility)
- Changed grid layout from 2-column to single-column stack (5 items fit better vertically)
- Removed the "Custom Heading" and "Custom Body" `<select>` sections entirely
- Kept the preview panel

**Step 3: Verify the app loads**

Run: `cd /Users/erickittelson/qvl-code/slidemason && pnpm --filter @slidemason/studio dev`
Open `http://localhost:4200`, navigate to a deck, expand the Fonts section. Verify:
- 5 pairing buttons shown (single column)
- No heading/body dropdown selects
- Clicking a pairing updates the preview

**Step 4: Commit**

```bash
cd /Users/erickittelson/qvl-code/slidemason
git add apps/studio/src/lib/fonts.ts apps/studio/src/components/FontPicker.tsx
git commit -m "feat: trim font picker to 5 curated pairings, remove custom selects"
```

---

### Task 5: Trim BriefForm dropdowns

**Files:**
- Modify: `apps/studio/src/components/BriefForm.tsx:33-111`

**Step 1: Replace the dropdown option arrays**

In `apps/studio/src/components/BriefForm.tsx`, replace the option arrays (lines 33-111) with these trimmed versions:

```ts
// Dropdown presets
const AUDIENCES = [
  'Executive leadership (C-suite)',
  'Your direct team',
  'Investors / VCs',
  'Clients / customers',
  'Conference attendees',
];

const GOALS = [
  'Get approval (budget / resources / proposal)',
  'Share progress, results, or metrics',
  'Pitch for investment',
  'Align team on strategy or direction',
  'Educate or train the audience',
];

const SLIDE_COUNTS = [
  '5 slides', '10 slides', '15 slides', '20 slides', '25+ slides',
];

const DURATIONS = [
  '5 minutes', '10 minutes', '15 minutes', '30 minutes', '60 minutes',
];

const DATA_STYLES = [
  'Data-heavy — lots of charts & numbers',
  'Balanced — mix of data and narrative',
  'Light on data — mostly concepts & ideas',
  'No data — pure narrative / storytelling',
  'Case-study driven — examples over raw data',
];

const VISUAL_STYLES = [
  'Minimal & clean — lots of whitespace',
  'Diagram-focused — flows and architecture',
  'Icon-driven — icons illustrate each point',
  'Text-forward — content-dense slides',
  'Infographic style — visual data storytelling',
];

const CONTENT_FOCUSES = [
  'Strategic — high-level direction & vision',
  'Tactical — specific plans & action items',
  'Educational — teach concepts step by step',
  'Persuasive — build a compelling argument',
  'Status update — progress & metrics',
];
```

Changes summary:
- AUDIENCES: 17 → 5 (kept the 5 most universal, free-text fallback still works via DropdownOrText)
- GOALS: 15 → 5 (merged similar options, e.g. "Get budget approval" + "Get sign-off" → "Get approval")
- SLIDE_COUNTS: 5 → 5 (unchanged)
- DURATIONS: 7 → 5 (dropped 20 min and 45 min)
- DATA_STYLES: 5 → 5 (unchanged)
- VISUAL_STYLES: 6 → 5 (dropped "Image-heavy" — least used for generated decks)
- CONTENT_FOCUSES: 7 → 5 (dropped "Comparative" and "Narrative" — covered by other options + free text)

**Step 2: Verify the app loads**

Open `http://localhost:4200`, navigate to a deck, expand the Brief section. Verify:
- Audience dropdown has 5 options + "Other (type your own)"
- Goal dropdown has 5 options + "Other (type your own)"
- Duration dropdown has 5 options
- All other selects have 5-6 options max

**Step 3: Commit**

```bash
cd /Users/erickittelson/qvl-code/slidemason
git add apps/studio/src/components/BriefForm.tsx
git commit -m "feat: trim all brief form dropdowns to max 5 options"
```

---

### Task 6: Update CLAUDE.md with Chart, DataTable, and data deck guidance

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Add Chart and DataTable to the Visual Atoms table**

In `CLAUDE.md`, find the "Visual Atoms" table (around line 130-148). Add these two rows at the end of the table, before the "### Layout Atoms" section:

```markdown
| `<Chart type data>` | Bar/line/area/pie chart | `<Chart type="bar" data={[{label:'Q1',rev:2.1}]} series={['rev']} />` |
| `<DataTable headers rows>` | Themed data table | `<DataTable headers={['Q','Rev']} rows={[['Q1','$2M']]} />` |
```

**Step 2: Add Chart and DataTable to the Size Props table**

After the existing size props table, add:

```markdown
| `Chart` type | `"bar"` \| `"line"` \| `"area"` \| `"pie"` |
| `DataTable` | `compact` \| default |
```

**Step 3: Add a "Research & Data-Heavy Decks" section**

After the "Animation & Interaction Recipes" section (around line 280), add this new section:

```markdown
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
<Chart
  type="line"
  data={monthlyData}
  xKey="month"
  series={['users']}
  showAxes
/>

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
```

**Step 4: Commit**

```bash
cd /Users/erickittelson/qvl-code/slidemason
git add CLAUDE.md
git commit -m "docs: add Chart, DataTable primitives and data deck guidance to CLAUDE.md"
```

---

### Task 7: Visual verification

**No files changed — manual testing only.**

**Step 1: Start the dev server**

```bash
cd /Users/erickittelson/qvl-code/slidemason && pnpm --filter @slidemason/studio dev
```

**Step 2: Verify UX trim**

Open `http://localhost:4200`, create or open a deck:
- [ ] Font picker shows exactly 5 pairings, no custom selects
- [ ] Audience dropdown has 5 + "Other"
- [ ] Goal dropdown has 5 + "Other"
- [ ] Duration dropdown has 5 options
- [ ] Content focus dropdown has 5 options
- [ ] Visual style dropdown has 5 options
- [ ] No dropdown in the entire UI has more than 6 options

**Step 3: Verify primitives compile**

```bash
cd /Users/erickittelson/qvl-code/slidemason/packages/primitives && pnpm run build
```

Expected: Clean build, Chart.tsx and DataTable.tsx compile without errors.

**Step 4: Quick smoke test — create a test slide using Chart**

Create a temporary file to verify the Chart primitive renders. In any deck's `slides.tsx`, add:

```tsx
import { Chart, DataTable } from '@slidemason/primitives';

// Add a test slide
<Slide key="test-chart" layout="center">
  <Chart
    type="bar"
    data={[
      { label: 'Q1', revenue: 2.1 },
      { label: 'Q2', revenue: 3.2 },
      { label: 'Q3', revenue: 4.1 },
    ]}
    series={['revenue']}
  />
</Slide>,

<Slide key="test-table" layout="center">
  <DataTable
    headers={['Metric', 'Value']}
    rows={[['Users', '45K'], ['Revenue', '$4.1M']]}
  />
</Slide>,
```

Verify both render in the browser, then remove the test slides.
