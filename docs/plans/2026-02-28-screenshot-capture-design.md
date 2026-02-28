# Screenshot Capture — Design

## Goal

One-click capture of the current slide to clipboard as PNG, so users can paste it into Claude Code, Cursor, or any AI chat to request visual changes.

## Architecture

- Add `html2canvas` dependency (~40KB)
- Camera icon button added to the existing nav pill in `SlideRenderer.tsx`
- On click: capture slide container DOM element → canvas → blob → `navigator.clipboard.write()`
- Brief visual feedback (checkmark flash) on the button — no toast component

## Scope

- ~30 lines in `SlideRenderer.tsx` (button + handler)
- One new dependency (`html2canvas`)
- No new files, no new components

## What It Does NOT Do

- No file saving (clipboard only)
- No annotation/markup overlay
- No watermark or slide number stamp
