# Slidemason V1 Design

## Project Identity

- **Name:** slidemason
- **Repo:** erickittelson/slidemason (personal GitHub, public, MIT license)
- **Description:** Local-first, open-source presentation builder powered by agentic coding workflows
- **Package manager:** pnpm workspaces
- **Stack:** React 19, Vite, TypeScript, Tailwind CSS v4, MDX, Playwright, Vitest

## Architecture

### Approach: Full Pipeline

Build the complete pipeline from day one: ingest -> brief -> outline -> MDX slides -> preview -> export. All packages wired up in a pnpm monorepo. Ships with 3 themes, 12 templates, 16 components.

### AI Execution Model: Agent-Only

No built-in LLM calls. Prompt files in `/prompts` guide the user's coding agent (Claude Code, Cursor, Copilot, Windsurf). Zero API key setup. The CLI handles scaffolding, validation, preview, and export. The agent handles content generation.

---

## Repo Structure

```
slidemason/
  apps/
    studio/                  # Vite + React dev preview app
  packages/
    cli/                     # CLI commands
    core/                    # Schema types, validation, ingestion logic
    renderer/                # React slide runtime + MDX processing
    components/              # Reusable slide components
    themes/                  # Theme packs
    export/                  # PDF + static export via Playwright
  data/                      # User drops source files here
  generated/                 # Output: brief.json, outline.json, deck/
  prompts/                   # Agent prompt files
  examples/                  # Example data + generated decks
  docs/                      # Documentation
  scripts/                   # Build/publish helpers
  package.json
  pnpm-workspace.yaml
  tsconfig.json
  .gitignore
  README.md
```

---

## Data Pipeline

### Flow

```
/data (raw files) -> ingest -> brief.json -> outline.json -> MDX slides -> preview/export
```

### Ingestion (packages/core)

- Recursively scans `/data` for supported file types (.md, .txt, .json, .csv, .png, .jpg, .jpeg, .webp)
- Categorizes files: text content, structured data, images
- Extracts text content and metadata (filename, type, size, modified date)
- Produces `generated/manifest.json` listing all discovered sources
- Respects `.slidemasonignore` for exclusion rules

### Brief Generation (agent-driven)

- Agent reads manifest + source files
- Agent follows `prompts/build-brief.md`
- Outputs `generated/brief.json`: title, audience, goal, tone, themes, sources, constraints
- Schema validated by packages/core with Zod

### Outline Generation (agent-driven)

- Agent reads brief + source files
- Agent follows `prompts/build-outline.md`
- Outputs `generated/outline.json`: slide entries with id, type, intent, headline, components, notes seed
- Schema validated by packages/core with Zod

### Slide Generation (agent-driven)

- Agent reads outline + available templates/components
- Agent follows `prompts/build-deck.md`
- Outputs MDX files in `generated/deck/` (one per slide)
- Each MDX file imports from @slidemason/components and uses theme tokens

---

## Renderer

### packages/renderer

- React 19 + Vite + MDX
- Each slide is an MDX file rendered as a full-viewport React component
- Slide sequencing via `deck.config.json` (generated)
- Keyboard navigation (arrow keys, space)
- URL-based slide routing (/slide/3)
- Fixed 16:9 aspect ratio with responsive scaling
- Hot reload via Vite HMR

### apps/studio

- Vite dev server wrapping the renderer
- `slidemason dev` starts this
- Optional sidebar with slide thumbnails

---

## Components (packages/components) — V1

| Component | Description |
|-----------|-------------|
| Headline | Primary heading block |
| Subheadline | Secondary heading |
| BulletGroup | Styled bullet list |
| NumberedSteps | Ordered step list |
| StatCard | Single metric with label |
| StatGrid | Grid of 2-4 stat cards |
| QuoteCallout | Styled quote block |
| TwoColumn | Side-by-side layout |
| ThreeCard | Three-card row layout |
| ImagePanel | Image with optional caption |
| KPIStrip | Horizontal KPI bar |
| TimelineRow | Timeline entry |
| ComparisonMatrix | Side-by-side comparison table |
| SectionLabel | Section divider label |
| FooterMark | Logo/footer element |
| PresenterNotes | Speaker notes (hidden in present mode) |

---

## Templates (packages/renderer/templates) — V1

- title-hero
- agenda
- section-divider
- two-column-argument
- quote-insight
- stat-grid
- image-caption
- comparison-table
- timeline
- roadmap
- recommendation-ask
- appendix

Each template composes components into a standard slide layout.

---

## Themes (packages/themes) — V1

1. **Slate** — Dark, professional, high-contrast
2. **Canvas** — Light, clean, minimal
3. **Signal** — Bold colors, strong typography

Theme tokens via CSS custom properties + Tailwind v4:
- Typography (font families, sizes, weights)
- Color palette (primary, secondary, accent, bg, text, muted)
- Spacing scale
- Corner radius
- Shadow levels
- Slide background patterns/gradients

---

## CLI (packages/cli)

| Command | Description |
|---------|-------------|
| slidemason init | Scaffold a new project |
| slidemason ingest | Scan /data, produce manifest.json |
| slidemason validate | Validate brief.json and outline.json schemas |
| slidemason dev | Start local preview (Vite dev server) |
| slidemason build | Build static slide app |
| slidemason export pdf | Export to PDF via Playwright |
| slidemason export static | Export static HTML/CSS/JS |
| slidemason publish github | Deploy to GitHub Pages |
| slidemason publish gitlab | Deploy to GitLab Pages |

---

## Export (packages/export)

### PDF

- Playwright headless Chromium
- Navigate each slide, capture as PDF page
- Merge into single PDF
- WYSIWYG: preview matches export

### Static

- Vite production build
- Output to dist/
- Self-contained, deployable to any static host

---

## Agent Prompt Files

| File | Purpose |
|------|---------|
| prompts/system.md | Project overview, conventions, file structure |
| prompts/ingest.md | How to read the manifest |
| prompts/build-brief.md | Generate brief.json from sources |
| prompts/build-outline.md | Generate outline.json from brief |
| prompts/build-deck.md | Generate MDX slides from outline |
| prompts/refine-design.md | Design review/refinement pass |
| prompts/components.md | Component reference with props and examples |
| prompts/templates.md | Template reference with usage guidance |
| prompts/themes.md | Theme reference |

---

## End-to-End Workflow

1. User runs `slidemason init` (or clones repo)
2. User drops files into `/data`
3. User runs `slidemason ingest` -> produces manifest.json
4. User tells agent: "Follow prompts in /prompts to build a deck"
5. Agent generates brief.json, user runs `slidemason validate`
6. Agent generates outline.json, user validates
7. Agent generates MDX slides in generated/deck/
8. User runs `slidemason dev` to preview
9. User asks agent to refine if needed
10. User runs `slidemason export pdf` or `slidemason export static`
11. Optionally `slidemason publish github`

---

## Key Design Principles

- Every intermediate artifact is human-readable and hand-editable
- Agent-compatible but not agent-dependent
- Zod schemas as the contract between agent and system
- CSS custom properties for theme tokens (works at CSS level, not just JS)
- Prompt files serve as both agent instructions and human documentation

---

## Non-Goals for V1

- Real-time collaboration
- Cloud-hosted generation
- Auth / accounts
- Drag-and-drop editor
- PowerPoint round-trip
- Animation timeline
- Plugin marketplace
- Desktop packaging

## Success Criteria

- New user generates a credible deck locally in under 30 minutes
- Output is visibly better than generic AI slide tools
- Repo structure is clear and navigable
- Themes and templates are reusable
- Exports are consistent
