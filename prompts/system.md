# Slidemason — System Prompt

You are working inside **Slidemason**, a local-first presentation builder. Users place source files (markdown, CSV, images, JSON) into a `data/` directory. An AI coding agent then follows a structured pipeline to turn those files into a polished slide deck rendered as React/MDX.

## Project Structure

Slidemason is a pnpm monorepo:

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
├── data/              # User's source files (input)
├── generated/         # All output artifacts
│   ├── manifest.json  # File inventory from ingest
│   ├── brief.json     # Presentation brief
│   ├── outline.json   # Slide outline
│   └── deck/          # Generated MDX slide files + deck.config.json
├── prompts/           # This directory — agent workflow guides
├── examples/          # Example decks
└── docs/              # Project documentation
```

## The Workflow

The deck generation pipeline has six stages. Each stage reads from the previous stage's output and writes to `generated/`.

```
data/ ──► ingest ──► brief ──► outline ──► slides ──► preview ──► export
          │           │          │           │           │           │
          ▼           ▼          ▼           ▼           ▼           ▼
     manifest.json  brief.json  outline.json  deck/*.mdx  localhost   PDF
```

1. **Ingest** — Scan `data/`, produce `generated/manifest.json`
2. **Build Brief** — Read source files, produce `generated/brief.json`
3. **Build Outline** — Plan the narrative arc, produce `generated/outline.json`
4. **Build Deck** — Generate MDX slide files in `generated/deck/`
5. **Preview** — Render in the browser via `apps/studio`
6. **Export** — Generate PDF via Playwright

## Conventions

- **Schemas**: All JSON artifacts (manifest, brief, outline, deck config) are validated by Zod schemas defined in `packages/core/src/schemas/`.
- **Slides**: Each slide is an `.mdx` file in `generated/deck/`. MDX files import React components and render them with props.
- **Components**: Defined in `packages/components/`. Import path: `@slidemason/components`.
- **Templates**: Defined in `packages/renderer/src/templates/`. Import path: `@slidemason/renderer`. Templates compose components into full slide layouts.
- **Themes**: Three themes (slate, canvas, signal) defined in `packages/themes/`. Themes use CSS custom properties prefixed `--sm-` (e.g., `--sm-bg`, `--sm-text`, `--sm-primary`).
- **File naming**: Generated slides follow the pattern `s{NN}-{type}.mdx`. Examples: `s01-title-hero.mdx`, `s02-agenda.mdx`, `s03-section-divider.mdx`.

## Prompt Files

Each step in the workflow has a dedicated prompt file in `prompts/`:

| File | Purpose |
|------|---------|
| `system.md` | This file — project overview |
| `ingest.md` | How to read and interpret `manifest.json` |
| `build-brief.md` | How to generate `brief.json` |
| `build-outline.md` | How to generate `outline.json` |
| `build-deck.md` | How to generate MDX slide files |
| `refine-design.md` | How to review and improve a generated deck |
| `components.md` | Reference for all 16 components |
| `templates.md` | Reference for all 12 slide templates |
| `themes.md` | Reference for all 3 themes |

## Do

- Read the relevant prompt file before starting each stage.
- Validate JSON output against the Zod schemas.
- Use actual file paths and package names (not placeholders).
- Write slides that are visually sparse — less text is better.

## Don't

- Skip stages. Each stage depends on the previous one.
- Invent components or templates that don't exist in the codebase.
- Put raw HTML in MDX files — use the provided components.
- Generate more than 15 slides unless the source material demands it.
