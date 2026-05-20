# OpenSpec Commands

> Source: https://github.com/Fission-AI/OpenSpec/blob/main/docs/commands.md

## Quick Reference

### Default (core profile)

| Command | Purpose |
|---------|---------|
| `/opsx:propose` | Create change + generate all planning artifacts in one step |
| `/opsx:explore` | Think through ideas before committing to a change |
| `/opsx:apply` | Implement tasks from the change |
| `/opsx:sync` | Merge delta specs into main specs |
| `/opsx:archive` | Archive a completed change |

### Expanded Workflow

| Command | Purpose |
|---------|---------|
| `/opsx:new` | Start a new change scaffold |
| `/opsx:continue` | Create the next artifact based on dependencies |
| `/opsx:ff` | Fast-forward: create all planning artifacts at once |
| `/opsx:verify` | Validate implementation matches artifacts |
| `/opsx:bulk-archive` | Archive multiple changes at once |
| `/opsx:onboard` | Guided tutorial through the complete workflow |

## Command Details

### `/opsx:propose [change-name-or-description]`

Create a new change and generate planning artifacts in one step. Default start command.

- Creates `openspec/changes/<change-name>/`
- Generates: proposal, specs, design, tasks
- Stops when ready for `/opsx:apply`

### `/opsx:explore [topic]`

Think through ideas with no structure required. Investigates codebase, compares options, creates diagrams. Can transition to `/opsx:propose` when insights crystallize.

### `/opsx:new [change-name] [--schema <name>]`

Start a new change scaffold. Creates the change folder and waits for `/opsx:continue` or `/opsx:ff`.

### `/opsx:continue [change-name]`

Create the next artifact in dependency chain. One artifact at a time for incremental progress.

### `/opsx:ff [change-name]`

Fast-forward — create all planning artifacts at once in dependency order.

### `/opsx:apply [change-name]`

Implement tasks. Works through task list, writing code and checking off items. Can resume where left off.

### `/opsx:verify [change-name]`

Validate implementation against artifacts across three dimensions:
- **Completeness** — All tasks done, all requirements implemented
- **Correctness** — Implementation matches spec intent
- **Coherence** — Design decisions reflected in code

### `/opsx:sync [change-name]`

Merge delta specs from change into main specs. Optional — archive will prompt if needed.

### `/opsx:archive [change-name]`

Finalize the change. Offers to sync specs, moves to `archive/YYYY-MM-DD-<name>/`.

### `/opsx:bulk-archive [change-names...]`

Archive multiple completed changes. Detects spec conflicts and resolves them.

## Command Syntax by AI Tool

| Tool | Format |
|------|--------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Kiro | Skill-based: `/openspec-propose`, `/openspec-apply-change` |
| Trae | Skill-based: `/openspec-propose`, `/openspec-apply-change` |
