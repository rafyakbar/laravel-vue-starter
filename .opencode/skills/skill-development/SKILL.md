---
name: skill-development
description: "Activate when the user asks to create, edit, or manage AI agent skills in this project. This includes writing SKILL.md files, setting up skill folder structure, syncing skills across agent directories, writing frontmatter metadata, defining activation triggers, or organizing reference files. Trigger words: skill, create skill, new skill, SKILL.md, agent instruction, agent rule. Do NOT activate for general documentation or non-skill markdown files."
license: MIT
metadata:
  author: project
---

# Skill Development Guide

How to create, structure, and deploy AI agent skills in this project.

## Overview

Skills are domain-specific instruction sets that AI agents activate contextually. Each skill lives in a folder containing a `SKILL.md` file and optional reference materials. Skills must be synced across all agent directories to ensure consistent behavior regardless of which AI tool is used.

## When to Activate

- User asks to create a new skill
- User wants to modify an existing skill
- User asks about skill structure or conventions
- User wants to sync skills across agent folders
- User references `SKILL.md`, `.agents/skills/`, or skill-related configuration

## Project Skill Architecture

### Two Categories of Skills

| Category | Location | Sync Required | Example |
|----------|----------|---------------|---------|
| Shared (all agents) | `skills/<name>/SKILL.md` (root) + all agent folders | Yes — must exist in every `.<agent>/skills/` | `git-commit` |
| Agent-specific | Only in specific `.<agent>/skills/` folders | No | `laravel-best-practices` |

### Agent Folders That Support Skills

All of these folders contain a `skills/` subdirectory and must receive shared skills:

```text
.agent/skills/
.agents/skills/
.claude/skills/
.codebuddy/skills/
.codex/skills/
.cursor/skills/
.forge/skills/
.gemini/skills/
.github/skills/
.iflow/skills/
.junie/skills/
.kilocode/skills/
.kiro/skills/
.opencode/skills/
.qoder/skills/
.qwen/skills/
.trae/skills/
.windsurf/skills/
```

### Instruction Files Per Agent

Skills should also be registered in the agent's root instruction file:

| Agent | Instruction File | Section |
|-------|-----------------|---------|
| Kiro / .agents | `AGENTS.md` | Skills Activation |
| Claude Code | `CLAUDE.md` | Agent Skills |
| Gemini | `GEMINI.md` | Skills Activation |
| Junie | `.junie/guidelines.md` | Skills Activation |

## Step-by-Step: Creating a New Skill

### Step 1 — Define the Skill

Determine:
- **Name**: lowercase, kebab-case (e.g., `queue-management`, `api-versioning`)
- **Scope**: what it covers and what it does NOT cover
- **Trigger**: when should the AI activate this skill automatically

### Step 2 — Create the Source File

Create `skills/<skill-name>/SKILL.md` at the project root:

```text
skills/
└── <skill-name>/
    ├── SKILL.md
    └── references/          # Optional
        └── detailed-guide.md
```

### Step 3 — Write SKILL.md

Follow this template:

```markdown
---
name: <skill-name>
description: "<Detailed activation description. Write as instructions to the AI: 
'Activate when... Do NOT activate for...' Include trigger keywords, file paths, 
and context that help the AI decide when to use this skill.>"
license: MIT
metadata:
  author: <author-name>
---

# <Skill Title>

## Overview

One paragraph explaining what this skill covers.

## When to Activate

- Bullet list of specific triggers
- File patterns, keywords, user intents
- Negative triggers (when NOT to activate)

## Scope

- **In scope:** ...
- **Out of scope:** ...

## Patterns & Conventions

Concrete rules the AI must follow. Include code templates where applicable.

## Do and Don't

| Do | Don't |
|----|-------|
| ... | ... |

## References

- `references/<file>.md` (if applicable)
```

### Step 4 — Sync to All Agent Folders

Copy the skill folder to every agent's skills directory:

