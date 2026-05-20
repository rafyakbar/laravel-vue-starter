---
name: doc-development
description: "Activate when the user asks to create, update, or manage documentation files in the docs/ directory, especially llms.txt-style reference documents. Covers writing references.md index files, numbered reference files (001_*.md, 002_*.md), organizing docs into topic folders, and following the llms.txt v1 specification format. Use when working in docs/, creating new documentation sets, or adding new references to existing topics. Do NOT activate for inline code comments, README.md updates, or skill documentation (use skill-development instead)."
license: MIT
metadata:
  author: project
---

# Documentation Development

Patterns and conventions for creating and maintaining structured LLM-friendly documentation in this project.

## Overview

This project uses a structured documentation format inspired by the llms.txt specification. Documentation lives in `docs/` and is organized into topic folders, each containing a `references.md` index and numbered reference files. This format is optimized for AI/LLM consumption while remaining human-readable.

## When to Activate

- User asks to create new documentation or a docs folder
- User asks to document a specification, API, or concept for LLM consumption
- User references `docs/`, `references.md`, or numbered reference files
- User mentions "llms.txt", "LLM-friendly docs", or "documentation set"
- User wants to add a new reference to an existing documentation topic

## When NOT to Activate

- Writing inline code comments or PHPDoc blocks
- Updating `README.md` at project root
- Creating or editing skill files (`SKILL.md`) — use `skill-development` instead
- Writing test documentation

## Scope

- **In scope:** Creating `docs/<topic>/` folders, `references.md` index files, numbered reference files, maintaining consistent format
- **Out of scope:** Code documentation (PHPDoc), README, skill files, changelog

## Directory Structure Convention

```text
docs/
└── <topic>_v<version>/
    ├── references.md              ← Index/overview file (REQUIRED)
    └── references/                ← Detailed reference files
        ├── 001_<subject>.md
        ├── 002_<subject>.md
        └── ...
```

### Naming Rules

- **Topic folders:** `<topic>_v<version>` using snake_case (e.g., `openspec_v1.3`, `sanctum_v4`, `vue-router_v4`)
- **Reference files:** `NNN_<subject>.md` with zero-padded 3-digit prefix and kebab-case subject (e.g., `001_getting-started.md`, `002_workflows.md`)
- **Index file:** always named `references.md` — never `index.md`, `README.md`, or other names
- **Subject naming:** use kebab-case, descriptive, short (e.g., `api-authentication` not `how_to_authenticate_with_the_api`)

### Versioning Strategy

- Always include version in folder name to allow multiple versions to coexist
- Use the major version or exact version matching the documented tool/spec (e.g., `_v1`, `_v1.3`, `_v4`)
- When a new major version is documented, create a new folder — do not overwrite the old one

## File Format: references.md (Index)

The index file provides an overview and links to all reference files. This is the entry point for any AI agent consuming the documentation.

```markdown
# <Topic Title>

> One-line summary of what this documentation covers.

## Overview

Brief paragraph explaining the topic and why it's documented here.
Include the target audience and what problems this documentation solves.

## Key Concepts

- **Term 1** — Brief definition
- **Term 2** — Brief definition
- Core concepts that readers must understand before diving into references

## References

- [001_getting-started.md](references/001_getting-started.md): First steps and basic setup
- [002_core-concepts.md](references/002_core-concepts.md): Fundamental patterns and architecture
- [003_advanced-usage.md](references/003_advanced-usage.md): Advanced patterns and edge cases

## Links

- Website: https://example.com
- GitHub: https://github.com/org/repo
- Documentation: https://docs.example.com
```

### Index File Rules

- The `# H1` heading MUST match the topic name and version
- The `> blockquote` is a one-sentence summary — keep it under 150 characters
- `## Key Concepts` lists terms/ideas needed to understand the references
- `## References` lists ALL reference files with relative links and one-line descriptions
- `## Links` provides external URLs for the original source material
- Do NOT include `## Use Cases` or `## Key Idea` sections unless they add unique value beyond the overview
- Every file in `references/` MUST appear in the References list — no orphan files

## File Format: Reference Files (NNN_*.md)

Each reference file is a self-contained document covering one aspect of the topic.

