---
name: session-summary
description: "Activate when the user asks to summarize, recap, snapshot, or save a digest of the current chat or work session, or when they invoke a /session-summary command. Trigger phrases include: 'summarize session', 'session summary', 'rangkum session', 'simpan ringkasan session', 'save session log', 'recap what we did', 'session handoff', 'session digest'. Output is always written to docs/session/ using the filename pattern YYYY-MM-DD_HH-mm-ss_kebab-case-title.md. Do NOT activate for inline code comments, README or technical docs (use doc-development), git commit messages (use git-commit), or OpenSpec proposals and archives (use the openspec-* skills)."
license: MIT
metadata:
  author: project
---

# Session Summary

Capture the full context of the current working session as a timestamped Markdown file in `docs/session/`, so it can be revisited later or handed off to another agent.

## Overview

A session summary is a self-contained record of one collaborative session between the user and the AI agent. It captures the user's goal, decisions made, files touched, commands executed, problems encountered, and the recommended next steps. The file lives in `docs/session/`, which is git-ignored — these are local notes, not committed artifacts.

## When to Activate

- User asks to summarize, recap, snapshot, or save the current session
- User invokes a slash command like `/session-summary`
- User says any of: "rangkum session", "simpan ringkasan", "save session log", "session digest", "session handoff", "what did we do today"
- User asks to "write down what we just did" or similar
- AI is at the end of a long, multi-step task and the user wants a written record

Do NOT activate for:

- Inline code comments or function docstrings
- README updates or technical documentation (use `doc-development`)
- Git commit messages (use `git-commit`)
- OpenSpec proposals, designs, or change archives (use the `openspec-*` skills)

## Output Location & Filename

All summaries live in:

```text
docs/session/
```

This folder is git-ignored via `docs/session/.gitignore` (excludes everything except itself), so summaries stay local to the developer's machine.

### Filename Pattern

```text
YYYY-MM-DD_HH-mm-ss_kebab-case-title.md
```

| Segment | Format | Example |
|---------|--------|---------|
| Date | `YYYY-MM-DD` | `2026-05-23` |
| Separator | `_` | `_` |
| Time | `HH-mm-ss` (24h, dash-separated) | `17-13-08` |
| Separator | `_` | `_` |
| Title | kebab-case, ≤6 words, ASCII only | `restructure-roles-and-permissions` |
| Extension | `.md` | `.md` |

Full example:

```text
docs/session/2026-05-23_17-13-08_restructure-roles-and-permissions.md
```

### Generating the Timestamp

Use the system clock at the moment the summary is written, not the time the session started.

PowerShell (Windows — this project's primary shell):

```powershell
Get-Date -Format 'yyyy-MM-dd_HH-mm-ss'
```

Bash / macOS / Linux:

```bash
date '+%Y-%m-%d_%H-%M-%S'
```

### Choosing the Title

- Lowercase, kebab-case, ASCII only (no spaces, no diacritics, no punctuation other than `-`)
- Maximum 6 words; aim for 3–5
- Describe the outcome of the session, not the format (`add-user-roles-table`, not `discussion`)
- If the session covered multiple topics, pick the dominant one
- If unclear, ask the user for a one-line title before writing the file

## Workflow

1. **Determine the title.** Pick a concise, descriptive title from the session content. If ambiguous, ask the user.
2. **Resolve the timestamp.** Run `Get-Date -Format 'yyyy-MM-dd_HH-mm-ss'` (or the platform equivalent) to obtain the current time.
3. **Compose the filename.** `docs/session/<timestamp>_<title>.md`.
4. **Draft the summary.** Use the template in the next section. Keep it factual; no marketing language.
5. **Write the file.** Create the Markdown file at the resolved path.
6. **Confirm.** Report the absolute path of the created file back to the user.

## Summary Template

```markdown
# <Title in Title Case>

- **Date:** <YYYY-MM-DD HH:mm:ss timezone>
- **Workspace:** <project name or root path>
- **Branch:** <git branch, if relevant>

## Goal

One paragraph stating what the user wanted to accomplish in this session.

## Outcome

One paragraph stating what was actually achieved. Be honest about partial work.

## Key Decisions

- Decision 1 — rationale in one line
- Decision 2 — rationale in one line

## Changes

### Files Created
- `path/to/file` — purpose

### Files Modified
- `path/to/file` — what changed

### Files Deleted
- `path/to/file` — reason

(Omit any subsection that has no entries.)

## Commands Executed

Only include commands that affected state (migrations, builds, generators, package installs). Skip read-only inspection commands.

\`\`\`bash
php artisan migrate
npm run build
\`\`\`

## Tests & Verification

- What was tested and how (`php artisan test --compact --filter=...`)
- What passed, what failed
- Anything left untested, with reason

## Open Issues / Follow-Ups

- [ ] Pending task 1
- [ ] Pending task 2

## Next Steps

Recommended next actions, in priority order, so the next session (or another agent) can pick up immediately.

## References

- Related specs, PRs, issues, or external docs
```

> Note: in the actual file you write, replace the escaped triple backticks (`\`\`\``) with real triple backticks. They are escaped here only so this template renders inside SKILL.md.

## Patterns & Conventions

- **Always Markdown.** Never use other formats (txt, yml, json) for the summary itself.
- **Keep it factual.** Use neutral, technical language. Avoid hype words ("successfully", "powerful", "amazing").
- **Use relative paths.** When referring to project files, use paths relative to the workspace root.
- **Include only what happened.** Do not invent steps or pad the summary. Empty sections should be omitted, not filled with "N/A".
- **Match the user's primary language.** If the session was conducted in Indonesian, write the body in Indonesian; if English, write in English. The skill itself is documented in English, but the summary content reflects the user.
- **Quote file paths and commands** with backticks.
- **Truncate long outputs.** If a command produced large output, summarize it; do not paste hundreds of lines.
- **Never include secrets** (API keys, tokens, passwords, contents of `.env`). If a secret was discussed, reference it by name only.

## Do and Don't

| Do | Don't |
|----|-------|
| Write to `docs/session/` only | Write to `docs/`, project root, or anywhere else |
| Use the exact filename pattern `YYYY-MM-DD_HH-mm-ss_title.md` | Use spaces, colons, or other separators |
| Use kebab-case ASCII for the title | Use camelCase, snake_case, or non-ASCII characters |
| Generate the timestamp from the system clock at write time | Hardcode dates or guess timestamps |
| Omit empty sections | Fill every section with "N/A" or "None" |
| Match the session's primary language for the body | Force English when the session was in another language |
| Confirm the absolute path back to the user after writing | Silently create the file without acknowledgment |
| Ask for a title if the session topic is ambiguous | Pick an unrelated or generic title like `session-1` |
| Reference secrets by name only | Paste tokens, passwords, or `.env` contents |

## Verification Checklist

Before finalizing:

- [ ] File path matches `docs/session/YYYY-MM-DD_HH-mm-ss_<kebab-title>.md` exactly
- [ ] Timestamp was obtained from the system clock at write time
- [ ] Title is kebab-case, ≤6 words, ASCII only
- [ ] Required sections (Goal, Outcome, Changes, Next Steps) are present and non-empty
- [ ] Empty optional sections were omitted, not stubbed
- [ ] Commands are quoted in fenced code blocks
- [ ] No secrets, tokens, or credentials are included
- [ ] Final absolute path was reported to the user
