# Themes Reference

Slidemason ships with 3 themes defined in `packages/themes/`. Each theme provides a complete set of CSS custom properties that components and templates reference automatically.

## How Themes Work

Themes define colors, typography, spacing, border radius, and shadows. These values are applied as CSS custom properties on the slide container, prefixed with `--sm-`:

| CSS Variable | Purpose |
|--------------|---------|
| `--sm-bg` | Slide background color |
| `--sm-surface` | Card/panel background color |
| `--sm-text` | Primary text color |
| `--sm-muted` | Secondary/caption text color |
| `--sm-primary` | Accent color for emphasis (bullets, stat values, headings) |
| `--sm-secondary` | Secondary accent color |
| `--sm-accent` | Tertiary accent color |
| `--sm-border` | Border and divider color |
| `--sm-radius` | Border radius for cards and panels |

Components reference these variables directly (e.g., `text-[var(--sm-text)]`), so changing the theme changes the entire deck's appearance without touching any slide files.

## How to Apply a Theme

Set the `theme` field in two places:

1. **`generated/outline.json`** — The `theme` field at the root of the outline schema.
2. **`generated/deck/deck.config.json`** — The `theme` field in the deck config.

Both should have the same value. Valid values: `"slate"`, `"canvas"`, `"signal"`.

```json
{
  "theme": "slate"
}
```

If omitted, the theme defaults to `"slate"`.

---

## Slate

**Dark executive theme.** Deep navy background with blue accents. Conveys authority, precision, and sophistication.

### Color Palette

| Token | Value | Hex |
|-------|-------|-----|
| background | Deep navy | `#0f172a` |
| surface | Dark slate | `#1e293b` |
| text | Near white | `#f8fafc` |
| muted | Slate gray | `#94a3b8` |
| primary | Blue | `#3b82f6` |
| secondary | Violet | `#8b5cf6` |
| accent | Cyan | `#06b6d4` |
| border | Dark slate edge | `#334155` |

### Typography

| Setting | Value |
|---------|-------|
| Heading font | Inter, system-ui, sans-serif |
| Body font | Inter, system-ui, sans-serif |
| Mono font | JetBrains Mono, ui-monospace, monospace |

### Other Settings

| Setting | Value |
|---------|-------|
| Slide padding | 3rem |
| Element gap | 1.5rem |
| Border radius | 0.5rem |
| Shadow style | Strong (0.3 opacity) |

### When to Use Slate

- Board presentations and executive reviews
- Investor pitches and fundraising decks
- Financial reports and quarterly reviews
- Any context where gravitas and professionalism matter
- When presenting on projectors in well-lit rooms (dark backgrounds resist washout)

---

## Canvas

**Light minimal theme.** Warm white background with stone tones. Clean, understated, and content-focused.

### Color Palette

| Token | Value | Hex |
|-------|-------|-----|
| background | Warm white | `#fafaf9` |
| surface | Pure white | `#ffffff` |
| text | Near black | `#1c1917` |
| muted | Stone gray | `#78716c` |
| primary | Charcoal | `#292524` |
| secondary | Amber | `#d97706` |
| accent | Emerald | `#059669` |
| border | Light stone | `#e7e5e4` |

### Typography

| Setting | Value |
|---------|-------|
| Heading font | Inter, system-ui, sans-serif |
| Body font | Inter, system-ui, sans-serif |
| Mono font | JetBrains Mono, ui-monospace, monospace |

### Other Settings

| Setting | Value |
|---------|-------|
| Slide padding | 3rem |
| Element gap | 1.5rem |
| Border radius | 0.5rem |
| Shadow style | Subtle (0.05-0.1 opacity) |

### When to Use Canvas

- Strategy presentations and workshops
- Product reviews and design critiques
- Internal team meetings and all-hands
- Printed or PDF-distributed decks (light backgrounds print well)
- When the content includes many images (neutral background doesn't compete)
- When you want the audience to focus on content, not chrome

---

## Signal

**Bold startup theme.** Near-black background with hot pink and amber accents. High-energy, high-contrast, memorable.

### Color Palette

| Token | Value | Hex |
|-------|-------|-----|
| background | Near black | `#020617` |
| surface | Dark navy | `#0f172a` |
| text | Pure white | `#ffffff` |
| muted | Slate | `#64748b` |
| primary | Hot pink | `#e11d48` |
| secondary | Violet | `#7c3aed` |
| accent | Amber | `#f59e0b` |
| border | Dark navy edge | `#1e293b` |

### Typography

| Setting | Value |
|---------|-------|
| Heading font | Inter, system-ui, sans-serif |
| Body font | Inter, system-ui, sans-serif |
| Mono font | JetBrains Mono, ui-monospace, monospace |

### Other Settings

| Setting | Value |
|---------|-------|
| Slide padding | 3rem |
| Element gap | 1.5rem |
| Border radius | 0.5rem |
| Shadow style | Heavy (0.4 opacity) |

### When to Use Signal

- Startup pitch decks and demo days
- Product launches and keynotes
- Marketing presentations and sales decks
- Conference talks and public speaking
- When you want to make a bold, memorable impression
- When the audience is younger or tech-savvy

---

## Theme Selection Guide

| Context | Recommended Theme |
|---------|-------------------|
| Board meeting | Slate |
| Investor pitch (Series A+) | Slate |
| Startup pitch (seed/pre-seed) | Signal |
| Product demo | Signal |
| Internal team meeting | Canvas |
| Strategy workshop | Canvas |
| Conference keynote | Signal |
| Financial report | Slate |
| Design review | Canvas |
| Sales presentation | Signal or Slate |

## Do

- Choose the theme based on audience and context, not personal preference.
- Set the theme early (in the outline stage) so all downstream stages use it.
- Keep the theme consistent across the entire deck.

## Don't

- Hardcode colors in MDX files. All color must come from theme CSS variables.
- Mix themes within a single deck.
- Override theme colors with inline styles on components.
- Choose Signal for conservative audiences or Canvas for high-energy contexts.
