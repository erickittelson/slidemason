# Slidemason

**Local-first, open-source presentation builder powered by AI coding agents.**

Slidemason turns your notes, documents, and data into polished slide decks — without SaaS, without lock-in, and without leaving your editor. Upload source files, fill out a brief in the studio, and let your AI coding agent generate a complete presentation. Every slide is custom React — bespoke designs with animations, icons, charts, and interactive elements. No templates. No cookie-cutter layouts.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![pnpm](https://img.shields.io/badge/pnpm-10+-orange.svg)](https://pnpm.io/)

![Slidemason Demo — 15 slides generated from a brief](docs/demo.gif)

---

## Features

- **Local-first** — Your data never leaves your machine. No accounts, no telemetry, no cloud.
- **Any AI agent** — Works with Claude Code, Cursor, Copilot, Windsurf, or any coding agent. Instructions auto-load from `CLAUDE.md` (symlinked to `.cursorrules`, `.windsurfrules`, `.github/copilot-instructions.md`).
- **7-step studio workflow** — Guided sidebar walks you through source files, brief, vision, theme, fonts, branding, and images. Everything saves to a JSON brief your agent reads.
- **36 slide primitives** — Layout components (`Split`, `Grid`, `Stack`), visual atoms (`Card`, `Badge`, `StatBox`, `IconCircle`), data primitives (`Chart`, `DataTable`), animation toolkit (`Animate`, `CountUp`, `TypeWriter`, `Stagger`), and interactive elements (`Tabs`, `Accordion`, `ClickReveal`, `Flipcard`, `Sortable`).
- **12 themes** — Each with 31 CSS variables for backgrounds, text, accents, charts, status colors, shadows, and more. Switch themes instantly.
- **Google Fonts** — Pick heading and body fonts from curated pairings or search the full Google Fonts library.
- **Branding** — Upload your logo (with placement control), set footer text. The agent places them on every slide.
- **Deck images** — Upload images and describe them. The agent knows what each image is and uses them in context.
- **Live preview** — Slides hot-reload in the studio as the agent writes them. Arrow keys to navigate, thumbnail strip at the bottom.
- **Export to PPTX** — One-click PowerPoint export from the sidebar. PDF export via Playwright.
- **Crash-proof primitives** — Invalid props fall back gracefully instead of white-screening. AI agents can pass bad values without killing the deck.
- **Deck validation API** — `GET /__api/decks/<slug>/validate` renders every slide server-side and reports errors. Agents can self-correct before you even see the deck.
- **Open and inspectable** — Briefs are JSON, slides are TSX, themes are CSS. Everything is readable and version-controllable.

---

## Quick Start

```bash
git clone https://github.com/erickittelson/slidemason.git
cd slidemason
pnpm install
pnpm dev        # Studio opens at http://localhost:4200
```

---

## How It Works

The studio sidebar walks you through 7 steps to build a brief. Then your AI agent reads the brief and source files and generates the slides.

### Step 1: Source Files
Upload PDFs, markdown, text files, or any documents with the content for your presentation. Drag and drop or click to upload.

### Step 2: Brief
Fill out who the deck is for and what it should accomplish:
- **Title & subtitle** (optional — AI generates if blank)
- **Presenter** name
- **Audience** — select from presets (C-suite, investors, team, clients, conference) or type your own
- **Goal** — what the audience should do or feel after (approve budget, align on strategy, etc.)
- **Tone** — professional, casual, inspirational, technical, storytelling, data-driven
- **Slide count** — 5 to 25+
- **Duration** — 5 to 60 minutes
- **Data density** — from data-heavy charts to pure narrative
- **Visual style** — minimal, diagram-focused, icon-driven, text-forward, infographic
- **Content focus** — strategic, tactical, educational, persuasive, status update

### Step 3: Your Vision
Free-text field for anything else — "make it feel urgent", "emphasize the Q3 numbers", "keep it under 10 minutes". Direct instructions to the agent in your own words.

### Step 4: Theme
Pick from 12 themes. The preview updates live so you can see exactly how each one looks with your slides.

### Step 5: Fonts
Choose heading and body fonts. Pick from curated pairings (Inter + DM Sans, Space Grotesk + Inter, etc.) or search Google Fonts for anything specific.

### Step 6: Branding
Upload a logo and choose placement (top-left, top-right, bottom-left, bottom-right). Set footer text (e.g., "Confidential - Acme Inc"). The agent places these on every slide.

### Step 7: Deck Images
Upload screenshots, diagrams, photos, or any images you want in the presentation. Add a description to each one so the agent knows what it is and where to use it.

### Build
Hit **Build Deck** and the studio saves everything to `brief.json`. Then ask your agent to generate the slides — it reads the brief, source files, and images, and writes `slides.tsx`. Slides hot-reload in the studio as the agent writes them.

### Export
Once the deck looks good, click **Export PPTX** to download a PowerPoint file. Or use Playwright for PDF export.

---

## Project Structure

```
slidemason/
├── packages/
│   ├── primitives/    # 36 slide components (layout, visual, animation, interaction, data)
│   ├── renderer/      # Presentation engine (navigation, transitions, slide layout)
│   ├── themes/        # 12 CSS themes with 31 variables each
│   └── export/        # PPTX export via Playwright
├── apps/
│   └── studio/        # Vite dev server + sidebar workflow + REST API
├── decks/             # Each deck is a folder
│   └── <slug>/
│       ├── data/          # Source documents (PDFs, markdown, text)
│       ├── data/assets/   # Logo, images, screenshots
│       ├── generated/     # brief.json produced by the studio
│       └── slides.tsx     # Generated slide content (custom JSX)
└── CLAUDE.md          # AI agent instructions (symlinked for all platforms)
```

---

## How Slides Work

Every slide is bespoke JSX — not a template fill-in. The agent designs each slide's layout, typography, colors, and animations from scratch based on the content. Slides use primitives from `@slidemason/primitives` for consistency, then layer on custom styling with Tailwind classes and theme CSS variables.

```tsx
import { Slide, Heading, GradientText, Badge, Text, Split, Card, Grid,
         Animate, CountUp, Stagger, StatBox, IconCircle } from '@slidemason/primitives';
import { Zap, Shield, Globe } from 'lucide-react';

const slides = [
  <Slide key="s1" layout="center" bg="mesh">
    <Badge>Series A · 2026</Badge>
    <GradientText size="hero">Product Name</GradientText>
    <Text muted>One line that captures the vision</Text>
  </Slide>,

  <Slide key="s2" layout="free">
    <Animate effect="fade-up">
      <Heading>Key Metric</Heading>
    </Animate>
    <CountUp to={2.3} prefix="$" suffix="M" decimals={1} />
  </Slide>,
];

export default slides;
```

All colors come from theme CSS variables (`var(--sm-primary)`, `var(--sm-surface)`, etc.) so slides look great in any of the 12 themes without changing code.

---

## Themes

`midnight` · `slate` · `canvas` · `signal` · `noir` · `dawn` · `boardroom` · `neon` · `forest` · `glacier` · `sunset` · `paper`

Each theme defines 31 CSS custom properties for backgrounds, text, accents, charts, status colors, shadows, and more. Set the theme in the brief and it applies automatically.

---

## AI Agent Token Usage & Cost

### The real comparison: time, not tokens

Building a polished 15-slide presentation by hand takes most people **2-4 hours** — researching layouts, writing copy, tweaking spacing, fighting with alignment, exporting, realizing slide 7 looks terrible, starting over. With Slidemason, the workflow is:

1. Upload your source docs (~1 min)
2. Fill out the brief in the sidebar (~2 min)
3. Tell your agent to generate the deck (~1-2 min for the agent to write it)
4. Review and tweak individual slides (~2-5 min)

**Total: under 5 minutes for a deck that would have taken hours.** The first time takes a bit longer as you learn the studio, but after that it's fast.

So when you see the cost numbers below, keep that in mind. We're talking about **cents** to save **hours**.

### Cost per deck (ballpark numbers)

These numbers are approximate — actual cost depends on source document size, revisions, and agent overhead. But they give you the right order of magnitude.

Based on a 15-slide deck with a 6-page source document:

| Platform | Model | Cost per deck | Cost to fix one slide |
|---|---|---|---|
| **Claude Code** | Haiku 4.5 | **~8 cents** | ~1 cent |
| **Claude Code** | Sonnet 4.6 | **~25 cents** | ~3 cents |
| **Claude Code** | Opus 4.6 | **~40 cents** | ~5 cents |
| **Cursor** | Pro ($20/mo) | ~1-2 of your ~225 monthly requests | ~1 request |
| **Copilot** | Pro ($10/mo) | ~1-3 of your 300 monthly requests | ~1 request |

> A 15-slide presentation costs somewhere between **a dime and two quarters**. Fixing a single slide costs **a few pennies**. On subscription plans like Cursor or Copilot, each deck is a rounding error on your monthly budget — you could generate decks every day and barely notice.

### Where those numbers come from

The agent reads your instructions (~6K tokens), brief (~250 tokens), and source documents (5K-30K tokens), then writes the slides (~7K-10K tokens of JSX). Here's the raw API math:

| Model | Input price | Output price | Raw cost for 15 slides |
|---|---|---|---|
| Haiku 4.5 | $1 / 1M tokens | $5 / 1M tokens | ~$0.08 |
| Sonnet 4.6 | $3 / 1M tokens | $15 / 1M tokens | ~$0.23 |
| Opus 4.6 | $5 / 1M tokens | $25 / 1M tokens | ~$0.38 |

Agent overhead (system prompts, multi-turn reasoning, file reads) can add 1.5-2x on top. Claude Code shows actual session cost in the status bar so you always know what you spent. These numbers will shift as model pricing changes — check your platform's current rates.

### Subscription platforms

**Cursor Pro ($20/month):** Credit-based. A deck generation uses 1-2 requests worth of credits. You can comfortably generate **100+ decks/month** on the Pro plan.

**GitHub Copilot Pro ($10/month):** 300 premium requests/month. A deck uses 1-3 requests. Overage is $0.04/request. Pro+ ($39/mo) bumps you to 1,500 requests.

**Windsurf:** Similar credit model. One deck is a small fraction of the monthly allowance.

### Tips to keep costs down

- **Fix individual slides** instead of regenerating the whole deck — "fix slide 5" costs pennies, not quarters
- **Use a lighter model for first drafts** — Haiku at 8 cents, then polish with Sonnet if needed
- **Trim your source docs** — remove appendices and boilerplate before uploading
- **Get the brief right first** — a clear brief means fewer do-overs

---

## Validating Decks

After the agent generates slides, you can validate they render without errors:

```bash
curl http://localhost:4200/__api/decks/<slug>/validate
```

Returns `{ "valid": true, "slideCount": 15 }` on success, or an `errors` array with slide index and error message on failure. All primitives include defensive fallbacks so invalid props degrade gracefully instead of crashing — but the validation endpoint catches deeper issues before you see them.

---

## Tech Stack

- **React 19** + **Vite 7** — Fast dev server with instant hot reload
- **TypeScript 5.9** — End-to-end type safety
- **Tailwind CSS v4** — Utility-first styling
- **Framer Motion** — Slide animations and transitions
- **Lucide React** — 1,500+ icons for visual anchors
- **Recharts** — Charts and data visualization
- **Playwright** — Headless browser for PDF and PPTX export
- **pnpm workspaces** — Monorepo package management

---

## Commands

```bash
pnpm dev              # Start studio dev server (port 4200)
pnpm build            # Build all packages
pnpm test             # Run test suite (includes crash-proof primitive tests)
```

---

## Contributing

Contributions are welcome. To get started:

```bash
pnpm install
pnpm dev
pnpm test
```

Please open an issue before submitting large changes so we can discuss the approach.

---

## License

[MIT](LICENSE)