```text
.agent/skills/<skill-name>/SKILL.md
.agents/skills/<skill-name>/SKILL.md
.claude/skills/<skill-name>/SKILL.md
.codebuddy/skills/<skill-name>/SKILL.md
.codex/skills/<skill-name>/SKILL.md
.cursor/skills/<skill-name>/SKILL.md
.forge/skills/<skill-name>/SKILL.md
.gemini/skills/<skill-name>/SKILL.md
.github/skills/<skill-name>/SKILL.md
.iflow/skills/<skill-name>/SKILL.md
.junie/skills/<skill-name>/SKILL.md
.kilocode/skills/<skill-name>/SKILL.md
.kiro/skills/<skill-name>/SKILL.md
.opencode/skills/<skill-name>/SKILL.md
.qoder/skills/<skill-name>/SKILL.md
.qwen/skills/<skill-name>/SKILL.md
.trae/skills/<skill-name>/SKILL.md
.windsurf/skills/<skill-name>/SKILL.md
```

All copies must be identical. If a skill has a `references/` folder, sync that too.

### Step 5 — Register in Instruction Files

Add an entry to the Skills Activation section in `AGENTS.md`:

```markdown
- `<skill-name>` — <One sentence describing when to activate>
```

Do the same for `CLAUDE.md` and `GEMINI.md` if they have a Skills Activation section.

### Step 6 — Verify

- Confirm the skill is discoverable by checking `.<agent>/skills/<skill-name>/SKILL.md` exists
- Confirm the description is specific enough that the AI can decide activation without ambiguity
- Confirm all code examples are valid and follow project conventions

## Writing Effective Descriptions (Frontmatter)

The `description` field is the single most important part — it determines whether the AI activates the skill at the right time.

### Good Description Patterns

```yaml
# Specific triggers + negative boundaries
description: "Activate when creating or modifying Vue 3 components, pages, layouts, 
stores, or services in the frontend. Covers DaisyUI component patterns, Heroicons 
icon system, toast notifications, sidebar drawer CRUD, form handling, dark mode, 
and the SPA architecture. Use when working in resources/app/. 
Do NOT activate for backend PHP code or Blade templates."
```

### Bad Description Patterns

```yaml
# Too vague — AI won't know when to trigger
description: "Vue development guide"

# Too broad — will trigger on everything
description: "Use whenever writing code"
```

### Description Quality Checklist

- [ ] Contains specific trigger keywords the user might say
- [ ] References file paths or patterns where the skill applies
- [ ] Includes "Do NOT activate for..." boundaries
- [ ] Is long enough to be unambiguous (2-5 sentences)
- [ ] Is within 1-1024 characters
- [ ] Written as an instruction TO the AI, not as documentation ABOUT the skill

## Adding Subfolders (References, Rules, etc.)

For skills that need extensive documentation (API specs, library guides, categorized rules), use subfolders:

```text
skills/<skill-name>/
├── SKILL.md              # Overview + quick patterns (keep concise)
├── references/           # Detailed documentation
│   ├── api-guide.md
│   └── examples.md
└── rules/                # Categorized rule files
    ├── security.md
    ├── routing.md
    └── testing.md
```

Use `references/` for supplementary documentation. Use `rules/` when the skill has many categorized rules that are too long for a single file (see `laravel-best-practices` as an example).

In `SKILL.md`, reference them:

```markdown
## References

- `references/api-guide.md` — Full API documentation
- `references/examples.md` — Extended usage examples
- `rules/security.md` — Security rules (if using rules/ pattern)
```

The AI should read reference files on-demand, not load them all upfront.

## Maintaining Skills

### Updating a Skill

1. Edit the source at `skills/<skill-name>/SKILL.md`
2. Copy the updated file to ALL agent folders (keep them in sync)
3. Update instruction files if the activation trigger changed

### Removing a Skill

