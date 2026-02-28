# Slidemason Studio UI Design

## Goal

Transform the studio from a passive slide viewer into an interactive workspace with a collapsible sidebar for file management, brief creation, theme/font selection, and asset uploads — all writing directly to the local filesystem via Vite dev server middleware.

## Target User

Developers using agentic coding tools (Claude Code, Cursor, Windsurf, Copilot) who run `pnpm dev` locally. The studio provides a GUI companion for preparing inputs that the coding agent consumes from the filesystem.

## Architecture: Three Build Modes

| Mode | What shows | How accessed |
|------|-----------|-------------|
| **Dev** (`pnpm dev`) | Sidebar + slide viewer + clickable nav | `localhost:4200` |
| **Web** (`vite build`) | Slide viewer + theme picker + thumbnails + ToC + fullscreen | Static HTML deploy |
| **PDF** (`?print` param) | Slides only, no UI chrome | Headless Playwright screenshot |

Mode detection:
- Dev: `import.meta.env.DEV === true`
- PDF: `new URLSearchParams(location.search).has('print')`
- Web: everything else (production build, no `?print`)

---

## Dev Mode: Collapsible Left Sidebar

### Layout
- Sidebar: 320px wide, collapsible to 48px icon rail
- Slide viewer: fills remaining width
- Sidebar sections scroll independently

### Sidebar Sections (top to bottom)

#### 1. Header
- "Slidemason" wordmark + collapse/expand toggle

#### 2. Quick Start Guide
- Contextual "next step" based on project state:
  - No files in `data/` → "Drop files below to get started"
  - Files present but no brief → "Fill in the brief form"
  - Brief exists but no deck → "Tell your agent: read `prompts/build-outline.md`"
  - Deck generated → "Your deck is ready! Navigate to preview"
- Copy-to-clipboard buttons for agent commands

#### 3. File Upload Zone
- Drag & drop area + click to browse
- List of current files in `data/` with delete buttons
- Supported formats: PDF, MD, TXT, CSV, DOCX, images
- Uploads via `POST /__api/files` → writes to `data/`

#### 4. Brief Form
- Title (text input)
- Audience (text input)
- Goal (text input)
- Tone (dropdown: professional, casual, inspirational, technical)
- Constraints (textarea)
- "Save Brief" button → `POST /__api/brief` → writes `generated/brief.json`
- Auto-loads existing brief on mount via `GET /__api/brief`

#### 5. Theme Picker
- Grid of 12 color swatches (bg + primary color preview)
- Clicking switches theme live (updates `data-theme` attribute)
- Active theme highlighted with ring/border
- Theme choice saved to brief.json

#### 6. Font Picker
- Heading font dropdown (Inter, Playfair Display, Space Grotesk, Montserrat, DM Serif Display)
- Body font dropdown (Inter, Source Serif 4, IBM Plex Sans, Lora, Nunito)
- Live preview: updates `--sm-heading-font` / `--sm-body-font` CSS vars
- Fonts loaded via Google Fonts `<link>` injection
- Saved to brief.json as `fonts: { heading, body }`

#### 7. Asset Library
- Logo upload → saved to `data/assets/logo.*`
- Image uploads → saved to `data/assets/`
- Thumbnail grid of uploaded assets
- Delete button per asset

---

## Web Mode: Viewer Features

All client-side, no server needed:

- **Theme picker toggle** — floating button (bottom-left) opens a small theme swatch panel
- **Clickable nav arrows** — bottom-right prev/next buttons
- **Keyboard navigation** — arrow keys, space
- **Slide thumbnails** — bottom strip of mini slide previews, click to jump
- **Table of contents** — overlay panel listing slide headlines, click to jump
- **Fullscreen toggle** — button that calls `document.requestFullscreen()`

---

## PDF Mode

- URL param `?print` activates
- All UI chrome hidden (no sidebar, no nav, no overlays)
- Just the slide content filling the viewport
- Playwright navigates to each `?print&slide=N` and screenshots

---

## Clickable Navigation (fix)

Replace the current static `← →` text in `SlideRenderer.tsx`:
- Left arrow: `<button>` calling `prev()`, styled as subtle icon
- Right arrow: `<button>` calling `next()`, styled as subtle icon
- Slide counter: `3 / 8` text between buttons
- Fullscreen button (web + dev modes)
- All hidden in PDF mode

---

## Vite Dev Server API (Plugin)

A Vite plugin (`vite-plugin-studio-api`) that adds middleware routes in dev mode only:

| Route | Method | What it does |
|-------|--------|-------------|
| `/__api/files` | GET | List files in `data/` |
| `/__api/files` | POST (multipart) | Upload file to `data/` |
| `/__api/files/:name` | DELETE | Remove file from `data/` |
| `/__api/brief` | GET | Read `generated/brief.json` |
| `/__api/brief` | POST | Write `generated/brief.json` |
| `/__api/assets` | GET | List assets in `data/assets/` |
| `/__api/assets` | POST (multipart) | Upload to `data/assets/` |
| `/__api/assets/:name` | DELETE | Remove from `data/assets/` |
| `/__api/status` | GET | Project state (has files? has brief? has deck?) |

Uses Node `fs` to read/write. Multipart parsing via `busboy` or similar.

---

## Feature Matrix

| Feature | Dev | Web | PDF |
|---------|-----|-----|-----|
| Slide viewer | Yes | Yes | Yes |
| Clickable nav arrows | Yes | Yes | No |
| Keyboard nav | Yes | Yes | No |
| Theme picker | Sidebar | Floating toggle | No |
| Font picker | Sidebar | No | No |
| Slide thumbnails | Sidebar | Bottom strip | No |
| Table of contents | Sidebar | Overlay | No |
| Fullscreen toggle | Yes | Yes | No |
| Sidebar | Yes | No | No |
| File upload | Yes | No | No |
| Brief form | Yes | No | No |
| Asset library | Yes | No | No |
| Quick start guide | Yes | No | No |
| Vite API middleware | Yes | N/A | N/A |

---

## Dependencies

- `busboy` — multipart form parsing for file uploads (Vite middleware)
- Google Fonts — loaded dynamically via `<link>` for font picker
- No new frontend framework dependencies — all built with React + existing CSS system
