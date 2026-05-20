# OpenSpec Workflows

> Source: https://github.com/Fission-AI/OpenSpec/blob/main/docs/workflows.md

## Philosophy: Actions, Not Phases

OpenSpec uses fluid actions rather than rigid phases. Commands are things you can do, not stages you're stuck in. You can always go back and refine.

## Two Modes

### Default Quick Path (core profile)

Commands: `propose`, `explore`, `apply`, `sync`, `archive`

```
/opsx:propose → /opsx:apply → /opsx:sync → /opsx:archive
```

### Expanded Workflow (custom selection)

Additional commands: `new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`

Enable with: `openspec config profile` then `openspec update`

## Workflow Patterns

### Quick Feature

When you know what to build and just need to execute:

```
/opsx:new → /opsx:ff → /opsx:apply → /opsx:verify → /opsx:archive
```

Best for: Small to medium features, bug fixes, straightforward changes.

### Exploratory

When requirements are unclear or you need to investigate first:

```
/opsx:explore → /opsx:new → /opsx:continue → ... → /opsx:apply
```

Best for: Performance optimization, debugging, architectural decisions.

### Parallel Changes

Work on multiple changes at once. Context switch freely between them:

```
Change A: /opsx:new → /opsx:ff → /opsx:apply (in progress)
Change B: /opsx:new → /opsx:ff → /opsx:apply
```

Resume with: `/opsx:apply <change-name>`

Use `/opsx:bulk-archive` to archive multiple completed changes at once.

### Completing a Change

Recommended flow:

```
/opsx:apply → /opsx:verify → /opsx:archive
```

`/opsx:verify` checks: Completeness, Correctness, Coherence.

## When to Use What

| Situation | Command |
|-----------|---------|
| Clear requirements, ready to build | `/opsx:ff` |
| Exploring, want to review each step | `/opsx:continue` |
| Time pressure, need to move fast | `/opsx:ff` |
| Complex change, want control | `/opsx:continue` |

## When to Update vs Start Fresh

**Update existing change when:**
- Same intent, refined execution
- Scope narrows (MVP first)
- Learning-driven corrections

**Start a new change when:**
- Intent fundamentally changed
- Scope exploded to different work
- Original change can be marked "done" standalone

## Best Practices

- Keep changes focused — one logical unit per change
- Use `/opsx:explore` for unclear requirements before committing
- Verify before archiving with `/opsx:verify`
- Name changes clearly: `add-dark-mode`, `fix-login-redirect`, not `update` or `wip`
