# Getting Started with OpenSpec

> Source: https://github.com/Fission-AI/OpenSpec/blob/main/docs/getting-started.md

## How It Works

OpenSpec helps you and your AI coding assistant agree on what to build before code is written.

Default quick path (core profile):

```
/opsx:propose → /opsx:apply → /opsx:sync → /opsx:archive
```

Expanded path (custom workflow selection):

```
/opsx:new → /opsx:ff or /opsx:continue → /opsx:apply → /opsx:verify → /opsx:archive
```

## What OpenSpec Creates

After `openspec init`, your project has this structure:

```
openspec/
├── specs/              # Source of truth (system behavior)
│   └── <domain>/
│       └── spec.md
├── changes/            # Proposed updates (one folder per change)
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # Delta specs (what's changing)
│           └── <domain>/
│               └── spec.md
└── config.yaml         # Project configuration
```

## Two Key Directories

- `specs/` — Source of truth. Describes how the system currently behaves. Organized by domain.
- `changes/` — Proposed modifications. Each change gets its own folder with all related artifacts. When complete, its specs merge into main `specs/`.

## Artifacts in Each Change

| Artifact | Purpose |
|----------|---------|
| proposal.md | The "why" and "what" — captures intent, scope, approach |
| specs/ | Delta specs showing ADDED/MODIFIED/REMOVED requirements |
| design.md | The "how" — technical approach and architecture decisions |
| tasks.md | Implementation checklist with checkboxes |

Artifacts build on each other:

```
proposal → specs → design → tasks → implement
```

You can always go back and refine earlier artifacts as you learn more.

## Delta Specs Format

Delta specs use sections to indicate the type of change:

```markdown
## ADDED Requirements

### Requirement: Two-Factor Authentication
The system MUST require a second factor during login.

#### Scenario: OTP required
- GIVEN a user with 2FA enabled
- WHEN the user submits valid credentials
- THEN an OTP challenge is presented

## MODIFIED Requirements

### Requirement: Session Timeout
The system SHALL expire sessions after 30 minutes of inactivity.

## REMOVED Requirements

### Requirement: Remember Me
(Deprecated in favor of 2FA)
```

## What Happens on Archive

1. ADDED requirements are appended to the main spec
2. MODIFIED requirements replace the existing version
3. REMOVED requirements are deleted from the main spec
4. Change folder moves to `openspec/changes/archive/` for audit history

## Verifying and Reviewing (CLI)

```bash
openspec list          # List active changes
openspec show <name>   # View change details
openspec validate <name>  # Validate spec formatting
openspec view          # Interactive dashboard
```
