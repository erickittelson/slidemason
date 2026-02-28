# Slidemason

**Local-first, open-source presentation builder powered by agentic coding workflows.**

Slidemason turns your notes, documents, and data into polished slide decks — without SaaS, without lock-in, and without leaving your terminal. Drop files into a `data/` directory, run a structured pipeline, and let your coding agent (Claude Code, Cursor, Copilot, Windsurf) generate a complete presentation from source material. Every intermediate artifact is a plain JSON or MDX file you can read, edit, and version-control.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![pnpm](https://img.shields.io/badge/pnpm-10+-orange.svg)](https://pnpm.io/)

---

## Features

- **Local-first** — Your data never leaves your machine. No accounts, no telemetry, no cloud.
- **Agent-compatible** — Works with Claude Code, Cursor, Copilot, Windsurf, or any coding agent that can read files.
- **Beautiful by default** — 3 themes, 12 templates, 16 components. Ship a polished deck without touching CSS.
- **Structured pipeline** — Ingest, brief, outline, slides. Each stage produces a human-readable artifact.
- **Export to PDF or static web** — Generate a PDF with Playwright or a static site you can host anywhere.
- **Publish to GitHub Pages** — One command to deploy your deck to the web.
- **Open and inspectable** — Every intermediate file (manifest, brief, outline) is JSON you can read and edit.
- **Composable** — Build custom slide layouts from reusable React components, or use the included templates.

---

## Quick Start

```bash
# Clone the repo
git clone https://github.com/erickittelson/slidemason.git
cd slidemason

# Install dependencies
pnpm install

# Drop your source files
cp your-prd.md data/
cp your-notes.md data/

# Scan your data
pnpm slidemason ingest

# Use your coding agent to generate the deck
# (Tell your agent: "Read prompts/system.md and follow the workflow")

# Preview locally
pnpm dev

# Export to PDF
pnpm slidemason export-pdf --slides 10 --output deck.pdf
```

---

## How It Works

Slidemason follows a six-stage pipeline. Each stage reads from the previous stage's output and writes to `generated/`.

```
data/ ──> ingest ──> brief ──> outline ──> slides ──> preview ──> export
          │          │         │            │          │            │
          v          v         v            v          v            v
     manifest.json  brief.json  outline.json  deck/*.mdx  localhost   PDF
```

| Stage | What happens | Input | Output |
|-------|-------------|-------|--------|
| **Ingest** | Scans `data/`, inventories every file with metadata | Source files | `generated/manifest.json` |
| **Brief** | Summarizes source material into a presentation brief | Manifest + source files | `generated/brief.json` |
| **Outline** | Plans the narrative arc, selects theme and templates | Brief | `generated/outline.json` |
| **Slides** | Generates MDX slide files using components and templates | Outline | `generated/deck/*.mdx` |
| **Preview** | Renders the deck in a live-reloading browser | MDX files | `localhost:5173` |
| **Export** | Captures slides as PDF or builds a static site | Rendered slides | PDF or HTML |

Every JSON artifact is validated against Zod schemas in `packages/core/`, so malformed output is caught immediately.

---

## Project Structure

```
slidemason/
├── packages/
│   ├── core/          # Zod schemas, ingestion, validation
│   ├── components/    # 16 React presentation components
│   ├── themes/        # 3 theme configs (slate, canvas, signal)
│   ├── renderer/      # Vite + React + MDX slide renderer, 12 templates
│   ├── cli/           # CLI entry point (citty)
│   └── export/        # PDF export via Playwright
├── apps/
│   └── studio/        # Vite dev server for live preview
├── data/              # Your source files (input)
├── generated/         # All output artifacts
│   ├── manifest.json
│   ├── brief.json
│   ├── outline.json
│   └── deck/          # Generated MDX slides + deck.config.json
├── prompts/           # Agent workflow guides
├── examples/          # Example decks
└── docs/              # Project documentation
```

---

## CLI Reference

| Command | Description |
|---------|-------------|
| `slidemason init` | Initialize a new Slidemason project |
| `slidemason ingest` | Scan `data/` and produce `generated/manifest.json` |
| `slidemason validate` | Validate all generated artifacts against Zod schemas |
| `slidemason dev` | Start the live preview server |
| `slidemason build` | Build the slide deck for production |
| `slidemason export-pdf` | Export the deck to PDF via Playwright |
| `slidemason export-static` | Export the deck as a static HTML site |
| `slidemason publish-github` | Publish the static export to GitHub Pages |

---

## Themes

Slidemason ships with three themes. Set the theme in your outline and every component picks it up automatically through CSS custom properties.

### Slate

Dark executive theme. Deep navy background (`#0f172a`) with blue (`#3b82f6`) and violet (`#8b5cf6`) accents. Best for board presentations, investor pitches, and financial reports.

### Canvas

Light minimal theme. Warm white background (`#fafaf9`) with charcoal (`#292524`) and amber (`#d97706`) accents. Best for strategy workshops, product reviews, and printed decks.

### Signal

Bold startup theme. Near-black background (`#020617`) with hot pink (`#e11d48`) and amber (`#f59e0b`) accents. Best for pitch decks, product launches, and conference talks.

---

## Templates

All 12 templates live in `packages/renderer/src/templates/`. Templates compose components into complete slide layouts.

| Template | Purpose |
|----------|---------|
| `TitleHero` | Opening slide with headline and optional subheadline |
| `Agenda` | Numbered list previewing the deck's structure |
| `SectionDivider` | Transition marker between major sections |
| `TwoColumnArgument` | Side-by-side comparison (pros/cons, before/after) |
| `QuoteInsight` | Featured quote with attribution and context |
| `StatGridSlide` | 2-4 key metrics displayed prominently |
| `ImageCaption` | Full-width image with optional headline and caption |
| `ComparisonTableSlide` | Multi-row comparison table with two options |
| `TimelineSlide` | Chronological sequence of events or milestones |
| `Roadmap` | Phased plan or sequential steps |
| `RecommendationAsk` | Call to action or decision request |
| `Appendix` | Supplementary references and data sources |

---

## Components

All 16 components live in `packages/components/`. Import from `@slidemason/components`.

### Layout (7)

| Component | Description |
|-----------|-------------|
| `Headline` | Large primary heading (`h1`) |
| `Subheadline` | Secondary heading (`h2`), lighter weight |
| `BulletGroup` | Unordered list with styled bullet markers |
| `NumberedSteps` | Ordered list with numbered circle markers |
| `TwoColumn` | Generic two-column layout accepting any content |
| `ThreeCard` | Grid of exactly 3 content cards |
| `SectionLabel` | Centered divider line with a label |

### Data Display (9)

| Component | Description |
|-----------|-------------|
| `StatCard` | Single statistic with large value and label |
| `StatGrid` | Responsive grid of 2-4 stat cards |
| `QuoteCallout` | Styled blockquote with optional attribution |
| `ImagePanel` | Image display with optional caption |
| `KPIStrip` | Compact horizontal row of key performance indicators |
| `TimelineRow` | Single event in a vertical timeline |
| `ComparisonMatrix` | Two-column comparison table with row labels |
| `FooterMark` | Subtle footer text (confidentiality, branding) |
| `PresenterNotes` | Hidden speaker notes for presenter view |

---

## Agent Workflow

Slidemason is designed to work with any AI coding agent. Here is the workflow:

1. **Place source files** in `data/` (markdown, CSV, images, JSON).
2. **Run `pnpm slidemason ingest`** to scan and inventory your files.
3. **Tell your agent**: "Read `prompts/system.md` and follow the workflow."
4. **The agent generates** `brief.json`, `outline.json`, and MDX slide files — each validated against Zod schemas.
5. **Preview** with `pnpm dev` and iterate with your agent.
6. **Export** with `pnpm slidemason export-pdf` or `pnpm slidemason export-static`.

The `prompts/` directory contains detailed guides for each stage:

| Prompt file | Guides the agent through |
|-------------|-------------------------|
| `system.md` | Project overview and conventions |
| `ingest.md` | Reading and interpreting the manifest |
| `build-brief.md` | Generating the presentation brief |
| `build-outline.md` | Planning the narrative arc |
| `build-deck.md` | Writing MDX slide files |
| `refine-design.md` | Reviewing and improving the deck |
| `components.md` | Component API reference |
| `templates.md` | Template API reference |
| `themes.md` | Theme selection and configuration |

---

## Tech Stack

- **React 19** + **Vite 7** — Fast dev server with hot reload
- **TypeScript 5.9** — End-to-end type safety
- **Tailwind CSS v4** — Utility-first styling
- **MDX** — Slides are Markdown + JSX, readable and diffable
- **Zod** — Schema validation for every generated artifact
- **citty** — Lightweight CLI framework
- **Playwright** — Headless browser for PDF export
- **pnpm workspaces** — Monorepo package management

---

## Contributing

Contributions are welcome. To get started:

```bash
# Install dependencies
pnpm install

# Run the dev server
pnpm dev

# Run tests
pnpm test

# Type-check
pnpm typecheck

# Lint
pnpm lint
```

Please open an issue before submitting large changes so we can discuss the approach.

---

## License

[MIT](LICENSE)
