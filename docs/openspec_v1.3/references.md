# OpenSpec v1.3 Reference

> OpenSpec is a lightweight spec-driven framework for AI coding assistants. It helps you and your AI agree on what to build before any code is written.

## Overview

OpenSpec adds a planning layer on top of AI coding tools. Each change produces a spec delta that captures how system requirements are being modified — making it easy to review intent, not just code.

## Key Concepts

- **Specs** (`openspec/specs/`) — Source of truth for system behavior
- **Changes** (`openspec/changes/`) — Proposed modifications with artifacts
- **Artifacts** — proposal.md, specs/, design.md, tasks.md
- **Delta Specs** — ADDED/MODIFIED/REMOVED requirements per change
- **Schemas** — Configurable workflows (default: `spec-driven`)

## Installation

```bash
npm install -g @fission-ai/openspec@latest
cd your-project
openspec init
```

## Default Workflow (core profile)

```
/opsx:propose → /opsx:apply → /opsx:sync → /opsx:archive
```

## References

- [001_getting-started.md](references/001_getting-started.md): First steps, project structure, example walkthrough
- [002_workflows.md](references/002_workflows.md): Workflow patterns (quick feature, exploratory, parallel changes)
- [003_commands.md](references/003_commands.md): Slash command reference for all AI tools
- [004_cli.md](references/004_cli.md): Terminal CLI commands (init, update, list, validate, archive, etc.)
- [005_customization.md](references/005_customization.md): Project config, custom schemas, templates

## Links

- Website: https://openspec.dev
- GitHub: https://github.com/Fission-AI/OpenSpec
- Discord: https://discord.gg/YctCnvvshC
