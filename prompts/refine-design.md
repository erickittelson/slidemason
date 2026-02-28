# Refine Design — Reviewing and Improving a Generated Deck

After generating slides, review the entire deck for visual consistency, narrative flow, and content density. This stage catches problems that only become visible when you look at the deck as a whole.

**Input**: `generated/deck/*.mdx` + `generated/deck/deck.config.json` + `generated/outline.json`
**Output**: Updated MDX files in `generated/deck/`

## Review Checklist

Work through each check in order. Fix issues as you find them.

### 1. Visual Hierarchy Check

For each slide, verify:

- [ ] The headline is the most prominent text element.
- [ ] Supporting content is clearly secondary (smaller, lighter, or indented).
- [ ] No more than 3 levels of visual hierarchy per slide (headline, body, detail).
- [ ] Stats and numbers stand out from labels and descriptions.

**Common fixes**:
- If a slide has too much text at the same visual weight, split it into two slides or convert some text to `PresenterNotes`.
- If a stat label is longer than the stat value, the visual emphasis is inverted — shorten the label.

### 2. Consistency Check

Across the full deck, verify:

- [ ] Similar content types use the same template. (Don't use `two-column-argument` for one comparison and `comparison-table` for another unless the data shape differs.)
- [ ] Headlines follow the same grammatical pattern. (All questions, all statements, or all action phrases — don't mix.)
- [ ] Bullet points use the same sentence structure. (All start with verbs, or all are noun phrases.)
- [ ] Stat formatting is consistent. (`$12.3M` on one slide and `12.3 million dollars` on another is inconsistent.)

**Common fixes**:
- Rewrite headlines to follow a single pattern.
- Normalize number formats: use `$12.3M` not `$12,300,000`, use `23%` not `23 percent`.
- If two slides serve similar purposes, consider whether one should be cut.

### 3. Flow Check

Read the slides in order (follow `deck.config.json` slide sequence) and verify:

- [ ] The narrative builds logically. Each slide follows naturally from the previous one.
- [ ] Section dividers appear at natural transition points.
- [ ] The opening (slides 1-2) establishes context before diving into detail.
- [ ] The closing (last 1-2 slides) ends with action, not data.
- [ ] No slide feels like a non-sequitur.

**Common fixes**:
- Add a `section-divider` slide between unrelated topics.
- Reorder slides so that context precedes evidence.
- Move data-heavy slides earlier and action slides later.
- If the deck ends on a `stat-grid` or `comparison-table`, add a `recommendation-ask` after it.

### 4. Density Check

For each slide, verify:

- [ ] No slide has more than 5 bullet points.
- [ ] No bullet point exceeds 30 words.
- [ ] No headline exceeds 10 words.
- [ ] Stat grids have 2-4 stats (not more).
- [ ] Timeline slides have 3-6 events (not more).
- [ ] Comparison tables have 3-5 rows (not more).

**Common fixes**:
- Split overcrowded slides into two.
- Move low-priority points to an `appendix` slide or to `PresenterNotes`.
- Shorten long bullet points by removing qualifiers and hedging language.
- For stat grids with more than 4 stats, keep the 4 most impactful and move others to supporting slides.

### 5. Theme Check

Verify the deck uses the theme correctly:

- [ ] `deck.config.json` has the correct `theme` value (matches `outline.json`).
- [ ] No hardcoded color values in MDX files (all color comes from CSS custom properties via components).
- [ ] Components use `className` overrides sparingly and only for layout, not color.

**Common fixes**:
- Remove any inline `style` props or hardcoded hex colors.
- Ensure all text colors come from theme variables (`--sm-text`, `--sm-muted`, `--sm-primary`).

### 6. Component Usage Check

Verify correct component and template usage:

- [ ] Each MDX file imports only what it uses.
- [ ] Templates are imported from `@slidemason/renderer`.
- [ ] Additional components (like `PresenterNotes`) are imported from `@slidemason/components`.
- [ ] JSX syntax is correct (arrays use `{[...]}`, objects use `{{ key: "value" }}`).
- [ ] All image `src` paths reference actual files from the manifest.

**Common fixes**:
- Fix malformed JSX prop syntax.
- Remove unused imports.
- Replace broken image paths with paths from `generated/manifest.json`.

## Refinement Principles

1. **Subtract before you add.** The best refinement is often removing content, not adding it.
2. **One idea per slide.** If a slide makes two points, it should probably be two slides.
3. **Headlines carry the story.** A reader should understand the deck's argument by reading only the headlines in sequence.
4. **Data supports, doesn't overwhelm.** Show the 3 most impactful numbers, not all 20.
5. **End with energy.** The last content slide should be forward-looking and action-oriented.

## Do

- Read every MDX file before making changes.
- Check the deck config slide order against the actual files.
- Test that the refined deck still validates (correct imports, valid JSX).
- Preserve the original outline's intent for each slide.

## Don't

- Add new slides that weren't in the outline without updating `outline.json` and `deck.config.json`.
- Change the theme without updating both `outline.json` and `deck.config.json`.
- Rewrite content to the point where it no longer reflects the source material.
- Over-optimize — a good deck shipped today beats a perfect deck shipped never.
