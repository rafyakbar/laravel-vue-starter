---
name: skill-sync
description: "Activate when the user asks to check, verify, sync, or audit skills across agent folders. This includes crosschecking which skills exist in each agent directory, identifying missing or extra skills, ensuring all folders have identical copies, and fixing discrepancies. Trigger words: sync skills, check skills, crosscheck, verify skills, missing skill, skill audit, skill consistency. Do NOT activate when creating a new skill (use skill-development instead) or when working on non-skill features."
license: MIT
metadata:
  author: project
---

# Skill Sync & Crosscheck

How to audit, verify, and synchronize skills across all agent folders in this project.

## Overview

This project supports multiple AI agents, each with their own skills directory. All shared skills must be present and identical across every agent folder. This skill provides the process for detecting and fixing discrepancies.

## When to Activate

- User asks to check or audit skill consistency across folders
- User asks to sync skills to all agents
- User notices a skill is missing in one agent but present in another
- User asks "are all skills in sync?"
- After creating or updating a skill (as a follow-up verification step)

## Source of Truth

The root `skills/` folder is the **single source of truth** for shared skills. All agent folders should mirror it exactly.

```text
skills/                          ← SOURCE OF TRUTH
├── skill-a/SKILL.md
├── skill-b/SKILL.md
└── skill-c/SKILL.md

.<agent>/skills/                 ← MIRRORS (must match source)
├── skill-a/SKILL.md
├── skill-b/SKILL.md
└── skill-c/SKILL.md
```

## Agent Folders to Sync

All of these must contain identical copies of every shared skill:

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

## Crosscheck Process

### Step 1 — List All Skills in Every Location

List the contents of:
- `skills/` (root source)
- Every `.<agent>/skills/` directory

### Step 2 — Build a Comparison Matrix

Create a table showing which skills exist where:

| Skill | skills/ | .agent | .agents | .claude | .codebuddy | .codex | .cursor | .forge | .gemini | .github | .iflow | .junie | .kilocode | .kiro | .opencode | .qoder | .qwen | .trae | .windsurf |
|-------|---------|--------|---------|---------|------------|--------|---------|--------|---------|---------|--------|--------|-----------|-------|-----------|--------|-------|-------|-----------|
| skill-a | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### Step 3 — Identify Discrepancies

Flag any of these issues:

| Issue | Meaning | Action |
|-------|---------|--------|
| Skill in agent folder but NOT in `skills/` root | Source of truth is incomplete | Copy skill TO `skills/` root |
| Skill in `skills/` root but NOT in agent folder | Agent folder is out of sync | Copy skill TO agent folder |
| Skill differs between folders (hash mismatch) | Stale copy | Overwrite agent copy with `skills/` root version |
| Skill in some agents but not all | Partial sync | Copy to missing agent folders |

### Step 4 — Fix Discrepancies

For each issue found:

1. **Missing from root** → Copy from the agent folder that has it into `skills/<name>/`
2. **Missing from agent** → Copy from `skills/<name>/` into `.<agent>/skills/<name>/`
3. **Content mismatch** → The root `skills/` version wins. Overwrite agent copies.
4. **Include subfolders** → If the skill has `references/`, `rules/`, or other subfolders, those must be synced too

### Step 5 — Verify Registration

After syncing files, check that ALL skills are registered in instruction files:

- `AGENTS.md` → `## Skills Activation` section
- `CLAUDE.md` → Agent Skills table
- `GEMINI.md` → Skills section (if exists)
- `.junie/guidelines.md` → `## Skills Activation` section

### Step 6 — Final Verification

Run a hash comparison to confirm all copies are identical:

```powershell
# PowerShell: Compare hashes for a specific skill
$skill = "skill-name"
$agents = @('.agent','.agents','.claude','.codebuddy','.codex','.cursor','.forge','.gemini','.github','.iflow','.junie','.kilocode','.kiro','.opencode','.qoder','.qwen','.trae','.windsurf')
$sourceHash = (Get-FileHash "skills/$skill/SKILL.md").Hash
foreach ($agent in $agents) {
    $path = "$agent/skills/$skill/SKILL.md"
    if (Test-Path $path) {
        $hash = (Get-FileHash $path).Hash
        $match = if ($hash -eq $sourceHash) { "OK" } else { "MISMATCH" }
        Write-Host "$match  $agent"
    } else {
        Write-Host "MISSING  $agent"
    }
}
```

## Quick Sync Command

To force-sync ALL skills from root to all agent folders:

```powershell
$agents = @('.agent','.agents','.claude','.codebuddy','.codex','.cursor','.forge','.gemini','.github','.iflow','.junie','.kilocode','.kiro','.opencode','.qoder','.qwen','.trae','.windsurf')
$skills = Get-ChildItem "skills" -Directory
foreach ($skill in $skills) {
    foreach ($agent in $agents) {
        $dest = "$agent/skills/$($skill.Name)"
        if (!(Test-Path $dest)) { New-Item -ItemType Directory -Path $dest -Force | Out-Null }
        Copy-Item "$($skill.FullName)/*" $dest -Recurse -Force
    }
    Write-Host "Synced: $($skill.Name)"
}
```

## Do and Don't

| Do | Don't |
|----|-------|
| Always treat `skills/` root as source of truth | Let agent folders diverge without fixing |
| Sync ALL subfolders (references/, rules/) too | Only sync SKILL.md and forget subfolders |
| Verify with hash after syncing | Assume copy worked without checking |
| Report the full comparison matrix to user | Silently fix without showing what changed |
| Check instruction files after sync | Only sync files but forget registration |
| Ask user before deleting a skill from any location | Remove skills without confirmation |
