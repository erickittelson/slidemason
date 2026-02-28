# Ingest — Reading the Manifest

After running `slidemason ingest` (or calling the `ingest()` function from `@slidemason/core`), a file is written to `generated/manifest.json`. This file is the starting point for all downstream stages.

## What manifest.json Contains

The manifest is a JSON object validated by `ManifestSchema` from `packages/core/src/schemas/manifest.ts`.

```json
{
  "generatedAt": "2026-02-27T10:00:00.000Z",
  "dataDir": "data",
  "files": [
    {
      "path": "data/overview.md",
      "name": "overview.md",
      "type": "markdown",
      "size": 2048,
      "modifiedAt": "2026-02-26T15:30:00.000Z"
    },
    {
      "path": "data/metrics.csv",
      "name": "metrics.csv",
      "type": "csv",
      "size": 512,
      "modifiedAt": "2026-02-25T09:00:00.000Z"
    }
  ]
}
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `generatedAt` | string (ISO 8601) | When the manifest was created |
| `dataDir` | string | Path to the scanned directory |
| `files` | array | List of discovered source files |
| `files[].path` | string | Relative path from project root |
| `files[].name` | string | File name only |
| `files[].type` | enum | One of: `markdown`, `text`, `json`, `csv`, `image` |
| `files[].size` | number | File size in bytes |
| `files[].modifiedAt` | string (ISO 8601) | Last modification time |

### Supported File Types

The ingestion logic maps extensions to types:

| Extension | Type |
|-----------|------|
| `.md` | `markdown` |
| `.txt` | `text` |
| `.json` | `json` |
| `.csv` | `csv` |
| `.png`, `.jpg`, `.jpeg`, `.webp` | `image` |

Files with unrecognized extensions are silently skipped.

## How to Use the Manifest

After reading `generated/manifest.json`, categorize the files and read their contents in preparation for the brief-building stage.

### What to Look For by File Type

**Markdown files** — These are usually the richest source. Look for:
- Document title (first `#` heading)
- Key themes and arguments
- Audience clues (who is this written for?)
- Conclusions or recommendations
- Any structure hints (numbered lists, sections)

**CSV files** — Structured data, typically metrics or comparisons. Look for:
- Column headers (what is being measured?)
- Standout values (highs, lows, trends)
- Row count (how much data is there?)
- Whether this is time-series, categorical, or comparison data

**JSON files** — Structured data or configuration. Look for:
- Schema/shape of the data
- Whether it contains lists, hierarchies, or key-value pairs
- Any metadata fields

**Text files** — Unstructured content. Look for:
- Key paragraphs or quotes
- Lists or enumerated points
- Any identifiable structure

**Image files** — Visual assets. Note:
- File name (often descriptive)
- Size (large images may be hero visuals, small ones may be icons)
- You cannot read image content, but you can reference them in slides via their path

## Do

- Read every file listed in the manifest before building the brief.
- Note which files are most relevant to the presentation's core message.
- Track image file paths so you can reference them in slides later.

## Don't

- Assume file order in the manifest implies presentation order.
- Ignore small files — a 200-byte markdown file might contain the key thesis.
- Try to read files not listed in the manifest.