### Header Template

```markdown
# <Reference Title>

> Source: <original_url_if_applicable>

Author: <author_name> (if known)
Published: <date> (if known)
```

### Body Structure

```markdown
## Background

Context and motivation — why does this matter?

## <Core Content Sections>

Main documentation organized by logical sections.
Use descriptive H2 headings that answer "what will I learn here?"

### Subsections

Use H3 for breaking down complex sections.

## Examples

Concrete code examples or usage patterns when applicable.

## Best Practices

Actionable recommendations — what should and shouldn't be done.
```

### Content Guidelines for Reference Files

- **Self-contained:** Each file must be understandable without reading other files
- **Concise prose:** Write for LLM consumption — clear, direct, no filler
- **Define jargon:** Explain technical terms on first use
- **Code blocks:** Always include language identifier (```php, ```bash, ```json)
- **One concept per heading:** Don't mix topics within a section
- **Source attribution:** Always cite when content is derived from external sources
- **Paraphrase:** Never reproduce more than 30 consecutive words from external sources
- **Actionable:** Include "how to" guidance, not just "what is" descriptions

### Content Quality Standards

- No placeholder text or TODO comments in published reference files
- All code examples must be syntactically valid
- All URLs must be real and accessible (no example.com in Links sections of actual docs)
- File length: aim for 100-500 lines per reference — split if longer, merge if shorter

## Creating a New Documentation Set

### Step 1 — Determine scope and version

Decide:
- What topic are you documenting?
- What version of the tool/spec/library?
- How many reference files will you need? (plan 3-7 files for most topics)

### Step 2 — Create the folder structure

```text
docs/<topic>_v<version>/
├── references.md
└── references/
    ├── 001_<first-subject>.md
    ├── 002_<second-subject>.md
    └── ...
```

### Step 3 — Write the index (references.md)

Start here. The index defines the scope and structure of the entire documentation set. Follow the index format above exactly.

### Step 4 — Write reference files in order

- Number sequentially: `001_`, `002_`, `003_`
- Order from foundational → specific → advanced:
  - `001_` = Getting started, overview, installation
  - `002_` = Core concepts, main workflows
  - `003_` = Commands, API reference
  - `004_`+ = Advanced topics, customization, edge cases
- Each file is independent — a reader should be able to jump to any file

### Step 5 — Cross-reference check

- Every file in `references/` is linked from `references.md`
- All relative links resolve correctly
- No broken references between files
- No duplicate content across files

### Step 6 — Verify against quality standards

- Run through Content Quality Standards above
- Ensure all code examples are valid
- Confirm source attributions are present where needed

## Adding a Reference to an Existing Set

When adding a new reference file to an existing documentation set:

1. Determine the next available number (check existing files)
2. Create `NNN_<subject>.md` following the reference file format
3. Add the entry to `references.md` in the correct position (maintain numerical order)
4. Verify the link resolves correctly

## Updating Existing Documentation

When updating an existing documentation set for a new version:

- **Minor update (same version):** Edit files in place, maintain same structure
- **Major version bump:** Create a new folder (e.g., `docs/topic_v2/`) — do NOT delete the old version unless explicitly asked

## Do and Don't

| Do                                              | Don't                                             |
|-------------------------------------------------|---------------------------------------------------|
| Use snake_case for folder names                 | Use spaces or camelCase in folder names            |
| Zero-pad reference numbers (001, 002)           | Use unpadded numbers (1, 2)                        |
| Write self-contained reference files            | Require reading files in sequence                  |
| Include source attribution                      | Copy content without citing                        |
| Keep index summaries to one line                | Write paragraphs in the reference list             |
| Use relative links in references.md             | Use absolute paths or URLs to local files          |
| Version the topic folder (e.g., `_v1`)          | Leave version ambiguous                            |
| Use kebab-case for reference file subjects      | Use snake_case or spaces in filenames              |
| Order references foundational → advanced        | Randomly order reference files                     |
| Keep each reference 100-500 lines               | Write 1000+ line monolithic references             |
| Paraphrase external content                     | Reproduce verbatim blocks from sources             |
| Include valid, working code examples            | Leave placeholder or pseudo-code in examples       |
