# OpenSpec Customization

> Source: https://github.com/Fission-AI/OpenSpec/blob/main/docs/customization.md

## Three Levels of Customization

| Level | Purpose | Who |
|-------|---------|-----|
| Project Config | Set defaults, inject context/rules | Most teams |
| Custom Schemas | Define your own workflow artifacts | Teams with unique processes |
| Global Overrides | Share schemas across all projects | Power users |

## Project Configuration

The `openspec/config.yaml` file is the easiest customization. It lets you:
- Set a default schema
- Inject project context (tech stack, conventions)
- Add per-artifact rules

### Example config.yaml

```yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, Vue 3, Laravel 13
  We use conventional commits
  Domain: SPA admin panel

rules:
  proposal:
    - Include rollback plan
    - Identify affected teams
  specs:
    - Use Given/When/Then format
  design:
    - Include file paths for new files
  tasks:
    - Break into chunks under 30 minutes
```

### How It Works

- **Context** appears in ALL artifacts as background for the AI
- **Rules** appear ONLY for the matching artifact type
- Neither context nor rules should appear in the output — they guide AI behavior

### Schema Resolution Order

1. CLI flag: `--schema <name>`
2. Change metadata (`.openspec.yaml`)
3. Project config (`openspec/config.yaml`)
4. Default (`spec-driven`)

## Custom Schemas

When project config isn't enough, create custom workflows in `openspec/schemas/`.

### Fork an Existing Schema

```bash
openspec schema fork spec-driven my-workflow
```

Creates:
```
openspec/schemas/my-workflow/
├── schema.yaml
└── templates/
    ├── proposal.md
    ├── spec.md
    ├── design.md
    └── tasks.md
```

### Schema Structure (schema.yaml)

```yaml
name: my-workflow
version: 1
description: My team's custom workflow

artifacts:
  - id: proposal
    generates: proposal.md
    template: proposal.md
    instruction: |
      Create a proposal explaining WHY this change is needed.
    requires: []

  - id: design
    generates: design.md
    template: design.md
    instruction: |
      Create a design document explaining HOW to implement.
    requires:
      - proposal

  - id: tasks
    generates: tasks.md
    template: tasks.md
    requires:
      - design

apply:
  requires: [tasks]
  tracks: tasks.md
```

Key fields:
- `id` — Unique identifier
- `generates` — Output filename (supports globs)
- `template` — Template file in templates/ directory
- `instruction` — AI instructions for creating the artifact
- `requires` — Dependencies (which artifacts must exist first)

### Validate Custom Schema

```bash
openspec schema validate my-workflow
```

### Example: Rapid Iteration Workflow

```yaml
name: rapid
version: 1
description: Fast iteration with minimal overhead

artifacts:
  - id: proposal
    generates: proposal.md
    template: proposal.md
    requires: []

  - id: tasks
    generates: tasks.md
    template: tasks.md
    requires: [proposal]

apply:
  requires: [tasks]
  tracks: tasks.md
```

### Example: Adding a Review Artifact

Fork default and add a review step between design and tasks:

```yaml
- id: review
  generates: review.md
  template: review.md
  instruction: |
    Create a review checklist (security, performance, testing).
  requires:
    - design
```

Then update tasks to require review.
