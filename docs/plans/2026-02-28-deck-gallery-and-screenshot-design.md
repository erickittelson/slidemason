# Multi-Deck Gallery + Screenshot Capture — Design

## Goal

Transform Slidemason from a single-deck dev tool into a proper deck management app. Users can create, browse, open, and delete decks from a gallery landing page. Plus one-click screenshot-to-clipboard for AI iteration workflows.

## Reference

Visual quality target: `/Users/erickittelson/Downloads/Deck-Builder` — pure black canvas, gradient typography, ghost numbers, semi-transparent cards, staggered Framer Motion. Slidemason already matches most of this through its theme system; the gap is the product shell (gallery, navigation, deck lifecycle).

---

## Feature 1: Multi-Deck Gallery

### Filesystem Layout

```
slidemason/
  decks/                          <- new top-level directory
    saberalert/
      data/                       <- source files (PDFs, markdown, etc.)
      data/assets/                <- uploaded images
      generated/brief.json        <- brief metadata
      slides.tsx                  <- the deck
    pitch-q2/
      ...
```

Replaces the current `data/`, `generated/`, and `apps/studio/src/slides.tsx` convention. Each deck is a self-contained folder.

### Vite API Changes

All existing endpoints become deck-scoped:

| Current | New |
|---|---|
| `/__api/files` | `/__api/decks/:slug/files` |
| `/__api/assets` | `/__api/decks/:slug/assets` |
| `/__api/brief` | `/__api/decks/:slug/brief` |
| `/__api/status` | `/__api/decks/:slug/status` |
| (none) | `GET /__api/decks` — list all decks |
| (none) | `POST /__api/decks` — create new deck |
| (none) | `DELETE /__api/decks/:slug` — delete deck |

`GET /__api/decks` returns: `{ slug, title, theme, slideCount, lastModified }[]` by reading each deck's `brief.json` and `slides.tsx`.

### Studio UI Flow

Two modes controlled by `activeDeck: string | null` state:

**Gallery mode** (activeDeck = null):
- Full-screen grid of deck cards
- Each card shows: title (from brief), theme color swatch, slide count, last-modified date
- "+ New Deck" card with name prompt
- Three-dot menu per card: Delete (with confirmation)
- No sidebar, no slide viewer

**Editor mode** (activeDeck = slug):
- Current sidebar + slide viewer, identical to today
- Back arrow in sidebar header returns to gallery
- All API calls scoped to active deck

**Routing:**
- URL hash (`#saberalert`) for bookmarkability
- No react-router — just state + hash listener

### Dynamic Slide Import

The current hardcoded `import slides from './slides'` becomes dynamic. When a deck is selected, the Vite dev server serves the deck's `slides.tsx` via a new endpoint or dynamic import. The simplest approach: a Vite plugin that aliases `virtual:deck-slides` to the active deck's file path, with HMR support.

---

## Feature 2: Screenshot Capture

- Camera icon button in the nav pill (next to fullscreen toggle)
- `html2canvas` captures slide container DOM → canvas → PNG blob
- `navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])` copies to clipboard
- Brief checkmark flash on the button for feedback
- ~30 lines of code, one new dependency

---

## What We're NOT Building

- No auth, no user accounts
- No cloud sync or sharing
- No deck duplication or renaming from UI
- No thumbnail screenshots on gallery cards (just metadata)
- No collaborative editing
- No file saving for screenshots (clipboard only)

---

## Migration

Existing `data/`, `generated/`, and `apps/studio/src/slides.tsx` get migrated into `decks/saberalert/` as a one-time setup step (or automated in the Vite plugin if the old structure is detected).
