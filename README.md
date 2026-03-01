# Slidemason

**Local-first, open-source presentation builder powered by agentic coding workflows.**

Slidemason turns your notes, documents, and data into polished slide decks — without SaaS, without lock-in, and without leaving your terminal. Drop files into a deck's `data/` directory, fill out a brief in the studio, and let your coding agent (Claude Code, Cursor, Copilot, Windsurf) generate a complete presentation from source material. Every slide is custom JSX — bespoke designs with Framer Motion animations, Lucide icons, and Tailwind styling.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![pnpm](https://img.shields.io/badge/pnpm-10+-orange.svg)](https://pnpm.io/)

---

## Features

- **Local-first** — Your data never leaves your machine. No accounts, no telemetry, no cloud.
- **Agent-compatible** — Works with Claude Code, Cursor, Copilot, Windsurf, or any coding agent that can read files.
- **Beautiful by default** — 12 themes with 31 CSS variables each. Ship a polished deck without touching CSS.
- **Custom slides** — Every slide is bespoke JSX using Framer Motion, Lucide icons, and Tailwind + theme variables.
- **Studio workflow** — Upload source files, fill out a brief, copy a prompt, and let your AI agent build the deck.
- **Export to PDF or static web** — Generate a PDF with Playwright or a static site you can host anywhere.
- **Open and inspectable** — Briefs are JSON, slides are TSX. Everything is readable and version-controllable.

---

## Quick Start

```bash
# Clone the repo
git clone https://github.com/erickittelson/slidemason.git
cd slidemason

# Install dependencies
pnpm install

# Start the studio
pnpm dev
```

Then open the studio in your browser. The workflow is:

1. **Create a deck** in the studio sidebar
2. **Upload source files** (PDFs, markdown, notes, data)
3. **Fill out the brief** (audience, goal, tone, theme)
4. **Copy the prompt** and paste it into your AI coding agent
5. **Preview** your slides in the studio as the agent generates them

---

## Project Structure

```
slidemason/
├── packages/
│   ├── renderer/      # Presentation engine with Framer Motion transitions
│   └── themes/        # 12 CSS themes with 31 variables each
├── apps/
│   └── studio/        # Vite-based studio with sidebar workflow
├── decks/             # Each deck is a folder
│   └── <slug>/
│       ├── data/      # Source documents (PDFs, markdown, text, etc.)
│       ├── generated/ # Brief file produced by the studio
│       └── slides.tsx # The deck's slide content (custom JSX)
└── CLAUDE.md          # AI agent instructions for generating slides
```

---

## How Slides Work

Slides are custom JSX using `framer-motion` and `lucide-react`. Each slide is a unique design tailored to its content — no templates, no reusable layouts. The AI agent reads your source material and brief, then designs each slide from scratch.

```tsx
import { motion } from 'framer-motion';
import { Zap, Shield, Globe } from 'lucide-react';

const slides = [
  <div key="s1" className="flex flex-1 flex-col items-center justify-center text-center p-16">
    <motion.h1
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-8xl font-extrabold"
      style={{
        background: 'linear-gradient(135deg, var(--sm-primary), var(--sm-secondary))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
    >
      Your Title
    </motion.h1>
  </div>,
];

export default slides;
```

All colors use theme CSS variables (`var(--sm-primary)`, `var(--sm-surface)`, etc.) so slides look great in any of the 12 themes.

---

## Themes

Slidemason ships with 12 themes: `midnight`, `slate`, `canvas`, `signal`, `noir`, `dawn`, `boardroom`, `neon`, `forest`, `glacier`, `sunset`, `paper`.

Each theme defines 31 CSS custom properties for backgrounds, text, accents, charts, status colors, shadows, and more. Set the theme in the brief and it is applied automatically.

---

## Tech Stack

- **React 19** + **Vite 7** — Fast dev server with hot reload
- **TypeScript 5.9** — End-to-end type safety
- **Tailwind CSS v4** — Utility-first styling
- **Framer Motion** — Slide animations and transitions
- **Lucide React** — Icons for visual anchors
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

# Type-check
pnpm typecheck
```

Please open an issue before submitting large changes so we can discuss the approach.

---

## License

[MIT](LICENSE)