1. Delete from `skills/<skill-name>/` (root)
2. Delete from all `.<agent>/skills/<skill-name>/` folders
3. Remove entry from `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`

### External Skills (skills-lock.json)

Skills sourced from external repositories are tracked in `skills-lock.json`:

```json
{
  "version": 1,
  "skills": {
    "skill-name": {
      "source": "github/repo-name",
      "sourceType": "github",
      "skillPath": "skills/skill-name/SKILL.md",
      "computedHash": "<sha256>"
    }
  }
}
```

Do NOT manually edit `skills-lock.json` for locally-created skills. Only external/imported skills need lock entries.

## Do and Don't

| Do | Don't |
|----|-------|
| Write descriptions as AI instructions | Write descriptions as human documentation |
| Include negative triggers ("Do NOT activate for...") | Leave scope ambiguous |
| Sync to ALL agent folders | Only create in one agent folder |
| Keep SKILL.md concise, put details in references/ | Write 1000+ lines in SKILL.md |
| Use concrete code templates | Give abstract advice without examples |
| Register in AGENTS.md / CLAUDE.md / GEMINI.md | Forget to register (skill won't be discoverable) |
| Use kebab-case for skill folder names | Use spaces, camelCase, or PascalCase |
| Match existing project conventions in examples | Introduce new patterns not used in the project |

## Final Verification Checklist

Before finalizing any skill creation, update, or rename, complete ALL items:

### Structure

- [ ] Skill source directory created at `skills/<name>/`
- [ ] `SKILL.md` file exists with **all caps** filename
- [ ] YAML frontmatter includes `name:` and `description:`
- [ ] `name:` matches directory name exactly (pattern: `^[a-z0-9]+(-[a-z0-9]+)*$`)
- [ ] `description:` passes the Description Quality Checklist above
- [ ] Body content includes actionable patterns or instructions (not just documentation)

### Sync to Agent Folders

- [ ] Copied to `.agent/skills/<name>/SKILL.md`
- [ ] Copied to `.agents/skills/<name>/SKILL.md`
- [ ] Copied to `.claude/skills/<name>/SKILL.md`
- [ ] Copied to `.codebuddy/skills/<name>/SKILL.md`
- [ ] Copied to `.codex/skills/<name>/SKILL.md`
- [ ] Copied to `.cursor/skills/<name>/SKILL.md`
- [ ] Copied to `.forge/skills/<name>/SKILL.md`
- [ ] Copied to `.gemini/skills/<name>/SKILL.md`
- [ ] Copied to `.github/skills/<name>/SKILL.md`
- [ ] Copied to `.iflow/skills/<name>/SKILL.md`
- [ ] Copied to `.junie/skills/<name>/SKILL.md`
- [ ] Copied to `.kilocode/skills/<name>/SKILL.md`
- [ ] Copied to `.kiro/skills/<name>/SKILL.md`
- [ ] Copied to `.opencode/skills/<name>/SKILL.md`
- [ ] Copied to `.qoder/skills/<name>/SKILL.md`
- [ ] Copied to `.qwen/skills/<name>/SKILL.md`
- [ ] Copied to `.trae/skills/<name>/SKILL.md`
- [ ] Copied to `.windsurf/skills/<name>/SKILL.md`
- [ ] All copies verified identical (SHA256 hash match)
- [ ] If skill has subfolders (`references/`, `rules/`, etc.), synced to all agent folders too

### Registration

- [ ] `AGENTS.md` updated — skill added to `## Skills Activation` section
- [ ] `CLAUDE.md` updated — skill added to Agent Skills table (if exists)
- [ ] `GEMINI.md` updated — skill added to Skills section (if exists)
- [ ] `.junie/guidelines.md` updated — skill added to `## Skills Activation` section

### Validation

- [ ] Run `vendor/bin/pint --dirty --format agent` if skill contains PHP code examples
- [ ] Confirm no naming conflict with existing skills
- [ ] Confirm the skill is not duplicating content already covered by another skill
